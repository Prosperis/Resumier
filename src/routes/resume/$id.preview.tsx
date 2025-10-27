import { createFileRoute, redirect } from "@tanstack/react-router"
import { RouteError } from "@/components/ui/route-error"
import { RouteLoadingFallback } from "@/components/ui/route-loading"
import { useAuthStore } from "@/stores"

/**
 * Resume preview route
 * Protected route for previewing resume in full screen
 * Requires authentication
 */
export const Route = createFileRoute("/resume/$id/preview")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      })
    }
  },
  pendingComponent: () => <RouteLoadingFallback message="Loading preview..." />,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Preview Error" />
  ),
})
