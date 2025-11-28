import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ExternalLink,
  Link as LinkIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Link } from "@/lib/api/types";
import type { LinkFormData } from "@/lib/validations/links";
import { SortableItem } from "../dnd/sortable-item";
import { LinkInlineForm } from "./link-inline-form";

interface LinkListProps {
  resumeId: string;
  links: Link[];
  editingId: string | null;
  isAddingNew: boolean;
  onEdit: (id: string) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onReorder?: (links: Link[]) => void;
}

// Use the shared getLinkIcon from the centralized location
import { getLinkIcon as getIcon } from "@/components/features/resume/preview/templates/shared/contact-info";
import type { LinkType } from "@/lib/api/types";

function getLinkIcon(type: LinkFormData["type"]) {
  return getIcon(type as LinkType, true, "h-3 w-3");
}

export function LinkList({
  resumeId,
  links,
  editingId,
  isAddingNew,
  onEdit,
  onClose,
  onDelete,
  onReorder,
}: LinkListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
      const result = Array.from(links);
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      onReorder(result);
    }
  };

  if (isAddingNew) {
    return (
      <div className="space-y-2">
        <LinkInlineForm
          resumeId={resumeId}
          existingLinks={links as Link[]}
          onClose={onClose}
          isNew
        />
        {links.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {links.map((link) => (
                <SortableItem key={link.id} id={link.id}>
                  <LinkPreviewCard
                    link={link}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    disabled
                  />
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <Card className="border-dashed gap-3 py-3">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center px-3">
          <LinkIcon className="text-muted-foreground mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-xs">No links added yet</p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            Add your portfolio, LinkedIn, GitHub, or other links
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {links.map((link) => (
            <SortableItem key={link.id} id={link.id}>
              {editingId === link.id ? (
                <LinkInlineForm
                  resumeId={resumeId}
                  editingId={editingId}
                  existingLinks={links as Link[]}
                  defaultValues={link}
                  onClose={onClose}
                />
              ) : (
                <LinkPreviewCard
                  link={link}
                  onEdit={() => onEdit(link.id)}
                  onDelete={() => onDelete(link.id)}
                  disabled={editingId !== null}
                />
              )}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function LinkPreviewCard({
  link,
  onEdit,
  onDelete,
  disabled,
}: {
  link: LinkFormData;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <Card className={`gap-2 py-2 ${disabled ? "opacity-50" : ""}`}>
      <CardContent className="pt-0 px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              {getLinkIcon(link.type)}
              <h3 className="text-xs font-semibold">{link.label}</h3>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex items-center gap-1 text-[11px] hover:underline"
            >
              {link.url}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          {!disabled && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onEdit}
              >
                <EditIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onDelete}
              >
                <TrashIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
