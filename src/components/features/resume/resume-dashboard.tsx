import { AlertCircle, Plus } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { RouteLoadingFallback } from "@/components/ui/route-loading"
import { useResumes } from "@/hooks/api"

interface ResumeDashboardProps {
  onCreateResume: () => void
  onResumeClick?: (id: string) => void
}

export function ResumeDashboard({ onCreateResume, onResumeClick }: ResumeDashboardProps) {
  const { data: resumes, isLoading, error } = useResumes()

  if (isLoading) {
    return <RouteLoadingFallback message="Loading your resumes..." />
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Failed to load resumes</h3>
              <p className="text-sm text-destructive/90 mt-1">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-4">
      {resumes?.map((resume) => (
        <Card
          key={resume.id}
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onResumeClick?.(resume.id)}
        >
          <CardHeader>
            <CardTitle>{resume.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Updated {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </CardHeader>
        </Card>
      ))}
      <button
        type="button"
        onClick={onCreateResume}
        className="border-dashed border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer py-8 text-muted-foreground hover:bg-accent"
      >
        <Plus className="size-8" />
        <span className="mt-2">New Resume</span>
      </button>
    </div>
  )
}
