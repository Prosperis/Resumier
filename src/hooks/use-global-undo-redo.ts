import { useCallback, useEffect, useRef } from "react";
import { useResumeStore } from "@/stores/resume-store";
import {
  useGlobalUndoStore,
  type GlobalChangeType,
  type GlobalStateSnapshot,
} from "@/stores/global-undo-store";

/**
 * Descriptions for different types of changes.
 */
const CHANGE_DESCRIPTIONS: Record<GlobalChangeType, string> = {
  userInfo: "Edit personal information",
  jobInfo: "Edit job details",
  template: "Change template",
  styleCustomization: "Change styling",
  bulk: "Multiple changes",
};

/**
 * Hook that provides global undo/redo functionality.
 * Automatically tracks changes to the resume store and provides undo/redo actions.
 */
export function useGlobalUndoRedo() {
  // Resume store state
  const template = useResumeStore((state) => state.template);
  const styleCustomization = useResumeStore((state) => state.styleCustomization);
  const userInfo = useResumeStore((state) => state.userInfo);
  const jobInfo = useResumeStore((state) => state.jobInfo);

  // Resume store setters
  const setTemplate = useResumeStore((state) => state.setTemplate);
  const setUserInfo = useResumeStore((state) => state.setUserInfo);
  const setJobInfo = useResumeStore((state) => state.setJobInfo);

  // Global undo store
  const pushEntry = useGlobalUndoStore((state) => state.pushEntry);
  const undoAction = useGlobalUndoStore((state) => state.undo);
  const redoAction = useGlobalUndoStore((state) => state.redo);
  const canUndo = useGlobalUndoStore((state) => state.canUndo());
  const canRedo = useGlobalUndoStore((state) => state.canRedo());
  const pause = useGlobalUndoStore((state) => state.pause);
  const resume = useGlobalUndoStore((state) => state.resume);
  const isPaused = useGlobalUndoStore((state) => state.isPaused);
  const currentIndex = useGlobalUndoStore((state) => state.currentIndex);
  const entries = useGlobalUndoStore((state) => state.entries);
  const getUndoDescription = useGlobalUndoStore((state) => state.getUndoDescription);
  const getRedoDescription = useGlobalUndoStore((state) => state.getRedoDescription);

  // Keep track of previous state for change detection
  const previousStateRef = useRef<GlobalStateSnapshot | null>(null);
  const isInitializedRef = useRef(false);

  // Get current snapshot
  const getCurrentSnapshot = useCallback((): GlobalStateSnapshot => {
    return {
      template,
      styleCustomization: JSON.parse(JSON.stringify(styleCustomization)),
      userInfo: JSON.parse(JSON.stringify(userInfo)),
      jobInfo: JSON.parse(JSON.stringify(jobInfo)),
    };
  }, [template, styleCustomization, userInfo, jobInfo]);

  // Apply a snapshot to the stores
  const applySnapshot = useCallback(
    (snapshot: GlobalStateSnapshot) => {
      pause();
      setTemplate(snapshot.template);
      setUserInfo(snapshot.userInfo);
      setJobInfo(snapshot.jobInfo);
      // StyleCustomization is set via individual actions, but for undo we need direct set
      // We'll handle this through the resume store's internal state
      useResumeStore.setState({
        styleCustomization: snapshot.styleCustomization,
      });
      // Small delay before resuming to allow state to settle
      setTimeout(() => {
        resume();
        previousStateRef.current = snapshot;
      }, 50);
    },
    [pause, resume, setTemplate, setUserInfo, setJobInfo],
  );

  // Detect what type of change occurred
  const detectChangeType = useCallback(
    (
      oldSnapshot: GlobalStateSnapshot,
      newSnapshot: GlobalStateSnapshot,
    ): GlobalChangeType | null => {
      const changes: GlobalChangeType[] = [];

      if (oldSnapshot.template !== newSnapshot.template) {
        changes.push("template");
      }

      if (
        JSON.stringify(oldSnapshot.styleCustomization) !==
        JSON.stringify(newSnapshot.styleCustomization)
      ) {
        changes.push("styleCustomization");
      }

      if (JSON.stringify(oldSnapshot.userInfo) !== JSON.stringify(newSnapshot.userInfo)) {
        changes.push("userInfo");
      }

      if (JSON.stringify(oldSnapshot.jobInfo) !== JSON.stringify(newSnapshot.jobInfo)) {
        changes.push("jobInfo");
      }

      if (changes.length === 0) return null;
      if (changes.length === 1) return changes[0];
      return "bulk";
    },
    [],
  );

  // Generate a description for the change
  const generateDescription = useCallback((changeType: GlobalChangeType): string => {
    return CHANGE_DESCRIPTIONS[changeType] || "Made changes";
  }, []);

  // Track state changes
  useEffect(() => {
    // Skip if paused (during undo/redo)
    if (isPaused) return;

    const currentSnapshot = getCurrentSnapshot();

    // Initialize on first run
    if (!isInitializedRef.current) {
      previousStateRef.current = currentSnapshot;
      isInitializedRef.current = true;
      return;
    }

    // Detect changes
    const previousSnapshot = previousStateRef.current;
    if (!previousSnapshot) {
      previousStateRef.current = currentSnapshot;
      return;
    }

    const changeType = detectChangeType(previousSnapshot, currentSnapshot);
    if (changeType) {
      const description = generateDescription(changeType);
      // Push the PREVIOUS state as the snapshot (so undo restores to it)
      pushEntry(changeType, description, previousSnapshot);
    }

    // Update previous state reference
    previousStateRef.current = currentSnapshot;
  }, [
    template,
    styleCustomization,
    userInfo,
    jobInfo,
    isPaused,
    getCurrentSnapshot,
    detectChangeType,
    generateDescription,
    pushEntry,
  ]);

  // Undo action
  const undo = useCallback(() => {
    const snapshot = undoAction();
    if (snapshot) {
      applySnapshot(snapshot);
      return true;
    }
    return false;
  }, [undoAction, applySnapshot]);

  // Redo action
  const redo = useCallback(() => {
    const snapshot = redoAction();
    if (snapshot) {
      // Apply the snapshot we moved to
      applySnapshot(snapshot);
      return true;
    } else if (canRedo) {
      // We're at index 0, going back to current state
      // Get the entry at index 0 and apply its "after" state
      const currentEntry = entries[0];
      if (currentEntry) {
        // We need to reconstruct the "after" state
        // This is tricky because we only store "before" snapshots
        // For now, just let the current state remain
        resume();
      }
      return true;
    }
    return false;
  }, [redoAction, applySnapshot, canRedo, entries, resume]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    undoDescription: getUndoDescription(),
    redoDescription: getRedoDescription(),
    isPreviewingHistory: currentIndex >= 0,
    currentIndex,
    entriesCount: entries.length,
  };
}

/**
 * Hook that provides only the undo/redo status without tracking changes.
 * Useful for UI components that need to show undo/redo button states.
 */
export function useUndoRedoStatus() {
  const canUndo = useGlobalUndoStore((state) => state.canUndo());
  const canRedo = useGlobalUndoStore((state) => state.canRedo());
  const getUndoDescription = useGlobalUndoStore((state) => state.getUndoDescription);
  const getRedoDescription = useGlobalUndoStore((state) => state.getRedoDescription);
  const currentIndex = useGlobalUndoStore((state) => state.currentIndex);
  const entries = useGlobalUndoStore((state) => state.entries);

  return {
    canUndo,
    canRedo,
    undoDescription: getUndoDescription(),
    redoDescription: getRedoDescription(),
    isPreviewingHistory: currentIndex >= 0,
    entriesCount: entries.length,
  };
}
