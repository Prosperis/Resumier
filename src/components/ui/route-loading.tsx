import { FadeIn } from "@/components/ui/animated"
import { LoadingDots, LoadingSpinner } from "./loading-spinner"

/**
 * Generic loading component for route pending states
 * Can be customized per route but provides a consistent default
 */
export function RouteLoadingFallback({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <FadeIn>
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" variant="primary" />
          <span className="text-lg text-muted-foreground">{message}</span>
        </div>
      </FadeIn>
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

/**
 * Inline loading component for smaller areas
 */
export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <LoadingDots size="sm" variant="muted" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  )
}
