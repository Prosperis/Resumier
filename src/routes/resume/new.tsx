import { createFileRoute, redirect } from "@tanstack/react-router"
import { useEffect } from "react"
import { ResumeBuilder } from "@/components/features/resume/resume-builder"
import { RouteError } from "@/components/ui/route-error"
import { ResumeEditorLoading } from "@/components/ui/route-loading"
import { useAuthStore, useResumeStore } from "@/stores"

/**
 * Create new resume route
 * Protected route for creating a new resume
 * Requires authentication
 */
export const Route = createFileRoute("/resume/new")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: NewResumeComponent,
  pendingComponent: ResumeEditorLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Resume Creation Error" />
  ),
})

function NewResumeComponent() {
  const resetContent = useResumeStore((state) => state.resetContent)

  // Reset content when creating a new resume
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount
  useEffect(() => {
    resetContent()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Resume</h1>
        <p className="text-muted-foreground">
          Fill in your information to create a professional resume
        </p>
      </div>

      <ResumeBuilder />
    </div>
  )
}
