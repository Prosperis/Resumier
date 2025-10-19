import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useIsMobile } from "./use-mobile"

function setup(width: number) {
  Object.defineProperty(window, "innerWidth", { writable: true, value: width })
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: width < 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
}

describe("useIsMobile", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("detects mobile width", () => {
    setup(500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it("detects desktop width", () => {
    setup(1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
