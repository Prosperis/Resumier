import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "../theme-provider";

// Ensure localStorage is available in test environment
if (typeof global.localStorage === "undefined") {
  global.localStorage = {
    store: {} as Record<string, string>,
    getItem(key: string) {
      return this.store[key] || null;
    },
    setItem(key: string, value: string) {
      this.store[key] = value;
    },
    removeItem(key: string) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
    get length() {
      return Object.keys(this.store).length;
    },
    key(index: number) {
      return Object.keys(this.store)[index] || null;
    },
  } as Storage;
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    // Clear localStorage and DOM classes before each test
    global.localStorage.clear();
    document.documentElement.classList.remove("light", "dark");

    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Rendering", () => {
    it("should render children", () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>,
      );

      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should provide theme context to children", () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>Current theme: {theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByText(/Current theme:/)).toBeInTheDocument();
    });
  });

  describe("Default Theme", () => {
    it("should default to system theme and resolve to light when system prefers light", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false, // System prefers light
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.theme).toBe("system");
      expect(result.current.resolvedTheme).toBe("light");
    });

    it("should default to system theme and resolve to dark when system prefers dark", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.theme).toBe("system");
      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("should load theme from localStorage if available", () => {
      localStorage.setItem("resumier-theme", "dark");

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.theme).toBe("dark");
    });

    it("should use custom storage key", () => {
      localStorage.setItem("custom-key", "light");

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider storageKey="custom-key">{children}</ThemeProvider>
        ),
      });

      expect(result.current.theme).toBe("light");
    });
  });

  describe("Setting Theme", () => {
    it("should update theme to dark", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
    });

    it("should update theme to light", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("light");
      });

      expect(result.current.theme).toBe("light");
    });

    it("should toggle between light and dark", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      // Start with light (or dark depending on system)
      const initialTheme = result.current.theme;

      act(() => {
        result.current.setTheme(initialTheme === "light" ? "dark" : "light");
      });

      expect(result.current.theme).toBe(
        initialTheme === "light" ? "dark" : "light",
      );
    });

    it("should persist theme to localStorage", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("dark");
      });

      expect(localStorage.getItem("resumier-theme")).toBe("dark");
    });

    it("should persist theme to custom storage key", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider storageKey="custom-key">{children}</ThemeProvider>
        ),
      });

      act(() => {
        result.current.setTheme("light");
      });

      expect(localStorage.getItem("custom-key")).toBe("light");
    });
  });

  describe("DOM Manipulation", () => {
    it("should add 'light' class to root element when theme is light", async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("light");
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true);
      });
    });

    it("should add 'dark' class to root element when theme is dark", async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("dark");
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });

    it("should remove previous theme class when changing themes", async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("light");
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true);
      });

      act(() => {
        result.current.setTheme("dark");
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(
          false,
        );
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });

    it("should detect system dark preference on initial load", async () => {
      // Mock dark mode preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      // Should detect system dark preference and apply it
      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });

    it("should detect system light preference on initial load", async () => {
      // Mock light mode preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      // Should detect system light preference and apply it
      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true);
      });
    });
  });

  describe("useTheme Hook", () => {
    it("should work when used within ThemeProvider", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      // When used correctly, it should have theme and setTheme
      expect(result.current.theme).toBeDefined();
      expect(result.current.setTheme).toBeTypeOf("function");
    });

    it("should provide theme and setTheme", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current).toHaveProperty("theme");
      expect(result.current).toHaveProperty("setTheme");
      expect(result.current.setTheme).toBeTypeOf("function");
    });

    it("should have correct initial theme based on system or storage", () => {
      // Set a stored theme
      localStorage.setItem("resumier-theme", "dark");

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.theme).toBe("dark");
    });
  });

  describe("Multiple Theme Changes", () => {
    it("should handle rapid theme changes", async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("dark");
      });
      act(() => {
        result.current.setTheme("light");
      });
      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });

    it("should persist last theme change to localStorage", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("dark");
      });
      act(() => {
        result.current.setTheme("light");
      });
      act(() => {
        result.current.setTheme("dark");
      });

      expect(localStorage.getItem("resumier-theme")).toBe("dark");
    });
  });
});
