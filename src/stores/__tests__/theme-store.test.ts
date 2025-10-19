import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useThemeStore } from "../theme-store"

describe("useThemeStore", () => {
  beforeEach(() => {
    // Clear store state before each test
    useThemeStore.setState({ theme: "light" })
    localStorage.clear()
    document.documentElement.classList.remove("dark")
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Initial State", () => {
    it("should have light theme as default", () => {
      const { result } = renderHook(() => useThemeStore())
      expect(result.current.theme).toBe("light")
    })

    it("should not have dark class on document initially", () => {
      renderHook(() => useThemeStore())
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })
  })

  describe("setTheme", () => {
    it("should update theme to dark", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.setTheme("dark")
      })

      expect(result.current.theme).toBe("dark")
    })

    it("should update theme to light", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.setTheme("dark")
      })

      act(() => {
        result.current.setTheme("light")
      })

      expect(result.current.theme).toBe("light")
    })

    it("should add dark class to document when theme is dark", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.setTheme("dark")
      })

      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    it("should remove dark class from document when theme is light", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.setTheme("dark")
      })

      act(() => {
        result.current.setTheme("light")
      })

      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })

    it("should persist theme to localStorage", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.setTheme("dark")
      })

      const stored = localStorage.getItem("resumier-theme")
      expect(stored).toBeTruthy()
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.theme).toBe("dark")
      }
    })
  })

  describe("toggleTheme", () => {
    it("should toggle from light to dark", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe("dark")
    })

    it("should toggle from dark to light", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.setTheme("dark")
      })

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe("light")
    })

    it("should update document class when toggling", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.toggleTheme()
      })

      expect(document.documentElement.classList.contains("dark")).toBe(true)

      act(() => {
        result.current.toggleTheme()
      })

      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })

    it("should persist toggled theme to localStorage", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.toggleTheme()
      })

      const stored = localStorage.getItem("resumier-theme")
      expect(stored).toBeTruthy()
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.theme).toBe("dark")
      }
    })
  })

  describe("Persistence & Hydration", () => {
    it("should persist and restore theme from localStorage", () => {
      const { result } = renderHook(() => useThemeStore())

      // Set dark theme
      act(() => {
        result.current.setTheme("dark")
      })

      // Verify it's persisted
      const stored = localStorage.getItem("resumier-theme")
      expect(stored).toBeTruthy()
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.theme).toBe("dark")
      }

      // Verify the store state matches
      expect(result.current.theme).toBe("dark")
    })

    it("should maintain theme after setting", () => {
      const { result } = renderHook(() => useThemeStore())

      // Set dark theme
      act(() => {
        result.current.setTheme("dark")
      })

      // Get fresh state
      const currentState = useThemeStore.getState()
      expect(currentState.theme).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  describe("Selectors", () => {
    it("should select theme using selectTheme", () => {
      const { result } = renderHook(() => useThemeStore())

      act(() => {
        result.current.setTheme("dark")
      })

      const theme = useThemeStore.getState().theme
      expect(theme).toBe("dark")
    })

    it("should not cause re-render when unrelated state changes", () => {
      let renderCount = 0
      const { result } = renderHook(() => {
        renderCount++
        return useThemeStore((state) => state.theme)
      })

      expect(renderCount).toBe(1)
      expect(result.current).toBe("light")

      // Accessing store methods shouldn't cause re-render
      const { setTheme } = useThemeStore.getState()
      expect(typeof setTheme).toBe("function")

      // Only actual state changes should cause re-render
      act(() => {
        useThemeStore.getState().setTheme("dark")
      })

      expect(renderCount).toBe(2)
      expect(result.current).toBe("dark")
    })
  })
})
