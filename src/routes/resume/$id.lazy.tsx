import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { ResumeEditor } from "@/components/features/resume/resume-editor";
import { RouteError } from "@/components/ui/route-error";
import { ResumeEditorLoading } from "@/components/ui/route-loading";
import { useResume } from "@/hooks/api";

/**
 * Edit resume route component (lazy loaded)
 * Renders resume editor with data fetching
 */
export const Route = createLazyFileRoute("/resume/$id")({
  component: EditResumeComponent,
});

function EditResumeComponent() {
  const { id } = useParams({ from: "/resume/$id" });
  const { data: resume, isLoading, error } = useResume(id);

  if (isLoading) {
    return <ResumeEditorLoading />;
  }

  if (error) {
    return (
      <RouteError
        error={error}
        reset={() => window.location.reload()}
        title="Failed to load resume"
      />
    );
  }

  if (!resume) {
    return (
      <RouteError
        error={new Error("Resume not found")}
        reset={() => window.location.reload()}
        title="Resume not found"
      />
    );
  }

  return (
    <div className="container mx-auto p-8">
      <ResumeEditor resume={resume} />
    </div>
  );
}
