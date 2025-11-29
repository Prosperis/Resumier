import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { Resume } from "@/lib/api/types";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  duration?: number;
}

export type PersonalInfoSection =
  | "basic"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "links";

// Resume builder section - tracks which collapsible section is open
export type ResumeBuilderSection =
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "links"
  | ""; // empty string means all collapsed

interface UIStore {
  // Sidebar State
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Personal Info Dialog Section State
  personalInfoSection: PersonalInfoSection;

  // Resume Builder Section State (which collapsible is open)
  resumeBuilderSection: ResumeBuilderSection;

  // Dialog State
  activeDialog: string | null;
  dialogData: Record<string, unknown>;

  // Notification State
  notifications: Notification[];

  // Loading State
  globalLoading: boolean;

  // Current Resume (for navbar actions)
  currentResume: Resume | null;

  // Sidebar Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // Personal Info Section Actions
  setPersonalInfoSection: (section: PersonalInfoSection) => void;

  // Resume Builder Section Actions
  setResumeBuilderSection: (section: ResumeBuilderSection) => void;
  toggleResumeBuilderSection: (section: ResumeBuilderSection) => void;

  // Dialog Actions
  openDialog: (name: string, data?: Record<string, unknown>) => void;
  closeDialog: () => void;

  // Notification Actions
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Loading Actions
  setGlobalLoading: (loading: boolean) => void;

  // Current Resume Actions
  setCurrentResume: (resume: Resume | null) => void;
}

const initialState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  personalInfoSection: "basic" as PersonalInfoSection,
  resumeBuilderSection: "personal" as ResumeBuilderSection,
  activeDialog: null,
  dialogData: {},
  notifications: [],
  globalLoading: false,
  currentResume: null,
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Sidebar Actions
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

        toggleSidebar: () =>
          set((state) => ({
            sidebarOpen: !state.sidebarOpen,
          })),

        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

        toggleSidebarCollapsed: () =>
          set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed,
          })),

        // Personal Info Section Actions
        setPersonalInfoSection: (personalInfoSection) =>
          set({ personalInfoSection }),

        // Resume Builder Section Actions
        setResumeBuilderSection: (resumeBuilderSection) =>
          set({ resumeBuilderSection }),

        toggleResumeBuilderSection: (section) =>
          set((state) => ({
            resumeBuilderSection:
              state.resumeBuilderSection === section ? "" : section,
          })),

        // Dialog Actions
        openDialog: (activeDialog, dialogData = {}) =>
          set({
            activeDialog,
            dialogData,
          }),

        closeDialog: () =>
          set({
            activeDialog: null,
            dialogData: {},
          }),

        // Notification Actions
        addNotification: (notification) => {
          const id = `notification-${Date.now()}-${Math.random()}`;
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id,
              },
            ],
          }));

          // Auto-remove after duration (default 5s)
          const duration = notification.duration ?? 5000;
          if (duration > 0) {
            setTimeout(() => {
              set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
              }));
            }, duration);
          }
        },

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearNotifications: () => set({ notifications: [] }),

        // Loading Actions
        setGlobalLoading: (globalLoading) => set({ globalLoading }),

        // Current Resume Actions
        setCurrentResume: (currentResume) => set({ currentResume }),
      }),
      {
        name: "resumier-ui",
        version: 2,
        storage: createJSONStorage(() => localStorage),
        // Only persist sidebar state and section states, not dialogs/notifications/loading
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          sidebarCollapsed: state.sidebarCollapsed,
          personalInfoSection: state.personalInfoSection,
          resumeBuilderSection: state.resumeBuilderSection,
        }),
        // Migrate from older versions
        migrate: (persistedState: unknown, version: number) => {
          const state = persistedState as Partial<UIStore>;
          if (version === 0) {
            // Add default personalInfoSection if missing
            return {
              ...state,
              personalInfoSection: state.personalInfoSection ?? "basic",
              resumeBuilderSection: "personal" as ResumeBuilderSection,
            };
          }
          if (version === 1) {
            // Add resumeBuilderSection
            return {
              ...state,
              resumeBuilderSection:
                state.resumeBuilderSection ?? ("personal" as ResumeBuilderSection),
            };
          }
          return state as UIStore;
        },
        // Ensure proper merging with defaults for any missing fields
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState as Partial<UIStore>),
          // Ensure section states have valid defaults
          personalInfoSection:
            (persistedState as Partial<UIStore>)?.personalInfoSection ??
            currentState.personalInfoSection,
          resumeBuilderSection:
            (persistedState as Partial<UIStore>)?.resumeBuilderSection ??
            currentState.resumeBuilderSection,
        }),
      },
    ),
    { name: "UIStore" },
  ),
);

// Selectors for optimized access
export const selectSidebarOpen = (state: UIStore) => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UIStore) =>
  state.sidebarCollapsed;
export const selectPersonalInfoSection = (state: UIStore) =>
  state.personalInfoSection;
export const selectSetPersonalInfoSection = (state: UIStore) =>
  state.setPersonalInfoSection;
export const selectResumeBuilderSection = (state: UIStore) =>
  state.resumeBuilderSection;
export const selectSetResumeBuilderSection = (state: UIStore) =>
  state.setResumeBuilderSection;
export const selectToggleResumeBuilderSection = (state: UIStore) =>
  state.toggleResumeBuilderSection;
export const selectActiveDialog = (state: UIStore) => state.activeDialog;
export const selectDialogData = (state: UIStore) => state.dialogData;
export const selectNotifications = (state: UIStore) => state.notifications;
export const selectGlobalLoading = (state: UIStore) => state.globalLoading;

export const selectSidebarActions = (state: UIStore) => ({
  setSidebarOpen: state.setSidebarOpen,
  toggleSidebar: state.toggleSidebar,
  setSidebarCollapsed: state.setSidebarCollapsed,
  toggleSidebarCollapsed: state.toggleSidebarCollapsed,
});

export const selectDialogActions = (state: UIStore) => ({
  openDialog: state.openDialog,
  closeDialog: state.closeDialog,
});

export const selectNotificationActions = (state: UIStore) => ({
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
});

// Current Resume selectors
export const selectCurrentResume = (state: UIStore) => state.currentResume;
export const selectSetCurrentResume = (state: UIStore) =>
  state.setCurrentResume;
