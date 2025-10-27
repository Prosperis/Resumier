/**
 * Test Utilities
 * Common test helpers, mocks, and utilities
 */

import type { RenderOptions } from "@testing-library/react"
import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { vi } from "vitest"

/**
 * Custom render function with providers
 * Extend this as needed with theme providers, query providers, etc.
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { ...options })
}

/**
 * Mock Zustand store for testing
 * Use this to create a clean store instance for each test
 */
export function createMockStore<T extends object>(initialState: T) {
  let state = initialState

  return {
    getState: () => state,
    setState: (partial: Partial<T>) => {
      state = { ...state, ...partial }
    },
    subscribe: vi.fn(),
    destroy: () => {
      state = initialState
    },
  }
}

/**
 * Reset a Zustand store to its initial state
 */
export function resetStore<T>(store: {
  setState: (state: Partial<T> | ((state: T) => Partial<T>)) => void
  getState: () => T
}) {
  const initialState = store.getState()
  store.setState(initialState)
}

// Re-export common testing utilities
export * from "@testing-library/react"
export { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
