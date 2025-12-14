/**
 * Editable Section Wrapper
 * Wraps resume sections to make them interactive with hover/click states
 */

import { forwardRef, type ReactNode, type MouseEvent, useCallback, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useOptionalInteractiveResume, type EditableSectionType } from "./interactive-context";

interface EditableSectionProps {
  children: ReactNode;
  sectionType: EditableSectionType;
  itemId?: string;
  className?: string;
  /** Custom label for the edit button tooltip */
  editLabel?: string;
  /** Whether this section can be deleted (for list items) */
  canDelete?: boolean;
  /** Whether this section can be reordered (for list items) */
  canReorder?: boolean;
  /** Whether to show the add button (for section headers) */
  showAddButton?: boolean;
  /** Callback for add action */
  onAdd?: () => void;
  /** Callback for delete action */
  onDelete?: () => void;
}

/**
 * EditableSection - Makes a resume section interactive
 *
 * When interactive mode is enabled:
 * - Shows hover outline with accent color
 * - Shows edit/delete actions on hover
 * - Clicking selects the section for editing
 * - Drag handle for reorderable items
 *
 * When interactive mode is disabled or context is missing:
 * - Renders children normally without any interactivity
 */
export const EditableSection = forwardRef<HTMLDivElement, EditableSectionProps>(
  function EditableSection(
    {
      children,
      sectionType,
      itemId,
      className,
      editLabel,
      canDelete = false,
      canReorder = false,
      showAddButton = false,
      onAdd,
      onDelete,
    },
    ref,
  ) {
    const context = useOptionalInteractiveResume();

    // If not in interactive context or interactive mode is off, render normally
    if (!context || !context.isInteractive) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      );
    }

    const { selectedSection, hoveredSection, selectSection, hoverSection } = context;

    const isSelected = selectedSection?.type === sectionType && selectedSection?.itemId === itemId;
    const isHovered = hoveredSection?.type === sectionType && hoveredSection?.itemId === itemId;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      selectSection({
        type: sectionType,
        itemId,
        rect,
      });
    };

    const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      hoverSection({
        type: sectionType,
        itemId,
        rect,
      });
    };

    const handleMouseLeave = () => {
      hoverSection(null);
    };

    const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onAdd?.();
    };

    const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDelete?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative group/editable transition-all duration-150 cursor-pointer",
          // Hover state - subtle highlight
          isHovered &&
            !isSelected &&
            "outline outline-2 outline-blue-400/50 outline-offset-2 rounded-sm",
          // Selected state - stronger highlight
          isSelected &&
            "outline outline-2 outline-blue-500 outline-offset-2 rounded-sm bg-blue-50/20",
          className,
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-editable-section={sectionType}
        data-item-id={itemId}
      >
        {/* Invisible hover bridge - extends hover area to include action buttons */}
        <div className="absolute -top-4 -right-4 w-8 h-8 pointer-events-auto" />
        {/* Action buttons - visible on hover */}
        <div
          className={cn(
            "absolute -top-2 -right-2 z-10 flex items-center gap-0.5",
            "opacity-0 group-hover/editable:opacity-100 transition-opacity",
            "pointer-events-auto",
          )}
        >
          {/* Drag handle for reorderable items */}
          {canReorder && (
            <button
              type="button"
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 shadow-sm cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-3 w-3" />
            </button>
          )}

          {/* Edit button */}
          <button
            type="button"
            className="p-1 rounded bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
            title={editLabel || "Edit"}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
              if (rect) {
                selectSection({ type: sectionType, itemId, rect });
              }
            }}
          >
            <Pencil className="h-3 w-3" />
          </button>

          {/* Add button for section headers */}
          {showAddButton && onAdd && (
            <button
              type="button"
              className="p-1 rounded bg-green-500 hover:bg-green-600 text-white shadow-sm"
              title="Add new"
              onClick={handleAddClick}
            >
              <Plus className="h-3 w-3" />
            </button>
          )}

          {/* Delete button for list items */}
          {canDelete && onDelete && (
            <button
              type="button"
              className="p-1 rounded bg-red-500 hover:bg-red-600 text-white shadow-sm"
              title="Delete"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {children}
      </div>
    );
  },
);

/**
 * EditableSectionHeader - A section header that can trigger adding new items
 */
interface EditableSectionHeaderProps {
  children: ReactNode;
  sectionType: EditableSectionType;
  onAdd?: () => void;
  className?: string;
}

