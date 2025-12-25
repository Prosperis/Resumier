/**
 * Cloud Storage Store
 * Manages cloud storage provider state (Google Drive, OneDrive, Dropbox, etc.)
 * Integrates with Better Auth for OAuth
 */

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  googleDriveService,
  type GoogleDriveFolder,
} from "@/lib/services/google-drive-service";
import { useAuthStore } from "./auth-store";
import { providerToCloudStorage, type AuthProvider } from "@/lib/auth/client";

export type CloudProvider = "google-drive" | "onedrive" | "dropbox" | "box" | "icloud" | null;

export interface CloudUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface CloudStorageSettings {
  provider: CloudProvider;
  folderId: string | null;
  folderName: string | null;
  folderPath: string | null;
  autoSync: boolean;
  syncOnSave: boolean;
  lastSyncTime: number | null;
}

interface CloudStorageState {
  // Auth state (derived from auth store)
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  
  // User info
  userInfo: CloudUserInfo | null;
  
  // Storage settings
  settings: CloudStorageSettings;
  
  // UI state
  isFolderPickerOpen: boolean;
  isConnecting: boolean;
}

interface CloudStorageActions {
  // Auth actions - now delegates to auth store
  startAuth: (provider: CloudProvider) => Promise<void>;
  signOut: () => void;
  syncFromAuthStore: () => void;
  
  // Folder actions
  setSelectedFolder: (folder: GoogleDriveFolder) => void;
  clearSelectedFolder: () => void;
  openFolderPicker: () => void;
  closeFolderPicker: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<CloudStorageSettings>) => void;
  resetSettings: () => void;
  
  // State actions
  setAuthenticating: (isAuthenticating: boolean) => void;
  setAuthError: (error: string | null) => void;
  setConnecting: (isConnecting: boolean) => void;
}

type CloudStorageStore = CloudStorageState & CloudStorageActions;

const defaultSettings: CloudStorageSettings = {
  provider: null,
  folderId: null,
  folderName: null,
  folderPath: null,
  autoSync: true,
  syncOnSave: true,
  lastSyncTime: null,
};

export const useCloudStorageStore = create<CloudStorageStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        isAuthenticating: false,
        authError: null,
        userInfo: null,
        settings: defaultSettings,
        isFolderPickerOpen: false,
        isConnecting: false,

        // Auth actions - delegates to Better Auth via auth store
        startAuth: async (provider) => {
          set({ isAuthenticating: true, authError: null });
          
          // Map CloudProvider to AuthProvider
          const authProviderMap: Record<string, AuthProvider | null> = {
            "google-drive": "google",
            "onedrive": "microsoft",
            "dropbox": "dropbox",
            "box": null,
            "icloud": null,
          };
          
          const authProvider = provider ? authProviderMap[provider] : null;
          
          if (!authProvider) {
            set({ 
              authError: `${provider} is not yet supported`,
              isAuthenticating: false 
            });
            return;
          }
          
          try {
            // Delegate to auth store which uses Better Auth
            await useAuthStore.getState().loginWithOAuth(authProvider);
            
            // After OAuth redirect, syncFromAuthStore will be called
            // The auth store handles the OAuth flow and session
          } catch (error) {
            set({ 
              authError: error instanceof Error ? error.message : "Failed to start authentication",
              isAuthenticating: false 
            });
          }
        },

        // Sync state from auth store after OAuth callback
        syncFromAuthStore: () => {
          const authState = useAuthStore.getState();
          
          if (authState.isAuthenticated && authState.user) {
            const savedFolder = googleDriveService.getSelectedFolder();
            const provider = authState.connectedProvider;
            
            // Map AuthProvider to CloudProvider
            const cloudProvider: CloudProvider = provider 
              ? (providerToCloudStorage[provider] as CloudProvider)
              : null;
            
            set({
              isAuthenticated: true,
              isAuthenticating: false,
              authError: null,
              userInfo: {
                id: authState.user.id,
                email: authState.user.email,
                name: authState.user.name,
                picture: authState.user.avatar,
              },
              settings: {
                ...get().settings,
                provider: cloudProvider,
                folderId: savedFolder?.id || null,
                folderName: savedFolder?.name || null,
              },
              // Open folder picker if no folder is selected
              isFolderPickerOpen: !savedFolder && cloudProvider === "google-drive",
            });
          } else {
            set({
              isAuthenticated: false,
              isAuthenticating: false,
              userInfo: null,
            });
          }
        },

        signOut: () => {
          // Sign out via auth store
          useAuthStore.getState().logout();
          googleDriveService.signOut();
          set({
            isAuthenticated: false,
            userInfo: null,
            settings: defaultSettings,
            isFolderPickerOpen: false,
          });
        },

        // Folder actions
        setSelectedFolder: (folder) => {
          googleDriveService.saveSelectedFolder(folder);
          set({
            settings: {
              ...get().settings,
              folderId: folder.id,
              folderName: folder.name,
              folderPath: folder.path || folder.name,
            },
            isFolderPickerOpen: false,
          });
        },

        clearSelectedFolder: () => {
          googleDriveService.clearSelectedFolder();
          set({
            settings: {
              ...get().settings,
              folderId: null,
              folderName: null,
              folderPath: null,
            },
          });
        },

        openFolderPicker: () => set({ isFolderPickerOpen: true }),
        closeFolderPicker: () => set({ isFolderPickerOpen: false }),

        // Settings actions
        updateSettings: (newSettings) => {
          set({
            settings: {
              ...get().settings,
              ...newSettings,
            },
          });
        },

        resetSettings: () => {
          // Sign out and reset
          useAuthStore.getState().logout();
          googleDriveService.signOut();
          set({
            isAuthenticated: false,
            userInfo: null,
            settings: defaultSettings,
          });
        },

        // State actions
        setAuthenticating: (isAuthenticating) => set({ isAuthenticating }),
        setAuthError: (authError) => set({ authError }),
        setConnecting: (isConnecting) => set({ isConnecting }),
      }),
      {
        name: "resumier-cloud-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          settings: state.settings,
        }),
      }
    ),
    { name: "CloudStorageStore" }
  )
);

// Selectors
export const selectCloudProvider = (state: CloudStorageStore) => state.settings.provider;
export const selectIsCloudAuthenticated = (state: CloudStorageStore) => state.isAuthenticated;
export const selectCloudUserInfo = (state: CloudStorageStore) => state.userInfo;
export const selectCloudSettings = (state: CloudStorageStore) => state.settings;
export const selectIsFolderPickerOpen = (state: CloudStorageStore) => state.isFolderPickerOpen;
export const selectCloudAuthError = (state: CloudStorageStore) => state.authError;
