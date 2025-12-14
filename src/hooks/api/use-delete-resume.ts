import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { Resume } from "../../lib/api/types";
import { resumeQueryKey } from "./use-resume";
import { resumesQueryKey } from "./use-resumes";
import { useAuthStore, selectIsGuest } from "../../stores/auth-store";
import { get, set } from "idb-keyval";

const IDB_STORE_KEY = "resumier-web-store";

/**
 * Delete resume mutation
 * Returns a React Query mutation hook for deleting a resume with optimistic updates
 * In guest mode, deletes from IndexedDB instead of API
 */
export function useDeleteResume() {
  const queryClient = useQueryClient();
  const isGuest = useAuthStore(selectIsGuest);

  return useMutation({
    mutationFn: async (id: string) => {
      // In guest mode, delete from IndexedDB
      if (isGuest) {
        try {
          // Get existing resumes from the store
          const idbData = await get(IDB_STORE_KEY);
          const resumes = (idbData as { resumes: Resume[] } | undefined)?.resumes || [];

          // Filter out the deleted resume
          const updatedResumes = resumes.filter((r) => r.id !== id);
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
            const updatedDocuments = documents.filter((doc) => doc.id !== id);
            await set("resumier-documents", updatedDocuments);
          }
        } catch (error) {
          console.error("Failed to delete resume from local storage:", error);
          throw error;
        }
      } else {
        // For authenticated users, use API
        return apiClient.delete<void>(`/api/resumes/${id}`);
      }
    },

    // Optimistic update
    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: resumesQueryKey });

      // Snapshot previous value for rollback
      const previousResumes = queryClient.getQueryData<Resume[]>(resumesQueryKey);

      // Optimistically remove from list
      queryClient.setQueryData<Resume[]>(resumesQueryKey, (old) => {
        if (!old) return old;
        return old.filter((resume) => resume.id !== id);
      });

      return { previousResumes };
    },

    // Rollback on error
    onError: (error, _id, context) => {
      if (context?.previousResumes) {
        queryClient.setQueryData(resumesQueryKey, context.previousResumes);
      }

      console.error("Failed to delete resume:", error);
    },

    // Always refetch after mutation (skip for guest mode)
    onSettled: (_data, _error, id) => {
      if (!isGuest) {
        queryClient.invalidateQueries({ queryKey: resumesQueryKey });
      }
      // Remove individual resume from cache
      queryClient.removeQueries({ queryKey: resumeQueryKey(id) });
    },
  });
}
