import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { Resume } from "../../lib/api/types";
import { useAuthStore, selectIsGuest } from "../../stores/auth-store";
import { get } from "idb-keyval";

/**
 * Query key for resumes list
 */
export const resumesQueryKey = ["resumes"] as const;

/**
 * Fetch all resumes
 * Returns a React Query hook for fetching the list of resumes
 * In guest mode, fetches from IndexedDB instead of API
 */
export function useResumes() {
  const isGuest = useAuthStore(selectIsGuest);

  return useQuery({
    queryKey: resumesQueryKey,
    queryFn: async () => {
      // In guest mode, fetch from IndexedDB
      if (isGuest) {
        try {
          const resumes = await get("resumier-documents");
          if (Array.isArray(resumes)) {
            return resumes as Resume[];
          }
          return [] as Resume[];
        } catch (error) {
          console.error("Failed to fetch resumes from local storage:", error);
          return [] as Resume[];
        }
      }

      // For authenticated users, use API
      return apiClient.get<Resume[]>("/api/resumes");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
