/**
 * Profile-specific Link List component
 */

import { LinkList } from "@/components/features/resume/forms/link-list";
import type { Link } from "@/lib/api/types";

interface ProfileLinkListProps {
  profileId: string;
  links: Link[];
  editingId: string | null;
  isAddingNew: boolean;
  onEdit: (id: string) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onReorder?: (links: Link[]) => void;
}

export function ProfileLinkList(props: ProfileLinkListProps) {
  return <LinkList {...props} resumeId={props.profileId} />;
}
