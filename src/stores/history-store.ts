import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { UserInfo } from "./resume-store";

// Types for tracking changes
export interface HistoryChange {
  field: string;
  label: string; // Human-readable label
  oldValue: unknown;
  newValue: unknown;
  section: string; // e.g., "personal", "experience", "education"
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  changes: HistoryChange[];
  snapshot: UserInfo; // Full state snapshot for restoration
  description: string; // Summary of changes
}

interface HistoryStore {
  // History stack
  entries: HistoryEntry[];
  currentIndex: number; // Current position in history (-1 = at latest)

  // Max history size
  maxEntries: number;

  // Preview mode (when navigating history)
  isPreviewingHistory: boolean;
  previewEntry: HistoryEntry | null;

  // Actions
  pushEntry: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Preview actions
  startPreview: (entry: HistoryEntry) => void;
  stopPreview: () => void;

  // Get entries for display
  getVisibleEntries: () => HistoryEntry[];
  getCurrentEntry: () => HistoryEntry | null;

  // Branch off (when making a new change while in history)
  branchOff: () => void;

  // Clear history
  clearHistory: () => void;
}

// Generate unique ID
const generateId = () => `history-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Get human-readable label for a field
export function getFieldLabel(field: string, section: string): string {
  const labels: Record<string, Record<string, string>> = {
    personal: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      customUrl: "Website",
    },
    experience: {
      company: "Company",
      title: "Job Title",
      startDate: "Start Date",
      endDate: "End Date",
      current: "Currently Working",
      description: "Description",
      awards: "Awards",
    },
    education: {
      school: "School",
      degree: "Degree",
      startDate: "Start Date",
      endDate: "End Date",
      description: "Description",
    },
    skills: {
      name: "Skill Name",
      years: "Years of Experience",
      proficiency: "Proficiency Level",
    },
    certifications: {
      name: "Certification Name",
      expiration: "Expiration Date",
    },
    links: {
      label: "Link Label",
      url: "URL",
    },
  };

  return labels[section]?.[field] || field;
}

// Generate description from changes
function generateDescription(changes: HistoryChange[]): string {
  if (changes.length === 0) return "No changes";
  if (changes.length === 1) {
    const change = changes[0];
    return `Updated ${change.label}`;
  }
  if (changes.length <= 3) {
    return `Updated ${changes.map((c) => c.label).join(", ")}`;
  }
  return `Updated ${changes.length} fields`;
}

export const useHistoryStore = create<HistoryStore>()(
  devtools(
    (set, get) => ({
      entries: [],
      currentIndex: -1, // -1 means we're at the latest state
      maxEntries: 50,
      isPreviewingHistory: false,
      previewEntry: null,

      pushEntry: (entryData) => {
        const state = get();

        // If we're in the middle of history, branch off
        if (state.currentIndex >= 0) {
          // Remove all entries after current position
          const entries = state.entries.slice(0, state.currentIndex + 1);
          set({ entries, currentIndex: -1 });
        }

        const newEntry: HistoryEntry = {
          ...entryData,
          id: generateId(),
          timestamp: Date.now(),
          description: entryData.description || generateDescription(entryData.changes),
        };

        set((state) => {
          const newEntries = [newEntry, ...state.entries];
          // Trim to max size
          if (newEntries.length > state.maxEntries) {
            newEntries.pop();
          }
          return {
            entries: newEntries,
            currentIndex: -1, // Reset to latest
            isPreviewingHistory: false,
            previewEntry: null,
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
            previewEntry: entry,
          });
          return entry;
        }
        return null;
      },

      redo: () => {
        const state = get();
        if (!state.canRedo()) return null;

        const newIndex = state.currentIndex - 1;

        if (newIndex < 0) {
          // We're back to the latest state
          set({
            currentIndex: -1,
            isPreviewingHistory: false,
            previewEntry: null,
          });
          return null; // Return null to indicate "back to current"
        }

        const entry = state.entries[newIndex];
        if (entry) {
          set({
            currentIndex: newIndex,
            isPreviewingHistory: true,
            previewEntry: entry,
          });
          return entry;
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
        return state.currentIndex > -1 || state.currentIndex === 0;
      },

      startPreview: (entry) => {
        set({
          isPreviewingHistory: true,
          previewEntry: entry,
        });
      },

      stopPreview: () => {
        set({
          isPreviewingHistory: false,
          previewEntry: null,
          currentIndex: -1,
        });
      },

      getVisibleEntries: () => {
        const state = get();
        return state.entries;
      },

      getCurrentEntry: () => {
        const state = get();
        if (state.currentIndex >= 0 && state.currentIndex < state.entries.length) {
          return state.entries[state.currentIndex];
        }
        return null;
      },

      branchOff: () => {
        const state = get();
        if (state.currentIndex >= 0) {
          // Keep only entries up to current position
          const entries = state.entries.slice(0, state.currentIndex + 1);
          set({
            entries,
            currentIndex: -1,
            isPreviewingHistory: false,
            previewEntry: null,
          });
        }
      },

      clearHistory: () => {
        set({
          entries: [],
          currentIndex: -1,
          isPreviewingHistory: false,
          previewEntry: null,
        });
      },
    }),
    { name: "HistoryStore" },
  ),
);

// Selectors
export const selectHistoryEntries = (state: HistoryStore) => state.entries;
export const selectCurrentIndex = (state: HistoryStore) => state.currentIndex;
export const selectIsPreviewingHistory = (state: HistoryStore) => state.isPreviewingHistory;
export const selectPreviewEntry = (state: HistoryStore) => state.previewEntry;
export const selectCanUndo = (state: HistoryStore) => state.canUndo();
export const selectCanRedo = (state: HistoryStore) => state.canRedo();

export const selectHistoryActions = (state: HistoryStore) => ({
  pushEntry: state.pushEntry,
  undo: state.undo,
  redo: state.redo,
  startPreview: state.startPreview,
  stopPreview: state.stopPreview,
  branchOff: state.branchOff,
  clearHistory: state.clearHistory,
});
