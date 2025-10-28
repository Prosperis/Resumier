/**
 * Security Utilities
 *
 * Provides functions for input sanitization, validation, and security best practices.
 * Used throughout the application to prevent XSS, injection attacks, and other vulnerabilities.
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes dangerous HTML tags and attributes
 */
export function sanitizeHtml(input: string): string {
  if (!input) return ""

  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "")

  // Remove javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, "")

  // Remove data: protocols (except for images)
  sanitized = sanitized.replace(/data:(?!image)/gi, "")

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")

  // Remove object and embed tags
  sanitized = sanitized.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "")

  return sanitized.trim()
}

/**
 * Sanitize user input for safe display
 * Converts special characters to HTML entities
 */
export function sanitizeText(input: string): string {
  if (!input) return ""

  // Use a map for HTML entity conversion (works in both browser and Node.js)
  const entityMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
  }

  return input.replace(/[&<>"'/]/g, (char) => entityMap[char] || char)
}

/**
 * Validate and sanitize URL
 * Ensures URL is safe and uses allowed protocols
 */
export function sanitizeUrl(url: string): string {
  if (!url) return ""

  try {
    const parsed = new URL(url)

    // Only allow safe protocols
    const allowedProtocols = ["http:", "https:", "mailto:", "tel:"]
    if (!allowedProtocols.includes(parsed.protocol)) {
      return ""
    }

    return parsed.toString()
  } catch {
    // Invalid URL
    return ""
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false

  // RFC 5322 compliant regex (simplified)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format (international)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false

  // Remove spaces, dashes, parentheses for validation
  const cleaned = phone.replace(/[\s\-()]/g, "")

  // Must start with + (optional) followed by 7-15 digits
  const phoneRegex = /^\+?[1-9]\d{6,14}$/
  return phoneRegex.test(cleaned)
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return "unnamed"

  // Remove path separators
  let sanitized = filename.replace(/[/\\]/g, "")

  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, "")

  // Remove control characters (0-31) by filtering each character
  sanitized = sanitized
    .split("")
    .filter((char) => char.charCodeAt(0) > 31)
    .join("")

  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, "")

  // If empty after sanitization, return default
  if (!sanitized) return "unnamed"

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split(".").pop()
    const name = sanitized.slice(0, 255 - (ext?.length || 0) - 1)
    sanitized = ext ? `${name}.${ext}` : name
  }

  return sanitized
}

/**
 * Rate limiting helper
 * Tracks function calls and prevents excessive requests
 */
export class RateLimiter {
  private calls: Map<string, number[]> = new Map()

  /**
   * Check if action is allowed
   * @param key - Unique identifier for the action
   * @param maxCalls - Maximum number of calls allowed
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(key: string, maxCalls: number, windowMs: number): boolean {
    const now = Date.now()
    const calls = this.calls.get(key) || []

    // Remove old calls outside the window
    const recentCalls = calls.filter((time) => now - time < windowMs)

    if (recentCalls.length >= maxCalls) {
      return false
    }

    // Add current call
    recentCalls.push(now)
    this.calls.set(key, recentCalls)

    // Cleanup old entries periodically
    if (this.calls.size > 1000) {
      this.cleanup(windowMs)
    }

    return true
  }

  /**
   * Clean up old entries
   */
  private cleanup(windowMs: number): void {
    const now = Date.now()
    for (const [key, calls] of this.calls.entries()) {
      const recentCalls = calls.filter((time) => now - time < windowMs)
      if (recentCalls.length === 0) {
        this.calls.delete(key)
      } else {
        this.calls.set(key, recentCalls)
      }
    }
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.calls.delete(key)
  }

  /**
   * Clear all rate limits
   */
  clear(): void {
    this.calls.clear()
  }
}

/**
 * Global rate limiter instance
 */
export const globalRateLimiter = new RateLimiter()

/**
 * Secure random string generator
 * Uses crypto API for cryptographically secure randomness
 */
export function generateSecureToken(length = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Hash string using SHA-256
 * Useful for client-side integrity checks (not for passwords!)
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Validate content length to prevent DoS
 */
export function validateContentLength(content: string, maxLength: number): boolean {
  return content.length <= maxLength
}

/**
 * Detect and prevent ReDoS (Regular Expression Denial of Service)
 * Checks if regex execution takes too long
 */
export function safeRegexTest(pattern: RegExp, input: string, timeoutMs = 100): boolean {
  const start = Date.now()

  try {
    // Set a timeout
    const timer = setTimeout(() => {
      throw new Error("Regex timeout")
    }, timeoutMs)

    const result = pattern.test(input)
    clearTimeout(timer)

    const duration = Date.now() - start
    if (duration > timeoutMs / 2) {
      console.warn(`Slow regex execution: ${duration}ms`)
    }

    return result
  } catch (error) {
    console.error("Regex execution failed:", error)
    return false
  }
}

/**
 * Security headers validation
 * Check if CSP and other security headers are present
 */
export function validateSecurityHeaders(headers: Headers): {
  valid: boolean
  missing: string[]
  warnings: string[]
} {
  const requiredHeaders = ["content-security-policy", "x-frame-options", "x-content-type-options"]

  const recommendedHeaders = ["strict-transport-security", "referrer-policy", "permissions-policy"]

  const missing: string[] = []
  const warnings: string[] = []

  for (const header of requiredHeaders) {
    if (!headers.has(header)) {
      missing.push(header)
    }
  }

  for (const header of recommendedHeaders) {
    if (!headers.has(header)) {
      warnings.push(header)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  }
}
