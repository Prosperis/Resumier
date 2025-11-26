import { describe, expect, it } from "vitest";
import {
  type PersonalInfoFormData,
  personalInfoSchema,
  getFullName,
  formatPhoneDisplay,
} from "../personal-info";

describe("personalInfoSchema", () => {
  describe("Valid Data", () => {
    it("validates complete personal info", () => {
      const validData: PersonalInfoFormData = {
        firstName: "John",
        lastName: "Doe",
        nameOrder: "firstLast",
        email: "john@example.com",
        phone: "+15551234567",
        location: "New York, NY",
        summary: "Experienced software developer",
      };
      const result = personalInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates minimal required fields", () => {
      const minimalData = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "+15551234567",
        location: "NYC",
      };
      const result = personalInfoSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it("validates with empty summary", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
        summary: "",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with omitted summary", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with lastFirst name order", () => {
      const data = {
        firstName: "太郎",
        lastName: "田中",
        nameOrder: "lastFirst",
        email: "test@example.com",
        phone: "+815012345678",
        location: "Tokyo, Japan",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Name Validation", () => {
    it("requires at least one name field", () => {
      const data = {
        firstName: "",
        lastName: "",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "At least one name field is required",
        );
      }
    });

    it("accepts only first name", () => {
      const data = {
        firstName: "Madonna",
        lastName: "",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts only last name", () => {
      const data = {
        firstName: "",
        lastName: "Prince",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects first name longer than 50 characters", () => {
      const data = {
        firstName: "A".repeat(51),
        lastName: "Doe",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "First name must be less than 50 characters",
        );
      }
    });

    it("rejects last name longer than 50 characters", () => {
      const data = {
        firstName: "John",
        lastName: "A".repeat(51),
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Last name must be less than 50 characters",
        );
      }
    });

    it("accepts first name exactly at 50 characters", () => {
      const data = {
        firstName: "A".repeat(50),
        lastName: "Doe",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts names with special characters", () => {
      const data = {
        firstName: "Jean-Pierre",
        lastName: "O'Brien",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts names with unicode characters", () => {
      const data = {
        firstName: "José",
        lastName: "García",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects first name with invalid characters", () => {
      const data = {
        firstName: "John123",
        lastName: "Doe",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "First name contains invalid characters",
        );
      }
    });

    it("rejects last name with invalid characters", () => {
      const data = {
        firstName: "John",
        lastName: "Doe123",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Last name contains invalid characters",
        );
      }
    });

    it("accepts compound last names", () => {
      const data = {
        firstName: "Maria",
        lastName: "González-López",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Email Validation", () => {
    it("rejects empty email", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "",
        phone: "+15551234567",
        location: "Test City",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Email is required");
      }
    });

    it("rejects invalid email format", () => {
      const invalidEmails = [
        "notanemail",
        "@example.com",
        "test@",
        "test @example.com",
      ];

      invalidEmails.forEach((email) => {
        const result = personalInfoSchema.safeParse({
          firstName: "Test",
          lastName: "User",
          email,
          phone: "+15551234567",
          location: "City",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Please enter a valid email address",
          );
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
          firstName: "Test",
          lastName: "User",
          email,
          phone: "+15551234567",
          location: "City",
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Phone Validation", () => {
    it("rejects empty phone", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
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

    it("accepts valid E.164 phone numbers", () => {
      const validPhones = [
        "+15551234567", // US
        "+442071234567", // UK
        "+81312345678", // Japan
        "+8613912345678", // China
        "+33123456789", // France
      ];

      validPhones.forEach((phone) => {
        const result = personalInfoSchema.safeParse({
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone,
          location: "City",
        });
        expect(result.success).toBe(true);
      });
    });

    it("rejects phone numbers without + prefix", () => {
      const result = personalInfoSchema.safeParse({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "15551234567",
        location: "City",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid phone number",
        );
      }
    });

    it("rejects phone numbers with formatting characters", () => {
      const invalidPhones = [
        "(555) 123-4567",
        "555-123-4567",
        "+1 (555) 123-4567",
        "+1-555-123-4567",
      ];

      invalidPhones.forEach((phone) => {
        const result = personalInfoSchema.safeParse({
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone,
          location: "City",
        });
        expect(result.success).toBe(false);
      });
    });

    it("rejects phone numbers that are too short", () => {
      const result = personalInfoSchema.safeParse({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+1234",
        location: "City",
      });
      expect(result.success).toBe(false);
    });

    it("rejects phone numbers that are too long", () => {
      const result = personalInfoSchema.safeParse({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+12345678901234567890",
        location: "City",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Location Validation", () => {
    it("rejects empty location", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
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
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
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
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
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
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "+15551234567",
          location,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Summary Validation", () => {
    it("accepts summary up to 500 characters", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
        summary: "A".repeat(500),
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects summary longer than 500 characters", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
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
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
        summary: "Line 1\nLine 2\nLine 3",
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts summary with special characters", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
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

    it("strips extra unexpected fields", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
        unexpectedField: "value",
      };
      // Zod by default strips unknown keys, so this should still succeed
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("handles null values correctly", () => {
      const data = {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        location: null,
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("handles undefined values for optional fields", () => {
      const data = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+15551234567",
        location: "Test City",
        summary: undefined,
      };
      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe("getFullName", () => {
  it("composes name in firstLast order", () => {
    expect(getFullName("John", "Doe", "firstLast")).toBe("John Doe");
  });

  it("composes name in lastFirst order", () => {
    expect(getFullName("太郎", "田中", "lastFirst")).toBe("田中, 太郎");
  });

  it("handles empty first name", () => {
    expect(getFullName("", "Doe", "firstLast")).toBe("Doe");
  });

  it("handles empty last name", () => {
    expect(getFullName("John", "", "firstLast")).toBe("John");
  });

  it("handles both empty names", () => {
    expect(getFullName("", "", "firstLast")).toBe("");
  });

  it("trims whitespace", () => {
    expect(getFullName("  John  ", "  Doe  ", "firstLast")).toBe("John Doe");
  });

  it("defaults to firstLast order", () => {
    expect(getFullName("John", "Doe")).toBe("John Doe");
  });
});

describe("formatPhoneDisplay", () => {
  it("formats US phone number in national format (default)", () => {
    expect(formatPhoneDisplay("+15551234567")).toBe("(555) 123-4567");
  });

  it("formats US phone number in national format", () => {
    expect(formatPhoneDisplay("+15551234567", "national")).toBe(
      "(555) 123-4567",
    );
  });

  it("formats US phone number in international format", () => {
    expect(formatPhoneDisplay("+15551234567", "international")).toBe(
      "+1 555 123 4567",
    );
  });

  it("formats US phone number in E.164 format", () => {
    expect(formatPhoneDisplay("+15551234567", "e164")).toBe("+15551234567");
  });

  it("formats UK phone number in national format", () => {
    expect(formatPhoneDisplay("+442071234567", "national")).toBe("020 7123 4567");
  });

  it("formats UK phone number in international format", () => {
    expect(formatPhoneDisplay("+442071234567", "international")).toBe(
      "+44 20 7123 4567",
    );
  });

  it("returns empty string for undefined", () => {
    expect(formatPhoneDisplay(undefined)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(formatPhoneDisplay("")).toBe("");
  });

  it("returns original value if parsing fails", () => {
    expect(formatPhoneDisplay("invalid")).toBe("invalid");
  });
});
