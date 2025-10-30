import {
  createLazyFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { PdfViewer } from "@/components/features/resume/pdf-viewer";
import { Button } from "@/components/ui/button";
import { RouteError } from "@/components/ui/route-error";
import { RouteLoadingFallback } from "@/components/ui/route-loading";
import { useResume } from "@/hooks/api";

/**
 * Resume preview route component (lazy loaded)
 * Renders full-screen resume preview
 */
export const Route = createLazyFileRoute("/resume/$id/preview")({
  component: PreviewResumeComponent,
});

function PreviewResumeComponent() {
  const { id } = useParams({ from: "/resume/$id/preview" });
  const navigate = useNavigate();
  const { data: resume, isLoading, error } = useResume(id);

  if (isLoading) {
    return <RouteLoadingFallback message="Loading preview..." />;
  }

  if (error || !resume) {
    return (
      <RouteError
        error={error || new Error("Resume not found")}
        reset={() => window.location.reload()}
        title="Failed to load preview"
      />
    );
  }

  const handleBack = () => {
    navigate({ to: "/resume/$id", params: { id } });
  };

  const handleDownload = () => {
    // PDF download logic will go here
    console.log("Downloading resume:", resume.title);
  };

  return (
    <div className="bg-muted/20 flex h-screen flex-col">
      {/* Header */}
      <div className="bg-background flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
          <div>
            <h2 className="font-semibold">{resume.title}</h2>
            <p className="text-muted-foreground text-sm">Preview Mode</p>
          </div>
        </div>

        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-background mx-auto max-w-4xl rounded-lg shadow-lg">
          <PdfViewer />
        </div>
      </div>
    </div>
  );
}
