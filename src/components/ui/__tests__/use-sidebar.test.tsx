import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";
import type { SidebarContextProps } from "@/components/ui/use-sidebar";
import { SidebarContext, useSidebar } from "@/components/ui/use-sidebar";

describe("useSidebar", () => {
  it("throws error when used outside SidebarProvider", () => {
    expect(() => renderHook(() => useSidebar())).toThrow(
      "useSidebar must be used within a SidebarProvider",
    );
  });
  it("returns context when used inside SidebarProvider", () => {
    const mockContext: SidebarContextProps = {
      state: "expanded",
      open: true,
      setOpen: vi.fn(),
      openMobile: false,
      setOpenMobile: vi.fn(),
      isMobile: false,
      toggleSidebar: vi.fn(),
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SidebarContext.Provider value={mockContext}>
        {children}
      </SidebarContext.Provider>
    );
    const { result } = renderHook(() => useSidebar(), { wrapper });
    expect(result.current).toBe(mockContext);
    expect(result.current.state).toBe("expanded");
    expect(result.current.open).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });
  it("provides toggleSidebar function", () => {
    const mockToggle = vi.fn();
    const mockContext: SidebarContextProps = {
      state: "expanded",
      open: true,
      setOpen: vi.fn(),
      openMobile: false,
      setOpenMobile: vi.fn(),
      isMobile: false,
      toggleSidebar: mockToggle,
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SidebarContext.Provider value={mockContext}>
        {children}
      </SidebarContext.Provider>
    );
    const { result } = renderHook(() => useSidebar(), { wrapper });
    result.current.toggleSidebar();
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
