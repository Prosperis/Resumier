import { Link, useRouter } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RouteErrorProps {
  error: Error;
  reset?: () => void;
  title?: string;
}

/**
 * Generic error component for route error boundaries
 * Provides consistent error handling with retry and navigation options
 */
export function RouteError({
  error,
  reset,
  title = "Something went wrong",
}: RouteErrorProps) {
  const router = useRouter();

  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      // Fallback: reload the page
      router.invalidate();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-destructive/10 rounded-full p-6">
            <AlertCircle className="text-destructive h-12 w-12" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleReset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link to="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="bg-muted/50 mt-8 rounded-lg border p-4 text-left text-sm">
            <summary className="cursor-pointer font-semibold">
              Error Details (Development Only)
            </summary>
            <pre className="mt-4 overflow-auto text-xs">{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * 404 Not Found component
 */
export function NotFoundError() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold tracking-tight">404</h1>
          <p className="text-2xl font-semibold">Page not found</p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link to="/">
          <Button size="lg">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
