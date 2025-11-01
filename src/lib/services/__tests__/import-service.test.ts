import { describe, expect, it } from "vitest";
import {
  importFromJSON,
  importFromLinkedIn,
} from "../../services/import-service";

describe("Import Service", () => {
  describe("importFromLinkedIn", () => {
    it("validates LinkedIn URL", async () => {
      const result = await importFromLinkedIn("https://example.com");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid LinkedIn URL");
    });

    it("accepts valid LinkedIn URL", async () => {
      const result = await importFromLinkedIn(
        "https://www.linkedin.com/in/username",
      );
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.personalInfo).toBeDefined();
    });

    it("returns mock data structure", async () => {
      const result = await importFromLinkedIn(
        "https://www.linkedin.com/in/username",
      );

      if (result.success && result.data) {
        expect(result.data.personalInfo?.name).toBeDefined();
        expect(result.data.experience).toBeDefined();
        expect(result.data.education).toBeDefined();
        expect(result.data.skills).toBeDefined();
      }
    });
  });

  describe("importFromJSON", () => {
    it("parses valid resume JSON", async () => {
      const validData = {
        personalInfo: {
          name: "Test User",
          email: "test@example.com",
          phone: "123-456-7890",
          location: "Test City",
          summary: "Test summary",
        },
        experience: [],
        education: [],
        skills: {
          technical: [],
          languages: [],
          tools: [],
          soft: [],
        },
        certifications: [],
        links: [],
      };

      const blob = new Blob([JSON.stringify(validData)], {
        type: "application/json",
      });
      const file = new File([blob], "resume.json", {
        type: "application/json",
      });

      const result = await importFromJSON(file);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.personalInfo?.name).toBe("Test User");
    });

    it("handles nested content object", async () => {
      const validData = {
        content: {
          personalInfo: {
            name: "Test User",
            email: "test@example.com",
            phone: "123-456-7890",
            location: "Test City",
            summary: "Test summary",
          },
        },
      };

      const blob = new Blob([JSON.stringify(validData)], {
        type: "application/json",
      });
      const file = new File([blob], "resume.json", {
        type: "application/json",
      });

      const result = await importFromJSON(file);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("rejects invalid JSON format", async () => {
      const invalidData = {
        notAResume: true,
      };

      const blob = new Blob([JSON.stringify(invalidData)], {
        type: "application/json",
      });
      const file = new File([blob], "invalid.json", {
        type: "application/json",
      });

      const result = await importFromJSON(file);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid resume format");
    });

    it("handles malformed JSON", async () => {
      const blob = new Blob(["{ invalid json }"], {
        type: "application/json",
      });
      const file = new File([blob], "malformed.json", {
        type: "application/json",
      });

      const result = await importFromJSON(file);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
