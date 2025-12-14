import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { Profile, ProfileContent } from "@/lib/api/profile-types";

const IDB_PROFILES_KEY = "resumier-profiles-store";

/**
 * Default empty profile content
 */
export const defaultProfileContent: ProfileContent = {
  personalInfo: {
    firstName: "",
    lastName: "",
    nameOrder: "firstLast",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    languages: [],
    tools: [],
    soft: [],
  },
  certifications: [],
  links: [],
};

// Store interface
interface ProfileStore {
  // Current profile being edited
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;

  // Profiles list (cached locally)
  profiles: Profile[];
  setProfiles: (profiles: Profile[]) => void;

  // CRUD operations
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  clearProfiles: () => void;

  // Content operations for active profile
  updateProfileContent: (id: string, content: Partial<ProfileContent>) => void;

  // Get profile by ID
  getProfile: (id: string) => Profile | undefined;
}

const initialState = {
  activeProfileId: null,
  profiles: [],
};

export const useProfileStore = create<ProfileStore>()(
  devtools(
    persist(
      (set, getState) => ({
        ...initialState,

        // Active profile
        setActiveProfileId: (id) => set({ activeProfileId: id }),

        // Profiles list
        setProfiles: (profiles) => set({ profiles }),

        // Add new profile
        addProfile: (profile) =>
          set((state) => ({
            profiles: [...state.profiles, profile],
          })),

        // Update profile
        updateProfile: (id, updates) =>
          set((state) => ({
            profiles: state.profiles.map((p) =>
              p.id === id
                ? {
                    ...p,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                  }
                : p,
            ),
          })),

        // Remove profile
        removeProfile: (id) =>
          set((state) => ({
            profiles: state.profiles.filter((p) => p.id !== id),
            // Clear active profile if it was deleted
            activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
          })),

        // Clear all profiles
        clearProfiles: () => set({ profiles: [], activeProfileId: null }),

        // Update profile content
        updateProfileContent: (id, content) =>
          set((state) => ({
            profiles: state.profiles.map((p) =>
              p.id === id
                ? {
                    ...p,
                    content: { ...p.content, ...content },
                    updatedAt: new Date().toISOString(),
                  }
                : p,
            ),
          })),

        // Get profile by ID
        getProfile: (id) => getState().profiles.find((p) => p.id === id),
      }),
      {
        name: IDB_PROFILES_KEY,
        storage: createJSONStorage(() => ({
          async getItem(name: string) {
            const value = await get(name);
            return value ?? null;
          },
          async setItem(name: string, value: unknown) {
            await set(name, value);
          },
          async removeItem(name: string) {
            await del(name);
          },
        })),
      },
    ),
    { name: "ProfileStore" },
  ),
);

// Selectors for optimized access
export const selectProfiles = (state: ProfileStore) => state.profiles;
export const selectActiveProfileId = (state: ProfileStore) => state.activeProfileId;
export const selectActiveProfile = (state: ProfileStore) =>
  state.profiles.find((p) => p.id === state.activeProfileId);

// Action selectors
export const selectProfileActions = (state: ProfileStore) => ({
  setActiveProfileId: state.setActiveProfileId,
  setProfiles: state.setProfiles,
  addProfile: state.addProfile,
  updateProfile: state.updateProfile,
  removeProfile: state.removeProfile,
  clearProfiles: state.clearProfiles,
  updateProfileContent: state.updateProfileContent,
  getProfile: state.getProfile,
});
