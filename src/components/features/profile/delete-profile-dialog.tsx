/**
 * Delete Profile Dialog
 * Confirmation dialog for deleting a profile
 */

import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Profile } from "@/lib/api/profile-types";
import { useDeleteProfile } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";

interface DeleteProfileDialogProps {
  profile: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkedResumesCount?: number;
}

export function DeleteProfileDialog({
  profile,
  open,
  onOpenChange,
  linkedResumesCount = 0,
}: DeleteProfileDialogProps) {
  const { mutate, isPending } = useDeleteProfile();
  const { toast } = useToast();

  const handleDelete = () => {
    if (!profile) return;

    mutate(profile.id, {
      onSuccess: () => {
        toast({
          title: "Profile deleted",
          description: `"${profile.name}" has been deleted`,
        });
        onOpenChange(false);
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to delete profile",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Profile</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>
              Are you sure you want to delete{" "}
              <strong>"{profile?.name}"</strong>?
            </span>
            {linkedResumesCount > 0 && (
              <span className="block text-destructive">
                Warning: This profile is linked to {linkedResumesCount} resume
                {linkedResumesCount !== 1 ? "s" : ""}. Those resumes will keep
                their current content but will no longer be linked to this
                profile.
              </span>
            )}
            <span className="block">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
