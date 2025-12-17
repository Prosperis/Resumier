import { FadeIn } from "@/components/ui/animated";
import { LoadingDots, LoadingSpinner } from "./loading-spinner";
import {
  DashboardSkeleton,
  ResumeEditorSkeleton,
  SettingsSkeleton,
  ProfileGridSkeleton,
} from "./loading-skeletons";

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
          <span className="text-muted-foreground text-lg">{message}</span>
        </div>
      </FadeIn>
    </div>
  );
}

/**
 * Dashboard-specific loading component with skeleton
 */
export function DashboardLoading() {
  return (
    <FadeIn>
      <div data-testid="dashboard-loading">
        <DashboardSkeleton />
      </div>
    </FadeIn>
  );
}

/**
 * Resume editor loading component with skeleton
 */
export function ResumeEditorLoading() {
  return (
    <FadeIn>
      <div data-testid="resume-loading" className="h-screen">
        <ResumeEditorSkeleton className="h-full" />
        <span className="sr-only">Loading Resume...</span>
      </div>
    </FadeIn>
  );
}

/**
 * Settings loading component with skeleton
 */
export function SettingsLoading() {
  return (
    <FadeIn>
      <div data-testid="settings-loading">
        <SettingsSkeleton />
      </div>
    </FadeIn>
  );
}

/**
 * Profile manager loading component with skeleton
 */
export function ProfileManagerLoading() {
  return (
    <FadeIn>
      <div data-testid="profile-loading">
        <ProfileGridSkeleton count={3} />
      </div>
    </FadeIn>
  );
}

/**
 * Inline loading component for smaller areas
 */
export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="text-muted-foreground flex items-center gap-2">
      <LoadingDots size="sm" variant="muted" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}
