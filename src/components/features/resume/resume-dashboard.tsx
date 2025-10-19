import { AlertCircle, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RouteLoadingFallback } from "@/components/ui/route-loading"
import { useResumes } from "@/hooks/api"
import { CreateResumeDialog, DeleteResumeDialog, RenameResumeDialog } from "./mutations"

interface ResumeDashboardProps {
  onResumeClick?: (id: string) => void
}

export function ResumeDashboard({ onResumeClick }: ResumeDashboardProps) {
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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 p-4">
      {resumes?.map((resume) => (
        <Card key={resume.id} className="group relative hover:shadow-md transition-all">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                className="flex-1 text-left"
                onClick={() => onResumeClick?.(resume.id)}
              >
                <CardTitle className="text-base">{resume.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </button>

              {/* Actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <RenameResumeDialog
                    resumeId={resume.id}
                    currentTitle={resume.title}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                    }
                  />
                  <DeleteResumeDialog
                    resumeId={resume.id}
                    resumeTitle={resume.title}
                    trigger={
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
        </Card>
      ))}

      {/* Create new resume button */}
      <CreateResumeDialog
        onSuccess={(id) => onResumeClick?.(id)}
        trigger={
          <button
            type="button"
            className="border-dashed border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer py-12 text-muted-foreground hover:bg-accent hover:border-accent-foreground/50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label="Plus icon"
            >
              <title>Add new resume</title>
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span className="mt-2 font-medium">New Resume</span>
          </button>
        }
      />
    </div>
  )
}
