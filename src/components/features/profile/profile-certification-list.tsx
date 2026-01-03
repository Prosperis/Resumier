/**
 * Profile-specific Certification List component
 */

import { CertificationList } from "@/components/features/resume/forms/certification-list";
import type { Certification } from "@/lib/api/types";

interface ProfileCertificationListProps {
  profileId: string;
  certifications: Certification[];
  editingId: string | null;
  isAddingNew: boolean;
  onEdit: (id: string) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onReorder?: (certifications: Certification[]) => void;
}

export function ProfileCertificationList(props: ProfileCertificationListProps) {
  return <CertificationList {...props} resumeId={props.profileId} />;
}

