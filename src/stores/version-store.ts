import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { ResumeContent, ResumeVersion } from "@/lib/api/types";

/**
 * Generate a unique version ID
 */
function generateVersionId(): string {
  return `version-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Version Store State and Actions
 */
interface VersionStore {
  // Map of resumeId -> versions array (sorted by createdAt descending)
  versions: Record<string, ResumeVersion[]>;

  // Loading state
  isLoading: boolean;

  // Max versions to keep per resume (auto-cleanup)
  maxVersionsPerResume: number;

  // Actions
  saveVersion: (
    resumeId: string,
    content: ResumeContent,
    options?: {
      label?: string;
      template?: string;
      styleCustomization?: { colorTheme: string; fontTheme: string };
      isAutoSave?: boolean;
    },
  ) => ResumeVersion;

  restoreVersion: (resumeId: string, versionId: string) => ResumeVersion | null;

  getVersions: (resumeId: string) => ResumeVersion[];

  getVersion: (resumeId: string, versionId: string) => ResumeVersion | null;

  deleteVersion: (resumeId: string, versionId: string) => void;

  updateVersionLabel: (resumeId: string, versionId: string, label: string) => void;

  clearVersions: (resumeId: string) => void;

  // Cleanup old auto-save versions (keep only last N)
  cleanupAutoSaves: (resumeId: string, keepCount?: number) => void;
}

const initialState = {
  versions: {} as Record<string, ResumeVersion[]>,
  isLoading: false,
  maxVersionsPerResume: 50,
};

export const useVersionStore = create<VersionStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        saveVersion: (resumeId, content, options = {}) => {
          const state = get();
          const existingVersions = state.versions[resumeId] || [];

          // Calculate next version number
          const maxVersion = existingVersions.reduce(
            (max, v) => Math.max(max, v.version),
            0,
          );

          const newVersion: ResumeVersion = {
            id: generateVersionId(),
            resumeId,
            version: maxVersion + 1,
            content: structuredClone(content), // Deep clone to prevent mutations
            template: options.template || "modern",
            styleCustomization: options.styleCustomization,
            createdAt: new Date().toISOString(),
            label: options.label,
            isAutoSave: options.isAutoSave ?? false,
          };

          // Add new version at the beginning (most recent first)
          let updatedVersions = [newVersion, ...existingVersions];

          // Enforce max versions limit
          if (updatedVersions.length > state.maxVersionsPerResume) {
            // Prefer keeping manual saves over auto-saves when trimming
            const manualSaves = updatedVersions.filter((v) => !v.isAutoSave);
            const autoSaves = updatedVersions.filter((v) => v.isAutoSave);

            // If manual saves alone exceed max, keep only the most recent ones
            const manualSavesToKeep = manualSaves.slice(0, state.maxVersionsPerResume);

            // Keep as many auto-saves as we can fit after manual saves
            const autoSavesToKeep = Math.max(
              0,
              state.maxVersionsPerResume - manualSavesToKeep.length,
            );
            
            updatedVersions = [
              ...manualSavesToKeep,
              ...autoSaves.slice(0, autoSavesToKeep),
            ].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
          }

          set({
            versions: {
              ...state.versions,
              [resumeId]: updatedVersions,
            },
          });

          return newVersion;
        },

        restoreVersion: (resumeId, versionId) => {
          const version = get().getVersion(resumeId, versionId);
          return version ? structuredClone(version) : null;
        },

        getVersions: (resumeId) => {
          return get().versions[resumeId] || [];
        },

        getVersion: (resumeId, versionId) => {
          const versions = get().versions[resumeId] || [];
          return versions.find((v) => v.id === versionId) || null;
        },

        deleteVersion: (resumeId, versionId) => {
          const state = get();
          const versions = state.versions[resumeId] || [];

          set({
            versions: {
              ...state.versions,
              [resumeId]: versions.filter((v) => v.id !== versionId),
            },
          });
        },

        updateVersionLabel: (resumeId, versionId, label) => {
          const state = get();
          const versions = state.versions[resumeId] || [];

          set({
            versions: {
              ...state.versions,
              [resumeId]: versions.map((v) =>
                v.id === versionId ? { ...v, label } : v,
              ),
            },
          });
        },

        clearVersions: (resumeId) => {
          const state = get();
          const { [resumeId]: _removed, ...remaining } = state.versions;
          set({ versions: remaining });
        },

        cleanupAutoSaves: (resumeId, keepCount = 10) => {
          const state = get();
          const versions = state.versions[resumeId] || [];

          const manualSaves = versions.filter((v) => !v.isAutoSave);
          const autoSaves = versions.filter((v) => v.isAutoSave);

          // Keep only the most recent N auto-saves
          const trimmedAutoSaves = autoSaves.slice(0, keepCount);

          const updatedVersions = [...manualSaves, ...trimmedAutoSaves].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          set({
            versions: {
              ...state.versions,
              [resumeId]: updatedVersions,
            },
          });
        },
      }),
      {
        name: "resumier-version-store",
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
    { name: "VersionStore" },
  ),
);

// Selectors for optimized access
export const selectVersions = (resumeId: string) => (state: VersionStore) =>
  state.versions[resumeId] || [];

export const selectVersionCount = (resumeId: string) => (state: VersionStore) =>
  (state.versions[resumeId] || []).length;

export const selectLatestVersion = (resumeId: string) => (state: VersionStore) => {
  const versions = state.versions[resumeId] || [];
  return versions[0] || null;
};

export const selectManualVersions = (resumeId: string) => (state: VersionStore) =>
  (state.versions[resumeId] || []).filter((v) => !v.isAutoSave);

export const selectAutoSaveVersions = (resumeId: string) => (state: VersionStore) =>
  (state.versions[resumeId] || []).filter((v) => v.isAutoSave);

// Action selectors
export const selectVersionActions = (state: VersionStore) => ({
  saveVersion: state.saveVersion,
  restoreVersion: state.restoreVersion,
  deleteVersion: state.deleteVersion,
  updateVersionLabel: state.updateVersionLabel,
  clearVersions: state.clearVersions,
  cleanupAutoSaves: state.cleanupAutoSaves,
});

