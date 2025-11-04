import { createFileRoute } from "@tanstack/react-router";
import { RouteError } from "@/components/ui/route-error";
import { SettingsLoading } from "@/components/ui/route-loading";

/**
 * Settings route
 * Available to all users (authenticated, guest, and demo)
 * Stores user preferences and configuration in local storage
 */
export const Route = createFileRoute("/settings")({
  pendingComponent: SettingsLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Settings Error" />
  ),
});
