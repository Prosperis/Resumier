import { createFileRoute, redirect } from "@tanstack/react-router"
import { RouteError } from "@/components/ui/route-error"
import { SettingsLoading } from "@/components/ui/route-loading"
import { useAuthStore } from "@/stores"

/**
 * Settings route
 * Protected route for user settings and preferences
 * Requires authentication
 */
export const Route = createFileRoute("/settings")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: SettingsComponent,
  pendingComponent: SettingsLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Settings Error" />
  ),
})

function SettingsComponent() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
          {/* Settings content will go here */}
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Customize how Resumier looks on your device
          </p>
          {/* Theme toggle and other appearance settings */}
        </div>
      </div>
    </div>
  )
}
