import { useQuery } from "@tanstack/react-query";
import { get } from "idb-keyval";
import { apiClient } from "../../lib/api/client";
import type { Profile } from "../../lib/api/profile-types";
import { selectIsGuest, useAuthStore } from "../../stores/auth-store";

const IDB_PROFILES_KEY = "resumier-profiles-store";

/**
 * Query key for profiles list
 */
export const profilesQueryKey = ["profiles"] as const;

/**
 * Fetch all profiles
 * Returns a React Query hook for fetching the list of profiles
 * In guest mode, fetches from IndexedDB instead of API
 */
export function useProfiles() {
  const isGuest = useAuthStore(selectIsGuest);

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
