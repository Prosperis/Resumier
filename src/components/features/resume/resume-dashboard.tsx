import { AlertCircle, Plus } from "lucide-react";
import { FadeIn } from "@/components/ui/animated";
import { Button } from "@/components/ui/button";
import { RouteLoadingFallback } from "@/components/ui/route-loading";
import { useDuplicateResume, useResumes } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import type { Resume } from "@/lib/api/types";
import { CreateResumeDialog } from "./mutations";
import { ResumeTable } from "./resume-table";

interface ResumeDashboardProps {
  onResumeClick?: (id: string) => void;
}

export function ResumeDashboard({ onResumeClick }: ResumeDashboardProps) {
  const { data: resumes, isLoading, error } = useResumes();
  const { mutate: duplicateResume } = useDuplicateResume();
  const { toast } = useToast();

  // Handle duplicate action
  const handleDuplicate = (resume: Resume) => {
    duplicateResume(resume, {
      onSuccess: (newResume) => {
        toast({
          title: "Success",
          description: `Resume "${newResume.title}" has been created`,
        });
        // Optionally navigate to the new resume
        // onResumeClick?.(newResume.id)
      },
      onError: (err) => {
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to duplicate resume",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return <RouteLoadingFallback message="Loading your resumes..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div
          className="border-destructive bg-destructive/10 rounded-lg border p-4"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-destructive mt-0.5 h-5 w-5"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-destructive font-semibold">
                Failed to load resumes
              </h3>
              <p className="text-destructive/90 mt-1 text-sm">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!resumes || resumes.length === 0) {
    return (
      <div className="p-4">
        <FadeIn>
          <div className="rounded-lg border-2 border-dashed p-12 text-center">
            <h3 className="mb-2 text-lg font-semibold">No resumes yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Create your first resume to get started
            </p>
            <CreateResumeDialog
              onSuccess={(id) => onResumeClick?.(id)}
              trigger={
                <Button aria-label="Create your first resume">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Create Resume
                </Button>
              }
            />
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="space-y-4 p-4 bg-background">
        {/* Header with create button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Resumes</h2>
            <p className="text-muted-foreground">
              Manage your resume documents ({resumes.length})
            </p>
          </div>
          <CreateResumeDialog
            onSuccess={(id) => onResumeClick?.(id)}
            trigger={
              <Button aria-label="Create new resume">
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
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
    </FadeIn>
  );
}
