import { useEffect, useState } from "react";
import { useAuthStore, selectIsGuest } from "@/stores/auth-store";
import {
  clearGuestData,
  exportGuestData,
  hasGuestData,
  migrateGuestDataToUser,
} from "@/lib/utils/guest-storage";

/**
 * Hook for managing guest mode storage
 * Provides utilities for guest data management
 */
export function useGuestStorage() {
  const isGuest = useAuthStore(selectIsGuest);
  const [hasData, setHasData] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if guest has data on mount
  useEffect(() => {
    async function checkData() {
      if (isGuest) {
        setIsChecking(true);
        try {
          const exists = await hasGuestData();
          setHasData(exists);
        } catch (error) {
          console.error("Failed to check guest data:", error);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
        setHasData(false);
      }
    }

    checkData();
  }, [isGuest]);

  /**
   * Clear all guest data
   */
  const clearData = async () => {
    try {
      await clearGuestData();
      setHasData(false);
    } catch (error) {
      console.error("Failed to clear guest data:", error);
      throw error;
    }
  };

  /**
   * Export guest data (for backup or migration)
   */
  const exportData = async () => {
    try {
      return await exportGuestData();
    } catch (error) {
      console.error("Failed to export guest data:", error);
      throw error;
    }
  };

  /**
   * Migrate guest data to authenticated user account
   */
  const migrateToUser = async (userId: string) => {
    try {
      await migrateGuestDataToUser(userId);
    } catch (error) {
      console.error("Failed to migrate guest data:", error);
      throw error;
    }
  };

  return {
    isGuest,
    hasData,
    isChecking,
    clearData,
    exportData,
    migrateToUser,
  };
}
