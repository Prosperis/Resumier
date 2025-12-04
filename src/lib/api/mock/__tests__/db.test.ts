import { vi } from "vitest";
import { delay, mockDb } from "@/lib/api/mock/db";
import type { CreateResumeDto, UpdateResumeDto } from "@/lib/api/types";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("MockDatabase", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset database to sample data
    mockDb.reset();
  });

  describe("getResumes", () => {
    it("returns all resumes", () => {
      const resumes = mockDb.getResumes();
      expect(resumes).toHaveLength(2);
      expect(resumes[0].title).toBe("Software Engineer Resume");
      expect(resumes[1].title).toBe("Product Manager Resume");
    });

    it("returns a copy of resumes array", () => {
      const resumes1 = mockDb.getResumes();
      const resumes2 = mockDb.getResumes();
      expect(resumes1).not.toBe(resumes2);
      expect(resumes1).toEqual(resumes2);
    });
  });

  describe("getResumeById", () => {
    it("returns resume when ID exists", () => {
      const resume = mockDb.getResumeById("1");
      expect(resume).not.toBeNull();
      expect(resume?.title).toBe("Software Engineer Resume");
    });

    it("returns null when ID does not exist", () => {
      const resume = mockDb.getResumeById("999");
      expect(resume).toBeNull();
    });

    it("returns correct resume by ID", () => {
      const resume = mockDb.getResumeById("2");
      expect(resume).not.toBeNull();
      expect(resume?.title).toBe("Product Manager Resume");
    });
  });

  describe("createResume", () => {
    it("creates a new resume with minimal data", () => {
      const createDto: CreateResumeDto = {
        title: "New Resume",
      };

      const resume = mockDb.createResume(createDto);

      expect(resume.id).toBe("3");
      expect(resume.title).toBe("New Resume");
      expect(resume.version).toBe(1);
      expect(resume.content).toHaveProperty("personalInfo");
      expect(resume.content).toHaveProperty("experience");
      expect(resume.content).toHaveProperty("education");
      expect(resume.content).toHaveProperty("skills");
    });

    it("creates a new resume with full content", () => {
      const createDto: CreateResumeDto = {
        title: "Full Resume",
        content: {
          personalInfo: {
            name: "Test User",
            email: "test@example.com",
            phone: "123-456-7890",
            location: "Test City",
            summary: "Test summary",
          },
          experience: [
            {
              id: "exp-1",
              company: "Test Corp",
              position: "Test Position",
              startDate: "2020-01",
              endDate: "2021-01",
              current: false,
              description: "Test description",
              highlights: ["Highlight 1", "Highlight 2"],
            },
          ],
          education: [],
          skills: {
            technical: ["JavaScript"],
            languages: ["English"],
            tools: ["Git"],
            soft: ["Communication"],
          },
          certifications: [],
          links: [],
        },
      };

      const resume = mockDb.createResume(createDto);

      expect(resume.title).toBe("Full Resume");
      expect(resume.content.personalInfo.name).toBe("Test User");
      expect(resume.content.experience).toHaveLength(1);
      expect(resume.content.skills.technical).toContain("JavaScript");
    });

    it("increments ID for each new resume", () => {
      const resume1 = mockDb.createResume({ title: "Resume 1" });
      const resume2 = mockDb.createResume({ title: "Resume 2" });

      expect(resume1.id).toBe("3");
      expect(resume2.id).toBe("4");
    });

    it("adds new resume to the list", () => {
      const initialCount = mockDb.getResumes().length;
      mockDb.createResume({ title: "New Resume" });
      const newCount = mockDb.getResumes().length;

      expect(newCount).toBe(initialCount + 1);
    });

    it("persists resume to localStorage", () => {
      mockDb.createResume({ title: "Persisted Resume" });

      const stored = localStorage.getItem("resumier-mock-db");
      expect(stored).not.toBeNull();

      const data = JSON.parse(stored!);
      expect(data.resumes).toHaveLength(3);
      expect(data.resumes[2].title).toBe("Persisted Resume");
    });

    it("sets createdAt and updatedAt timestamps", () => {
      const before = new Date().toISOString();
      const resume = mockDb.createResume({ title: "Timestamped Resume" });
      const after = new Date().toISOString();

      expect(resume.createdAt).toBeDefined();
      expect(resume.updatedAt).toBeDefined();
      expect(resume.createdAt).toBe(resume.updatedAt);
      expect(resume.createdAt >= before).toBe(true);
      expect(resume.createdAt <= after).toBe(true);
    });
  });

  describe("updateResume", () => {
    it("updates resume title", () => {
      const updateDto: UpdateResumeDto = {
        title: "Updated Title",
      };

      const updated = mockDb.updateResume("1", updateDto);

      expect(updated).not.toBeNull();
      expect(updated?.title).toBe("Updated Title");
    });

    it("updates resume content", () => {
      const updateDto: UpdateResumeDto = {
        content: {
          personalInfo: {
            name: "Updated Name",
            email: "updated@example.com",
            phone: "",
            location: "",
            summary: "",
          },
        },
      };

      const updated = mockDb.updateResume("1", updateDto);

      expect(updated).not.toBeNull();
      expect(updated?.content.personalInfo.name).toBe("Updated Name");
      expect(updated?.content.personalInfo.email).toBe("updated@example.com");
    });

    it("increments version on update", () => {
      const original = mockDb.getResumeById("1");
      const originalVersion = original?.version || 0;

      const updated = mockDb.updateResume("1", { title: "Updated" });

      expect(updated?.version).toBe(originalVersion + 1);
    });

    it("updates updatedAt timestamp", () => {
      const original = mockDb.getResumeById("1");
      const originalUpdatedAt = original?.updatedAt;

      // Wait a bit to ensure timestamp changes
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);

      const updated = mockDb.updateResume("1", { title: "Updated" });

      vi.useRealTimers();

      expect(updated?.updatedAt).not.toBe(originalUpdatedAt);
    });

    it("returns null when resume does not exist", () => {
      const updated = mockDb.updateResume("999", { title: "Does Not Exist" });
      expect(updated).toBeNull();
    });

    it("persists update to localStorage", () => {
      mockDb.updateResume("1", { title: "Persisted Update" });

      const stored = localStorage.getItem("resumier-mock-db");
      expect(stored).not.toBeNull();

      const data = JSON.parse(stored!);
      const resume = data.resumes.find((r: any) => r.id === "1");
      expect(resume.title).toBe("Persisted Update");
    });

    it("preserves existing content when updating title", () => {
      const original = mockDb.getResumeById("1");
      const originalContent = original?.content;

      const updated = mockDb.updateResume("1", { title: "New Title" });

      expect(updated?.content).toEqual(originalContent);
    });

    it("merges content updates with existing content", () => {
      const original = mockDb.getResumeById("1");
      const originalExperience = original?.content.experience;

      const updated = mockDb.updateResume("1", {
        content: {
          personalInfo: {
            name: "Updated Name",
            email: "",
            phone: "",
            location: "",
            summary: "",
          },
        },
      });

      expect(updated?.content.personalInfo.name).toBe("Updated Name");
      expect(updated?.content.experience).toEqual(originalExperience);
    });
  });

  describe("deleteResume", () => {
    it("deletes resume when ID exists", () => {
      const success = mockDb.deleteResume("1");
      expect(success).toBe(true);

      const deleted = mockDb.getResumeById("1");
      expect(deleted).toBeNull();
    });

    it("returns false when ID does not exist", () => {
      const success = mockDb.deleteResume("999");
      expect(success).toBe(false);
    });

    it("removes resume from list", () => {
      const initialCount = mockDb.getResumes().length;
      mockDb.deleteResume("1");
      const newCount = mockDb.getResumes().length;

      expect(newCount).toBe(initialCount - 1);
    });

    it("persists deletion to localStorage", () => {
      mockDb.deleteResume("1");

      const stored = localStorage.getItem("resumier-mock-db");
      expect(stored).not.toBeNull();

      const data = JSON.parse(stored!);
      const resume = data.resumes.find((r: any) => r.id === "1");
      expect(resume).toBeUndefined();
    });
  });

  describe("clear", () => {
    it("removes all resumes", () => {
      mockDb.clear();
      const resumes = mockDb.getResumes();
      expect(resumes).toHaveLength(0);
    });

    it("resets nextId to 1", () => {
      mockDb.clear();
      const resume = mockDb.createResume({ title: "First After Clear" });
      expect(resume.id).toBe("1");
    });

    it("persists cleared state to localStorage", () => {
      mockDb.clear();

      const stored = localStorage.getItem("resumier-mock-db");
      expect(stored).not.toBeNull();

      const data = JSON.parse(stored!);
      expect(data.resumes).toHaveLength(0);
      expect(data.nextId).toBe(1);
    });
  });

  describe("reset", () => {
    it("resets to sample data", () => {
      mockDb.clear();
      mockDb.reset();

      const resumes = mockDb.getResumes();
      expect(resumes).toHaveLength(2);
    });

    it("resets nextId to 3", () => {
      mockDb.clear();
      mockDb.reset();

      const resume = mockDb.createResume({ title: "First After Reset" });
      expect(resume.id).toBe("3");
    });

    it("restores sample resumes", () => {
      mockDb.clear();
      mockDb.reset();

      const resumes = mockDb.getResumes();
      expect(resumes[0].title).toBe("Software Engineer Resume");
      expect(resumes[1].title).toBe("Product Manager Resume");
    });
  });

  describe("localStorage persistence", () => {
    it("handles localStorage errors gracefully on load", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      // Should not throw and return sample data
      const resumes = mockDb.getResumes();
      expect(resumes).toBeDefined();
    });

    it("handles localStorage errors gracefully on save", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      // Mock setItem to throw an error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error("Storage error");
      });

      // Should not throw, but should handle the error gracefully
      expect(() => mockDb.createResume({ title: "Test" })).not.toThrow();

      // Restore original
      Storage.prototype.setItem = originalSetItem;
      consoleWarnSpy.mockRestore();
    });

    it("handles invalid JSON in localStorage", () => {
      localStorage.setItem("resumier-mock-db", "invalid json");

      // Should not throw and return sample data
      mockDb.reset();
      const resumes = mockDb.getResumes();
      expect(resumes).toHaveLength(2);
    });
  });
});

describe("delay", () => {
  it("returns a promise", () => {
    const result = delay(100);
    expect(result).toBeInstanceOf(Promise);
  });

  it("resolves after specified time", async () => {
    vi.useFakeTimers();

    const promise = delay(100);
    let resolved = false;

    promise.then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);

    vi.advanceTimersByTime(50);
    await Promise.resolve();
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(50);
    await Promise.resolve();
    expect(resolved).toBe(true);

    vi.useRealTimers();
  });

  it("resolves with void", async () => {
    const result = await delay(0);
    expect(result).toBeUndefined();
  });
});
