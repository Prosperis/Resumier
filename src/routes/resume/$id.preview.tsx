import { createFileRoute, redirect, useNavigate, useParams } from "@tanstack/react-router"
import { ArrowLeft, Download } from "lucide-react"
import { useEffect } from "react"
import { PdfViewer } from "@/components/features/resume/pdf-viewer"
import { Button } from "@/components/ui/button"
import { RouteError } from "@/components/ui/route-error"
import { RouteLoadingFallback } from "@/components/ui/route-loading"
import { useAuthStore, useResumeStore } from "@/stores"

/**
 * Resume preview route
 * Protected route for previewing resume in full screen
 * Requires authentication
 */
export const Route = createFileRoute("/resume/$id/preview")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: PreviewResumeComponent,
  pendingComponent: () => <RouteLoadingFallback message="Loading preview..." />,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Preview Error" />
  ),
})

function PreviewResumeComponent() {
  const { id } = useParams({ from: "/resume/$id/preview" })
  const navigate = useNavigate()
  const documents = useResumeStore((state) => state.documents)
  const userInfo = useResumeStore((state) => state.userInfo)

  // Load resume for preview
  // biome-ignore lint/correctness/useExhaustiveDependencies: Load on mount or ID change
  useEffect(() => {
    const resume = documents.find((doc) => doc.id === id)
    if (resume) {
      console.log("Previewing resume:", resume.name)
    }
  }, [id])

  const handleBack = () => {
    navigate({ to: "/resume/$id", params: { id } })
  }

  const handleDownload = () => {
    // PDF download logic will go here
    console.log("Downloading resume...")
  }

  return (
    <div className="h-screen flex flex-col bg-muted/20">
      {/* Header */}
      <div className="border-b bg-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
          <div>
            <h2 className="font-semibold">{userInfo.name || "Resume Preview"}</h2>
            <p className="text-sm text-muted-foreground">{userInfo.title || "Preview Mode"}</p>
          </div>
        </div>

        <Button onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-lg">
          <PdfViewer />
        </div>
      </div>
    </div>
  )
}
