/**
 * Test utilities with vi.mocked() polyfill
 * Import { vi } from this file instead of from 'vitest' directly
 */
import * as vitestExports from "vitest";

// Get the vi object
const { vi: vitestVi } = vitestExports;

// Add vi.mocked() polyfill if it doesn't exist
if (!("mocked" in vitestVi)) {
  (vitestVi as any).mocked = function mocked<T>(item: T): T {
    return item as any;
  };
}

// Add vi.clearAllMocks() polyfill if it doesn't exist
if (!("clearAllMocks" in vitestVi)) {
  // In Vitest 1.6.1, clearAllMocks doesn't exist but restoreAllMocks does
  // Use restoreAllMocks as a polyfill
  (vitestVi as any).clearAllMocks = function clearAllMocks() {
    if (
      "restoreAllMocks" in vitestVi &&
      typeof (vitestVi as any).restoreAllMocks === "function"
    ) {
      return (vitestVi as any).restoreAllMocks();
    }
    return;
  };
}

// Export the enhanced vi
export const vi = vitestVi;

// Re-export specific items from vitest for convenience
export const {
  describe,
  it,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} = vitestExports;

// Add standalone clearAllMocks export that doesn't cause hoisting issues
export const clearAllMocks = () => {
  if (
    "restoreAllMocks" in vitestVi &&
    typeof (vitestVi as any).restoreAllMocks === "function"
  ) {
    return (vitestVi as any).restoreAllMocks();
  }
  return;
};
