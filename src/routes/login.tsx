import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores"

/**
 * Login route
 * Public route for user authentication
 * Redirects to dashboard if already authenticated
 * Supports redirect query param to return to intended destination
 */
export const Route = createFileRoute("/login")({
  beforeLoad: ({ search }) => {
    const { isAuthenticated } = useAuthStore.getState()

    // If already authenticated, redirect to dashboard or intended destination
    if (isAuthenticated) {
      throw redirect({
        to: (search as { redirect?: string })?.redirect || "/dashboard",
      })
    }
  },
})
