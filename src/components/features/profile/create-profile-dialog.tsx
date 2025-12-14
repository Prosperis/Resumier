/**
 * Create Profile Dialog
 * Dialog for creating a new profile
 */

import { Loader2, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateProfile } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";

interface CreateProfileDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: (id: string) => void;
}

export function CreateProfileDialog({ trigger, onSuccess }: CreateProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");
  const { toast } = useToast();

  const { mutate, isPending, error } = useCreateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError("");

    if (!name.trim()) {
      setValidationError("Please enter a profile name");
      toast({
        title: "Error",
        description: "Please enter a profile name",
        variant: "destructive",
      });
      document.getElementById("profile-name")?.focus();
      return;
    }

    mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Success",
            description: "Profile created successfully",
          });
          setOpen(false);
          setName("");
          setDescription("");

          if (onSuccess) {
            onSuccess(data.id);
          }
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Failed to create profile",
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
          <Button aria-label="Create new profile">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Create a master profile to reuse across multiple resumes. Add your experience,
              education, and skills once, then create tailored resumes from this profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationError) {
                    setValidationError("");
                  }
                }}
                placeholder="e.g., Software Engineer, Product Manager"
                disabled={isPending}
                autoFocus
                required
                aria-invalid={!!validationError || !!error}
                aria-describedby={
                  validationError ? "name-validation-error" : error ? "name-api-error" : undefined
                }
              />
              {validationError && (
                <p id="name-validation-error" className="text-destructive text-sm" role="alert">
                  {validationError}
                </p>
              )}
              {error && !validationError && (
                <p id="name-api-error" className="text-destructive text-sm" role="alert">
                  {error.message || "An error occurred"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-description">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="profile-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this profile for? e.g., Tech roles at startups"
                disabled={isPending}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              aria-label={isPending ? "Creating profile..." : "Create profile"}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Create Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
