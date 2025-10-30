import { useEffect } from "react";
import { cleanupStaleQueries, logCacheStats } from "@/lib/cache/cache-manager";

/**
 * Hook to automatically manage cache cleanup
 * Runs cleanup on mount and periodically
 */
export function useCacheCleanup(options?: {
  /** Enable automatic cleanup (default: true) */
  enabled?: boolean;
  /** Cleanup interval in ms (default: 5 minutes) */
  interval?: number;
  /** Log stats on cleanup (default: false) */
  logStats?: boolean;
}) {
  const {
    enabled = true,
    interval = 1000 * 60 * 5, // 5 minutes
    logStats = false,
  } = options || {};

  useEffect(() => {
    if (!enabled) return;

    // Run initial cleanup
    cleanupStaleQueries();

    if (logStats) {
      logCacheStats();
    }

    // Set up periodic cleanup
    const intervalId = setInterval(() => {
      cleanupStaleQueries();

      if (logStats) {
        logCacheStats();
      }
    }, interval);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, interval, logStats]);
}
