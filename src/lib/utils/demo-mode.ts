import { set } from "idb-keyval";
import { createDemoResume, createDemoResumes } from "./demo-data";
import type { Resume } from "@/lib/api/types";

/**
 * Demo Mode Storage Utilities
 * Manages demo mode data initialization and management
 */

export interface DemoModeConfig {
  multipleResumes?: boolean; // If true, creates multiple demo resumes
  clearExisting?: boolean; // If true, clears existing data before loading demo
}

/**
 * Initialize demo mode with pre-populated John Doe data
 * Loads complete resume data into IndexedDB
 */
export async function initializeDemoMode(
  config: DemoModeConfig = {}
): Promise<void> {
  const { multipleResumes = false, clearExisting = false } = config;

  try {
    console.log("Demo mode config:", config);
    
    // Optionally clear existing data
    if (clearExisting) {
      console.log("Clearing existing demo data...");
      await clearDemoData();
    }

    // Create demo resume(s)
    const demoResumes = multipleResumes ? createDemoResumes() : [createDemoResume()];
    console.log(`Created ${demoResumes.length} demo resume(s):`, demoResumes.map(r => r.title));

    // Store in IndexedDB (resumier-web-store)
    // This matches the structure used by the app
    const resumeStoreData = {
      resumes: demoResumes,
    };

    console.log("Storing demo data in IndexedDB (resumier-web-store)...");
    await set("resumier-web-store", resumeStoreData);

    // Create document list for the resumes
    const documents = demoResumes.map((resume) => ({
      id: resume.id,
      title: resume.title,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    }));

    console.log("Storing documents list in IndexedDB (resumier-documents)...");
    await set("resumier-documents", documents);

    console.log("✅ Demo mode initialized successfully with John Doe data");
  } catch (error) {
    console.error("❌ Failed to initialize demo mode:", error);
    throw error;
  }
}

/**
 * Check if app is currently in demo mode
 */
export function isDemoMode(): boolean {
  try {
    const authData = localStorage.getItem("resumier-auth");
    if (!authData) return false;

    const auth = JSON.parse(authData);
    return auth.state?.isDemo === true;
  } catch (error) {
    console.error("Failed to check demo mode:", error);
    return false;
  }
}

/**
 * Enable demo mode flag in auth store
 */
export function enableDemoMode(): void {
  try {
    const authData = localStorage.getItem("resumier-auth");
    let auth: any = { state: {} };

    if (authData) {
      auth = JSON.parse(authData);
    }

    // Ensure state object exists
    if (!auth.state) {
      auth.state = {};
    }

    // Set demo mode flag
    auth.state.isDemo = true;
    auth.state.isGuest = true;
    auth.state.user = {
      id: `demo-${Date.now()}`,
      email: "demo@resumier.app",
      name: "Demo User",
    };

    localStorage.setItem("resumier-auth", JSON.stringify(auth));
  } catch (error) {
    console.error("Failed to enable demo mode:", error);
    throw error;
  }
}

/**
 * Disable demo mode and clear demo data
 */
export async function disableDemoMode(): Promise<void> {
  try {
    // Clear demo flag from auth
    const authData = localStorage.getItem("resumier-auth");
    if (authData) {
      const auth = JSON.parse(authData);
      if (auth.state) {
        auth.state.isDemo = false;
        auth.state.isGuest = false;
        auth.state.user = null;
      }
      localStorage.setItem("resumier-auth", JSON.stringify(auth));
    }

    // Optionally clear demo data
    await clearDemoData();
  } catch (error) {
    console.error("Failed to disable demo mode:", error);
    throw error;
  }
}

/**
 * Clear demo data from IndexedDB
 */
async function clearDemoData(): Promise<void> {
  try {
    await set("resumier-web-store", { resumes: [] });
    await set("resumier-documents", []);
  } catch (error) {
    console.error("Failed to clear demo data:", error);
    throw error;
  }
}

/**
 * Get current demo resume data
 */
export async function getDemoData(): Promise<Resume[]> {
  const { get } = await import("idb-keyval");
  try {
    const data = await get("resumier-web-store");
    return data?.resumes || [];
  } catch (error) {
    console.error("Failed to get demo data:", error);
    return [];
  }
}

/**
 * Export demo data for reference or backup
 */
export async function exportDemoData(): Promise<{
  resumes: Resume[];
  documents: any[];
}> {
  const { get } = await import("idb-keyval");
  try {
    const resumeStore = await get("resumier-web-store");
    const documents = await get("resumier-documents");

    return {
      resumes: resumeStore?.resumes || [],
      documents: documents || [],
    };
  } catch (error) {
    console.error("Failed to export demo data:", error);
    throw error;
  }
}
