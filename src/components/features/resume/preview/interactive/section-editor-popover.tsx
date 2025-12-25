/**
 * Section Editing Popover
 * Floating editor that appears when a section is selected
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInteractiveResume, type EditableSectionType } from "./interactive-context";

interface SectionEditorPopoverProps {
  children: ReactNode;
  title: string;
  /** Optional subtitle for context (e.g., "Experience 1 of 3") */
  subtitle?: string;
  /** Whether to show navigation arrows for list items */
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  /** Called when the popover should close */
  onClose?: () => void;
  /** Called when changes are saved */
  onSave?: () => void;
}

export function SectionEditorPopover({
  children,
  title,
  subtitle,
  showNavigation = false,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  onClose,
  onSave,
}: SectionEditorPopoverProps) {
  const { selectedSection, clearSelection } = useInteractiveResume();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on selected section
  useEffect(() => {
    if (!selectedSection?.rect) return;

    const rect = selectedSection.rect;
    const popoverWidth = 320;
    const popoverHeight = 400;
    const padding = 16;

    // Default: position to the right of the element
    let left = rect.right + padding;
    let top = rect.top;

    // If not enough space on the right, position on the left
    if (left + popoverWidth > window.innerWidth - padding) {
      left = rect.left - popoverWidth - padding;
    }

    // If still not enough space, position at the right edge of the viewport
    if (left < padding) {
      left = padding;
    }

    // Ensure it's not below the viewport
    if (top + popoverHeight > window.innerHeight - padding) {
      top = window.innerHeight - popoverHeight - padding;
    }

    // Ensure it's not above the viewport
    if (top < padding) {
      top = padding;
    }

    setPosition({ top, left });
  }, [selectedSection]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        // Don't close if clicking on an editable section
        const target = e.target as HTMLElement;
        if (target.closest("[data-editable-section]")) {
          return;
        }
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup: ensure popover closes on unmount to prevent portal cleanup errors
  useEffect(() => {
    return () => {
      // Close the popover when component unmounts to prevent React portal cleanup errors
      if (selectedSection) {
        try {
          clearSelection();
        } catch (error) {
          // Silently ignore cleanup errors during unmount
          console.warn("Error during popover cleanup:", error);
        }
      }
    };
  }, [selectedSection, clearSelection]);

  const handleClose = () => {
    onClose?.();
    clearSelection();
  };

  const handleSave = () => {
    onSave?.();
    handleClose();
  };

  if (!selectedSection) return null;

  // Use a stable portal container to avoid cleanup issues
  const portalContainer = typeof document !== "undefined" ? document.body : null;
  if (!portalContainer) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={cn(
        "fixed z-50 w-80 max-h-[80vh]",
        "bg-white dark:bg-slate-900 rounded-lg shadow-xl",
        "border border-slate-200 dark:border-slate-700",
        "flex flex-col overflow-hidden",
        "animate-in fade-in-0 slide-in-from-left-2 duration-200",
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          {showNavigation && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={onPrevious}
                disabled={!hasPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={onNext}
                disabled={!hasNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <Button variant="outline" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Check className="h-4 w-4 mr-1" />
          Done
        </Button>
      </div>
    </div>,
    portalContainer,
  );
}

/**
 * Hook to manage popover state for a specific section type
 */
export function useSectionEditor(sectionType: EditableSectionType) {
  const { selectedSection, selectSection, clearSelection, resume } = useInteractiveResume();

  const isOpen = selectedSection?.type === sectionType;
  const selectedItemId = isOpen ? selectedSection?.itemId : undefined;

  const open = (itemId?: string) => {
    selectSection({ type: sectionType, itemId });
  };

  const close = () => {
    if (isOpen) {
      clearSelection();
    }
  };

  return {
    isOpen,
    selectedItemId,
    open,
    close,
    resume,
  };
}
