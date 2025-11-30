import { useMutation, useQueryClient } from "@tanstack/react-query";
import { get, set } from "idb-keyval";
import { apiClient } from "../../lib/api/client";
import type { Profile, UpdateProfileDto } from "../../lib/api/profile-types";
import { selectIsGuest, useAuthStore } from "../../stores/auth-store";
import { profilesQueryKey } from "./use-profiles";

const IDB_PROFILES_KEY = "resumier-profiles-store";

interface UpdateProfileParams {
  id: string;
  data: UpdateProfileDto;
}

/**
 * Update profile mutation
 * Returns a React Query mutation hook for updating a profile
 * In guest mode, saves to IndexedDB instead of API
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const isGuest = useAuthStore(selectIsGuest);

  return useMutation({
    mutationFn: async ({ id, data }: UpdateProfileParams) => {
      // In guest mode, update in IndexedDB
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

          // Find and update the profile
          const profileIndex = profiles.findIndex((p) => p.id === id);
          if (profileIndex === -1) {
            throw new Error("Profile not found");
          }

          const existingProfile = profiles[profileIndex];
          const updatedProfile: Profile = {
            ...existingProfile,
            ...data,
            content: data.content
              ? { ...existingProfile.content, ...data.content }
              : existingProfile.content,
            updatedAt: new Date().toISOString(),
          };

          profiles[profileIndex] = updatedProfile;

          // Save back to IndexedDB
          await set(IDB_PROFILES_KEY, {
            state: { profiles, activeProfileId },
            version: 0,
          });

          return updatedProfile;
        } catch (error) {
          console.error("Failed to update profile in local storage:", error);
          throw error;
        }
      }

      // For authenticated users, use API
      return apiClient.patch<Profile>(`/api/profiles/${id}`, data);
    },

    onSuccess: (updatedProfile) => {
      // Update the profile in cache
      queryClient.setQueryData(["profiles", updatedProfile.id], updatedProfile);

      // Update in list cache
      queryClient.setQueryData<Profile[]>(profilesQueryKey, (old) => {
        if (!old) return [updatedProfile];
        return old.map((p) =>
          p.id === updatedProfile.id ? updatedProfile : p
        );
      });
    },
  });
}
