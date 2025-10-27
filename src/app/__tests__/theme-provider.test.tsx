import { act, render, renderHook, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ThemeProvider, useTheme } from "../theme-provider"

describe("ThemeProvider", () => {
  beforeEach(() => {
    // Clear localStorage and DOM classes before each test
    localStorage.clear()
    document.documentElement.classList.remove("light", "dark")

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
    }))
  })

  afterEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  })

  describe("Rendering", () => {
    it("should render children", () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>,
      )

      expect(screen.getByText("Test Content")).toBeInTheDocument()
    })

    it("should provide theme context to children", () => {
      const TestComponent = () => {
        const { theme } = useTheme()
        return <div>Current theme: {theme}</div>
      }

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      )

      expect(screen.getByText(/Current theme:/)).toBeInTheDocument()
    })
  })

  describe("Default Theme", () => {
    it("should default to 'system' theme", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      expect(result.current.theme).toBe("system")
    })

    it("should use custom default theme when provided", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>,
      })

      expect(result.current.theme).toBe("dark")
    })

    it("should load theme from localStorage if available", () => {
      localStorage.setItem("resumier-theme", "dark")

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      expect(result.current.theme).toBe("dark")
    })

    it("should use custom storage key", () => {
      localStorage.setItem("custom-key", "light")

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider storageKey="custom-key">{children}</ThemeProvider>
        ),
      })

      expect(result.current.theme).toBe("light")
    })
  })

  describe("Setting Theme", () => {
    it("should update theme to dark", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("dark")
      })

      expect(result.current.theme).toBe("dark")
    })

    it("should update theme to light", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("light")
      })

      expect(result.current.theme).toBe("light")
    })

    it("should update theme to system", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("system")
      })

      expect(result.current.theme).toBe("system")
    })

    it("should persist theme to localStorage", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("dark")
      })

      expect(localStorage.getItem("resumier-theme")).toBe("dark")
    })

    it("should persist theme to custom storage key", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider storageKey="custom-key">{children}</ThemeProvider>
        ),
      })

      act(() => {
        result.current.setTheme("light")
      })

      expect(localStorage.getItem("custom-key")).toBe("light")
    })
  })

  describe("DOM Manipulation", () => {
    it("should add 'light' class to root element when theme is light", async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("light")
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true)
      })
    })

    it("should add 'dark' class to root element when theme is dark", async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("dark")
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true)
      })
    })

    it("should remove previous theme class when changing themes", async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("light")
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true)
      })

      act(() => {
        result.current.setTheme("dark")
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(false)
        expect(document.documentElement.classList.contains("dark")).toBe(true)
      })
    })

    it("should use system preference when theme is system", async () => {
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
      }))

      renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      // Default is 'system'
      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true)
      })
    })

    it("should use light system preference when not dark", async () => {
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
      }))

      renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      // Default is 'system' and system preference is light
      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true)
      })
    })
  })

  describe("useTheme Hook", () => {
    it("should work when used within ThemeProvider", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      // When used correctly, it should have theme and setTheme
      expect(result.current.theme).toBeDefined()
      expect(result.current.setTheme).toBeTypeOf("function")
    })

    it("should provide theme and setTheme", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      expect(result.current).toHaveProperty("theme")
      expect(result.current).toHaveProperty("setTheme")
      expect(result.current.setTheme).toBeTypeOf("function")
    })

    it("should have correct initial theme", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider defaultTheme="light">{children}</ThemeProvider>,
      })

      expect(result.current.theme).toBe("light")
    })
  })

  describe("Multiple Theme Changes", () => {
    it("should handle rapid theme changes", async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("dark")
      })
      act(() => {
        result.current.setTheme("light")
      })
      act(() => {
        result.current.setTheme("dark")
      })

      expect(result.current.theme).toBe("dark")
      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true)
      })
    })

    it("should persist last theme change to localStorage", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme("dark")
      })
      act(() => {
        result.current.setTheme("light")
      })
      act(() => {
        result.current.setTheme("system")
      })

      expect(localStorage.getItem("resumier-theme")).toBe("system")
    })
  })
})
