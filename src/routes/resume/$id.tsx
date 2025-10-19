import { createFileRoute, redirect, useParams } from "@tanstack/react-router"
import { ResumeEditor } from "@/components/features/resume/resume-editor"
import { RouteError } from "@/components/ui/route-error"
import { ResumeEditorLoading } from "@/components/ui/route-loading"
import { useResume } from "@/hooks/api"
import { useAuthStore } from "@/stores"

/**
 * Edit resume route
 * Protected route for editing an existing resume by ID
 * Requires authentication
 */
export const Route = createFileRoute("/resume/$id")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: EditResumeComponent,
  pendingComponent: ResumeEditorLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Resume Loading Error" />
  ),
})

function EditResumeComponent() {
  const { id } = useParams({ from: "/resume/$id" })
  const { data: resume, isLoading, error } = useResume(id)

  if (isLoading) {
    return <ResumeEditorLoading />
  }

  if (error) {
    return (
      <RouteError
        error={error}
        reset={() => window.location.reload()}
        title="Failed to load resume"
      />
    )
  }

  if (!resume) {
    return (
      <RouteError
        error={new Error("Resume not found")}
        reset={() => window.location.reload()}
        title="Resume not found"
      />
    )
  }

  return (
    <div className="container mx-auto p-8">
      <ResumeEditor resume={resume} />
    </div>
  )
}
