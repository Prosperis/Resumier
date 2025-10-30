import { beforeEach, describe, expect, it } from "vitest";
import {
  generateSecureToken,
  globalRateLimiter,
  hashString,
  isValidEmail,
  isValidPhone,
  RateLimiter,
  sanitizeFilename,
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  validateContentLength,
  validateSecurityHeaders,
} from "../index";

describe("Security Utilities", () => {
  describe("sanitizeHtml", () => {
    it("removes script tags", () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain("<script>");
      expect(result).toContain("<p>Hello</p>");
    });

    it("removes event handlers", () => {
      const input = "<div onclick=\"alert('xss')\">Click me</div>";
      const result = sanitizeHtml(input);
      expect(result).not.toContain("onclick");
    });

    it("removes javascript: protocols", () => {
      const input = "<a href=\"javascript:alert('xss')\">Link</a>";
      const result = sanitizeHtml(input);
      expect(result).not.toContain("javascript:");
    });

    it("removes iframe tags", () => {
      const input = '<iframe src="evil.com"></iframe>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain("<iframe");
    });

    it("handles empty input", () => {
      expect(sanitizeHtml("")).toBe("");
      expect(sanitizeHtml(null as any)).toBe("");
    });
  });

  describe("sanitizeText", () => {
    it("converts HTML entities", () => {
      const input = "<script>alert('xss')</script>";
      const result = sanitizeText(input);
      expect(result).toContain("&lt;");
      expect(result).toContain("&gt;");
      expect(result).not.toContain("<script>");
    });

    it("handles special characters", () => {
      const input = "& < > \" '";
      const result = sanitizeText(input);
      expect(result).toContain("&amp;");
      expect(result).toContain("&lt;");
      expect(result).toContain("&gt;");
    });
  });

  describe("sanitizeUrl", () => {
    it("allows safe protocols", () => {
      expect(sanitizeUrl("https://example.com")).toBe("https://example.com/");
      expect(sanitizeUrl("http://example.com")).toBe("http://example.com/");
      expect(sanitizeUrl("mailto:test@example.com")).toBe(
        "mailto:test@example.com",
      );
    });

    it("blocks dangerous protocols", () => {
      expect(sanitizeUrl("javascript:alert('xss')")).toBe("");
      expect(sanitizeUrl("data:text/html,<script>alert('xss')</script>")).toBe(
        "",
      );
      expect(sanitizeUrl("file:///etc/passwd")).toBe("");
    });

    it("handles invalid URLs", () => {
      expect(sanitizeUrl("not a url")).toBe("");
      expect(sanitizeUrl("")).toBe("");
    });
  });

  describe("isValidEmail", () => {
    it("validates correct emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user+tag@domain.co.uk")).toBe(true);
      expect(isValidEmail("first.last@example.com")).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(isValidEmail("not-an-email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("validates correct phone numbers", () => {
      expect(isValidPhone("+1234567890")).toBe(true);
      expect(isValidPhone("+44 20 7946 0958")).toBe(true);
      expect(isValidPhone("(555) 123-4567")).toBe(true);
    });

    it("rejects invalid phone numbers", () => {
      expect(isValidPhone("123")).toBe(false);
      expect(isValidPhone("abc")).toBe(false);
      expect(isValidPhone("")).toBe(false);
    });
  });

  describe("sanitizeFilename", () => {
    it("removes path separators", () => {
      expect(sanitizeFilename("../../etc/passwd")).not.toContain("/");
      expect(sanitizeFilename("..\\..\\windows\\system32")).not.toContain("\\");
    });

    it("removes dangerous characters", () => {
      const result = sanitizeFilename('file<>:"|?*name.txt');
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
      expect(result).not.toContain(":");
      expect(result).not.toContain("|");
    });

    it("handles long filenames", () => {
      const longName = `${"a".repeat(300)}.txt`;
      const result = sanitizeFilename(longName);
      expect(result.length).toBeLessThanOrEqual(255);
      expect(result).toContain(".txt");
    });

    it("returns default for empty input", () => {
      expect(sanitizeFilename("")).toBe("unnamed");
      expect(sanitizeFilename("...")).toBe("unnamed");
    });
  });

  describe("RateLimiter", () => {
    let limiter: RateLimiter;

    beforeEach(() => {
      limiter = new RateLimiter();
    });

    it("allows calls within limit", () => {
      expect(limiter.isAllowed("test", 3, 1000)).toBe(true);
      expect(limiter.isAllowed("test", 3, 1000)).toBe(true);
      expect(limiter.isAllowed("test", 3, 1000)).toBe(true);
    });

    it("blocks calls exceeding limit", () => {
      limiter.isAllowed("test", 2, 1000);
      limiter.isAllowed("test", 2, 1000);
      expect(limiter.isAllowed("test", 2, 1000)).toBe(false);
    });

    it("resets after time window", async () => {
      limiter.isAllowed("test", 2, 100);
      limiter.isAllowed("test", 2, 100);
      expect(limiter.isAllowed("test", 2, 100)).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(limiter.isAllowed("test", 2, 100)).toBe(true);
    });

    it("tracks different keys independently", () => {
      limiter.isAllowed("key1", 1, 1000);
      limiter.isAllowed("key2", 1, 1000);

      expect(limiter.isAllowed("key1", 1, 1000)).toBe(false);
      expect(limiter.isAllowed("key2", 1, 1000)).toBe(false);
      expect(limiter.isAllowed("key3", 1, 1000)).toBe(true);
    });

    it("can reset specific key", () => {
      limiter.isAllowed("test", 1, 1000);
      expect(limiter.isAllowed("test", 1, 1000)).toBe(false);

      limiter.reset("test");
      expect(limiter.isAllowed("test", 1, 1000)).toBe(true);
    });

    it("can clear all limits", () => {
      limiter.isAllowed("key1", 1, 1000);
      limiter.isAllowed("key2", 1, 1000);

      limiter.clear();

      expect(limiter.isAllowed("key1", 1, 1000)).toBe(true);
      expect(limiter.isAllowed("key2", 1, 1000)).toBe(true);
    });
  });

  describe("generateSecureToken", () => {
    it("generates tokens of correct length", () => {
      const token = generateSecureToken(16);
      expect(token).toHaveLength(32); // 16 bytes = 32 hex chars
    });

    it("generates unique tokens", () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });

    it("generates hex strings", () => {
      const token = generateSecureToken();
      expect(token).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe("hashString", () => {
    it("generates consistent hashes", async () => {
      const hash1 = await hashString("test");
      const hash2 = await hashString("test");
      expect(hash1).toBe(hash2);
    });

    it("generates different hashes for different inputs", async () => {
      const hash1 = await hashString("test1");
      const hash2 = await hashString("test2");
      expect(hash1).not.toBe(hash2);
    });

    it("generates 64-character hex strings", async () => {
      const hash = await hashString("test");
      expect(hash).toHaveLength(64); // SHA-256 = 32 bytes = 64 hex chars
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe("validateContentLength", () => {
    it("accepts content within limit", () => {
      expect(validateContentLength("short", 10)).toBe(true);
      expect(validateContentLength("exact", 5)).toBe(true);
    });

    it("rejects content exceeding limit", () => {
      expect(validateContentLength("too long", 5)).toBe(false);
      expect(validateContentLength("x".repeat(1001), 1000)).toBe(false);
    });
  });

  describe("validateSecurityHeaders", () => {
    it("validates required headers", () => {
      const headers = new Headers({
        "content-security-policy": "default-src 'self'",
        "x-frame-options": "DENY",
        "x-content-type-options": "nosniff",
      });

      const result = validateSecurityHeaders(headers);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it("detects missing required headers", () => {
      const headers = new Headers({
        "x-frame-options": "DENY",
      });

      const result = validateSecurityHeaders(headers);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain("content-security-policy");
      expect(result.missing).toContain("x-content-type-options");
    });

    it("warns about missing recommended headers", () => {
      const headers = new Headers({
        "content-security-policy": "default-src 'self'",
        "x-frame-options": "DENY",
        "x-content-type-options": "nosniff",
      });

      const result = validateSecurityHeaders(headers);
      expect(result.warnings).toContain("strict-transport-security");
      expect(result.warnings).toContain("referrer-policy");
    });
  });

  describe("globalRateLimiter", () => {
    it("is a singleton instance", () => {
      expect(globalRateLimiter).toBeInstanceOf(RateLimiter);
    });
  });
});
