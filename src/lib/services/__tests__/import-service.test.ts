import { vi } from "vitest";
import { importFromJSON, importFromLinkedIn } from "../import-service";

// Mock the API client
vi.mock("@/lib/api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

// Helper to create a mock File with text() method
function createMockFile(content: string, name: string): File {
  const file = {
    name,
    text: () => Promise.resolve(content),
  } as unknown as File;
  return file;
}

describe("Import Service", () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("importFromLinkedIn", () => {
    it("validates LinkedIn URL", async () => {
      const result = await importFromLinkedIn("https://example.com");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Please enter a valid LinkedIn profile URL");
    });

    it("returns error when no data or URL provided", async () => {
      const result = await importFromLinkedIn();
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "No LinkedIn data found. Please use the OAuth flow or provide a profile URL.",
      );
    });

    it("retrieves data from sessionStorage when OAuth completed", async () => {
      const mockData = {
        personalInfo: {
          name: "Test User",
          email: "test@example.com",
        },
        experience: [{ company: "Test Co" }],
        education: [],
        skills: { technical: ["JavaScript"] },
      };

      sessionStorage.setItem("linkedin_import_data", JSON.stringify(mockData));
      sessionStorage.setItem("linkedin_import_state", "completed");

      const result = await importFromLinkedIn();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.personalInfo?.name).toBe("Test User");

      // Verify sessionStorage was cleared
      expect(sessionStorage.getItem("linkedin_import_data")).toBeNull();
      expect(sessionStorage.getItem("linkedin_import_state")).toBeNull();
    });

    it("returns error when OAuth data is empty", async () => {
      const emptyData = {};

      sessionStorage.setItem("linkedin_import_data", JSON.stringify(emptyData));
      sessionStorage.setItem("linkedin_import_state", "completed");

      const result = await importFromLinkedIn();

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "LinkedIn data appears to be empty. Please try again.",
      );
    });

    it("returns error when sessionStorage data is invalid JSON", async () => {
      sessionStorage.setItem("linkedin_import_data", "not valid json");
      sessionStorage.setItem("linkedin_import_state", "completed");

      const result = await importFromLinkedIn();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to parse LinkedIn import data");
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

      const file = createMockFile(JSON.stringify(validData), "resume.json");

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

      const file = createMockFile(JSON.stringify(validData), "resume.json");

      const result = await importFromJSON(file);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("rejects invalid JSON format", async () => {
      const invalidData = {
        notAResume: true,
      };

      const file = createMockFile(JSON.stringify(invalidData), "invalid.json");

      const result = await importFromJSON(file);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid resume format");
    });

    it("handles malformed JSON", async () => {
      const file = createMockFile("{ invalid json }", "malformed.json");

      const result = await importFromJSON(file);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
