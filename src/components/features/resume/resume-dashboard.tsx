import { AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RouteLoadingFallback } from "@/components/ui/route-loading"
import { useDuplicateResume, useResumes } from "@/hooks/api"
import { useToast } from "@/hooks/use-toast"
import type { Resume } from "@/lib/api/types"
import { CreateResumeDialog } from "./mutations"
import { ResumeTable } from "./resume-table"

interface ResumeDashboardProps {
  onResumeClick?: (id: string) => void
}

export function ResumeDashboard({ onResumeClick }: ResumeDashboardProps) {
  const { data: resumes, isLoading, error } = useResumes()
  const { mutate: duplicateResume } = useDuplicateResume()
  const { toast } = useToast()

  // Handle duplicate action
  const handleDuplicate = (resume: Resume) => {
    duplicateResume(resume, {
      onSuccess: (newResume) => {
        toast({
          title: "Success",
          description: `Resume "${newResume.title}" has been created`,
        })
        // Optionally navigate to the new resume
        // onResumeClick?.(newResume.id)
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to duplicate resume",
          variant: "destructive",
        })
      },
    })
  }

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

  // Empty state
  if (!resumes || resumes.length === 0) {
    return (
      <div className="p-4">
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first resume to get started
          </p>
          <CreateResumeDialog
            onSuccess={(id) => onResumeClick?.(id)}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Resume
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resumes</h2>
          <p className="text-muted-foreground">Manage your resume documents ({resumes.length})</p>
        </div>
        <CreateResumeDialog
          onSuccess={(id) => onResumeClick?.(id)}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Resume
            </Button>
          }
        />
      </div>

      {/* Resume table */}
      <ResumeTable
        resumes={resumes}
        onEdit={(resume) => onResumeClick?.(resume.id)}
        onDuplicate={handleDuplicate}
      />
    </div>
  )
}
