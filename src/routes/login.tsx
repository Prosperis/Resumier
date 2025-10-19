import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoginForm } from "@/components/features/auth/login-form"
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
  component: LoginComponent,
})

function LoginComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{" "}
            {/* biome-ignore lint/a11y/useValidAnchor: Placeholder for future sign up functionality */}
            <a href="#" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
