import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { RootLayout } from "@/components/layouts/root-layout"
import { NotFoundError } from "@/components/ui/route-error"

/**
 * Root route component
 * Serves as the layout wrapper for all routes in the application
 */
export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundError,
})

function RootComponent() {
  return (
    <>
      <RootLayout>
        <Outlet />
      </RootLayout>
      {/* Show router devtools in development */}
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  )
}
