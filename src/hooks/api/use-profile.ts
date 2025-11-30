import { useQuery } from "@tanstack/react-query";
import { get } from "idb-keyval";
import { apiClient } from "../../lib/api/client";
import type { Profile } from "../../lib/api/profile-types";
import { selectIsGuest, useAuthStore } from "../../stores/auth-store";

const IDB_PROFILES_KEY = "resumier-profiles-store";

/**
 * Query key for single profile
 */
export const profileQueryKey = (id: string) => ["profiles", id] as const;

/**
 * Fetch a single profile by ID
 * Returns a React Query hook for fetching a specific profile
 * In guest mode, fetches from IndexedDB instead of API
 */
export function useProfile(id: string) {
  const isGuest = useAuthStore(selectIsGuest);

  return useQuery({
    queryKey: profileQueryKey(id),
    queryFn: async () => {
      // In guest mode, fetch from IndexedDB
      if (isGuest) {
        try {
          const idbData = await get(IDB_PROFILES_KEY);
          if (idbData && typeof idbData === "object" && "state" in idbData) {
            const state = idbData as { state: { profiles: Profile[] } };
            if (state.state?.profiles) {
              const profile = state.state.profiles.find((p) => p.id === id);
              if (profile) {
                return profile;
              }
            }
          }
          throw new Error("Profile not found");
        } catch (error) {
          console.error("Failed to fetch profile from local storage:", error);
          throw error;
        }
      }

      // For authenticated users, use API
      return apiClient.get<Profile>(`/api/profiles/${id}`);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
