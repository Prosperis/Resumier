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
      <ResumeDashboard onResumeClick={handleResumeClick} />
    </div>
  );
}
