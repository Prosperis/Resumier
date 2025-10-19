import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

// Mock matchMedia BEFORE any imports (for Framer Motion)
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false, // Default to light mode and no reduced motion
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  dispatchEvent: vi.fn(),
}))

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
})

// Also set on global for Framer Motion
// @ts-expect-error - global mock
global.matchMedia = mockMatchMedia

// Mock ResizeObserver for Framer Motion
const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.ResizeObserver = mockResizeObserver
// @ts-expect-error - global mock
window.ResizeObserver = mockResizeObserver
