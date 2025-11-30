import { useQuery } from "@tanstack/react-query";
import { get, set } from "idb-keyval";
import { apiClient } from "../../lib/api/client";
import { getDemoProfiles } from "../../lib/api/demo-data";
import type { Profile } from "../../lib/api/profile-types";
import {
  selectIsDemo,
  selectIsGuest,
  useAuthStore,
} from "../../stores/auth-store";

const IDB_PROFILES_KEY = "resumier-profiles-store";

/**
 * Query key for profiles list
 */
export const profilesQueryKey = ["profiles"] as const;

/**
 * Save profiles to IndexedDB
 */
async function saveProfilesToIDB(profiles: Profile[]): Promise<void> {
  await set(IDB_PROFILES_KEY, {
    state: { profiles, activeProfileId: null },
    version: 0,
  });
}

/**
 * Fetch all profiles
 * Returns a React Query hook for fetching the list of profiles
 * In guest mode, fetches from IndexedDB instead of API
 * In demo mode, seeds demo data if not present
 */
export function useProfiles() {
  const isGuest = useAuthStore(selectIsGuest);
  const isDemo = useAuthStore(selectIsDemo);

  return useQuery({
    queryKey: profilesQueryKey,
    queryFn: async () => {
      // In guest mode, fetch from IndexedDB
      if (isGuest) {
        try {
          const idbData = await get(IDB_PROFILES_KEY);
          if (idbData && typeof idbData === "object" && "state" in idbData) {
            const state = idbData as { state: { profiles: Profile[] } };
            if (state.state?.profiles && state.state.profiles.length > 0) {
              return state.state.profiles;
            }
          }

          // If in demo mode and no profiles exist, seed with demo data
          if (isDemo) {
            const demoProfiles = getDemoProfiles();
            await saveProfilesToIDB(demoProfiles);
            return demoProfiles;
          }

          return [] as Profile[];
        } catch (error) {
          console.error("Failed to fetch profiles from local storage:", error);
          return [] as Profile[];
        }
      }

      // For authenticated users, use API
      return apiClient.get<Profile[]>("/api/profiles");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
