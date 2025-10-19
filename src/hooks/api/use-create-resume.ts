import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../../lib/api/client"
import type { CreateResumeDto, Resume } from "../../lib/api/types"
import { resumesQueryKey } from "./use-resumes"

/**
 * Create resume mutation
 * Returns a React Query mutation hook for creating a new resume
 */
export function useCreateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateResumeDto) => apiClient.post<Resume>("/api/resumes", data),

    onSuccess: (newResume) => {
      // Invalidate resumes list to trigger refetch
      queryClient.invalidateQueries({ queryKey: resumesQueryKey })

      // Optimistically add to cache
      queryClient.setQueryData<Resume[]>(resumesQueryKey, (old) => {
        if (!old) return [newResume]
        return [...old, newResume]
      })

      // Set the new resume in cache for detail view
      queryClient.setQueryData(["resumes", newResume.id], newResume)
    },
  })
}
