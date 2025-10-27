import { createFileRoute, redirect } from "@tanstack/react-router"
import { queryClient } from "@/app/query-client"
import { RouteError } from "@/components/ui/route-error"
import { ResumeEditorLoading } from "@/components/ui/route-loading"
import { resumeQueryKey } from "@/hooks/api/use-resume"
import { apiClient } from "@/lib/api/client"
import type { Resume } from "@/lib/api/types"
import { useAuthStore } from "@/stores"

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
  // Prefetch individual resume data for faster editing (cache warming)
  loader: async ({ params }) => {
    const { id } = params

    // Prefetch the specific resume if not already in cache
    await queryClient.prefetchQuery({
      queryKey: resumeQueryKey(id),
      queryFn: () => apiClient.get<Resume>(`/api/resumes/${id}`),
      staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
    })
  },
  pendingComponent: ResumeEditorLoading,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Resume Loading Error" />
  ),
})
