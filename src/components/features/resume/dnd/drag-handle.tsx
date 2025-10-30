import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  className?: string;
  isDragging?: boolean;
}

export function DragHandle({ className, isDragging = false }: DragHandleProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn(
        "flex cursor-grab items-center justify-center active:cursor-grabbing",
        "text-muted-foreground hover:text-foreground transition-colors",
        "touch-none p-1 select-none",
        isDragging && "text-primary cursor-grabbing",
        className,
      )}
      aria-label="Drag to reorder"
    >
      <GripVertical className="h-5 w-5" />
    </button>
  );
}
