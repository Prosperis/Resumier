import { act, renderHook } from "@testing-library/react"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { useTheme } from "@/hooks/use-theme"

let originalMatchMedia: typeof window.matchMedia
beforeAll(() => {
  originalMatchMedia = window.matchMedia
  // Mock matchMedia for theme detection
  const mockMatchMedia = vi.fn((query) => ({
    matches: false, // Default to light mode
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
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
  afterEach(() => {
    vi.clearAllMocks()
  })
  it("initializes with light theme by default", () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })
  it("initializes from localStorage when theme is set", () => {
    localStorage.setItem("theme", "dark")
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })
  it("sets theme to dark", () => {
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.setTheme("dark")
    })
    expect(result.current.theme).toBe("dark")
    expect(localStorage.getItem("theme")).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })
  it("sets theme to light", () => {
    localStorage.setItem("theme", "dark")
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.setTheme("light")
    })
    expect(result.current.theme).toBe("light")
    expect(localStorage.getItem("theme")).toBe("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })
  it("toggles theme from light to dark", () => {
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe("dark")
    expect(localStorage.getItem("theme")).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })
  it("toggles theme from dark to light", () => {
    localStorage.setItem("theme", "dark")
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe("light")
    expect(localStorage.getItem("theme")).toBe("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })
})
