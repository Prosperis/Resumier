import { createLazyFileRoute } from "@tanstack/react-router"
import { LoginForm } from "@/components/features/auth/login-form"

/**
 * Login route component (lazy loaded)
 * Renders authentication form
 */
export const Route = createLazyFileRoute("/login")({
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
            <a href="#" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
