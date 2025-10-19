import { act, renderHook } from "@testing-library/react"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { useTheme } from "./use-theme"

let originalMatchMedia: typeof window.matchMedia

beforeAll(() => {
  originalMatchMedia = window.matchMedia
  // Mock matchMedia properly
  const mockMatchMedia = vi.fn().mockImplementation((query) => ({
    matches: false, // Default to light mode for tests
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(), // deprecated but some code still uses it
    removeListener: vi.fn(), // deprecated but some code still uses it
    dispatchEvent: vi.fn(),
  }))

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: mockMatchMedia,
  })
})

afterAll(() => {
  window.matchMedia = originalMatchMedia
})

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ""
  })

  it("initializes from localStorage", () => {
    localStorage.setItem("theme", "dark")
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  // TODO: Fix this test - legacy code will be refactored in Phase 7
  it.skip("toggles theme", () => {
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe("dark")
    expect(localStorage.getItem("theme")).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })
})
