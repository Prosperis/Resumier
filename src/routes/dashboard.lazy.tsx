import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { ResumeDashboard } from "@/components/features/resume/resume-dashboard";

/**
 * Dashboard route component (lazy loaded)
 * Protected route showing user's resume dashboard
 */
export const Route = createLazyFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const navigate = useNavigate();

  const handleResumeClick = (id: string) => {
    navigate({ to: "/resume/$id", params: { id } });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
        <p className="text-muted-foreground">Manage your resumes and create new ones</p>
      </div>

      <ResumeDashboard onResumeClick={handleResumeClick} />
    </div>
  );
}
