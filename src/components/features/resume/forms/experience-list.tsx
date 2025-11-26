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
import { ExperienceInlineForm } from "./experience-inline-form";

interface ExperienceListProps {
  resumeId: string;
  experiences: Experience[];
  editingId: string | null;
  isAddingNew: boolean;
  onEdit: (id: string) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onReorder?: (experiences: Experience[]) => void;
}

export function ExperienceList({
  resumeId,
  experiences,
  editingId,
  isAddingNew,
  onEdit,
  onClose,
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

  // Show new form at top when adding
  if (isAddingNew) {
    return (
      <div className="space-y-2">
        <ExperienceInlineForm
          resumeId={resumeId}
          existingExperiences={experiences}
          onClose={onClose}
          isNew
        />
        {experiences.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={experiences.map((exp) => exp.id)}
              strategy={verticalListSortingStrategy}
            >
              {experiences.map((exp) => (
                <SortableItem key={exp.id} id={exp.id}>
                  <ExperiencePreviewCard
                    experience={exp}
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

  if (experiences.length === 0) {
    return (
      <Card className="border-dashed gap-3 py-3">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center px-3">
          <p className="text-muted-foreground text-xs">
            No experience added yet.
          </p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            Click the + button to add your first experience.
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
        items={experiences.map((exp) => exp.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {experiences.map((exp) => (
            <SortableItem key={exp.id} id={exp.id}>
              {editingId === exp.id ? (
                <ExperienceInlineForm
                  resumeId={resumeId}
                  editingId={editingId}
                  existingExperiences={experiences}
                  defaultValues={exp}
                  onClose={onClose}
                />
              ) : (
                <ExperiencePreviewCard
                  experience={exp}
                  onEdit={() => onEdit(exp.id)}
                  onDelete={() => onDelete(exp.id)}
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

// Separate preview card component
function ExperiencePreviewCard({
  experience: exp,
  onEdit,
  onDelete,
  disabled,
}: {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
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

  const formatDateRange = () => {
    const start = formatDate(exp.startDate);
    const end = exp.current ? "Present" : formatDate(exp.endDate || "");
    return `${start} – ${end}`;
  };

  return (
    <Card className={`gap-2 py-2 ${disabled ? "opacity-50" : ""}`}>
      <CardHeader className="px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-xs font-semibold">{exp.position}</h3>
            <p className="text-muted-foreground text-[11px]">{exp.company}</p>
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[10px]">
              <CalendarIcon className="h-2.5 w-2.5" />
              <span>{formatDateRange()}</span>
            </div>
          </div>
          {!disabled && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onEdit}
                aria-label={`Edit ${exp.position} experience`}
              >
                <EditIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onDelete}
                aria-label={`Delete ${exp.position} experience`}
              >
                <TrashIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      {(exp.description || (exp.highlights && exp.highlights.length > 0)) && (
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
  );
}
