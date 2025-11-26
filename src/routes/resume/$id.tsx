import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { queryClient } from "@/app/query-client";
import { ResumeEditor } from "@/components/features/resume/resume-editor";
import { RouteError } from "@/components/ui/route-error";
import { ResumeEditorLoading } from "@/components/ui/route-loading";
import { resumeQueryKey, useResume } from "@/hooks/api/use-resume";
import { apiClient } from "@/lib/api/client";
import type { Resume } from "@/lib/api/types";
import { useAuthStore } from "@/stores";

/**
 * Edit resume route
 * Protected route for editing an existing resume by ID
 * Requires authentication
 */
export const Route = createFileRoute("/resume/$id")({
  beforeLoad: () => {
    const { isAuthenticated, isGuest } = useAuthStore.getState();

    // Allow both authenticated users and guests to edit resumes
    if (!isAuthenticated && !isGuest) {
      throw redirect({
        to: "/",
      });
    }
  },
  // Prefetch individual resume data for faster editing (cache warming)
  loader: async ({ params }) => {
    const { id } = params;

    // Prefetch the specific resume if not already in cache
    await queryClient.prefetchQuery({
      queryKey: resumeQueryKey(id),
      queryFn: () => apiClient.get<Resume>(`/api/resumes/${id}`),
      staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
    });
  },
  component: EditResumeComponent,
  pendingComponent: ResumeEditorLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Resume Loading Error" />
  ),
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

  return <ResumeEditor resume={resume} />;
}
