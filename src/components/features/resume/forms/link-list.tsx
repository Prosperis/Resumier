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
import { ExternalLink, Github, Linkedin, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LinkFormData } from "@/lib/validations/links";
import { SortableItem } from "../dnd/sortable-item";

interface LinkListProps {
  links: LinkFormData[];
  onEdit: (link: LinkFormData) => void;
  onDelete: (id: string) => void;
  onReorder?: (links: LinkFormData[]) => void;
}

function getLinkIcon(type: LinkFormData["type"]) {
  switch (type) {
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "github":
      return <Github className="h-4 w-4" />;
    case "portfolio":
      return <ExternalLink className="h-4 w-4" />;
    case "other":
      return <LinkIcon className="h-4 w-4" />;
    default:
      return <LinkIcon className="h-4 w-4" />;
  }
}

function getLinkTypeLabel(type: LinkFormData["type"]) {
  switch (type) {
    case "linkedin":
      return "LinkedIn";
    case "github":
      return "GitHub";
    case "portfolio":
      return "Portfolio";
    case "other":
      return "Other";
    default:
      return type;
  }
}

export function LinkList({
  links,
  onEdit,
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

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
      const result = Array.from(links);
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      onReorder(result);
    }
  };

  if (links.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <LinkIcon className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground">No links added yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Add your portfolio, LinkedIn, GitHub, or other professional links
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
        items={links.map((link) => link.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {links.map((link) => (
            <SortableItem key={link.id} id={link.id}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getLinkIcon(link.type)}
                        <h3 className="font-semibold">{link.label}</h3>
                        <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                          {getLinkTypeLabel(link.type)}
                        </span>
                      </div>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center gap-1 text-sm hover:underline"
                      >
                        {link.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(link)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(link.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
