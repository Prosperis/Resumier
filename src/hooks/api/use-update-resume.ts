import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { Resume, UpdateResumeDto } from "../../lib/api/types";
import { resumeQueryKey } from "./use-resume";
import { resumesQueryKey } from "./use-resumes";
import { useAuthStore, selectIsGuest } from "../../stores/auth-store";
import { set, get } from "idb-keyval";

const IDB_STORE_KEY = "resumier-web-store";

/**
 * Update resume variables
 */
interface UpdateResumeVariables {
  id: string;
  data: UpdateResumeDto;
}

/**
 * Update resume mutation
 * Returns a React Query mutation hook for updating a resume with optimistic updates
 * In guest mode, saves to IndexedDB instead of API
 */
export function useUpdateResume() {
  const queryClient = useQueryClient();
  const isGuest = useAuthStore(selectIsGuest);

  return useMutation({
    mutationFn: async ({ id, data }: UpdateResumeVariables) => {
      // In guest mode, save to IndexedDB instead of API
      if (isGuest) {
        try {
          // Get existing resumes from the store
          const idbData = await get(IDB_STORE_KEY);
          const resumes =
            (idbData as { resumes: Resume[] } | undefined)?.resumes || [];

          // Find the resume to update
          const resumeIndex = resumes.findIndex((r) => r.id === id);
          if (resumeIndex === -1) {
            throw new Error("Resume not found");
          }

          const existingResume = resumes[resumeIndex];

          // Merge the update with existing resume
          const updatedResume: Resume = {
            ...existingResume,
            ...data,
            content: data.content
              ? { ...existingResume.content, ...data.content }
              : existingResume.content,
            updatedAt: new Date().toISOString(),
          };

          // Update the resume in the array
          const updatedResumes = [...resumes];
          updatedResumes[resumeIndex] = updatedResume;

          // Save back to IndexedDB
          await set(IDB_STORE_KEY, { resumes: updatedResumes });

          // Also update the documents list
          const documents = (await get("resumier-documents")) as
            | Array<{
                id: string;
                title: string;
                createdAt: string;
                updatedAt: string;
              }>
            | undefined;

          if (documents) {
            const updatedDocuments = documents.map((doc) =>
              doc.id === id
                ? {
                    ...doc,
                    title: updatedResume.title,
                    updatedAt: updatedResume.updatedAt,
                  }
                : doc,
            );
            await set("resumier-documents", updatedDocuments);
          }

          return updatedResume;
        } catch (error) {
          console.error("Failed to save resume to IndexedDB:", error);
          throw error;
        }
      }

      // For authenticated users, use API
      return apiClient.put<Resume>(`/api/resumes/${id}`, data);
    },

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: resumeQueryKey(id) });

      // Snapshot previous value for rollback
      const previousResume = queryClient.getQueryData<Resume>(
        resumeQueryKey(id),
      );

      // Optimistically update the resume
      queryClient.setQueryData<Resume>(resumeQueryKey(id), (old) => {
        if (!old) return undefined;
        return {
          ...old,
          ...data,
          content: data.content
            ? { ...old.content, ...data.content }
            : old.content,
          updatedAt: new Date().toISOString(),
        };
      });

      // Optimistically update in list view
      queryClient.setQueryData<Resume[]>(resumesQueryKey, (old) => {
        if (!old) return old;
        return old.map((resume) => {
          if (resume.id !== id) return resume;
          return {
            ...resume,
            ...data,
            content: data.content
              ? { ...resume.content, ...data.content }
              : resume.content,
            updatedAt: new Date().toISOString(),
          };
        });
      });

      return { previousResume };
    },

    // Rollback on error
    onError: (error, { id }, context) => {
      if (context?.previousResume) {
        queryClient.setQueryData(resumeQueryKey(id), context.previousResume);
      }

      console.error("Failed to update resume:", error);
    },

    // Refetch after mutation to ensure UI updates (but skip for guest mode)
    onSettled: (_data, _error, { id }) => {
      if (isGuest) {
        // In guest mode, we don't refetch from API
        // The data is already updated in the optimistic update and saved to IndexedDB
        return;
      }

      // For authenticated users, defer refetch outside of the react-query persist cycle
      // This prevents conflicts with the persist plugin during dehydration
      // We use a timeout to ensure persist operations complete first
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: resumeQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: resumesQueryKey });
      }, 100);
    },
  });
}
