import { useCallback, useState } from "react";
import { useUpdateProfile } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import type { ProfileContent } from "@/lib/api/profile-types";

/**
 * Entity keys that support list operations in ProfileContent
 */
export type ProfileEntityKey = "experience" | "education" | "certifications" | "links";

/**
 * Base interface for entities with an id field
 */
interface EntityWithId {
  id: string;
}

/**
 * Configuration options for the profile entity list handlers hook
 */
interface UseProfileEntityHandlersOptions<T extends EntityWithId> {
  /** The profile ID to update */
  profileId: string;
  /** The key in ProfileContent for this entity type */
  entityKey: ProfileEntityKey;
  /** Function to get the current items from the profile content */
  getCurrentItems: () => T[];
  /** Label used in toast messages (e.g., "Experience", "Education") */
  entityLabel: string;
}

/**
 * Return type for the profile entity list handlers hook
 */
interface UseProfileEntityHandlersReturn<T extends EntityWithId> {
  /** ID of the item currently being edited, or null */
  editingId: string | null;
  /** Whether a new item is being added */
  isAddingNew: boolean;
  /** Whether any editing operation is in progress */
  isEditing: boolean;
  /** Start adding a new item */
  handleAdd: () => void;
  /** Start editing an existing item */
  handleEdit: (id: string) => void;
  /** Cancel the current edit or add operation */
  handleCancel: () => void;
  /** Delete an item by ID */
  handleDelete: (id: string) => void;
  /** Reorder items (after drag-and-drop) */
  handleReorder: (reorderedItems: T[]) => void;
}

/**
 * Custom hook to manage entity list operations in the profile builder.
 * Similar to useEntityListHandlers but for profiles.
 */
export function useProfileEntityHandlers<T extends EntityWithId>({
  profileId,
  entityKey,
  getCurrentItems,
  entityLabel,
}: UseProfileEntityHandlersOptions<T>): UseProfileEntityHandlersReturn<T> {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { mutate: updateProfile } = useUpdateProfile();
  const { toast } = useToast();

  const handleAdd = useCallback(() => {
    setEditingId(null);
    setIsAddingNew(true);
  }, []);

  const handleEdit = useCallback((id: string) => {
    setIsAddingNew(false);
    setEditingId(id);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsAddingNew(false);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const items = getCurrentItems();
      const updatedItems = items.filter((item) => item.id !== id);

      updateProfile(
        {
          id: profileId,
          data: { content: { [entityKey]: updatedItems } as Partial<ProfileContent> },
        },
        {
          onSuccess: () => {
            toast({ title: "Success", description: `${entityLabel} deleted` });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to delete: ${error.message}`,
              variant: "destructive",
            });
          },
        },
      );
    },
    [profileId, entityKey, getCurrentItems, entityLabel, updateProfile, toast],
  );

  const handleReorder = useCallback(
    (reorderedItems: T[]) => {
      updateProfile(
        {
          id: profileId,
          data: { content: { [entityKey]: reorderedItems } as Partial<ProfileContent> },
        },
        {
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to reorder: ${error.message}`,
              variant: "destructive",
            });
          },
        },
      );
    },
    [profileId, entityKey, updateProfile, toast],
  );

  return {
    editingId,
    isAddingNew,
    isEditing: editingId !== null || isAddingNew,
    handleAdd,
    handleEdit,
    handleCancel,
    handleDelete,
    handleReorder,
  };
}
