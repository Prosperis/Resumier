import { createLazyFileRoute } from "@tanstack/react-router";

/**
 * Settings route component (lazy loaded)
 * Renders settings page
 */
export const Route = createLazyFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  return (
    <div className="container mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Account</h2>
          <p className="text-muted-foreground text-sm">
            Manage your account settings and preferences
          </p>
          {/* Settings content will go here */}
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Appearance</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Customize how Resumier looks on your device
          </p>
          {/* Theme toggle and other appearance settings */}
        </div>
      </div>
    </div>
  );
}
