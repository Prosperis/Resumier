import * as Sentry from "@sentry/react";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Error fallback component shown when an error occurs
 */
function ErrorFallback({ error }: { error?: Error }) {
  const router = useRouter();

  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="bg-destructive/10 rounded-full p-6">
            <AlertCircle className="text-destructive h-12 w-12" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground">
            We've been notified and will look into it right away.
          </p>
        </div>

        {/* Error Details (dev only) */}
        {import.meta.env.DEV && (
          <details className="bg-muted rounded-lg border p-4 text-left">
            <summary className="cursor-pointer font-mono text-sm">Error Details</summary>
            <pre className="mt-2 text-xs break-words whitespace-pre-wrap">
              {errorMessage}
              {error instanceof Error && error.stack && (
                <>
                  {"\n\n"}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleReload} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
          <Button onClick={handleGoHome} variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>

        {/* Feedback Link */}
        <p className="text-muted-foreground text-sm">
          Need help?{" "}
          <button
            type="button"
            onClick={() => {
              // Trigger Sentry feedback widget
              const feedbackButton = document.querySelector(
                "[data-sentry-feedback]",
              ) as HTMLButtonElement;
              feedbackButton?.click();
            }}
            className="hover:text-foreground underline underline-offset-4"
          >
            Report this issue
          </button>
        </p>
      </div>
    </div>
  );
}

/**
 * Error Boundary wrapper using Sentry
 * Automatically captures errors and shows fallback UI
 */
export const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: (errorData) => <ErrorFallback error={errorData.error as Error} />,
    showDialog: false, // We have our own UI
    beforeCapture: (scope, _error, errorInfo) => {
      // Add React error info
      scope.setContext("react_errorInfo", {
        componentStack: typeof errorInfo === "string" ? errorInfo : "",
      });

      // Add additional tags
      scope.setTag("error_boundary", "react");
    },
  },
);

/**
 * Route-level error boundary for TanStack Router
 */
export function RouteErrorBoundary({ error }: { error?: Error }) {
  // Capture error in Sentry
  if (error instanceof Error) {
    Sentry.captureException(error, {
      tags: {
        error_boundary: "route",
      },
    });
  }

  return <ErrorFallback error={error} />;
}
