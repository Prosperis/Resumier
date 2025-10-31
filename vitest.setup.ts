/**
 * Vitest Environment Setup
 * Runs before setupTests.ts to configure global mocks for Framer Motion
 */

// Setup fake-indexeddb FIRST before any other imports
import "fake-indexeddb/auto"
import { IDBFactory } from "fake-indexeddb"

// Ensure indexedDB is available on ALL global scopes
const idb = new IDBFactory()
globalThis.indexedDB = idb
window.indexedDB = idb
global.indexedDB = idb

// Mock localStorage and sessionStorage if not available (jsdom should provide these, but ensure they exist)
class LocalStorageMock implements Storage {
  private store: Map<string, string> = new Map()
  
  get length(): number {
    return this.store.size
  }
  
  clear(): void {
    this.store.clear()
  }
  
  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }
  
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }
  
  removeItem(key: string): void {
    this.store.delete(key)
  }
  
  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }
}

// Ensure localStorage exists in all environments (even if jsdom provides it, ensure it's available)
if (typeof global !== 'undefined') {
  if (typeof global.localStorage === 'undefined') {
    global.localStorage = new LocalStorageMock()
  }
  if (typeof global.sessionStorage === 'undefined') {
    global.sessionStorage = new LocalStorageMock()
  }
  // Also ensure it's on globalThis
  if (typeof (globalThis as any).localStorage === 'undefined') {
    (globalThis as any).localStorage = global.localStorage
  }
  if (typeof (globalThis as any).sessionStorage === 'undefined') {
    (globalThis as any).sessionStorage = global.sessionStorage
  }
}

// Make localStorage and sessionStorage available globally without needing window prefix
if (typeof window !== 'undefined') {
  if (!window.localStorage) {
    window.localStorage = new LocalStorageMock()
  }
  if (!window.sessionStorage) {
    window.sessionStorage = new LocalStorageMock()
  }
  // Make them available as bare globals too
  ;(global as any).localStorage = window.localStorage
  ;(global as any).sessionStorage = window.sessionStorage
}

// Extend vitest expect with jest-dom matchers
import * as matchers from "@testing-library/jest-dom/matchers"
import { expect as vitestExpect, vi } from "vitest"

// Polyfill vi.mocked() - this function doesn't exist in standard Vitest
// It's used throughout the test suite for type-safe mocking
(vi as any).mocked = function mocked<T>(item: T): T {
  return item as any
}

// FORCE polyfill vi.clearAllMocks() - it appears to exist but isn't callable
// This is a known issue in some Vitest versions
const originalClearAllMocks = (vi as any).clearAllMocks
;(vi as any).clearAllMocks = function clearAllMocks() {
  if (typeof originalClearAllMocks === 'function') {
    return originalClearAllMocks.call(vi)
  }
  // Fallback: use resetAllMocks which definitely works
  return vi.resetAllMocks()
}

// Extend the imported expect
vitestExpect.extend(matchers)

// Also extend the global expect (when globals: true)
if (typeof (globalThis as any).expect !== "undefined") {
  // @ts-expect-error - jest-dom matchers aren't typed for vitest expect
  (globalThis as any).expect.extend(matchers)
}

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

// Mock ResizeObserver for Framer Motion and components
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  callback: ResizeObserverCallback
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

// Mock document methods for Framer Motion
if (!document.addEventListener) {
  document.addEventListener = () => {}
}
if (!document.removeEventListener) {
  document.removeEventListener = () => {}
}
