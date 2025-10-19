import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { DragHandle } from "./drag-handle"

interface SortableItemProps {
  id: string
  children: React.ReactNode
  className?: string
  showHandle?: boolean
}

export function SortableItem({ id, children, className, showHandle = true }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative", isDragging && "opacity-50 z-50", className)}
    >
      <div className="flex items-start gap-2">
        {showHandle && (
          <div {...attributes} {...listeners} className="pt-2">
            <DragHandle isDragging={isDragging} />
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
