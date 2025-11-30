import { useMutation, useQueryClient } from "@tanstack/react-query";
import { get, set } from "idb-keyval";
import { apiClient } from "../../lib/api/client";
import type { CreateProfileDto, Profile } from "../../lib/api/profile-types";
import { selectIsGuest, useAuthStore } from "../../stores/auth-store";
import { defaultProfileContent } from "../../stores/profile-store";
import { profilesQueryKey } from "./use-profiles";

const IDB_PROFILES_KEY = "resumier-profiles-store";

/**
 * Create profile mutation
 * Returns a React Query mutation hook for creating a new profile
 * In guest mode, saves to IndexedDB instead of API
 */
export function useCreateProfile() {
  const queryClient = useQueryClient();
  const isGuest = useAuthStore(selectIsGuest);

  return useMutation({
    mutationFn: async (data: CreateProfileDto) => {
      const now = new Date().toISOString();
      const newProfile: Profile = {
        id: crypto.randomUUID(),
        name: data.name || "Untitled Profile",
        description: data.description,
        content: data.content
          ? { ...defaultProfileContent, ...data.content }
          : defaultProfileContent,
        createdAt: now,
        updatedAt: now,
      };

      // In guest mode, save to IndexedDB
      if (isGuest) {
        try {
          const idbData = await get(IDB_PROFILES_KEY);
          let profiles: Profile[] = [];

          if (idbData && typeof idbData === "object" && "state" in idbData) {
            const state = idbData as { state: { profiles: Profile[] } };
            profiles = state.state?.profiles || [];
          }

          // Add new profile
          profiles = [...profiles, newProfile];

          // Save back to IndexedDB (matching Zustand persist format)
          await set(IDB_PROFILES_KEY, {
            state: { profiles, activeProfileId: null },
            version: 0,
          });

          return newProfile;
        } catch (error) {
          console.error("Failed to create profile in local storage:", error);
          throw error;
        }
      }

      // For authenticated users, use API
      return apiClient.post<Profile>("/api/profiles", data);
    },

    onSuccess: (newProfile) => {
      // Invalidate profiles list to trigger refetch
      queryClient.invalidateQueries({ queryKey: profilesQueryKey });

      // Optimistically add to cache
      queryClient.setQueryData<Profile[]>(profilesQueryKey, (old) => {
        if (!old) return [newProfile];
        return [...old, newProfile];
      });

      // Set the new profile in cache for detail view
      queryClient.setQueryData(["profiles", newProfile.id], newProfile);
    },
  });
}
