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
import { CalendarIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Experience } from "@/lib/api/types";
import { SortableItem } from "../dnd/sortable-item";

interface ExperienceListProps {
  experiences: Experience[];
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
  onReorder?: (experiences: Experience[]) => void;
}

export function ExperienceList({
  experiences,
  onEdit,
  onDelete,
  onReorder,
}: ExperienceListProps) {
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

    const oldIndex = experiences.findIndex((exp) => exp.id === active.id);
    const newIndex = experiences.findIndex((exp) => exp.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
      const result = Array.from(experiences);
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      onReorder(result);
    }
  };

  if (experiences.length === 0) {
    return (
      <Card className="border-dashed gap-3 py-3">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center px-3">
          <p className="text-muted-foreground text-xs">
            No experience added yet.
          </p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            Click "Add Experience" to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const formatDateRange = (exp: Experience) => {
    const start = formatDate(exp.startDate);
    const end = exp.current ? "Present" : formatDate(exp.endDate || "");
    return `${start} – ${end}`;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={experiences.map((exp) => exp.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {experiences.map((exp) => (
            <SortableItem key={exp.id} id={exp.id}>
              <Card className="gap-2 py-2">
                <CardHeader className="px-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold">{exp.position}</h3>
                      <p className="text-muted-foreground text-[11px]">
                        {exp.company}
                      </p>
                      <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[10px]">
                        <CalendarIcon className="h-2.5 w-2.5" />
                        <span>{formatDateRange(exp)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onEdit(exp)}
                        aria-label={`Edit ${exp.position} experience`}
                      >
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDelete(exp.id)}
                        aria-label={`Delete ${exp.position} experience`}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {(exp.description ||
                  (exp.highlights && exp.highlights.length > 0)) && (
                  <CardContent className="px-3">
                    {exp.description && (
                      <p className="text-muted-foreground text-[11px]">
                        {exp.description}
                      </p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-1 space-y-0.5 text-[11px]">
                        {exp.highlights.map((highlight, index) => (
                          <li key={index} className="flex gap-1.5">
                            <span className="text-muted-foreground">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                )}
              </Card>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
