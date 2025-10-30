import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { Resume } from "../../lib/api/types";

/**
 * Query key factory for single resume
 */
export const resumeQueryKey = (id: string) => ["resumes", id] as const;

/**
 * Fetch resume by ID
 * Returns a React Query hook for fetching a single resume
 */
export function useResume(id: string) {
  return useQuery({
    queryKey: resumeQueryKey(id),
    queryFn: () => apiClient.get<Resume>(`/api/resumes/${id}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Only fetch if ID is provided
    enabled: Boolean(id),
  });
}
