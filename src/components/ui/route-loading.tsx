import { Loader2 } from "lucide-react"

/**
 * Generic loading component for route pending states
 * Can be customized per route but provides a consistent default
 */
export function RouteLoadingFallback({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-lg text-muted-foreground">{message}</span>
      </div>
    </div>
  )
}

/**
 * Dashboard-specific loading component
 */
export function DashboardLoading() {
  return <RouteLoadingFallback message="Loading your resumes..." />
}

/**
 * Resume editor loading component
 */
export function ResumeEditorLoading() {
  return <RouteLoadingFallback message="Loading resume editor..." />
}

/**
 * Settings loading component
 */
export function SettingsLoading() {
  return <RouteLoadingFallback message="Loading settings..." />
}
