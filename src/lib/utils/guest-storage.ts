import { del, entries, set } from "idb-keyval";
import type { Profile } from "../api/profile-types";
import { mockDb } from "../api/mock/db";
import type { ResumeDocument, StyleCustomization, UserInfo, JobInfo } from "@/stores/resume-store";

/**
 * Guest Mode Storage Utilities
 * Manages IndexedDB data for guest users
 */

/**
 * Zustand persist state wrapper type.
 * The actual state is wrapped in a `state` property by zustand-persist.
 */
interface ZustandPersistedState<T> {
  state: T;
  version?: number;
}

/**
 * Resume store state structure (as persisted by Zustand).
 */
interface ResumeStoreState {
  template: string;
  styleCustomization: StyleCustomization;
  userInfo: UserInfo;
  jobInfo: JobInfo;
  jobs: JobInfo[];
  documents: ResumeDocument[];
  content: Record<string, unknown>;
}

/**
 * Profile store state structure (as persisted by Zustand).
 */
interface ProfileStoreState {
  activeProfileId: string | null;
  profiles: Profile[];
}

/**
 * Type-safe guest data structure for import/export operations.
 */
export interface GuestData {
  /** Resume store data (null if not present) */
  resumeStore: ZustandPersistedState<ResumeStoreState> | null;
  /** Documents data (null if not present) - legacy, now part of resumeStore */
  documents: ResumeDocument[] | null;
  /** Profiles data (null if not present) */
  profiles: ZustandPersistedState<ProfileStoreState> | null;
}

/**
 * Clear all guest data from IndexedDB
 * Used when guest wants to start fresh or after migrating to authenticated account
 */
export async function clearGuestData(): Promise<void> {
  try {
    await del("resumier-web-store");
    await del("resumier-documents");
    await del("resumier-profiles-store");
  } catch (error) {
    console.error("Failed to clear guest data:", error);
    throw error;
  }
}

/**
 * Export all guest data from IndexedDB
 * Returns serializable data that can be sent to backend
 */
export async function exportGuestData(): Promise<GuestData> {
  try {
    const allEntries = await entries();
    const data: Record<string, unknown> = {};

    for (const [key, value] of allEntries) {
      if (
        key === "resumier-web-store" ||
        key === "resumier-documents" ||
        key === "resumier-profiles-store"
      ) {
        data[key] = value;
      }
    }

    return {
      resumeStore: (data["resumier-web-store"] as GuestData["resumeStore"]) || null,
      documents: (data["resumier-documents"] as GuestData["documents"]) || null,
      profiles: (data["resumier-profiles-store"] as GuestData["profiles"]) || null,
    };
  } catch (error) {
    console.error("Failed to export guest data:", error);
    throw error;
  }
}

/**
 * Import data into IndexedDB
 * Used to restore backed up data or migrate from another storage
 */
export async function importGuestData(data: Partial<GuestData>): Promise<void> {
  try {
    if (data.resumeStore) {
      await set("resumier-web-store", data.resumeStore);
    }
    if (data.documents) {
      await set("resumier-documents", data.documents);
    }
    if (data.profiles) {
      await set("resumier-profiles-store", data.profiles);
    }
  } catch (error) {
    console.error("Failed to import guest data:", error);
    throw error;
  }
}

/**
 * Check if guest has any saved data
 */
export async function hasGuestData(): Promise<boolean> {
  try {
    // Check IndexedDB for resume data
    const allEntries = await entries();
    for (const [key] of allEntries) {
      if (
        key === "resumier-web-store" ||
        key === "resumier-documents" ||
        key === "resumier-profiles-store"
      ) {
        return true;
      }
    }

    // Initialize mock DB by calling getResumes() - this ensures localStorage is populated
    const resumes = mockDb.getResumes();

    // Check if there are any resumes
    if (resumes && resumes.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to check guest data:", error);
    return false;
  }
}

/**
 * Migrate guest data to authenticated user account
 * This should be called after a guest signs up or logs in
 * The data should be sent to the backend API to associate with the user account
 */
export async function migrateGuestDataToUser(userId: string): Promise<void> {
  try {
    // Export guest data
    const guestData = await exportGuestData();

    // TODO: Send to backend API
    // await apiClient.post(`/users/${userId}/migrate-guest-data`, guestData);
    console.log("Guest data to migrate:", guestData);

    // After successful migration, clear local guest data
    // await clearGuestData();

    // For now, we keep the data locally since there's no backend yet
    console.log(
      "Guest data migration prepared for user:",
      userId,
      "Data will be kept locally until backend is implemented.",
    );
  } catch (error) {
    console.error("Failed to migrate guest data:", error);
    throw error;
  }
}

/**
 * Clear all localStorage data including:
 * - IndexedDB guest data (resumes, profiles, documents)
 * - All Zustand persisted stores (auth, settings, resume, profile, etc.)
 * - Any other localStorage items
 * 
 * WARNING: This will log the user out and remove all local data!
 */
export async function clearAllLocalStorage(): Promise<void> {
  try {
    // Clear IndexedDB guest data
    await clearGuestData();

    // Clear all localStorage items (including Zustand persisted stores)
    // Zustand stores use keys like "resumier-auth", "resumier-settings", etc.
    const keysToRemove: string[] = [];
    
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keysToRemove.push(key);
      }
    }

    // Remove all keys
    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove localStorage key: ${key}`, error);
      }
    });

    console.log(`Cleared ${keysToRemove.length} localStorage items`);
    console.log("✅ All localStorage data cleared successfully");
  } catch (error) {
    console.error("Failed to clear all localStorage:", error);
    throw error;
  }
}
