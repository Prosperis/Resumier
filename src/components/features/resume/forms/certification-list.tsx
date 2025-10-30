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
import { CalendarIcon, EditIcon, ExternalLinkIcon, TrashIcon } from "lucide-react";
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
    })
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
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">No certifications added yet.</p>
          <p className="text-muted-foreground mt-1 text-xs">
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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={certifications.map((cert) => cert.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {certifications.map((cert) => (
            <SortableItem key={cert.id} id={cert.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{cert.name}</h3>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                            aria-label={`View ${cert.name} credential`}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{cert.issuer}</p>
                      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Issued {formatDate(cert.date)}</span>
                        {cert.expiryDate && <span> · Expires {formatDate(cert.expiryDate)}</span>}
                      </div>
                      {cert.credentialId && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(cert)}
                        aria-label={`Edit ${cert.name} certification`}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(cert.id)}
                        aria-label={`Delete ${cert.name} certification`}
                      >
                        <TrashIcon className="h-4 w-4" />
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
