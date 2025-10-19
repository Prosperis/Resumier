import { createFileRoute, redirect, useParams } from "@tanstack/react-router"
import { useEffect } from "react"
import { ResumeBuilder } from "@/components/features/resume/resume-builder"
import { RouteError } from "@/components/ui/route-error"
import { ResumeEditorLoading } from "@/components/ui/route-loading"
import { useAuthStore, useResumeStore } from "@/stores"

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
  const documents = useResumeStore((state) => state.documents)

  // Load resume content by ID
  // biome-ignore lint/correctness/useExhaustiveDependencies: Load on mount or ID change
  useEffect(() => {
    const resume = documents.find((doc) => doc.id === id)
    if (resume) {
      // In a real app, you'd load the full resume content here
      // For now, we'll just use what's in the store
      console.log("Loading resume:", resume.name)
    }
  }, [id])

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Resume</h1>
        <p className="text-muted-foreground">Update your resume information and content</p>
      </div>

      <ResumeBuilder />
    </div>
  )
}
