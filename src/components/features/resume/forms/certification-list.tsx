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
  CalendarIcon,
  EditIcon,
  ExternalLinkIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Certification } from "@/lib/api/types";
import { SortableItem } from "../dnd/sortable-item";

interface CertificationListProps {
  certifications: Certification[];
  onEdit: (certification: Certification) => void;
  onDelete: (id: string) => void;
  onReorder?: (certifications: Certification[]) => void;
}

export function CertificationList({
  certifications,
  onEdit,
  onDelete,
  onReorder,
}: CertificationListProps) {
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

    const oldIndex = certifications.findIndex((cert) => cert.id === active.id);
    const newIndex = certifications.findIndex((cert) => cert.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
      const result = Array.from(certifications);
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      onReorder(result);
    }
  };

  if (certifications.length === 0) {
    return (
      <Card className="border-dashed gap-3 py-3">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center px-3">
          <p className="text-muted-foreground text-xs">
            No certifications added yet.
          </p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            Click "Add Certification" to get started.
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={certifications.map((cert) => cert.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {certifications.map((cert) => (
            <SortableItem key={cert.id} id={cert.id}>
              <Card className="gap-2 py-2">
                <CardHeader className="px-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-semibold">{cert.name}</h3>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                            aria-label={`View ${cert.name} credential`}
                          >
                            <ExternalLinkIcon className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        {cert.issuer}
                      </p>
                      <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[10px]">
                        <CalendarIcon className="h-2.5 w-2.5" />
                        <span>Issued {formatDate(cert.date)}</span>
                        {cert.expiryDate && (
                          <span> · Expires {formatDate(cert.expiryDate)}</span>
                        )}
                      </div>
                      {cert.credentialId && (
                        <p className="text-muted-foreground mt-0.5 text-[10px]">
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onEdit(cert)}
                        aria-label={`Edit ${cert.name} certification`}
                      >
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDelete(cert.id)}
                        aria-label={`Delete ${cert.name} certification`}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
