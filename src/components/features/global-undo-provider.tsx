import { useEffect } from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useGlobalUndoRedo } from "@/hooks/use-global-undo-redo";

interface GlobalUndoProviderProps {
  children: React.ReactNode;
  /** Whether to enable keyboard shortcuts. Defaults to true. */
  enableKeyboardShortcuts?: boolean;
  /** Whether to show toast notifications. Defaults to true. */
  showToasts?: boolean;
}

/**
 * Provider component that enables global undo/redo functionality.
 * Wraps the application to track state changes and handle keyboard shortcuts.
 *
 * Place this component high in the component tree (e.g., in __root.tsx or providers.tsx).
 *
 * @example
 * ```tsx
 * <GlobalUndoProvider>
 *   <App />
 * </GlobalUndoProvider>
 * ```
 */
export function GlobalUndoProvider({
  children,
  enableKeyboardShortcuts = true,
  showToasts = true,
}: GlobalUndoProviderProps) {
  // Initialize the global undo/redo tracking
  // This hook automatically subscribes to store changes and tracks history
  useGlobalUndoRedo();

  // Set up keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z, etc.)
  useKeyboardShortcuts({
    enabled: enableKeyboardShortcuts,
    showToasts,
  });

  // Clean up history when component unmounts (optional, for SPA navigation)
  useEffect(() => {
    return () => {
      // Could clear history here if needed on unmount
      // For now, we keep history persistent across navigation
    };
  }, []);

  return <>{children}</>;
}