export function EditableSectionHeader({
  children,
  sectionType: _sectionType,
  onAdd,
  className,
}: EditableSectionHeaderProps) {
  const context = useOptionalInteractiveResume();

  if (!context || !context.isInteractive) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "relative group/header cursor-pointer",
        "hover:bg-blue-50/30 rounded transition-colors",
        className,
      )}
    >
      {children}

      {/* Add button on hover */}
      {onAdd && (
        <>
          {/* Invisible hover bridge - extends hover area to include add button */}
          <div className="absolute -right-4 top-0 bottom-0 w-6 pointer-events-auto" />
          <button
            type="button"
            className={cn(
              "absolute -right-2 top-1/2 -translate-y-1/2 z-10",
              "p-1 rounded bg-green-500 hover:bg-green-600 text-white shadow-sm",
              "opacity-0 group-hover/header:opacity-100 transition-opacity",
              "pointer-events-auto",
            )}
            title="Add new item"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <Plus className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}

/**
 * SectionWrapper - Wraps an entire section with management controls (hide/show, reorder)
 * This appears on the left side of sections for section-level management
 * Now also supports drag and drop reordering
 */
interface SectionWrapperProps {
  children: ReactNode;
  sectionType: EditableSectionType;
  sectionLabel: string;
  className?: string;
  /** Whether this section is required and cannot be hidden */
  required?: boolean;
  /** Whether drag and drop is enabled (used within SortableSectionColumn) */
  isDraggable?: boolean;
}

export function SectionWrapper({
  children,
  sectionType,
  sectionLabel,
  className,
  required = false,
  isDraggable = false,
}: SectionWrapperProps) {
  const context = useOptionalInteractiveResume();
  const dragState = useDragState();

  // If not in interactive context or interactive mode is off, render normally
  if (!context || !context.isInteractive) {
    return <div className={className}>{children}</div>;
  }

  const { toggleSectionVisibility, moveSectionUp, moveSectionDown, getSectionIndex, sectionOrder } =
    context;

  const currentIndex = getSectionIndex(sectionType);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === sectionOrder.length - 1;

  // Use sortable hook for drag and drop
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sectionType,
    disabled: !isDraggable,
  });

  // Determine if we should show a drop indicator based on drag state from context
  // Use the column-specific sectionIds for calculating positions
  const columnSectionIds = dragState.sectionIds;
  const isBeingDraggedOver = dragState.overId === sectionType && dragState.activeId !== sectionType;
  const activeIndex = dragState.activeId ? columnSectionIds.indexOf(dragState.activeId) : -1;
  const thisIndex = columnSectionIds.indexOf(sectionType);

  // Show drop indicator above if dragging from below
  const showDropIndicatorAbove = isBeingDraggedOver && activeIndex > thisIndex;
  // Show drop indicator below if dragging from above
  const showDropIndicatorBelow = isBeingDraggedOver && activeIndex < thisIndex;

  const style = isDraggable
    ? {
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 200ms ease",
      }
    : undefined;

  return (
    <div
      ref={isDraggable ? setNodeRef : undefined}
      style={style}
      className={cn("relative group/section", isDragging && "opacity-50 z-50", className)}
    >
      {/* Drop indicator above */}
      {showDropIndicatorAbove && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-blue-500 rounded-full z-40 shadow-lg shadow-blue-500/50" />
      )}

      {/* Invisible hover bridge - extends hover area to include the controls */}
      <div className="absolute -left-12 top-0 bottom-0 w-12 pointer-events-auto" />
      {/* Section management controls - appear on the left on hover */}
      <div
        className={cn(
          "absolute -left-10 top-0 bottom-0 flex flex-col items-center justify-start pt-1 gap-0.5",
          "opacity-0 group-hover/section:opacity-100 transition-opacity",
          "pointer-events-auto",
          isDragging && "opacity-100",
        )}
      >
        {/* Drag handle */}
        {isDraggable && (
          <button
            type="button"
            className={cn(
              "p-1 rounded bg-blue-500 hover:bg-blue-600 text-white shadow-sm cursor-grab active:cursor-grabbing mb-1",
              isDragging && "cursor-grabbing",
            )}
            title={`Drag to reorder ${sectionLabel}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3" />
          </button>
        )}

        {/* Move up */}
        <button
          type="button"
          className={cn(
            "p-1 rounded bg-slate-600 hover:bg-slate-700 text-white shadow-sm",
            isFirst && "opacity-30 cursor-not-allowed",
          )}
          title={`Move ${sectionLabel} up`}
          disabled={isFirst}
          onClick={(e) => {
            e.stopPropagation();
            moveSectionUp(sectionType);
          }}
        >
          <ChevronUp className="h-3 w-3" />
        </button>

        {/* Move down */}
        <button
          type="button"
          className={cn(
            "p-1 rounded bg-slate-600 hover:bg-slate-700 text-white shadow-sm",
            isLast && "opacity-30 cursor-not-allowed",
          )}
          title={`Move ${sectionLabel} down`}
          disabled={isLast}
          onClick={(e) => {
            e.stopPropagation();
            moveSectionDown(sectionType);
          }}
        >
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Hide/Show toggle */}
        {!required && (
          <button
            type="button"
            className="p-1 rounded bg-amber-500 hover:bg-amber-600 text-white shadow-sm mt-1"
            title={`Hide ${sectionLabel}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility(sectionType);
            }}
          >
            <EyeOff className="h-3 w-3" />
          </button>
        )}
      </div>

      {children}

      {/* Drop indicator below */}
      {showDropIndicatorBelow && (
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full z-40 shadow-lg shadow-blue-500/50" />
      )}
    </div>
  );
}

