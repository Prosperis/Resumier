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
import type { Education } from "@/lib/api/types";
import type { CreateEducationFormData } from "@/lib/validations/education";
import { SortableItem } from "../dnd/sortable-item";
import { EducationInlineForm } from "./education-inline-form";

interface EducationListProps {
  education: Education[];
  editingId: string | null;
  isAddingNew: boolean;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (data: CreateEducationFormData) => void;
  onDelete: (id: string) => void;
  onReorder?: (education: Education[]) => void;
}

export function EducationList({
  education,
  editingId,
  isAddingNew,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onReorder,
}: EducationListProps) {
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

    const oldIndex = education.findIndex((edu) => edu.id === active.id);
    const newIndex = education.findIndex((edu) => edu.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
      const result = Array.from(education);
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      onReorder(result);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const formatDateRange = (edu: Education) => {
    const start = formatDate(edu.startDate);
    const end = edu.current ? "Present" : formatDate(edu.endDate);
    return `${start} – ${end}`;
  };

  if (isAddingNew) {
    return (
      <div className="space-y-2">
        <EducationInlineForm onSubmit={onSave} onCancel={onCancelEdit} isNew />
        {education.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={education.map((edu) => edu.id)} strategy={verticalListSortingStrategy}>
              {education.map((edu) => (
                <SortableItem key={edu.id} id={edu.id}>
                  <EducationPreviewCard education={edu} onEdit={() => {}} onDelete={() => {}} disabled />
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    );
  }

  if (education.length === 0) {
    return (
      <Card className="border-dashed gap-3 py-3">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center px-3">
          <p className="text-muted-foreground text-xs">No education added yet.</p>
          <p className="text-muted-foreground mt-1 text-[10px]">Click the + button to add your education.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={education.map((edu) => edu.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {education.map((edu) => (
            <SortableItem key={edu.id} id={edu.id}>
              {editingId === edu.id ? (
                <EducationInlineForm defaultValues={edu} onSubmit={onSave} onCancel={onCancelEdit} />
              ) : (
                <EducationPreviewCard
                  education={edu}
                  onEdit={() => onEdit(edu.id)}
                  onDelete={() => onDelete(edu.id)}
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

function EducationPreviewCard({
  education: edu,
  onEdit,
  onDelete,
  disabled,
}: {
  education: Education;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const formatDateRange = () => {
    const start = formatDate(edu.startDate);
    const end = edu.current ? "Present" : formatDate(edu.endDate);
    return `${start} – ${end}`;
  };

  return (
    <Card className={`gap-2 py-2 ${disabled ? "opacity-50" : ""}`}>
      <CardHeader className="px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-xs font-semibold">{edu.degree}</h3>
            <p className="text-[11px] font-medium">{edu.institution}</p>
            <p className="text-muted-foreground text-[11px]">{edu.field}</p>
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[10px]">
              <CalendarIcon className="h-2.5 w-2.5" />
              <span>{formatDateRange()}</span>
            </div>
          </div>
          {!disabled && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
                <EditIcon className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}>
                <TrashIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      {((edu.gpa && edu.gpa.trim() !== "") || (edu.honors && edu.honors.length > 0)) && (
        <CardContent className="px-3">
          {edu.gpa && edu.gpa.trim() !== "" && (
            <p className="text-[11px]">
              <span className="font-medium">GPA:</span> {edu.gpa}
            </p>
          )}
          {edu.honors && edu.honors.length > 0 && (
            <div className="mt-1">
              <p className="text-[11px] font-medium">Honors & Awards:</p>
              <ul className="mt-0.5 space-y-0.5 text-[11px]">
                {edu.honors.map((honor, index) => (
                  <li key={index} className="flex gap-1.5">
                    <span className="text-muted-foreground">•</span>
                    <span>{honor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
