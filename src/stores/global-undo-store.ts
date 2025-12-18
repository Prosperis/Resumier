import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { TemplateType } from "@/lib/types/templates";
import type { JobInfo, StyleCustomization, UserInfo } from "./resume-store";

/**
 * Global state snapshot for undo/redo operations.
 * Captures all user-editable state across the application.
 */
export interface GlobalStateSnapshot {
  // Resume Store State
  template: TemplateType;
  styleCustomization: StyleCustomization;
  userInfo: UserInfo;
  jobInfo: JobInfo;
}

/**
 * Types of changes that can be tracked globally.
 */
export type GlobalChangeType = "userInfo" | "jobInfo" | "template" | "styleCustomization" | "bulk";

/**
 * Represents a single entry in the global undo history.
 */
export interface GlobalHistoryEntry {
  id: string;
  timestamp: number;
  /** Description of what changed */
  description: string;
  /** Type of change for categorization/filtering */
  changeType: GlobalChangeType;
  /** Full state snapshot before this change */
  snapshot: GlobalStateSnapshot;
}

interface GlobalUndoStore {
  // History stack (newest first)
  entries: GlobalHistoryEntry[];
  // Current position in history (-1 = at latest/current state)
  currentIndex: number;
  // Max history size
  maxEntries: number;
  // Whether currently in preview mode (viewing historical state)
  isPreviewingHistory: boolean;
  // Reference to the "future" state when in history (for redo)
  futureSnapshots: GlobalStateSnapshot[];
  // Debounce tracking
  lastChangeType: GlobalChangeType | null;
  lastChangeTime: number;
  // Pause tracking temporarily (e.g., during undo/redo operations)
  isPaused: boolean;

  // Actions
  pushEntry: (
    changeType: GlobalChangeType,
    description: string,
    snapshot: GlobalStateSnapshot,
  ) => void;
  undo: () => GlobalStateSnapshot | null;
  redo: () => GlobalStateSnapshot | null;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Management
  clearHistory: () => void;
  pause: () => void;
  resume: () => void;

  // Getters
  getUndoDescription: () => string | null;
  getRedoDescription: () => string | null;
}

// Generate unique ID
const generateId = () => `global-history-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Debounce time for grouping related changes (ms)
const DEBOUNCE_TIME = 500;

export const useGlobalUndoStore = create<GlobalUndoStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      entries: [],
      currentIndex: -1,
      maxEntries: 100,
      isPreviewingHistory: false,
      futureSnapshots: [],
      lastChangeType: null,
      lastChangeTime: 0,
      isPaused: false,

      pushEntry: (changeType, description, snapshot) => {
        const state = get();

        // Don't track if paused (during undo/redo operations)
        if (state.isPaused) return;

        const now = Date.now();

        // Check if we should merge with the last entry (debouncing)
        // Only debounce same-type changes within DEBOUNCE_TIME
        if (
          state.lastChangeType === changeType &&
          now - state.lastChangeTime < DEBOUNCE_TIME &&
          state.entries.length > 0 &&
          state.currentIndex === -1
        ) {
          // Update the last entry's snapshot to the previous-previous state
          // This way rapid changes are grouped together
          set({
            lastChangeTime: now,
          });
          return;
        }

        // If we're in the middle of history, truncate future entries
        if (state.currentIndex >= 0) {
          const entriesToKeep = state.entries.slice(state.currentIndex);
          set({
            entries: entriesToKeep,
            currentIndex: -1,
            isPreviewingHistory: false,
            futureSnapshots: [],
          });
        }

        const newEntry: GlobalHistoryEntry = {
          id: generateId(),
          timestamp: now,
          description,
          changeType,
          snapshot,
        };

        set((state) => {
          const newEntries = [newEntry, ...state.entries];
          // Trim to max size
          if (newEntries.length > state.maxEntries) {
            newEntries.pop();
          }
          return {
            entries: newEntries,
            currentIndex: -1,
            isPreviewingHistory: false,
            futureSnapshots: [],
            lastChangeType: changeType,
            lastChangeTime: now,
          };
        });
      },

      undo: () => {
        const state = get();
        if (!state.canUndo()) return null;

        const newIndex = state.currentIndex === -1 ? 0 : state.currentIndex + 1;
        const entry = state.entries[newIndex];

        if (entry) {
          set({
            currentIndex: newIndex,
            isPreviewingHistory: true,
          });
          return entry.snapshot;
        }
        return null;
      },

      redo: () => {
        const state = get();
        if (!state.canRedo()) return null;

        const newIndex = state.currentIndex - 1;

        if (newIndex < 0) {
          // Going back to current/latest state
          set({
            currentIndex: -1,
            isPreviewingHistory: false,
          });
          // Return null to indicate "back to current"
          // The caller should restore from the latest entry's "after" state
          return null;
        }

        const entry = state.entries[newIndex];
        if (entry) {
          set({
            currentIndex: newIndex,
            isPreviewingHistory: true,
          });
          return entry.snapshot;
        }
        return null;
      },

      canUndo: () => {
        const state = get();
        const maxIndex = state.entries.length - 1;
        const currentPos = state.currentIndex === -1 ? -1 : state.currentIndex;
        return currentPos < maxIndex;
      },

      canRedo: () => {
        const state = get();
        return state.currentIndex >= 0;
      },

      clearHistory: () => {
        set({
          entries: [],
          currentIndex: -1,
          isPreviewingHistory: false,
          futureSnapshots: [],
          lastChangeType: null,
          lastChangeTime: 0,
        });
      },

      pause: () => {
        set({ isPaused: true });
      },

      resume: () => {
        set({ isPaused: false });
      },

      getUndoDescription: () => {
        const state = get();
        const index = state.currentIndex === -1 ? 0 : state.currentIndex + 1;
        const entry = state.entries[index];
        return entry?.description ?? null;
      },

      getRedoDescription: () => {
        const state = get();
        if (state.currentIndex < 0) return null;
        const index = state.currentIndex;
        if (index === 0) {
          return "Return to current state";
        }
        const entry = state.entries[index - 1];
        return entry?.description ?? null;
      },
    })),
    { name: "GlobalUndoStore" },
  ),
);

// Selectors
export const selectGlobalHistoryEntries = (state: GlobalUndoStore) => state.entries;
export const selectGlobalCurrentIndex = (state: GlobalUndoStore) => state.currentIndex;
export const selectIsGlobalPreviewingHistory = (state: GlobalUndoStore) =>
  state.isPreviewingHistory;
export const selectGlobalCanUndo = (state: GlobalUndoStore) => state.canUndo();
export const selectGlobalCanRedo = (state: GlobalUndoStore) => state.canRedo();
export const selectGlobalIsPaused = (state: GlobalUndoStore) => state.isPaused;

export const selectGlobalUndoActions = (state: GlobalUndoStore) => ({
  pushEntry: state.pushEntry,
  undo: state.undo,
  redo: state.redo,
  clearHistory: state.clearHistory,
  pause: state.pause,
  resume: state.resume,
  getUndoDescription: state.getUndoDescription,
  getRedoDescription: state.getRedoDescription,
});