/**
 * HiddenSectionPlaceholder - Shows a placeholder for hidden sections that can be restored
 */
interface HiddenSectionPlaceholderProps {
  sectionType: EditableSectionType;
  sectionLabel: string;
}

export function HiddenSectionPlaceholder({
  sectionType,
  sectionLabel,
}: HiddenSectionPlaceholderProps) {
  const context = useOptionalInteractiveResume();

  // Only show in interactive mode
  if (!context || !context.isInteractive) {
    return null;
  }

  const { toggleSectionVisibility, isSectionVisible } = context;

  // Only show if section is hidden
  if (isSectionVisible(sectionType)) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative group/hidden flex items-center justify-center",
        "py-2 px-4 my-2 mx-0",
        "border-2 border-dashed border-slate-300 rounded-md",
        "bg-slate-50/50 hover:bg-slate-100/50 transition-colors cursor-pointer",
      )}
      onClick={() => toggleSectionVisibility(sectionType)}
    >
      <div className="flex items-center gap-2 text-slate-500">
        <EyeOff className="h-4 w-4" />
        <span className="text-sm font-medium">{sectionLabel}</span>
        <span className="text-xs">(hidden)</span>
      </div>

      {/* Show button on hover */}
      <button
        type="button"
        className={cn(
          "absolute right-2 p-1.5 rounded",
          "bg-green-500 hover:bg-green-600 text-white shadow-sm",
          "opacity-0 group-hover/hidden:opacity-100 transition-opacity",
        )}
        title={`Show ${sectionLabel}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleSectionVisibility(sectionType);
        }}
      >
        <Eye className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/**
 * EditableText - Inline editable text element
 * For simple text that can be edited directly on the document
 */
interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  multiline?: boolean;
}

export function EditableText({
  value,
  onChange,
  placeholder = "Click to edit...",
  className,
  as: Component = "span",
  multiline = false,
}: EditableTextProps) {
  const context = useOptionalInteractiveResume();

  // Non-interactive mode - just render the text
  if (!context || !context.isInteractive) {
    return <Component className={className}>{value || placeholder}</Component>;
  }

  // Interactive mode - contenteditable
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.textContent || "";
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      e.currentTarget.textContent = value;
      e.currentTarget.blur();
    }
  };

  return (
    <Component
      className={cn(
        className,
        "outline-none",
        "hover:bg-blue-50/50 focus:bg-blue-50/80 rounded px-0.5 -mx-0.5",
        "transition-colors cursor-text",
        !value && "text-slate-400 italic",
      )}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
    >
      {value || placeholder}
    </Component>
  );
}

/**
 * SortableSectionColumn - Wrapper component that provides drag and drop context
 * for a column of sections (main content or sidebar)
 */
interface SortableSectionColumnProps {
  children: ReactNode;
  sectionIds: EditableSectionType[];
  className?: string;
}

// Context for sharing drag state with child components
import { createContext, useContext } from "react";

interface DragStateContextValue {
  activeId: EditableSectionType | null;
  overId: EditableSectionType | null;
  sectionIds: EditableSectionType[];
}

const DragStateContext = createContext<DragStateContextValue>({
  activeId: null,
  overId: null,
  sectionIds: [],
});

export function useDragState() {
  return useContext(DragStateContext);
}

export function SortableSectionColumn({
  children,
  sectionIds,
  className,
}: SortableSectionColumnProps) {
  const context = useOptionalInteractiveResume();
  const [activeId, setActiveId] = useState<EditableSectionType | null>(null);
  const [overId, setOverId] = useState<EditableSectionType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before starting drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as EditableSectionType);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over?.id as EditableSectionType | null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setOverId(null);

      if (!over || active.id === over.id || !context) {
        return;
      }

      const oldIndex = sectionIds.indexOf(active.id as EditableSectionType);
      const newIndex = sectionIds.indexOf(over.id as EditableSectionType);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      // Create new local order for this column
      const newColumnOrder = arrayMove(sectionIds, oldIndex, newIndex);

      // Update the full section order by replacing the sections in this column
      // Simple approach: just update the sections within this column at their current positions
      const newOrder = [...context.sectionOrder];
      const columnPositions = sectionIds.map((s) => newOrder.indexOf(s)).sort((a, b) => a - b);

      newColumnOrder.forEach((sectionType, idx) => {
        newOrder[columnPositions[idx]] = sectionType;
      });

      context.reorderSections(newOrder);
    },
    [context, sectionIds],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
  }, []);

  // If not in interactive context, just render children normally
  if (!context || !context.isInteractive) {
    return <div className={className}>{children}</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
        <DragStateContext.Provider value={{ activeId, overId, sectionIds }}>
          <div className={className}>{children}</div>
        </DragStateContext.Provider>
      </SortableContext>
    </DndContext>
  );
}
