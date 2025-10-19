import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CalendarIcon, EditIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Experience } from "@/lib/api/types"
import { SortableItem } from "../dnd/sortable-item"

interface ExperienceListProps {
  experiences: Experience[]
  onEdit: (experience: Experience) => void
  onDelete: (id: string) => void
  onReorder?: (experiences: Experience[]) => void
}

export function ExperienceList({ experiences, onEdit, onDelete, onReorder }: ExperienceListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = experiences.findIndex((exp) => exp.id === active.id)
    const newIndex = experiences.findIndex((exp) => exp.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
      const result = Array.from(experiences)
      const [removed] = result.splice(oldIndex, 1)
      result.splice(newIndex, 0, removed)
      onReorder(result)
    }
  }

  if (experiences.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No experience added yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click "Add Experience" to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (date: string) => {
    if (!date) return ""
    const [year, month] = date.split("-")
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
    ]
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`
  }

  const formatDateRange = (exp: Experience) => {
    const start = formatDate(exp.startDate)
    const end = exp.current ? "Present" : formatDate(exp.endDate || "")
    return `${start} – ${end}`
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={experiences.map((exp) => exp.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {experiences.map((exp) => (
            <SortableItem key={exp.id} id={exp.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{formatDateRange(exp)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(exp)}
                        aria-label={`Edit ${exp.position} experience`}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(exp.id)}
                        aria-label={`Delete ${exp.position} experience`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {(exp.description || (exp.highlights && exp.highlights.length > 0)) && (
                  <CardContent>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm">
                        {exp.highlights.map((highlight, index) => (
                          <li key={index} className="flex gap-2">
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
  )
}
