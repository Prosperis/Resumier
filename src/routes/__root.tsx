import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
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
    <>
      <RootLayout>
        <Outlet />
      </RootLayout>
      {/* Show router devtools in development */}
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
}
