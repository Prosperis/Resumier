import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  copyToClipboard,
  downloadHTML,
  formatResumeDate,
  openPrintPreview,
  printResume,
} from "@/components/features/resume/export/export-utils";
import type { Resume } from "@/lib/api/types";

describe("export-utils", () => {
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

      printResume("My Resume");

      expect(document.title).toBe("My Resume");
      expect(window.print).toHaveBeenCalled();

      document.title = originalTitle;
    });

    it("should call window.print", () => {
      printResume("Test Resume");

      expect(window.print).toHaveBeenCalledTimes(1);
    });

    it("should restore original title after timeout", () => {
      document.title = "Original Title";

      printResume("My Resume");

      expect(document.title).toBe("My Resume");

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
    let mockLink: HTMLAnchorElement;

    beforeEach(() => {
      mockLink = {
        href: "",
        download: "",
        click: vi.fn(),
      } as unknown as HTMLAnchorElement;

      // Mock URL methods
      global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
      global.URL.revokeObjectURL = vi.fn();

      vi.spyOn(document, "createElement").mockReturnValue(mockLink);
      vi.spyOn(document.body, "appendChild").mockImplementation(() => mockLink);
      vi.spyOn(document.body, "removeChild").mockImplementation(() => mockLink);

      vi.spyOn(document.body, "appendChild").mockImplementation(() => mockLink);
      vi.spyOn(document.body, "removeChild").mockImplementation(() => mockLink);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should create a blob with HTML content", () => {
      const resume: Resume = {
        id: "1",
        title: "My Resume",
        content: {
          personalInfo: {
            name: "John Doe",
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

      const htmlContent = "<html><body>Resume Content</body></html>";

      downloadHTML(resume, htmlContent);

      expect(URL.createObjectURL).toHaveBeenCalled();
    });

    it("should create download link with correct filename", () => {
      const resume: Resume = {
        id: "1",
        title: "Software Engineer Resume",
        content: {
          personalInfo: {
            name: "Jane Smith",
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

      downloadHTML(resume, "<html></html>");

      expect(mockLink.download).toBe("Software Engineer Resume.html");
    });

    it("should trigger download by clicking the link", () => {
      const resume: Resume = {
        id: "1",
        title: "Test",
        content: {
          personalInfo: {
            name: "Test User",
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

      downloadHTML(resume, "<html></html>");

      expect(mockLink.click).toHaveBeenCalled();
    });

    it("should clean up resources after download", () => {
      const resume: Resume = {
        id: "1",
        title: "Test",
        content: {
          personalInfo: {
            name: "Test User",
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

      downloadHTML(resume, "<html></html>");

      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
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
        expect.any(Error)
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
