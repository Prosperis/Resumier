import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useSidebar, SidebarContext } from './use-sidebar'

describe('useSidebar', () => {
  it('throws when used outside provider', () => {
    const { result } = renderHook(() => useSidebar())
    expect(result.error).toBeInstanceOf(Error)
  })

  it('returns context when inside provider', () => {
    const context = {
      state: 'expanded',
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
