/**
 * Vitest Environment Setup
 * Runs before setupTests.ts to configure global mocks for Framer Motion
 */

// Mock matchMedia for Framer Motion (must be defined early)
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {}, // deprecated
  removeListener: () => {}, // deprecated
  dispatchEvent: () => false,
})

// Set on both window and globalThis
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
})

Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
})

// Mock ResizeObserver for Framer Motion
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})
