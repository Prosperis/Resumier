import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { Resume, UpdateResumeDto } from "../../lib/api/types";
import { resumeQueryKey } from "./use-resume";
import { resumesQueryKey } from "./use-resumes";
import { useAuthStore, selectIsGuest } from "../../stores/auth-store";
import { set } from "idb-keyval";

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
          // Get existing resume from cache or fetch it
          let resume = queryClient.getQueryData<Resume>(resumeQueryKey(id));

          if (!resume) {
            // If not in cache, try to get from IndexedDB
            const stored = await import("idb-keyval").then((m) =>
              m.get(`resume-${id}`),
            );
            if (stored) {
              resume = stored as Resume;
            }
          }

          if (!resume) {
            throw new Error("Resume not found");
          }

          // Merge the update with existing resume
          const updatedResume: Resume = {
            ...resume,
            ...data,
            content: data.content
              ? { ...resume.content, ...data.content }
              : resume.content,
            updatedAt: new Date().toISOString(),
          };

          // Save to IndexedDB
          await set(`resume-${id}`, updatedResume);

          // Also update the resume list in IndexedDB
          const resumes = (await import("idb-keyval").then((m) =>
            m.get("resumier-documents"),
          )) as Resume[] | undefined;

          if (resumes) {
            const updatedResumes = resumes.map((r) =>
              r.id === id ? updatedResume : r,
            );
            await set("resumier-documents", updatedResumes);
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
