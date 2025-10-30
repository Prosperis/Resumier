import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  duration?: number;
}

interface UIStore {
  // Sidebar State
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Dialog State
  activeDialog: string | null;
  dialogData: Record<string, unknown>;

  // Notification State
  notifications: Notification[];

  // Loading State
  globalLoading: boolean;

  // Sidebar Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // Dialog Actions
  openDialog: (name: string, data?: Record<string, unknown>) => void;
  closeDialog: () => void;

  // Notification Actions
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Loading Actions
  setGlobalLoading: (loading: boolean) => void;
}

const initialState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeDialog: null,
  dialogData: {},
  notifications: [],
  globalLoading: false,
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
      }),
      {
        name: "resumier-ui",
        storage: createJSONStorage(() => localStorage),
        // Only persist sidebar state, not dialogs/notifications/loading
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          sidebarCollapsed: state.sidebarCollapsed,
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
