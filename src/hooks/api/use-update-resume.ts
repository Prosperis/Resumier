import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { Resume, UpdateResumeDto } from "../../lib/api/types";
import { resumeQueryKey } from "./use-resume";
import { resumesQueryKey } from "./use-resumes";

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
 */
export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateResumeVariables) =>
      apiClient.put<Resume>(`/api/resumes/${id}`, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: resumeQueryKey(id) });

      // Snapshot previous value for rollback
      const previousResume = queryClient.getQueryData<Resume>(resumeQueryKey(id));

      // Optimistically update the resume
      queryClient.setQueryData<Resume>(resumeQueryKey(id), (old) => {
        if (!old) return undefined;
        return {
          ...old,
          ...data,
          content: data.content ? { ...old.content, ...data.content } : old.content,
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
            content: data.content ? { ...resume.content, ...data.content } : resume.content,
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

    // Always refetch after mutation to ensure data is in sync
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: resumeQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: resumesQueryKey });
    },
  });
}
