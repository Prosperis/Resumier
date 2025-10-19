import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface DragHandleProps {
  className?: string
  isDragging?: boolean
}

export function DragHandle({ className, isDragging = false }: DragHandleProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn(
        "flex items-center justify-center cursor-grab active:cursor-grabbing",
        "text-muted-foreground hover:text-foreground transition-colors",
        "touch-none select-none p-1",
        isDragging && "cursor-grabbing text-primary",
        className,
      )}
      aria-label="Drag to reorder"
    >
      <GripVertical className="h-5 w-5" />
    </button>
  )
}
