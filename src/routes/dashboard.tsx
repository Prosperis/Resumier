import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { ResumeDashboard } from "@/components/features/resume/resume-dashboard"
import { RouteError } from "@/components/ui/route-error"
import { DashboardLoading } from "@/components/ui/route-loading"
import { useAuthStore } from "@/stores"

/**
 * Dashboard route
 * Protected route showing user's resume dashboard
 * Requires authentication
 */
export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: DashboardComponent,
  pendingComponent: DashboardLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Dashboard Error" />
  ),
})

function DashboardComponent() {
  const navigate = useNavigate()

  const handleResumeClick = (id: string) => {
    navigate({ to: "/resume/$id", params: { id } })
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
        <p className="text-muted-foreground">Manage your resumes and create new ones</p>
      </div>

      <ResumeDashboard onResumeClick={handleResumeClick} />
    </div>
  )
}
