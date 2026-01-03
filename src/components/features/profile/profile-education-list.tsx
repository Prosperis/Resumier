/**
 * Profile-specific Education List component
 */

import { EducationList } from "@/components/features/resume/forms/education-list";
import type { Education } from "@/lib/api/types";

interface ProfileEducationListProps {
  profileId: string;
  education: Education[];
  editingId: string | null;
  isAddingNew: boolean;
  onEdit: (id: string) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onReorder?: (education: Education[]) => void;
}

export function ProfileEducationList(props: ProfileEducationListProps) {
  return <EducationList {...props} resumeId={props.profileId} />;
}

