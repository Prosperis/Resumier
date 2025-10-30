import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "@/app/query-client";
import { RouteError } from "@/components/ui/route-error";
import { DashboardLoading } from "@/components/ui/route-loading";
import { resumesQueryKey } from "@/hooks/api/use-resumes";
import { apiClient } from "@/lib/api/client";
import type { Resume } from "@/lib/api/types";
import { useAuthStore } from "@/stores";

/**
 * Dashboard route
 * Protected route showing user's resume dashboard
 * Requires authentication
 */
export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  // Prefetch resumes for faster dashboard load (cache warming)
  loader: async () => {
    // Prefetch resumes list if not already in cache
    await queryClient.prefetchQuery({
      queryKey: resumesQueryKey,
      queryFn: () => apiClient.get<Resume[]>("/api/resumes"),
      staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
    });
  },
  pendingComponent: DashboardLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Dashboard Error" />
  ),
});
