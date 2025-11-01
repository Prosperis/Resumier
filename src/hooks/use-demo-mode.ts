import { useEffect, useState } from "react";
import { useAuthStore, selectIsGuest } from "@/stores/auth-store";
import {
  initializeDemoMode,
  isDemoMode as checkDemoMode,
  enableDemoMode as enableDemo,
  disableDemoMode as disableDemo,
  getDemoData,
  exportDemoData,
  type DemoModeConfig,
} from "@/lib/utils/demo-mode";
import type { Resume } from "@/lib/api/types";

/**
 * Hook for managing demo mode
 * Provides utilities for demo mode management and data operations
 */
export function useDemoMode() {
  const isGuest = useAuthStore(selectIsGuest);
  const [isDemo, setIsDemo] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [demoResumes, setDemoResumes] = useState<Resume[]>([]);

  // Check demo mode status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const demoStatus = checkDemoMode();
        setIsDemo(demoStatus);

        if (demoStatus) {
          const resumes = await getDemoData();
          setDemoResumes(resumes);
          setHasData(resumes.length > 0);
        }
      } catch (error) {
        console.error("Failed to check demo mode status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    checkStatus();
  }, []);

  /**
   * Initialize demo mode with John Doe data
   */
  const initializeDemo = async (config?: DemoModeConfig) => {
    try {
      await initializeDemoMode(config);
      enableDemo();
      setIsDemo(true);

      // Refresh demo data
      const resumes = await getDemoData();
      setDemoResumes(resumes);
      setHasData(resumes.length > 0);
    } catch (error) {
      console.error("Failed to initialize demo mode:", error);
      throw error;
    }
  };

  /**
   * Exit demo mode and clear data
   */
  const exitDemo = async () => {
    try {
      await disableDemo();
      setIsDemo(false);
      setHasData(false);
      setDemoResumes([]);
    } catch (error) {
      console.error("Failed to exit demo mode:", error);
      throw error;
    }
  };

  /**
   * Refresh demo data from storage
   */
  const refreshData = async () => {
    try {
      const resumes = await getDemoData();
      setDemoResumes(resumes);
      setHasData(resumes.length > 0);
    } catch (error) {
      console.error("Failed to refresh demo data:", error);
      throw error;
    }
  };

  /**
   * Export demo data
   */
  const exportData = async () => {
    try {
      return await exportDemoData();
    } catch (error) {
      console.error("Failed to export demo data:", error);
      throw error;
    }
  };

  return {
    isDemo,
    isGuest,
    hasData,
    isChecking,
    demoResumes,
    initializeDemo,
    exitDemo,
    refreshData,
    exportData,
  };
}
