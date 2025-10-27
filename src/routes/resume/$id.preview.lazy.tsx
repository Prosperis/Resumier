import { createLazyFileRoute, useNavigate, useParams } from "@tanstack/react-router"
import { ArrowLeft, Download } from "lucide-react"
import { PdfViewer } from "@/components/features/resume/pdf-viewer"
import { Button } from "@/components/ui/button"
import { RouteError } from "@/components/ui/route-error"
import { RouteLoadingFallback } from "@/components/ui/route-loading"
import { useResume } from "@/hooks/api"

/**
 * Resume preview route component (lazy loaded)
 * Renders full-screen resume preview
 */
export const Route = createLazyFileRoute("/resume/$id/preview")({
  component: PreviewResumeComponent,
})

function PreviewResumeComponent() {
  const { id } = useParams({ from: "/resume/$id/preview" })
  const navigate = useNavigate()
  const { data: resume, isLoading, error } = useResume(id)

  if (isLoading) {
    return <RouteLoadingFallback message="Loading preview..." />
  }

  if (error || !resume) {
    return (
      <RouteError
        error={error || new Error("Resume not found")}
        reset={() => window.location.reload()}
        title="Failed to load preview"
      />
    )
  }

  const handleBack = () => {
    navigate({ to: "/resume/$id", params: { id } })
  }

  const handleDownload = () => {
    // PDF download logic will go here
    console.log("Downloading resume:", resume.title)
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
            <h2 className="font-semibold">{resume.title}</h2>
            <p className="text-sm text-muted-foreground">Preview Mode</p>
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
