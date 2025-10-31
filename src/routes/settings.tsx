import { createFileRoute, redirect } from "@tanstack/react-router";
import { RouteError } from "@/components/ui/route-error";
import { SettingsLoading } from "@/components/ui/route-loading";
import { useAuthStore } from "@/stores";

/**
 * Settings route
 * Protected route for user settings and preferences
 * Requires authentication
 */
export const Route = createFileRoute("/settings")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    // Settings require full authentication (not available for guests)
    if (!isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  pendingComponent: SettingsLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Settings Error" />
  ),
});
