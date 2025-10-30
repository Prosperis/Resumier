/**
 * Enhanced console utilities for better development experience
 * Uses appropriate console methods for different log types
 */

const isDev = import.meta.env.DEV

/**
 * Debug-level logging - only in development
 * Use for detailed diagnostic information
 */
export const debug = (...args: unknown[]): void => {
  if (isDev) {
    console.debug(...args)
  }
}

/**
 * Info-level logging - only in development
 * Use for general informational messages
 */
export const info = (...args: unknown[]): void => {
  if (isDev) {
    console.info(...args)
  }
}

/**
 * Warning-level logging
 * Use for potentially harmful situations
 */
export const warn = (...args: unknown[]): void => {
  console.warn(...args)
}

/**
 * Error-level logging
 * Use for error events
 */
export const error = (...args: unknown[]): void => {
  console.error(...args)
}

/**
 * Table display - only in development
 * Use for displaying tabular data
 */
export const table = (data: unknown): void => {
  if (isDev) {
    console.table(data)
  }
}

/**
 * Group logging - only in development
 * Use for grouping related logs
 */
export const group = (label: string): void => {
  if (isDev) {
    console.group(label)
  }
}

/**
 * Collapsed group - only in development
 * Use for grouping related logs (collapsed by default)
 */
export const groupCollapsed = (label: string): void => {
  if (isDev) {
    console.groupCollapsed(label)
  }
}

/**
 * End group - only in development
 */
export const groupEnd = (): void => {
  if (isDev) {
    console.groupEnd()
  }
}

/**
 * Time measurement - only in development
 * Use for performance timing
 */
export const time = (label: string): void => {
  if (isDev) {
    console.time(label)
  }
}

/**
 * Time measurement end - only in development
 */
export const timeEnd = (label: string): void => {
  if (isDev) {
    console.timeEnd(label)
  }
}

/**
 * Time log - only in development
 * Logs intermediate time
 */
export const timeLog = (label: string, ...args: unknown[]): void => {
  if (isDev) {
    console.timeLog(label, ...args)
  }
}

/**
 * Trace logging - only in development
 * Use for stack trace output
 */
export const trace = (...args: unknown[]): void => {
  if (isDev) {
    console.trace(...args)
  }
}

/**
 * Assert - logs error if condition is false
 */
export const assert = (condition: boolean, ...args: unknown[]): void => {
  console.assert(condition, ...args)
}

/**
 * Count - only in development
 * Use for counting occurrences
 */
export const count = (label?: string): void => {
  if (isDev) {
    console.count(label)
  }
}

/**
 * Count reset - only in development
 */
export const countReset = (label?: string): void => {
  if (isDev) {
    console.countReset(label)
  }
}

/**
 * Clear console - only in development
 */
export const clear = (): void => {
  if (isDev) {
    console.clear()
  }
}

/**
 * Pretty print an object - only in development
 */
export const dir = (item: unknown, options?: unknown): void => {
  if (isDev) {
    console.dir(item, options)
  }
}

/**
 * Styled console output - only in development
 */
export const styled = (message: string, styles: string): void => {
  if (isDev) {
    console.log(`%c${message}`, styles)
  }
}

/**
 * Success message - only in development
 */
export const success = (message: string, ...args: unknown[]): void => {
  if (isDev) {
    console.log(`%c✓ ${message}`, "color: #10b981; font-weight: bold", ...args)
  }
}

/**
 * Performance marker - only in development
 */
export const perf = (label: string, startTime: number): void => {
  if (isDev) {
    const duration = performance.now() - startTime
    console.log(
      `%c⚡ ${label}`,
      "color: #f59e0b; font-weight: bold",
      `${duration.toFixed(2)}ms`,
    )
  }
}

// Export as default object for easier importing
export default {
  debug,
  info,
  warn,
  error,
  table,
  group,
  groupCollapsed,
  groupEnd,
  time,
  timeEnd,
  timeLog,
  trace,
  assert,
  count,
  countReset,
  clear,
  dir,
  styled,
  success,
  perf,
}
