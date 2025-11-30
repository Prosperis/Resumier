import { useMutation, useQueryClient } from "@tanstack/react-query";
import { get, set } from "idb-keyval";
import { apiClient } from "../../lib/api/client";
import type { Profile } from "../../lib/api/profile-types";
import { selectIsGuest, useAuthStore } from "../../stores/auth-store";
import { profilesQueryKey } from "./use-profiles";

const IDB_PROFILES_KEY = "resumier-profiles-store";

/**
 * Delete profile mutation
 * Returns a React Query mutation hook for deleting a profile
 * In guest mode, deletes from IndexedDB instead of API
 */
export function useDeleteProfile() {
  const queryClient = useQueryClient();
  const isGuest = useAuthStore(selectIsGuest);

  return useMutation({
    mutationFn: async (id: string) => {
      // In guest mode, delete from IndexedDB
      if (isGuest) {
        try {
          const idbData = await get(IDB_PROFILES_KEY);
          let profiles: Profile[] = [];
          let activeProfileId: string | null = null;

          if (idbData && typeof idbData === "object" && "state" in idbData) {
            const state = idbData as {
              state: { profiles: Profile[]; activeProfileId: string | null };
            };
            profiles = state.state?.profiles || [];
            activeProfileId = state.state?.activeProfileId || null;
          }

          // Remove the profile
          const filteredProfiles = profiles.filter((p) => p.id !== id);

          if (filteredProfiles.length === profiles.length) {
            throw new Error("Profile not found");
          }

          // Clear active profile if it was deleted
          if (activeProfileId === id) {
            activeProfileId = null;
          }

          // Save back to IndexedDB
          await set(IDB_PROFILES_KEY, {
            state: { profiles: filteredProfiles, activeProfileId },
            version: 0,
          });

          return { success: true };
        } catch (error) {
          console.error("Failed to delete profile from local storage:", error);
          throw error;
        }
      }

      // For authenticated users, use API
      return apiClient.delete<{ success: boolean }>(`/api/profiles/${id}`);
    },

    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["profiles", deletedId] });

      // Update list cache
      queryClient.setQueryData<Profile[]>(profilesQueryKey, (old) => {
        if (!old) return [];
        return old.filter((p) => p.id !== deletedId);
      });

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: profilesQueryKey });
    },
  });
}
