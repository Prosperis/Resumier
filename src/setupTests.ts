import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Helper function for mocking (replaces vi.mocked from newer Vitest versions)
export function mocked<T>(fn: T): T {
  return fn;
}

// Add mocked to vi namespace for compatibility
if (!("mocked" in vi)) {
  Object.assign(vi, { mocked });
}

// Mock matchMedia BEFORE any imports (for Framer Motion)
const mockMatchMedia = vi.fn((query: string) => ({
  matches: false, // Default to light mode and no reduced motion
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
});

// Also set on global for Framer Motion
global.matchMedia = mockMatchMedia;

// Mock ResizeObserver for Framer Motion
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  callback: ResizeObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// biome-ignore lint/suspicious/noExplicitAny: test environment requires global mock
global.ResizeObserver = MockResizeObserver as any;
// biome-ignore lint/suspicious/noExplicitAny: test environment requires global mock
(window as any).ResizeObserver = MockResizeObserver;
