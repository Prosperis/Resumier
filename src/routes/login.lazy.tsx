import { createLazyFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/features/auth/login-form";

/**
 * Login route component (lazy loaded)
 * Renders authentication form
 */
export const Route = createLazyFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to your account to continue</p>
        </div>

        <LoginForm />

        <div className="text-muted-foreground text-center text-sm">
          <p>
            Don't have an account?{" "}
            {/* biome-ignore lint/a11y/useValidAnchor: placeholder link for future signup feature */}
            <a href="#" className="text-primary font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
