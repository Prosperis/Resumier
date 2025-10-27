import { queryClient } from "@/app/query-client"

/**
 * Cache management utilities
 * Provides functions for monitoring and managing query cache size
 */

/**
 * Get the estimated size of localStorage in bytes
 */
export function getLocalStorageSize(): number {
  let total = 0

  for (const key in localStorage) {
    if (Object.hasOwn(localStorage, key)) {
      total += key.length + (localStorage[key]?.length || 0)
    }
  }

  return total * 2 // UTF-16 uses 2 bytes per character
}

/**
 * Get the size of the query cache in localStorage
 */
export function getQueryCacheSize(): number {
  const cacheKey = "resumier-query-cache"
  const cacheData = localStorage.getItem(cacheKey)

  if (!cacheData) return 0

  return (cacheKey.length + cacheData.length) * 2 // UTF-16
}

/**
 * Clear old or stale queries from the cache
 * Removes queries that haven't been used recently
 */
export function cleanupStaleQueries(): void {
  // Get all queries from the cache
  const cache = queryClient.getQueryCache()
  const queries = cache.getAll()

  // Remove queries that are inactive and stale
  queries.forEach((query) => {
    const state = query.state
    const isInactive = query.getObserversCount() === 0
    const isStale = state.isInvalidated || state.dataUpdatedAt < Date.now() - 1000 * 60 * 30 // 30 minutes

    if (isInactive && isStale) {
      cache.remove(query)
    }
  })

  console.log(`Cleaned up ${queries.length} stale queries`)
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const cache = queryClient.getQueryCache()
  const queries = cache.getAll()

  const stats = {
    totalQueries: queries.length,
    activeQueries: queries.filter((q) => q.getObserversCount() > 0).length,
    inactiveQueries: queries.filter((q) => q.getObserversCount() === 0).length,
    staleQueries: queries.filter((q) => q.state.isInvalidated).length,
    cacheSize: getQueryCacheSize(),
    cacheSizeKB: (getQueryCacheSize() / 1024).toFixed(2),
    totalStorageSize: getLocalStorageSize(),
    totalStorageSizeKB: (getLocalStorageSize() / 1024).toFixed(2),
  }

  return stats
}

/**
 * Clear all persisted cache data
 * Useful for debugging or when cache gets corrupted
 */
export function clearPersistedCache(): void {
  localStorage.removeItem("resumier-query-cache")
  queryClient.clear()
  console.log("Cleared all persisted cache data")
}

/**
 * Log cache statistics to console
 * Useful for debugging and monitoring
 */
export function logCacheStats(): void {
  const stats = getCacheStats()

  console.group("📊 Cache Statistics")
  console.log(`Total Queries: ${stats.totalQueries}`)
  console.log(`Active Queries: ${stats.activeQueries}`)
  console.log(`Inactive Queries: ${stats.inactiveQueries}`)
  console.log(`Stale Queries: ${stats.staleQueries}`)
  console.log(`Cache Size: ${stats.cacheSizeKB} KB`)
  console.log(`Total Storage: ${stats.totalStorageSizeKB} KB`)
  console.groupEnd()
}

// Export for development/debugging
if (import.meta.env.DEV) {
  // Make cache utilities available in console for debugging
  ;(window as any).cacheUtils = {
    getStats: getCacheStats,
    logStats: logCacheStats,
    cleanup: cleanupStaleQueries,
    clear: clearPersistedCache,
  }

  console.log("💡 Cache utilities available: window.cacheUtils")
}
