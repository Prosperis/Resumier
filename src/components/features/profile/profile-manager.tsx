/**
 * Profile Manager Component
 * Grid/list view for managing profiles
 */

import { AlertCircle, Plus, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RouteLoadingFallback } from "@/components/ui/route-loading";
import { useProfiles, useResumes } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/lib/api/profile-types";
import { ProfileCard } from "./profile-card";
import { CreateProfileDialog } from "./create-profile-dialog";
import { DeleteProfileDialog } from "./delete-profile-dialog";

interface ProfileManagerProps {
  onEditProfile?: (profileId: string) => void;
  onCreateResumeFromProfile?: (profile: Profile) => void;
}

export function ProfileManager({
  onEditProfile,
  onCreateResumeFromProfile,
}: ProfileManagerProps) {
  const { data: profiles, isLoading, error } = useProfiles();
  const { data: resumes } = useResumes();
  const { toast } = useToast();

  // Delete dialog state
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

  // Count resumes linked to each profile
  const getLinkedResumesCount = (profileId: string): number => {
    if (!resumes) return 0;
    return resumes.filter((r) => r.profileLink?.profileId === profileId).length;
  };

  const handleEdit = (profile: Profile) => {
    if (onEditProfile) {
      onEditProfile(profile.id);
    } else {
      // Default behavior: show toast
      toast({
        title: "Edit Profile",
        description: `Editing "${profile.name}"`,
      });
    }
  };

  const handleDelete = (profile: Profile) => {
    setProfileToDelete(profile);
  };

  const handleCreateResume = (profile: Profile) => {
    if (onCreateResumeFromProfile) {
      onCreateResumeFromProfile(profile);
    } else {
      toast({
        title: "Create Resume",
        description: `Creating resume from "${profile.name}"`,
      });
    }
  };

  if (isLoading) {
    return <RouteLoadingFallback message="Loading your profiles..." />;
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
                Failed to load profiles
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
  if (!profiles || profiles.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No profiles yet</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
          Create a master profile with your experience, education, and
          skills. Then create multiple tailored resumes from this single
          source of truth.
        </p>
        <CreateProfileDialog
          trigger={
            <Button aria-label="Create your first profile">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Profile
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      {/* Profile grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            linkedResumesCount={getLinkedResumesCount(profile.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateResume={handleCreateResume}
          />
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <DeleteProfileDialog
        profile={profileToDelete}
        open={!!profileToDelete}
        onOpenChange={(open) => !open && setProfileToDelete(null)}
        linkedResumesCount={
          profileToDelete
            ? getLinkedResumesCount(profileToDelete.id)
            : 0
        }
      />
    </>
  );
}
