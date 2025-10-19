import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../../lib/api/client"
import type { Resume } from "../../lib/api/types"
import { resumesQueryKey } from "./use-resumes"

/**
 * Duplicate resume mutation
 * Creates a copy of an existing resume with a new ID and "(Copy)" suffix
 */
export function useDuplicateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (resume: Resume) => {
      // Create a new resume with the same content but new ID and title
      const duplicatedResume = {
        title: `${resume.title} (Copy)`,
        content: resume.content,
      }

      return apiClient.post<Resume>("/api/resumes", duplicatedResume)
    },

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
