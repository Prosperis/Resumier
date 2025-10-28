import { renderHook } from "@testing-library/react"
import { vi } from "../test/vitest-utils"
import { useIsMobile } from "./use-mobile"

function setupWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches: width < 768,
      media: `(min-width: 768px)`,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  })
}
describe("useIsMobile", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })
  it("detects mobile width (< 768px)", () => {
    setupWindowWidth(500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
  it("detects tablet width (border case)", () => {
    setupWindowWidth(767)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
  it("detects desktop width (>= 768px)", () => {
    setupWindowWidth(768)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
  it("detects large desktop width", () => {
    setupWindowWidth(1920)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
