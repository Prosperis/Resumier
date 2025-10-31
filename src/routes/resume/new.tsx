import { createFileRoute, redirect } from "@tanstack/react-router";
import { RouteError } from "@/components/ui/route-error";
import { ResumeEditorLoading } from "@/components/ui/route-loading";
import { useAuthStore } from "@/stores";

/**
 * Create new resume route
 * Protected route for creating a new resume
 * Requires authentication
 */
export const Route = createFileRoute("/resume/new")({
  beforeLoad: () => {
    const { isAuthenticated, isGuest } = useAuthStore.getState();

    // Allow both authenticated users and guests to create resumes
    // Guest data is stored in IndexedDB
    if (!isAuthenticated && !isGuest) {
      throw redirect({
        to: "/",
      });
    }
  },
  pendingComponent: ResumeEditorLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Resume Creation Error" />
  ),
});
