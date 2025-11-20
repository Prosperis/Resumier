import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

/**
 * User Settings Interface
 * Stores all user preferences and configuration
 */
export interface UserSettings {
  // Appearance
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  reducedMotion: boolean;

  // Editor Preferences
  autoSave: boolean;
  autoSaveInterval: number; // in milliseconds
  spellCheck: boolean;

  // Notifications
  enableNotifications: boolean;
  notificationSound: boolean;

  // Export Settings
  defaultExportFormat: "latex" | "docx" | "txt";
  includeMetadata: boolean;
  promptExportFilename: boolean;

  // Privacy
  analyticsEnabled: boolean;
  errorReportingEnabled: boolean;
}

interface SettingsStore {
  // State
  settings: UserSettings;
  isLoading: boolean;

  // Actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  getSetting: <K extends keyof UserSettings>(key: K) => UserSettings[K];
}

const defaultSettings: UserSettings = {
  // Appearance
  theme: "system",
  fontSize: "medium",
  reducedMotion: false,

  // Editor Preferences
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  spellCheck: true,

  // Notifications
  enableNotifications: true,
  notificationSound: false,

  // Export Settings
  defaultExportFormat: "latex",
  includeMetadata: true,
  promptExportFilename: true,

  // Privacy
  analyticsEnabled: true,
  errorReportingEnabled: true,
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set, get) => ({
        settings: defaultSettings,
        isLoading: false,

        updateSettings: (newSettings) => {
          set((state) => ({
            settings: {
              ...state.settings,
              ...newSettings,
            },
          }));
        },

        resetSettings: () => {
          set({ settings: defaultSettings });
        },

        getSetting: (key) => {
          return get().settings[key];
        },
      }),
      {
        name: "resumier-settings",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          settings: state.settings,
        }),
      },
    ),
    {
      name: "SettingsStore",
    },
  ),
);

// Selectors for convenience
export const selectSettings = (state: SettingsStore) => state.settings;
export const selectTheme = (state: SettingsStore) => state.settings.theme;
export const selectAutoSave = (state: SettingsStore) => state.settings.autoSave;
export const selectAutoSaveInterval = (state: SettingsStore) =>
  state.settings.autoSaveInterval;
export const selectReducedMotion = (state: SettingsStore) =>
  state.settings.reducedMotion;
