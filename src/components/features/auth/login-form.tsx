import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation errors
    setValidationErrors({});

    // Basic client-side validation
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Focus first error field
      if (errors.email) {
        document.getElementById("email")?.focus();
      } else if (errors.password) {
        document.getElementById("password")?.focus();
      }
      return;
    }

    try {
      await login(email, password);
      // Redirect to intended destination or dashboard
      navigate({ to: search.redirect || "/dashboard" });
    } catch (err) {
      // Error is handled by the store
      console.error("Login failed:", err);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      {/* Demo credentials banner */}
      <div className="rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-950">
        <p className="font-medium text-blue-900 dark:text-blue-100">Demo Credentials:</p>
        <p className="text-blue-700 dark:text-blue-300">
          Email: <code className="font-mono">demo@example.com</code>
        </p>
        <p className="text-blue-700 dark:text-blue-300">
          Password: <code className="font-mono">demo123</code>
        </p>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Clear validation error on change
              if (validationErrors.email) {
                setValidationErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            disabled={isLoading}
            aria-invalid={!!validationErrors.email}
            aria-describedby={validationErrors.email ? "email-error" : undefined}
          />
          {validationErrors.email && (
            <p id="email-error" className="text-destructive text-sm" role="alert">
              {validationErrors.email}
            </p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="ml-auto text-sm underline-offset-4 hover:underline disabled:opacity-50"
              disabled={isLoading}
              onClick={() => {
                // TODO: Implement forgot password functionality
                console.log("Forgot password clicked");
              }}
            >
              Forgot your password?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // Clear validation error on change
              if (validationErrors.password) {
                setValidationErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            disabled={isLoading}
            aria-invalid={!!validationErrors.password}
            aria-describedby={validationErrors.password ? "password-error" : undefined}
          />
          {validationErrors.password && (
            <p id="password-error" className="text-destructive text-sm" role="alert">
              {validationErrors.password}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          aria-label={isLoading ? "Logging in" : "Login"}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isLoading}
          aria-label="Login with GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mr-2 h-4 w-4"
          >
            <title>GitHub</title>
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
          disabled={isLoading}
          onClick={() => {
            // TODO: Navigate to sign up page
            console.log("Sign up clicked");
          }}
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
