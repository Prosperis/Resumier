import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import type { Notification } from "../ui-store";
import { useUIStore } from "../ui-store";

describe("useUIStore", () => {
  beforeEach(() => {
    // Clear store state and localStorage before each test
    useUIStore.setState({
      sidebarOpen: true,
      sidebarCollapsed: false,
      personalInfoSection: "basic",
      activeDialog: null,
      dialogData: {},
      notifications: [],
      globalLoading: false,
    });
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  describe("Initial State", () => {
    it("has correct initial state", () => {
      const { result } = renderHook(() => useUIStore());
      expect(result.current.sidebarOpen).toBe(true);
      expect(result.current.sidebarCollapsed).toBe(false);
      expect(result.current.personalInfoSection).toBe("basic");
      expect(result.current.activeDialog).toBeNull();
      expect(result.current.dialogData).toEqual({});
      expect(result.current.notifications).toEqual([]);
      expect(result.current.globalLoading).toBe(false);
    });
  });
  describe("Sidebar Actions", () => {
    it("sets sidebar open state", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.setSidebarOpen(false);
      });
      expect(result.current.sidebarOpen).toBe(false);
      act(() => {
        result.current.setSidebarOpen(true);
      });
      expect(result.current.sidebarOpen).toBe(true);
    });
    it("toggles sidebar", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.sidebarOpen).toBe(false);
      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.sidebarOpen).toBe(true);
    });
    it("sets sidebar collapsed state", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.setSidebarCollapsed(true);
      });
      expect(result.current.sidebarCollapsed).toBe(true);
      act(() => {
        result.current.setSidebarCollapsed(false);
      });
      expect(result.current.sidebarCollapsed).toBe(false);
    });
    it("toggles sidebar collapsed state", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.toggleSidebarCollapsed();
      });
      expect(result.current.sidebarCollapsed).toBe(true);
      act(() => {
        result.current.toggleSidebarCollapsed();
      });
      expect(result.current.sidebarCollapsed).toBe(false);
    });
  });

  describe("Personal Info Section Actions", () => {
    it("sets personal info section", () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setPersonalInfoSection("experience");
      });
      expect(result.current.personalInfoSection).toBe("experience");

      act(() => {
        result.current.setPersonalInfoSection("education");
      });
      expect(result.current.personalInfoSection).toBe("education");
    });

    it("remembers personal info section through multiple changes", () => {
      const { result } = renderHook(() => useUIStore());

      const sections = [
        "skills",
        "certifications",
        "links",
        "basic",
      ] as const;

      for (const section of sections) {
        act(() => {
          result.current.setPersonalInfoSection(section);
        });
        expect(result.current.personalInfoSection).toBe(section);
      }
    });
  });

  describe("Dialog Actions", () => {
    it("opens dialog with name only", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.openDialog("test-dialog");
      });
      const currentState = useUIStore.getState();
      expect(currentState.activeDialog).toBe("test-dialog");
      expect(currentState.dialogData).toEqual({});
    });
    it("opens dialog with data", () => {
      const { result } = renderHook(() => useUIStore());
      const data = { id: "1", name: "Test" };
      act(() => {
        result.current.openDialog("test-dialog", data);
      });
      const currentState = useUIStore.getState();
      expect(currentState.activeDialog).toBe("test-dialog");
      expect(currentState.dialogData).toEqual(data);
    });
    it("closes dialog and clears data", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.openDialog("test-dialog", { id: "1" });
      });
      act(() => {
        result.current.closeDialog();
      });
      const currentState = useUIStore.getState();
      expect(currentState.activeDialog).toBeNull();
      expect(currentState.dialogData).toEqual({});
    });
  });
  describe("Notification Actions", () => {
    it("adds a notification", () => {
      const { result } = renderHook(() => useUIStore());
      const notification: Omit<Notification, "id"> = {
        type: "success",
        title: "Success",
        message: "Operation completed",
      };
      act(() => {
        result.current.addNotification(notification);
      });
      const currentState = useUIStore.getState();
      expect(currentState.notifications).toHaveLength(1);
      expect(currentState.notifications[0]).toMatchObject(notification);
      expect(currentState.notifications[0].id).toBeDefined();
    });
    it("auto-removes notification after duration", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.addNotification({
          type: "info",
          title: "Info",
          duration: 1000,
        });
      });
      expect(result.current.notifications).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      const currentState = useUIStore.getState();
      expect(currentState.notifications).toHaveLength(0);
    });
    it("does not auto-remove notification with duration 0", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.addNotification({
          type: "info",
          title: "Info",
          duration: 0,
        });
      });
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      expect(result.current.notifications).toHaveLength(1);
    });
    it("removes specific notification by id", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.addNotification({ type: "info", title: "Info 1" });
        result.current.addNotification({ type: "info", title: "Info 2" });
      });
      const firstId = result.current.notifications[0].id;
      act(() => {
        result.current.removeNotification(firstId);
      });
      const currentState = useUIStore.getState();
      expect(currentState.notifications).toHaveLength(1);
      expect(currentState.notifications[0].title).toBe("Info 2");
    });
    it("clears all notifications", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.addNotification({ type: "info", title: "Info 1" });
        result.current.addNotification({ type: "info", title: "Info 2" });
        result.current.addNotification({ type: "info", title: "Info 3" });
      });
      expect(result.current.notifications).toHaveLength(3);
      act(() => {
        result.current.clearNotifications();
      });
      expect(result.current.notifications).toEqual([]);
    });
    it("adds multiple notification types", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.addNotification({ type: "success", title: "Success" });
        result.current.addNotification({ type: "error", title: "Error" });
        result.current.addNotification({ type: "warning", title: "Warning" });
        result.current.addNotification({ type: "info", title: "Info" });
      });
      const notifications = result.current.notifications;
      expect(notifications).toHaveLength(4);
      expect(notifications[0].type).toBe("success");
      expect(notifications[1].type).toBe("error");
      expect(notifications[2].type).toBe("warning");
      expect(notifications[3].type).toBe("info");
    });
  });
  describe("Loading Actions", () => {
    it("sets global loading state", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.setGlobalLoading(true);
      });
      expect(result.current.globalLoading).toBe(true);
      act(() => {
        result.current.setGlobalLoading(false);
      });
      expect(result.current.globalLoading).toBe(false);
    });
  });
  describe("Persistence", () => {
    it("persists sidebar state to localStorage", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.setSidebarOpen(false);
        result.current.setSidebarCollapsed(true);
        result.current.setPersonalInfoSection("experience");
      });
      const stored = localStorage.getItem("resumier-ui");
      expect(stored).toBeTruthy();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.sidebarOpen).toBe(false);
        expect(parsed.state.sidebarCollapsed).toBe(true);
        expect(parsed.state.personalInfoSection).toBe("experience");
      }
    });
    it("does not persist dialog, notification, or loading state", () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.openDialog("test", { id: "1" });
        result.current.addNotification({ type: "info", title: "Test" });
        result.current.setGlobalLoading(true);
      });
      const stored = localStorage.getItem("resumier-ui");
      if (stored) {
        const parsed = JSON.parse(stored);
        // These should not be in persisted state
        expect(parsed.state.activeDialog).toBeUndefined();
        expect(parsed.state.dialogData).toBeUndefined();
        expect(parsed.state.notifications).toBeUndefined();
        expect(parsed.state.globalLoading).toBeUndefined();
      }
    });
  });
  describe("Selectors", () => {
    it("does not cause re-render when unrelated state changes", () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useUIStore((state) => state.sidebarOpen);
      });
      expect(renderCount).toBe(1);
      expect(result.current).toBe(true);
      // Changing dialog shouldn't cause re-render of sidebarOpen selector
      act(() => {
        useUIStore.getState().openDialog("test");
      });
      // Still only 1 render since sidebarOpen didn't change
      expect(renderCount).toBe(1);
      // Changing sidebarOpen SHOULD cause re-render
      act(() => {
        useUIStore.getState().setSidebarOpen(false);
      });
      expect(renderCount).toBe(2);
      expect(result.current).toBe(false);
    });
  });
});
