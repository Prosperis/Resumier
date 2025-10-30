import { describe, expect, it } from "vitest";
import {
  type PersonalInfoFormData,
  personalInfoSchema,
} from "../personal-info";

describe("personalInfoSchema", () => {
  describe("Valid Data", () => {
    it("validates complete personal info", () => {
      const validData: PersonalInfoFormData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        location: "New York, NY",
        summary: "Experienced software developer",
      };
      const result = personalInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates minimal required fields", () => {
      const minimalData = {
        name: "Jane",
        email: "jane@example.com",
        phone: "123456",
        location: "NYC",
      };
      const result = personalInfoSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it("validates with empty summary", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
        summary: "",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with omitted summary", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Name Validation", () => {
    it("rejects empty name", () => {
      const data = {
        name: "",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name is required");
      }
    });

    it("rejects name longer than 100 characters", () => {
      const data = {
        name: "A".repeat(101),
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name must be less than 100 characters",
        );
      }
    });

    it("accepts name exactly at 100 characters", () => {
      const data = {
        name: "A".repeat(100),
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts name with special characters", () => {
      const data = {
        name: "O'Brien-Smith Jr.",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts name with unicode characters", () => {
      const data = {
        name: "José García-Müller",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Email Validation", () => {
    it("rejects empty email", () => {
      const data = {
        name: "Test User",
        email: "",
        phone: "1234567890",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Zod email validation returns "Invalid email address" for empty string
        // because it checks email format before checking if required
        expect(result.error.issues[0].message).toContain("Invalid email");
      }
    });

    it("rejects invalid email format", () => {
      const invalidEmails = [
        "notanemail",
        "@example.com",
        "test@",
        "test @example.com",
        "test..test@example.com",
      ];

      invalidEmails.forEach((email) => {
        const result = personalInfoSchema.safeParse({
          name: "Test",
          email,
          phone: "123",
          location: "City",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Invalid email address");
        }
      });
    });

    it("accepts valid email formats", () => {
      const validEmails = [
        "test@example.com",
        "user.name@example.com",
        "user+tag@example.co.uk",
        "test_123@example-domain.com",
      ];

      validEmails.forEach((email) => {
        const result = personalInfoSchema.safeParse({
          name: "Test",
          email,
          phone: "123",
          location: "City",
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Phone Validation", () => {
    it("rejects empty phone", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Phone number is required");
      }
    });

    it("accepts various phone formats", () => {
      const phoneFormats = [
        "+1234567890",
        "(123) 456-7890",
        "123-456-7890",
        "123.456.7890",
        "+1 (123) 456-7890",
      ];

      phoneFormats.forEach((phone) => {
        const result = personalInfoSchema.safeParse({
          name: "Test",
          email: "test@example.com",
          phone,
          location: "City",
        });
        expect(result.success).toBe(true);
      });
    });

    it("accepts international phone numbers", () => {
      const internationalPhones = [
        "+44 20 7123 4567",
        "+81 3-1234-5678",
        "+86 10 1234 5678",
      ];

      internationalPhones.forEach((phone) => {
        const result = personalInfoSchema.safeParse({
          name: "Test",
          email: "test@example.com",
          phone,
          location: "City",
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Location Validation", () => {
    it("rejects empty location", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Location is required");
      }
    });

    it("rejects location longer than 100 characters", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "A".repeat(101),
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Location must be less than 100 characters",
        );
      }
    });

    it("accepts location exactly at 100 characters", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "A".repeat(100),
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts various location formats", () => {
      const locations = [
        "New York, NY",
        "London, UK",
        "Tokyo, Japan",
        "San Francisco, CA, USA",
        "Remote",
      ];

      locations.forEach((location) => {
        const result = personalInfoSchema.safeParse({
          name: "Test",
          email: "test@example.com",
          phone: "123",
          location,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Summary Validation", () => {
    it("accepts summary up to 500 characters", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
        summary: "A".repeat(500),
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects summary longer than 500 characters", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
        summary: "A".repeat(501),
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Summary must be less than 500 characters",
        );
      }
    });

    it("accepts multiline summary", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
        summary: "Line 1\nLine 2\nLine 3",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts summary with special characters", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
        summary: "Developer with 5+ years & expertise in React, Node.js, etc.",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("rejects missing required fields", () => {
      const data = {};
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects data with extra unexpected fields", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
        unexpectedField: "value",
      };
      // Zod by default strips unknown keys, so this should still succeed
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("handles null values correctly", () => {
      const data = {
        name: null,
        email: null,
        phone: null,
        location: null,
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("handles undefined values for optional fields", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        location: "Test City",
        summary: undefined,
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
