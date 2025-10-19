import { createFileRoute } from "@tanstack/react-router"

/**
 * Index (home) route
 * Main dashboard/landing page for the application
 */
export const Route = createFileRoute("/")({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Resumier</h1>
          <p className="text-lg text-muted-foreground">
            Create professional resumes with ease using our modern resume builder.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-6 space-y-2">
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            <p className="text-muted-foreground">
              Build your first resume in minutes with our intuitive interface.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-2">
            <h2 className="text-2xl font-semibold">Features</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Multiple resume templates</li>
              <li>Real-time preview</li>
              <li>Export to PDF</li>
              <li>Cloud storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
