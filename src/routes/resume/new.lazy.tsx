import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ResumeBuilder } from "@/components/features/resume/resume-builder";
import { useResumeStore } from "@/stores";

/**
 * Create new resume route component (lazy loaded)
 * Renders resume creation form
 */
export const Route = createLazyFileRoute("/resume/new")({
  component: NewResumeComponent,
});

function NewResumeComponent() {
  const resetContent = useResumeStore((state) => state.resetContent);

  // Reset content when creating a new resume
  useEffect(() => {
    resetContent();
  }, [resetContent]);

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
  );
}
