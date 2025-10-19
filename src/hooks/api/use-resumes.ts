import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../../lib/api/client"
import type { Resume } from "../../lib/api/types"

/**
 * Query key for resumes list
 */
export const resumesQueryKey = ["resumes"] as const

/**
 * Fetch all resumes
 * Returns a React Query hook for fetching the list of resumes
 */
export function useResumes() {
  return useQuery({
    queryKey: resumesQueryKey,
    queryFn: () => apiClient.get<Resume[]>("/api/resumes"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
