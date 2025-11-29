import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { Resume } from "../../lib/api/types";
import { useAuthStore, selectIsGuest } from "../../stores/auth-store";
import { get } from "idb-keyval";

const IDB_STORE_KEY = "resumier-web-store";

/**
 * Query key factory for single resume
 */
export const resumeQueryKey = (id: string) => ["resumes", id] as const;

/**
 * Fetch resume by ID
 * Returns a React Query hook for fetching a single resume
 * In guest mode, fetches from IndexedDB instead of API
 */
export function useResume(id: string) {
  const isGuest = useAuthStore(selectIsGuest);

  return useQuery({
    queryKey: resumeQueryKey(id),
    queryFn: async () => {
      // In guest mode, fetch from IndexedDB
      if (isGuest) {
        try {
          // Check the main resumier-web-store for the resumes array
          const idbData = await get(IDB_STORE_KEY);
          if (idbData && typeof idbData === "object" && "resumes" in idbData) {
            const resumes = (idbData as { resumes: Resume[] }).resumes;
            const resume = resumes.find((r) => r.id === id);
            if (resume) {
              return resume;
            }
          }
          throw new Error("Resume not found in local storage");
        } catch (error) {
          console.error("Failed to fetch resume from local storage:", error);
          throw error;
        }
      }

      // For authenticated users, use API
      return apiClient.get<Resume>(`/api/resumes/${id}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Only fetch if ID is provided
    enabled: Boolean(id),
  });
}
