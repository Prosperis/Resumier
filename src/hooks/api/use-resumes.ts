import { useQuery } from "@tanstack/react-query";
import { get, set } from "idb-keyval";
import { apiClient } from "../../lib/api/client";
import { getDemoResumes } from "../../lib/api/demo-data";
import type { Resume } from "../../lib/api/types";
import { selectIsGuest, useAuthStore } from "../../stores/auth-store";

const IDB_STORE_KEY = "resumier-web-store";

/**
 * Query key for resumes list
 */
export const resumesQueryKey = ["resumes"] as const;

/**
 * Save resumes to IndexedDB
 */
async function saveResumesToIDB(resumes: Resume[]): Promise<void> {
  await set(IDB_STORE_KEY, { resumes });
}

/**
 * Fetch all resumes
 * Returns a React Query hook for fetching the list of resumes
 * In guest mode, fetches from IndexedDB instead of API
 * In demo mode, seeds demo data if not present
 */
export function useResumes() {
  const isGuest = useAuthStore(selectIsGuest);

  return useQuery({
    queryKey: resumesQueryKey,
    queryFn: async () => {
      // In guest mode, fetch from IndexedDB
      if (isGuest) {
        try {
          const idbData = await get(IDB_STORE_KEY);
          if (idbData && typeof idbData === "object" && "resumes" in idbData) {
            const resumes = (idbData as { resumes: Resume[] }).resumes;
            if (resumes && resumes.length > 0) {
              return resumes;
            }
          }

          // Only seed demo resumes if explicitly in demo mode
          // Don't auto-seed for regular guest mode (user chose "local storage only")
          // Get the current auth state to ensure we're checking the latest value
          // (not a stale persisted value from localStorage)
          const currentAuthState = useAuthStore.getState();
          const isCurrentlyDemo = currentAuthState.isDemo;
          
          // Only seed if we're explicitly in demo mode (not just guest mode)
          if (isCurrentlyDemo) {
            console.log("Seeding demo resumes for demo mode");
            const demoResumes = getDemoResumes();
            await saveResumesToIDB(demoResumes);
            return demoResumes;
          }

          // Return empty array for guest mode (no auto-generation)
          // User explicitly chose "local storage only" - don't auto-generate resumes
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
