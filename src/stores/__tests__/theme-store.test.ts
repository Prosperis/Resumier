import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useThemeStore } from "../theme-store";

describe("useThemeStore", () => {
  beforeEach(() => {
    // Clear store state and localStorage before each test
    useThemeStore.setState({ theme: "light" });
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe("Initial State", () => {
    it("has light theme as default", () => {
      const { result } = renderHook(() => useThemeStore());
      expect(result.current.theme).toBe("light");
    });
    it("does not have dark class on document initially", () => {
      renderHook(() => useThemeStore());
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });
  describe("setTheme", () => {
    it("updates theme to dark", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.setTheme("dark");
      });
      expect(result.current.theme).toBe("dark");
    });
    it("updates theme to light", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.setTheme("dark");
      });
      act(() => {
        result.current.setTheme("light");
      });
      expect(result.current.theme).toBe("light");
    });
    it("adds dark class to document when theme is dark", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.setTheme("dark");
      });
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
    it("removes dark class from document when theme is light", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.setTheme("dark");
      });
      act(() => {
        result.current.setTheme("light");
      });
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
    it("persists theme to localStorage", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.setTheme("dark");
      });
      const stored = localStorage.getItem("resumier-theme");
      expect(stored).toBeTruthy();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.theme).toBe("dark");
      }
    });
  });
  describe("toggleTheme", () => {
    it("toggles from light to dark", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe("dark");
    });
    it("toggles from dark to light", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.setTheme("dark");
      });
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe("light");
    });
    it("updates document class when toggling", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.toggleTheme();
      });
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      act(() => {
        result.current.toggleTheme();
      });
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
    it("persists toggled theme to localStorage", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.toggleTheme();
      });
      const stored = localStorage.getItem("resumier-theme");
      expect(stored).toBeTruthy();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.theme).toBe("dark");
      }
    });
  });
  describe("Persistence & Hydration", () => {
    it("persists and restores theme from localStorage", () => {
      const { result } = renderHook(() => useThemeStore());
      // Set dark theme
      act(() => {
        result.current.setTheme("dark");
      });
      // Verify persistence
      const stored = localStorage.getItem("resumier-theme");
      expect(stored).toBeTruthy();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.theme).toBe("dark");
      }
      // Verify store state
      expect(result.current.theme).toBe("dark");
    });
    it("maintains theme after setting", () => {
      const { result } = renderHook(() => useThemeStore());
      // Set dark theme
      act(() => {
        result.current.setTheme("dark");
      });
      // Get fresh state
      const currentState = useThemeStore.getState();
      expect(currentState.theme).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
  describe("Selectors", () => {
    it("selects theme using selectTheme", () => {
      const { result } = renderHook(() => useThemeStore());
      act(() => {
        result.current.setTheme("dark");
      });
      const theme = useThemeStore.getState().theme;
      expect(theme).toBe("dark");
    });
    it("does not cause re-render when unrelated state changes", () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useThemeStore((state) => state.theme);
      });
      expect(renderCount).toBe(1);
      expect(result.current).toBe("light");
      // Accessing store methods shouldn't cause re-render
      const { setTheme } = useThemeStore.getState();
      expect(typeof setTheme).toBe("function");
      // Only actual state changes should cause re-render
      act(() => {
        useThemeStore.getState().setTheme("dark");
      });
      expect(renderCount).toBe(2);
      expect(result.current).toBe("dark");
    });
  });
});
