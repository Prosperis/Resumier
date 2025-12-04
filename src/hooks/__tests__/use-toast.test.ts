import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { reducer, toast, useToast } from "../use-toast";

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clear any existing toasts before each test by directly manipulating memoryState
    const { result } = renderHook(() => useToast());
    // Dismiss all toasts
    act(() => {
      result.current.dismiss();
    });
    // Advance time to remove all dismissed toasts
    act(() => {
      vi.advanceTimersByTime(5100);
    });
    // Wait for cleanup
    act(() => {
      vi.advanceTimersByTime(100);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Initialization", () => {
    it("initializes with empty toasts array", () => {
      const { result } = renderHook(() => useToast());
      expect(result.current.toasts).toEqual([]);
    });

    it("provides toast function", () => {
      const { result } = renderHook(() => useToast());
      expect(typeof result.current.toast).toBe("function");
    });

    it("provides dismiss function", () => {
      const { result } = renderHook(() => useToast());
      expect(typeof result.current.dismiss).toBe("function");
    });
  });

  describe("Adding Toasts", () => {
    it("adds a toast with title", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Test Toast" });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Test Toast");
    });

    it("adds a toast with title and description", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "Test Toast",
          description: "Test Description",
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Test Toast");
      expect(result.current.toasts[0].description).toBe("Test Description");
    });

    it("adds a toast with destructive variant", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "Error",
          variant: "destructive",
        });
      });

      expect(result.current.toasts[0].variant).toBe("destructive");
    });

    it("generates unique IDs for each toast", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Toast 1" });
        result.current.toast({ title: "Toast 2" });
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].id).not.toBe(result.current.toasts[1].id);
    });

    it("limits toasts to TOAST_LIMIT (3)", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Toast 1" });
        result.current.toast({ title: "Toast 2" });
        result.current.toast({ title: "Toast 3" });
        result.current.toast({ title: "Toast 4" });
      });

      expect(result.current.toasts).toHaveLength(3);
      // Newest toasts should be at the beginning
      expect(result.current.toasts[0].title).toBe("Toast 4");
      expect(result.current.toasts[2].title).toBe("Toast 2");
    });

    it("adds new toasts at the beginning", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "First" });
        result.current.toast({ title: "Second" });
      });

      expect(result.current.toasts[0].title).toBe("Second");
      expect(result.current.toasts[1].title).toBe("First");
    });
  });

  describe("Dismissing Toasts", () => {
    it("dismisses a specific toast by ID", () => {
      const { result } = renderHook(() => useToast());
      let toastId: string;

      act(() => {
        const { id } = result.current.toast({ title: "Test Toast" });
        toastId = id;
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.dismiss(toastId);
      });

      // Toast should be marked as closed but still in array
      expect(result.current.toasts[0]).toHaveProperty("open", false);
    });

    it("removes dismissed toast after TOAST_REMOVE_DELAY", () => {
      const { result } = renderHook(() => useToast());
      let toastId: string;
      const initialCount = result.current.toasts.length;

      act(() => {
        const { id } = result.current.toast({ title: "Test Toast" });
        toastId = id;
      });

      // Should have one more toast than we started with
      expect(result.current.toasts).toHaveLength(initialCount + 1);

      act(() => {
        result.current.dismiss(toastId);
      });

      // Still in array immediately after dismiss
      expect(result.current.toasts.length).toBeGreaterThanOrEqual(1);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Our toast should be removed after delay
      expect(result.current.toasts.length).toBe(initialCount);
    });

    it("dismisses all toasts when no ID provided", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Toast 1" });
        result.current.toast({ title: "Toast 2" });
        result.current.toast({ title: "Toast 3" });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.dismiss();
      });

      // All toasts should be marked as closed
      expect(result.current.toasts.every((t: any) => t.open === false)).toBe(
        true,
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // All should be removed after delay
      expect(result.current.toasts).toHaveLength(0);
    });

    it("does not add duplicate removal timeouts", () => {
      const { result } = renderHook(() => useToast());
      let toastId: string;

      act(() => {
        const { id } = result.current.toast({ title: "Test Toast" });
        toastId = id;
      });

      // Dismiss same toast multiple times
      act(() => {
        result.current.dismiss(toastId);
        result.current.dismiss(toastId);
        result.current.dismiss(toastId);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should still be removed only once
      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe("Updating Toasts", () => {
    it("updates toast properties using update function", () => {
      const { result } = renderHook(() => useToast());
      let updateFn: (props: any) => void;

      act(() => {
        const { update } = result.current.toast({ title: "Original" });
        updateFn = update;
      });

      act(() => {
        updateFn({ title: "Updated" });
      });

      expect(result.current.toasts[0].title).toBe("Updated");
    });

    it("partially updates toast properties", () => {
      const { result } = renderHook(() => useToast());
      let updateFn: (props: any) => void;

      act(() => {
        const { update } = result.current.toast({
          title: "Original",
          description: "Original Description",
        });
        updateFn = update;
      });

      act(() => {
        updateFn({ description: "Updated Description" });
      });

      expect(result.current.toasts[0].title).toBe("Original");
      expect(result.current.toasts[0].description).toBe("Updated Description");
    });

    it("updates only the specific toast", () => {
      const { result } = renderHook(() => useToast());
      let updateFn: (props: any) => void;

      act(() => {
        result.current.toast({ title: "Toast 1" });
        const { update } = result.current.toast({ title: "Toast 2" });
        updateFn = update;
      });

      act(() => {
        updateFn({ title: "Updated Toast 2" });
      });

      expect(result.current.toasts[0].title).toBe("Updated Toast 2");
      expect(result.current.toasts[1].title).toBe("Toast 1");
    });
  });

  describe("Toast Return Object", () => {
    it("returns object with id, dismiss, and update", () => {
      const { result } = renderHook(() => useToast());
      let toastResult: any;

      act(() => {
        toastResult = result.current.toast({ title: "Test" });
      });

      expect(toastResult).toHaveProperty("id");
      expect(toastResult).toHaveProperty("dismiss");
      expect(toastResult).toHaveProperty("update");
      expect(typeof toastResult.dismiss).toBe("function");
      expect(typeof toastResult.update).toBe("function");
    });

    it("dismiss function removes the specific toast", () => {
      const { result } = renderHook(() => useToast());
      let dismissFn: () => void;

      act(() => {
        const { dismiss } = result.current.toast({ title: "Test" });
        dismissFn = dismiss;
      });

      act(() => {
        dismissFn();
      });

      expect(result.current.toasts[0]).toHaveProperty("open", false);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe("Multiple Hook Instances", () => {
    it("syncs state across multiple hook instances", () => {
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());

      act(() => {
        result1.current.toast({ title: "Shared Toast" });
      });

      // Both instances should see the toast
      expect(result1.current.toasts).toHaveLength(1);
      expect(result2.current.toasts).toHaveLength(1);
      expect(result1.current.toasts[0].id).toBe(result2.current.toasts[0].id);
    });

    it("dismissing from one instance affects all instances", () => {
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());

      act(() => {
        result1.current.toast({ title: "Shared Toast" });
      });

      act(() => {
        result2.current.dismiss();
      });

      // Both instances should see the dismissed state
      expect(result1.current.toasts[0]).toHaveProperty("open", false);
      expect(result2.current.toasts[0]).toHaveProperty("open", false);
    });
  });

  describe("Cleanup", () => {
    it("removes listener on unmount", () => {
      const { unmount } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());
      const initialCount = result2.current.toasts.length;

      unmount();

      act(() => {
        result2.current.toast({ title: "Test" });
      });

      // Second instance should have one more toast than before
      expect(result2.current.toasts).toHaveLength(initialCount + 1);
    });
  });
});

describe("toast function (standalone)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clear all toasts more thoroughly
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismiss();
    });
    act(() => {
      vi.advanceTimersByTime(5100);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("can be called without hook instance", () => {
    let toastResult: any;

    act(() => {
      toastResult = toast({ title: "Standalone Toast" });
    });

    expect(toastResult).toHaveProperty("id");
    expect(toastResult).toHaveProperty("dismiss");
    expect(toastResult).toHaveProperty("update");
  });

  it("standalone toast appears in hook instance", () => {
    const initialResult = renderHook(() => useToast());
    const initialCount = initialResult.result.current.toasts.length;

    act(() => {
      toast({ title: "Standalone Toast" });
    });

    const { result } = renderHook(() => useToast());
    // Should have one more toast than we started with
    expect(result.current.toasts.length).toBe(initialCount + 1);
    expect(result.current.toasts[0].title).toBe("Standalone Toast");
  });
});

describe("reducer", () => {
  it("ADD_TOAST adds toast to beginning of array", () => {
    const state: { toasts: any[] } = { toasts: [] };
    const newState = reducer(state, {
      type: "ADD_TOAST",
      toast: { id: "1", title: "Test" },
    });

    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0].id).toBe("1");
  });

  it("UPDATE_TOAST updates the correct toast", () => {
    const state = {
      toasts: [
        { id: "1", title: "First" },
        { id: "2", title: "Second" },
      ],
    };
    const newState = reducer(state, {
      type: "UPDATE_TOAST",
      toast: { id: "2", title: "Updated Second" },
    });

    expect(newState.toasts[0].title).toBe("First");
    expect(newState.toasts[1].title).toBe("Updated Second");
  });

  it("DISMISS_TOAST sets open to false for specific toast", () => {
    const state = {
      toasts: [{ id: "1", title: "Test" }],
    };

    // Mock the timeout
    vi.useFakeTimers();

    const newState = reducer(state, {
      type: "DISMISS_TOAST",
      toastId: "1",
    });

    expect(newState.toasts[0]).toHaveProperty("open", false);

    vi.useRealTimers();
  });

  it("DISMISS_TOAST without ID dismisses all toasts", () => {
    const state = {
      toasts: [
        { id: "1", title: "First" },
        { id: "2", title: "Second" },
      ],
    };

    vi.useFakeTimers();

    const newState = reducer(state, {
      type: "DISMISS_TOAST",
    });

    expect(newState.toasts[0]).toHaveProperty("open", false);
    expect(newState.toasts[1]).toHaveProperty("open", false);

    vi.useRealTimers();
  });

  it("REMOVE_TOAST removes specific toast from array", () => {
    const state = {
      toasts: [
        { id: "1", title: "First" },
        { id: "2", title: "Second" },
      ],
    };
    const newState = reducer(state, {
      type: "REMOVE_TOAST",
      toastId: "1",
    });

    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0].id).toBe("2");
  });

  it("REMOVE_TOAST without ID removes all toasts", () => {
    const state = {
      toasts: [
        { id: "1", title: "First" },
        { id: "2", title: "Second" },
      ],
    };
    const newState = reducer(state, {
      type: "REMOVE_TOAST",
      toastId: undefined,
    });

    expect(newState.toasts).toHaveLength(0);
  });

  it("ADD_TOAST enforces TOAST_LIMIT", () => {
    const state = {
      toasts: [
        { id: "1", title: "First" },
        { id: "2", title: "Second" },
        { id: "3", title: "Third" },
      ],
    };
    const newState = reducer(state, {
      type: "ADD_TOAST",
      toast: { id: "4", title: "Fourth" },
    });

    expect(newState.toasts).toHaveLength(3);
    expect(newState.toasts[0].id).toBe("4");
    expect(newState.toasts[2].id).toBe("2");
    // "First" should be dropped
  });
});
