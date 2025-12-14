import { useCallback, useRef } from "react";
import { useResumeStore, type UserInfo } from "@/stores/resume-store";
import { useHistoryStore, getFieldLabel, type HistoryChange } from "@/stores/history-store";

/**
 * Hook that provides resume update functions with automatic history tracking.
 * Wraps the resume store's update functions to record changes.
 */
export function useResumeHistory() {
  const userInfo = useResumeStore((state) => state.userInfo);
  const updateUserInfo = useResumeStore((state) => state.updateUserInfo);
  const setUserInfo = useResumeStore((state) => state.setUserInfo);

  const pushEntry = useHistoryStore((state) => state.pushEntry);
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const currentIndex = useHistoryStore((state) => state.currentIndex);
  const entries = useHistoryStore((state) => state.entries);
  const branchOff = useHistoryStore((state) => state.branchOff);

  // Keep ref to previous state for comparison
  const previousStateRef = useRef<UserInfo>(userInfo);

  // Detect changes between two states
  const detectChanges = useCallback(
    (oldState: UserInfo, newState: UserInfo, _section: string = "personal"): HistoryChange[] => {
      const changes: HistoryChange[] = [];

      // Compare top-level fields
      const simpleFields = ["name", "email", "phone", "address", "customUrl"];
      for (const field of simpleFields) {
        const oldVal = oldState[field];
        const newVal = newState[field];
        if (oldVal !== newVal) {
          changes.push({
            field,
            label: getFieldLabel(field, "personal"),
            oldValue: oldVal,
            newValue: newVal,
            section: "personal",
          });
        }
      }

      // Compare arrays (experiences, education, skills, etc.)
      const arrayFields = [
        { key: "experiences", section: "experience" },
        { key: "education", section: "education" },
        { key: "skills", section: "skills" },
        { key: "certifications", section: "certifications" },
        { key: "links", section: "links" },
      ];

      for (const { key, section: arraySection } of arrayFields) {
        const oldArr = (oldState[key] as unknown[]) || [];
        const newArr = (newState[key] as unknown[]) || [];

        if (JSON.stringify(oldArr) !== JSON.stringify(newArr)) {
          // Determine what kind of change
          if (newArr.length > oldArr.length) {
            changes.push({
              field: key,
              label: `Added ${arraySection}`,
              oldValue: oldArr.length,
              newValue: newArr.length,
              section: arraySection,
            });
          } else if (newArr.length < oldArr.length) {
            changes.push({
              field: key,
              label: `Removed ${arraySection}`,
              oldValue: oldArr.length,
              newValue: newArr.length,
              section: arraySection,
            });
          } else {
            changes.push({
              field: key,
              label: `Updated ${arraySection}`,
              oldValue: oldArr,
              newValue: newArr,
              section: arraySection,
            });
          }
        }
      }

      return changes;
    },
    [],
  );

  // Update with history tracking
  const updateWithHistory = useCallback(
    (updates: Partial<UserInfo>, description?: string) => {
      const previousState = { ...previousStateRef.current };

      // If we're in the middle of history, branch off first
      if (currentIndex >= 0) {
        branchOff();
      }

      // Apply the update
      updateUserInfo(updates);

      // Create the new state for comparison
      const newState = { ...previousState, ...updates };

      // Detect changes
      const changes = detectChanges(previousState, newState);

      // Only push to history if there are actual changes
      if (changes.length > 0) {
        pushEntry({
          changes,
          snapshot: previousState, // Save the state BEFORE the change
          description: description || "",
        });
      }

      // Update ref
      previousStateRef.current = newState;
    },
    [updateUserInfo, pushEntry, detectChanges, currentIndex, branchOff],
  );

  // Undo action - restores previous state
  const undoChange = useCallback(() => {
    const entry = undo();
    if (entry) {
      // Restore the snapshot (state before this change was made)
      setUserInfo(entry.snapshot);
      previousStateRef.current = entry.snapshot;
    }
  }, [undo, setUserInfo]);

  // Redo action
  const redoChange = useCallback(() => {
    const currentIdx = currentIndex;

    if (currentIdx <= 0) {
      // Going back to latest state
      redo();
      // Get the state after this entry's changes
      if (currentIdx === 0 && entries.length > 0) {
        // Apply the first entry's new values
        const entryToApply = entries[0];
        const restoredState = { ...entryToApply.snapshot };

        // Apply the changes from this entry
        for (const change of entryToApply.changes) {
          if (change.section === "personal" && typeof change.newValue !== "object") {
            (restoredState as Record<string, unknown>)[change.field] = change.newValue;
          }
        }

        setUserInfo(restoredState);
        previousStateRef.current = restoredState;
      }
    } else {
      const result = redo();
      if (result) {
        // Restore to the state at this point
        setUserInfo(result.snapshot);
        previousStateRef.current = result.snapshot;
      }
    }
  }, [redo, setUserInfo, currentIndex, entries]);

  // Sync ref when userInfo changes externally
  const syncState = useCallback(() => {
    previousStateRef.current = userInfo;
  }, [userInfo]);

  return {
    updateWithHistory,
    undoChange,
    redoChange,
    syncState,
  };
}
