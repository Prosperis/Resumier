import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { SidebarContextProps } from "./use-sidebar"
import { SidebarContext, useSidebar } from "./use-sidebar"

describe("useSidebar", () => {
  it("throws when used outside provider", () => {
    expect(() => renderHook(() => useSidebar())).toThrowError()
  })

  it("returns context when inside provider", () => {
    const context: SidebarContextProps = {
      state: "expanded",
      open: true,
      setOpen: vi.fn(),
      openMobile: false,
      setOpenMobile: vi.fn(),
      isMobile: false,
      toggleSidebar: vi.fn(),
    }
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SidebarContext.Provider value={context}>{children}</SidebarContext.Provider>
    )
    const { result } = renderHook(() => useSidebar(), { wrapper })
    expect(result.current).toBe(context)
  })
})
