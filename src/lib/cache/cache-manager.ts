import { queryClient } from "@/app/query-client";
import logger from "@/lib/utils/console";

/**
 * Cache management utilities
 * Provides functions for monitoring and managing query cache size
 */

/**
 * Get the estimated size of localStorage in bytes
 */
export function getLocalStorageSize(): number {
  let total = 0;

  for (const key in localStorage) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: localStorage is not a plain object
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      total += key.length + (localStorage[key]?.length || 0);
    }
  }

  return total * 2; // UTF-16 uses 2 bytes per character
}

/**
 * Get the size of the query cache in localStorage
 */
export function getQueryCacheSize(): number {
  const cacheKey = "resumier-query-cache";
  const cacheData = localStorage.getItem(cacheKey);

  if (!cacheData) return 0;

  return (cacheKey.length + cacheData.length) * 2; // UTF-16
}

/**
 * Clear old or stale queries from the cache
 * Removes queries that haven't been used recently
 */
export function cleanupStaleQueries(): void {
  // Get all queries from the cache
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();

  let removedCount = 0;

  // Remove queries that are inactive and stale
  queries.forEach((query) => {
    const state = query.state;
    const isInactive = query.getObserversCount() === 0;
    const isStale =
      state.isInvalidated || state.dataUpdatedAt < Date.now() - 1000 * 60 * 30; // 30 minutes

    if (isInactive && isStale) {
      cache.remove(query);
      removedCount++;
    }
  });

  if (removedCount > 0) {
    logger.debug(`🧹 Cleaned up ${removedCount} stale queries`);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();

  const stats = {
    totalQueries: queries.length,
    activeQueries: queries.filter((q) => q.getObserversCount() > 0).length,
    inactiveQueries: queries.filter((q) => q.getObserversCount() === 0).length,
    staleQueries: queries.filter((q) => q.state.isInvalidated).length,
    cacheSize: getQueryCacheSize(),
    cacheSizeKB: (getQueryCacheSize() / 1024).toFixed(2),
    totalStorageSize: getLocalStorageSize(),
    totalStorageSizeKB: (getLocalStorageSize() / 1024).toFixed(2),
  };

  return stats;
}

/**
 * Clear all persisted cache data
 * Useful for debugging or when cache gets corrupted
 */
export function clearPersistedCache(): void {
  localStorage.removeItem("resumier-query-cache");
  queryClient.clear();
  logger.warn("🗑️ Cleared all persisted cache data");
}

/**
 * Log cache statistics to console
 * Useful for debugging and monitoring
 */
export function logCacheStats(): void {
  const stats = getCacheStats();

  logger.group("📊 Cache Statistics");
  logger.table({
    "Total Queries": stats.totalQueries,
    "Active Queries": stats.activeQueries,
    "Inactive Queries": stats.inactiveQueries,
    "Stale Queries": stats.staleQueries,
    "Cache Size": `${stats.cacheSizeKB} KB`,
    "Total Storage": `${stats.totalStorageSizeKB} KB`,
  });
  logger.groupEnd();
}

// Export for development/debugging (only in dev mode)
if (import.meta.env.DEV) {
  // Make cache utilities available in console for debugging
  // biome-ignore lint/suspicious/noExplicitAny: dev-only debugging utilities on window object
  (window as any).cacheUtils = {
    getStats: getCacheStats,
    logStats: logCacheStats,
    cleanup: cleanupStaleQueries,
    clear: clearPersistedCache,
  };

  logger.debug("💡 Cache utilities available: window.cacheUtils");
}
