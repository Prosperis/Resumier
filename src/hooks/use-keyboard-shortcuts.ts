import { useCallback, useEffect } from "react";
import { useGlobalUndoRedo } from "./use-global-undo-redo";
import { useUIStore } from "@/stores/ui-store";

interface KeyboardShortcutsOptions {
  /** Whether to enable keyboard shortcuts. Defaults to true. */
  enabled?: boolean;
  /** Whether to show toast notifications on undo/redo. Defaults to true. */
  showToasts?: boolean;
  /** Whether to allow shortcuts when in input fields. Defaults to false. */
  allowInInputs?: boolean;
}

/**
 * Hook that provides global keyboard shortcuts for the application.
 * Handles Ctrl+Z (undo), Ctrl+Shift+Z/Ctrl+Y (redo), and more.
 */
export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const {
    enabled = true,
    showToasts = true,
    allowInInputs = false,
  } = options;

  const { undo, redo, canUndo, canRedo, undoDescription, redoDescription } =
    useGlobalUndoRedo();
  const addNotification = useUIStore((state) => state.addNotification);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Check if user is in an input field
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox";

      // Skip if in input field (unless allowInInputs is true)
      // But still allow Ctrl+Z/Y for text inputs as they have their own undo
      if (isInputField && !allowInInputs) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + Z = Undo (without Shift)
      if (modKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        if (canUndo) {
          e.preventDefault();
          e.stopPropagation();
          const success = undo();
          if (success && showToasts) {
            addNotification({
              type: "info",
              title: "Undo",
              message: undoDescription || "Undid last change",
              duration: 2000,
            });
          }
        }
        return;
      }

      // Ctrl/Cmd + Shift + Z = Redo
      if (modKey && e.key.toLowerCase() === "z" && e.shiftKey) {
        if (canRedo) {
          e.preventDefault();
          e.stopPropagation();
          const success = redo();
          if (success && showToasts) {
            addNotification({
              type: "info",
              title: "Redo",
              message: redoDescription || "Redid last change",
              duration: 2000,
            });
          }
        }
        return;
      }

      // Ctrl/Cmd + Y = Redo (Windows alternative)
      if (modKey && e.key.toLowerCase() === "y") {
        if (canRedo) {
          e.preventDefault();
          e.stopPropagation();
          const success = redo();
          if (success && showToasts) {
            addNotification({
              type: "info",
              title: "Redo",
              message: redoDescription || "Redid last change",
              duration: 2000,
            });
          }
        }
        return;
      }

      // Ctrl/Cmd + S = Save (prevent browser save dialog)
      if (modKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // Auto-save is already handled, just prevent the browser dialog
        if (showToasts) {
          addNotification({
            type: "success",
            title: "Saved",
            message: "Changes are automatically saved",
            duration: 2000,
          });
        }
        return;
      }
    },
    [
      enabled,
      allowInInputs,
      canUndo,
      canRedo,
      undo,
      redo,
      undoDescription,
      redoDescription,
      showToasts,
      addNotification,
    ]
  );

  useEffect(() => {
    if (!enabled) return;

    // Use capture phase to handle events before they reach input fields
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [enabled, handleKeyDown]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

/**
 * Lightweight hook for components that only need undo/redo actions without keyboard handling.
 * This is useful for toolbar buttons.
 */
export function useUndoRedoActions() {
  const { undo, redo, canUndo, canRedo, undoDescription, redoDescription } =
    useGlobalUndoRedo();

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    undoDescription,
    redoDescription,
  };
}

