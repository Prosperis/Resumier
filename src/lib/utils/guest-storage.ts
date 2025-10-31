import { del, entries, set } from "idb-keyval";
import { mockDb } from "../api/mock/db";

/**
 * Guest Mode Storage Utilities
 * Manages IndexedDB data for guest users
 */

/**
 * Clear all guest data from IndexedDB
 * Used when guest wants to start fresh or after migrating to authenticated account
 */
export async function clearGuestData(): Promise<void> {
  try {
    await del("resumier-web-store");
    await del("resumier-documents");
  } catch (error) {
    console.error("Failed to clear guest data:", error);
    throw error;
  }
}

/**
 * Export all guest data from IndexedDB
 * Returns serializable data that can be sent to backend
 */
export async function exportGuestData(): Promise<{
  resumeStore: unknown;
  documents: unknown;
}> {
  try {
    const allEntries = await entries();
    const data: Record<string, unknown> = {};

    for (const [key, value] of allEntries) {
      if (key === "resumier-web-store" || key === "resumier-documents") {
        data[key] = value;
      }
    }

    return {
      resumeStore: data["resumier-web-store"] || null,
      documents: data["resumier-documents"] || null,
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
export async function importGuestData(data: {
  resumeStore?: unknown;
  documents?: unknown;
}): Promise<void> {
  try {
    if (data.resumeStore) {
      await set("resumier-web-store", data.resumeStore);
    }
    if (data.documents) {
      await set("resumier-documents", data.documents);
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
      if (key === "resumier-web-store" || key === "resumier-documents") {
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
