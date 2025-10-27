import { describe, it, expect } from "vitest"
import { personalInfoSchema } from "./personal-info"

describe("personalInfoSchema", () => {
  describe("valid data", () => {
    it("accepts valid personal info with all fields", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "555-0100",
        location: "San Francisco, CA",
        summary: "Experienced software engineer",
      }

      const result = personalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it("accepts valid personal info without optional summary", () => {
      const validData = {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "555-0200",
        location: "New York, NY",
      }

      const result = personalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts empty string for summary", () => {
      const validData = {
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "555-0300",
        location: "Austin, TX",
        summary: "",
      }

      const result = personalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts complex email formats", () => {
      const complexEmails = [
        "user+tag@example.com",
        "user.name@example.co.uk",
        "user_name@example-domain.com",
      ]

      for (const email of complexEmails) {
        const result = personalInfoSchema.safeParse({
          name: "Test User",
          email,
          phone: "555-0100",
          location: "Test City",
        })
        expect(result.success).toBe(true)
      }
    })
  })

  describe("name validation", () => {
    it("rejects empty name", () => {
      const invalidData = {
        name: "",
        email: "test@example.com",
        phone: "555-0100",
        location: "Test City",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name is required")
      }
    })

    it("rejects missing name", () => {
      const invalidData = {
        email: "test@example.com",
        phone: "555-0100",
        location: "Test City",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("rejects name longer than 100 characters", () => {
      const invalidData = {
        name: "A".repeat(101),
        email: "test@example.com",
        phone: "555-0100",
        location: "Test City",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name must be less than 100 characters")
      }
    })

    it("accepts name with exactly 100 characters", () => {
      const validData = {
        name: "A".repeat(100),
        email: "test@example.com",
        phone: "555-0100",
        location: "Test City",
      }

      const result = personalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("email validation", () => {
    it("rejects empty email", () => {
      const invalidData = {
        name: "Test User",
        email: "",
        phone: "555-0100",
        location: "Test City",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        // Empty string fails email validation first
        expect(result.error.issues[0].message).toBe("Invalid email address")
      }
    })

    it("rejects invalid email formats", () => {
      const invalidEmails = [
        "notanemail",
        "@example.com",
        "user@",
        "user @example.com",
        "user@.com",
      ]

      for (const email of invalidEmails) {
        const result = personalInfoSchema.safeParse({
          name: "Test User",
          email,
          phone: "555-0100",
          location: "Test City",
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Invalid email address")
        }
      }
    })

    it("rejects missing email", () => {
      const invalidData = {
        name: "Test User",
        phone: "555-0100",
        location: "Test City",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("phone validation", () => {
    it("rejects empty phone", () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        phone: "",
        location: "Test City",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Phone number is required")
      }
    })

    it("rejects missing phone", () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        location: "Test City",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("accepts various phone formats", () => {
      const phoneFormats = [
        "555-0100",
        "(555) 010-0100",
        "+1-555-010-0100",
        "555.010.0100",
        "5550100100",
      ]

      for (const phone of phoneFormats) {
        const result = personalInfoSchema.safeParse({
          name: "Test User",
          email: "test@example.com",
          phone,
          location: "Test City",
        })
        expect(result.success).toBe(true)
      }
    })
  })

  describe("location validation", () => {
    it("rejects empty location", () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0100",
        location: "",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Location is required")
      }
    })

    it("rejects missing location", () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0100",
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("rejects location longer than 100 characters", () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0100",
        location: "A".repeat(101),
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Location must be less than 100 characters")
      }
    })

    it("accepts location with exactly 100 characters", () => {
      const validData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0100",
        location: "A".repeat(100),
      }

      const result = personalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("summary validation", () => {
    it("rejects summary longer than 500 characters", () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0100",
        location: "Test City",
        summary: "A".repeat(501),
      }

      const result = personalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Summary must be less than 500 characters")
      }
    })

    it("accepts summary with exactly 500 characters", () => {
      const validData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0100",
        location: "Test City",
        summary: "A".repeat(500),
      }

      const result = personalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts multiline summary", () => {
      const validData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0100",
        location: "Test City",
        summary: "Line 1\nLine 2\nLine 3",
      }

      const result = personalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
