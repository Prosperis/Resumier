/**
 * Profile-specific Experience List component
 * Wraps the resume ExperienceList but uses profile update hooks
 */

import { ExperienceList } from "@/components/features/resume/forms/experience-list";
import type { Experience } from "@/lib/api/types";

interface ProfileExperienceListProps {
  profileId: string;
  experiences: Experience[];
  editingId: string | null;
  isAddingNew: boolean;
  onEdit: (id: string) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onReorder?: (experiences: Experience[]) => void;
}

/**
 * Profile Experience List - adapts resume ExperienceList for profiles
 * Note: This is a temporary wrapper. The underlying ExperienceList uses resumeId,
 * so we need to create profile-specific inline forms.
 * For now, this will work but the inline forms need to be profile-aware.
 */
export function ProfileExperienceList(props: ProfileExperienceListProps) {
  // For now, pass profileId as resumeId to reuse the component
  // TODO: Create ProfileExperienceInlineForm that uses useUpdateProfile
  return <ExperienceList {...props} resumeId={props.profileId} />;
}
