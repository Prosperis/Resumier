import { useCallback, useState } from "react";
import { useUpdateResume } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import type { ResumeContent } from "@/lib/api/types";

/**
 * Entity keys that support list operations in ResumeContent
 */
export type EntityKey = "experience" | "education" | "certifications" | "links";

/**
 * Base interface for entities with an id field
 */
interface EntityWithId {
  id: string;
}

/**
 * Configuration options for the entity list handlers hook
 */
interface UseEntityListHandlersOptions<T extends EntityWithId> {
  /** The resume ID to update */
  resumeId: string;
  /** The key in ResumeContent for this entity type */
  entityKey: EntityKey;
  /** Function to get the current items from the resume content */
  getCurrentItems: () => T[];
  /** Label used in toast messages (e.g., "Experience", "Education") */
  entityLabel: string;
}

/**
 * Return type for the entity list handlers hook
 */
interface UseEntityListHandlersReturn<T extends EntityWithId> {
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
 * Custom hook to manage entity list operations in the resume builder.
 * Encapsulates common patterns for Experience, Education, Certifications, and Links.
 *
 * @example
 * ```ts
 * const experienceHandlers = useEntityListHandlers({
 *   resumeId: "123",
 *   entityKey: "experience",
 *   getCurrentItems: () => content.experience || [],
 *   entityLabel: "Experience",
 * });
 *
 * // Use handlers in components
 * <Button onClick={experienceHandlers.handleAdd}>Add</Button>
 * ```
 */
export function useEntityListHandlers<T extends EntityWithId>({
  resumeId,
  entityKey,
  getCurrentItems,
  entityLabel,
}: UseEntityListHandlersOptions<T>): UseEntityListHandlersReturn<T> {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { mutate: updateResume } = useUpdateResume();
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

      updateResume(
        {
          id: resumeId,
          data: { content: { [entityKey]: updatedItems } as Partial<ResumeContent> },
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
    [resumeId, entityKey, getCurrentItems, entityLabel, updateResume, toast],
  );

  const handleReorder = useCallback(
    (reorderedItems: T[]) => {
      updateResume(
        {
          id: resumeId,
          data: { content: { [entityKey]: reorderedItems } as Partial<ResumeContent> },
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
    [resumeId, entityKey, updateResume, toast],
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

