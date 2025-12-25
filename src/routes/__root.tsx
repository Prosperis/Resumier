import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { GlobalUndoProvider } from "@/components/features/global-undo-provider";
import { RootLayout } from "@/components/layouts/root-layout";
import { NotFoundError } from "@/components/ui/route-error";
import { useCacheCleanup } from "@/hooks/use-cache-cleanup";

/**
 * Root route component
 * Serves as the layout wrapper for all routes in the application
 */
export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundError,
});

function RootComponent() {
  // Enable automatic cache cleanup
  useCacheCleanup({
    enabled: true,
    interval: 1000 * 60 * 5, // 5 minutes
    logStats: import.meta.env.DEV,
  });

  return (
    <GlobalUndoProvider>
      <RootLayout>
        <Outlet />
      </RootLayout>
      {/* Show router devtools only in development, hide in production */}
      {import.meta.env.MODE !== "production" && <TanStackRouterDevtools position="bottom-right" />}
    </GlobalUndoProvider>
  );
}
