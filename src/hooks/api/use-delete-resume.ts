import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { Resume } from "../../lib/api/types";
import { resumeQueryKey } from "./use-resume";
import { resumesQueryKey } from "./use-resumes";

/**
 * Delete resume mutation
 * Returns a React Query mutation hook for deleting a resume with optimistic updates
 */
export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/api/resumes/${id}`),

    // Optimistic update
    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: resumesQueryKey });

      // Snapshot previous value for rollback
      const previousResumes =
        queryClient.getQueryData<Resume[]>(resumesQueryKey);

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

    // Always refetch after mutation
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: resumesQueryKey });
      // Remove individual resume from cache
      queryClient.removeQueries({ queryKey: resumeQueryKey(id) });
    },
  });
}
