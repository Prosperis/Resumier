import { persistQueryClient } from "@tanstack/query-persist-client-core";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client configuration
 * Configures global defaults for queries and mutations
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cache time: Unused data is garbage collected after 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus in development
      refetchOnWindowFocus: import.meta.env.PROD,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

/**
 * LocalStorage persister for caching query data offline
 * Persists query cache to localStorage for offline access
 */
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "resumier-query-cache",
});

/**
 * Persist query client to localStorage
 * Allows offline access to cached data
 */
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  // Only persist resume-related queries
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const queryKey = query.queryKey[0];
      // Don't persist queries in error or pending state as they will cause
      // "query ended up rejecting" errors during dehydration when queries are
      // cancelled due to mutations or other state changes
      if (query.state.status === "error" || query.state.status === "pending") {
        return false;
      }
      // Persist resumes list and individual resume queries
      return queryKey === "resumes" || queryKey === "resume";
    },
  },
});
