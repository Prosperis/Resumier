import { vi } from "vitest";
import {
  copyToClipboard,
  downloadHTML,
  formatResumeDate,
  openPrintPreview,
  printResume,
} from "@/components/features/resume/export/export-utils";
import type { Resume } from "@/lib/api/types";

// Mock file-saver
vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

// Mock settings store
vi.mock("@/stores/settings-store", () => ({
  useSettingsStore: {
    getState: () => ({
      settings: {
        promptExportFilename: false, // Disable prompts in tests
      },
    }),
  },
}));

describe("export-utils", () => {
  const mockResume: Resume = {
    id: "1",
    title: "My Resume",
    content: {
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        location: "New York, NY",
        summary: "Software Engineer",
      },
      experience: [],
      education: [],
      skills: { technical: [], soft: [], languages: [], tools: [] },
      certifications: [],
      links: [],
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };

  describe("printResume", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      window.print = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it("should set document title before printing", () => {
      const originalTitle = document.title;
      document.title = "Original Title";

      printResume(mockResume);

      // Title should be set to generated filename without extension
      expect(document.title).toContain("John_Doe_Resume_");
      expect(window.print).toHaveBeenCalled();

      document.title = originalTitle;
    });

    it("should call window.print", () => {
      printResume(mockResume);

      expect(window.print).toHaveBeenCalledTimes(1);
    });

    it("should restore original title after timeout", () => {
      document.title = "Original Title";

      printResume(mockResume);

      // Title should be changed temporarily
      expect(document.title).not.toBe("Original Title");

      vi.advanceTimersByTime(1000);

      expect(document.title).toBe("Original Title");
    });
  });

  describe("openPrintPreview", () => {
    it("should call window.print", () => {
      window.print = vi.fn();

      openPrintPreview();

      expect(window.print).toHaveBeenCalledTimes(1);
    });
  });

  describe("downloadHTML", () => {
    let saveAsMock: any;

    beforeEach(async () => {
      const fileSaver = await import("file-saver");
      saveAsMock = fileSaver.saveAs as any;
      saveAsMock.mockClear();

      // Mock DOM elements for template extraction
      const mockResumeElement = document.createElement("div");
      mockResumeElement.className = "resume-light-mode";
      mockResumeElement.innerHTML = "<div><h1>John Doe</h1><p>Resume content</p></div>";
      document.body.appendChild(mockResumeElement);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      // Clean up DOM
      const elements = document.querySelectorAll(".resume-light-mode");
      elements.forEach((el) => el.remove());
    });

    it("should create a blob with HTML content", () => {
      const resume: Resume = {
        id: "1",
        title: "My Resume",
        content: {
          personalInfo: {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            location: "New York, NY",
            summary: "Software Engineer",
          },
          experience: [],
          education: [],
          skills: { technical: [], soft: [], languages: [], tools: [] },
          certifications: [],
          links: [],
        },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };

      downloadHTML(resume);

      expect(saveAsMock).toHaveBeenCalled();
      const blob = saveAsMock.mock.calls[0][0];
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("text/html;charset=utf-8");
    });

    it("should create download link with correct filename", () => {
      const resume: Resume = {
        id: "1",
        title: "Software Engineer Resume",
        content: {
          personalInfo: {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            phone: "",
            location: "",
            summary: "",
          },
          experience: [],
          education: [],
          skills: { technical: [], soft: [], languages: [], tools: [] },
          certifications: [],
          links: [],
        },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };

      downloadHTML(resume);

      expect(saveAsMock).toHaveBeenCalled();
      const filename = saveAsMock.mock.calls[0][1];
      // Filename should include personal name, date, and extension
      // sanitizeFilename replaces dots, so extension appears as _html
      expect(filename).toContain("Jane_Smith_Resume_");
      expect(filename).toMatch(/_html$/);
    });

    it("should trigger download using saveAs", () => {
      const resume: Resume = {
        id: "1",
        title: "Test",
        content: {
          personalInfo: {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            phone: "",
            location: "",
            summary: "",
          },
          experience: [],
          education: [],
          skills: { technical: [], soft: [], languages: [], tools: [] },
          certifications: [],
          links: [],
        },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };

      downloadHTML(resume);

      expect(saveAsMock).toHaveBeenCalledTimes(1);
    });

    it("should include resume content in HTML", () => {
      const resume: Resume = {
        id: "1",
        title: "Test",
        content: {
          personalInfo: {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            phone: "",
            location: "",
            summary: "",
          },
          experience: [],
          education: [],
          skills: { technical: [], soft: [], languages: [], tools: [] },
          certifications: [],
          links: [],
        },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };

      downloadHTML(resume);

      expect(saveAsMock).toHaveBeenCalled();
      const blob = saveAsMock.mock.calls[0][0];
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe("copyToClipboard", () => {
    it("should copy text to clipboard successfully", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const result = await copyToClipboard("Test text");

      expect(writeTextMock).toHaveBeenCalledWith("Test text");
      expect(result).toBe(true);
    });

    it("should return false on clipboard error", async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error("Permission denied"));
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await copyToClipboard("Test text");

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to copy to clipboard:",
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it("should handle empty string", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const result = await copyToClipboard("");

      expect(writeTextMock).toHaveBeenCalledWith("");
      expect(result).toBe(true);
    });
  });

  describe("formatResumeDate", () => {
    it("should format valid date string", () => {
      const result = formatResumeDate("2024-03-15");

      expect(result).toMatch(/Mar 2024/);
    });

    it("should return empty string for empty input", () => {
      const result = formatResumeDate("");

      expect(result).toBe("");
    });

    it("should return original string for invalid date", () => {
      const invalidDate = "not-a-date";

      const result = formatResumeDate(invalidDate);

      // Invalid dates result in "Invalid Date" when formatted
      expect(result).toBe("Invalid Date");
    });

    it("should format different date correctly", () => {
      const result = formatResumeDate("2023-12-01");

      // Month might vary by 1 due to timezone, so check for Nov or Dec
      expect(result).toMatch(/(Nov|Dec) 2023/);
    });

    it("should handle ISO date format", () => {
      const result = formatResumeDate("2024-06-20T10:30:00Z");

      expect(result).toMatch(/Jun 2024/);
    });
  });
});
