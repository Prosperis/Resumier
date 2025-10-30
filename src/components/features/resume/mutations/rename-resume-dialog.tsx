import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateResume } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";

interface RenameResumeDialogProps {
  resumeId: string;
  currentTitle: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function RenameResumeDialog({
  resumeId,
  currentTitle,
  trigger,
  onSuccess,
}: RenameResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [validationError, setValidationError] = useState("");
  const { toast } = useToast();

  const { mutate, isPending, error } = useUpdateResume();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation error
    setValidationError("");

    if (!title.trim()) {
      setValidationError("Please enter a resume title");
      toast({
        title: "Error",
        description: "Please enter a resume title",
        variant: "destructive",
      });
      // Focus the input field
      document.getElementById("title")?.focus();
      return;
    }

    if (title.trim() === currentTitle) {
      setOpen(false);
      return;
    }

    mutate(
      {
        id: resumeId,
        data: {
          title: title.trim(),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Resume title updated successfully",
          });
          setOpen(false);

          if (onSuccess) {
            onSuccess();
          }
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Failed to update resume title",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            aria-label={`Rename ${currentTitle}`}
          >
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
            Rename
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
            <DialogDescription>
              Enter a new title for your resume
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Clear validation error on change
                if (validationError) {
                  setValidationError("");
                }
              }}
              placeholder="e.g., Software Engineer Resume"
              disabled={isPending}
              autoFocus
              aria-invalid={!!validationError || !!error}
              aria-describedby={
                validationError
                  ? "title-validation-error"
                  : error
                    ? "title-api-error"
                    : undefined
              }
            />
            {validationError && (
              <p
                id="title-validation-error"
                className="text-destructive mt-2 text-sm"
                role="alert"
              >
                {validationError}
              </p>
            )}
            {error && !validationError && (
              <p
                id="title-api-error"
                className="text-destructive mt-2 text-sm"
                role="alert"
              >
                {error.message || "An error occurred"}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setTitle(currentTitle); // Reset on cancel
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              aria-label={isPending ? "Saving changes..." : "Save changes"}
            >
              {isPending && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
