import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError, NotFoundError } from "@/lib/api/errors";
import { mockResumeApi } from "@/lib/api/mock/resumes";
import type { CreateResumeDto, UpdateResumeDto } from "@/lib/api/types";

// Mock the delay function
vi.mock("@/lib/api/mock/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/mock/db")>();
  return {
    ...actual,
    delay: vi.fn(() => Promise.resolve()),
  };
});

// Import mockDb after mocking
const { mockDb } = await import("@/lib/api/mock/db");

describe("mockResumeApi", () => {
  beforeEach(() => {
    // Reset database before each test
    mockDb.reset();
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("fetches all resumes", async () => {
      const resumes = await mockResumeApi.getAll();

      expect(resumes).toHaveLength(2);
      expect(resumes[0].title).toBe("Software Engineer Resume");
      expect(resumes[1].title).toBe("Product Manager Resume");
    });

    it("includes delay", async () => {
      const { delay } = await import("@/lib/api/mock/db");
      await mockResumeApi.getAll();

      expect(delay).toHaveBeenCalledWith(expect.any(Number));
    });

    it("returns empty array when no resumes exist", async () => {
      mockDb.clear();
      const resumes = await mockResumeApi.getAll();

      expect(resumes).toHaveLength(0);
    });
  });

  describe("getById", () => {
    it("fetches resume by ID", async () => {
      const resume = await mockResumeApi.getById("1");

      expect(resume).toBeDefined();
      expect(resume.id).toBe("1");
      expect(resume.title).toBe("Software Engineer Resume");
    });

    it("throws NotFoundError when resume does not exist", async () => {
      await expect(mockResumeApi.getById("999")).rejects.toThrow(NotFoundError);
      await expect(mockResumeApi.getById("999")).rejects.toThrow(
        'Resume with ID "999" not found',
      );
    });

    it("includes delay", async () => {
      const { delay } = await import("@/lib/api/mock/db");
      await mockResumeApi.getById("1");

      expect(delay).toHaveBeenCalledWith(expect.any(Number));
    });

    it("fetches correct resume by ID", async () => {
      const resume = await mockResumeApi.getById("2");

      expect(resume.id).toBe("2");
      expect(resume.title).toBe("Product Manager Resume");
    });
  });

  describe("create", () => {
    it("creates a new resume", async () => {
      const createDto: CreateResumeDto = {
        title: "New Resume",
      };

      const resume = await mockResumeApi.create(createDto);

      expect(resume).toBeDefined();
      expect(resume.id).toBe("3");
      expect(resume.title).toBe("New Resume");
    });

    it("creates resume with full content", async () => {
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
          experience: [],
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

      const resume = await mockResumeApi.create(createDto);

      expect(resume.content.personalInfo.name).toBe("Test User");
      expect(resume.content.skills.technical).toContain("JavaScript");
    });

    it("throws error when title is empty", async () => {
      const createDto: CreateResumeDto = {
        title: "",
      };

      await expect(mockResumeApi.create(createDto)).rejects.toThrow(
        "Resume title is required",
      );
    });

    it("throws error when title is only whitespace", async () => {
      const createDto: CreateResumeDto = {
        title: "   ",
      };

      await expect(mockResumeApi.create(createDto)).rejects.toThrow(
        "Resume title is required",
      );
    });

    it("throws ConflictError when title already exists", async () => {
      const createDto: CreateResumeDto = {
        title: "Software Engineer Resume",
      };

      await expect(mockResumeApi.create(createDto)).rejects.toThrow(
        ConflictError,
      );
      await expect(mockResumeApi.create(createDto)).rejects.toThrow(
        'Resume with title "Software Engineer Resume" already exists',
      );
    });

    it("includes delay", async () => {
      const { delay } = await import("@/lib/api/mock/db");
      await mockResumeApi.create({ title: "Delayed Resume" });

      expect(delay).toHaveBeenCalledWith(expect.any(Number));
    });

    it("adds resume to database", async () => {
      const initialCount = mockDb.getResumes().length;
      await mockResumeApi.create({ title: "Added Resume" });
      const newCount = mockDb.getResumes().length;

      expect(newCount).toBe(initialCount + 1);
    });
  });

  describe("update", () => {
    it("updates resume title", async () => {
      const updateDto: UpdateResumeDto = {
        title: "Updated Title",
      };

      const updated = await mockResumeApi.update("1", updateDto);

      expect(updated.title).toBe("Updated Title");
      expect(updated.id).toBe("1");
    });

    it("updates resume content", async () => {
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

      const updated = await mockResumeApi.update("1", updateDto);

      expect(updated.content.personalInfo.name).toBe("Updated Name");
      expect(updated.content.personalInfo.email).toBe("updated@example.com");
    });

    it("throws NotFoundError when resume does not exist", async () => {
      const updateDto: UpdateResumeDto = {
        title: "Does Not Exist",
      };

      await expect(mockResumeApi.update("999", updateDto)).rejects.toThrow(
        NotFoundError,
      );
      await expect(mockResumeApi.update("999", updateDto)).rejects.toThrow(
        'Resume with ID "999" not found',
      );
    });

    it("throws error when title is empty string", async () => {
      const updateDto: UpdateResumeDto = {
        title: "",
      };

      await expect(mockResumeApi.update("1", updateDto)).rejects.toThrow(
        "Resume title cannot be empty",
      );
    });

    it("throws error when title is only whitespace", async () => {
      const updateDto: UpdateResumeDto = {
        title: "   ",
      };

      await expect(mockResumeApi.update("1", updateDto)).rejects.toThrow(
        "Resume title cannot be empty",
      );
    });

    it("throws ConflictError when new title conflicts with another resume", async () => {
      const updateDto: UpdateResumeDto = {
        title: "Product Manager Resume",
      };

      await expect(mockResumeApi.update("1", updateDto)).rejects.toThrow(
        ConflictError,
      );
      await expect(mockResumeApi.update("1", updateDto)).rejects.toThrow(
        'Resume with title "Product Manager Resume" already exists',
      );
    });

    it("allows updating to the same title", async () => {
      const original = await mockResumeApi.getById("1");
      const updateDto: UpdateResumeDto = {
        title: original.title,
      };

      const updated = await mockResumeApi.update("1", updateDto);

      expect(updated.title).toBe(original.title);
    });

    it("includes delay", async () => {
      const { delay } = await import("@/lib/api/mock/db");
      await mockResumeApi.update("1", { title: "Delayed Update" });

      expect(delay).toHaveBeenCalledWith(expect.any(Number));
    });

    it("increments version", async () => {
      const original = await mockResumeApi.getById("1");
      const updated = await mockResumeApi.update("1", {
        title: "Version Test",
      });

      expect(updated.version).toBe((original.version || 0) + 1);
    });

    it("updates timestamp", async () => {
      const original = await mockResumeApi.getById("1");

      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);

      const updated = await mockResumeApi.update("1", {
        title: "Timestamp Test",
      });

      vi.useRealTimers();

      expect(updated.updatedAt).not.toBe(original.updatedAt);
    });
  });

  describe("delete", () => {
    it("deletes resume", async () => {
      await mockResumeApi.delete("1");

      const resume = mockDb.getResumeById("1");
      expect(resume).toBeNull();
    });

    it("throws NotFoundError when resume does not exist", async () => {
      await expect(mockResumeApi.delete("999")).rejects.toThrow(NotFoundError);
      await expect(mockResumeApi.delete("999")).rejects.toThrow(
        'Resume with ID "999" not found',
      );
    });

    it("includes delay", async () => {
      const { delay } = await import("@/lib/api/mock/db");
      await mockResumeApi.delete("1");

      expect(delay).toHaveBeenCalledWith(expect.any(Number));
    });

    it("removes resume from database", async () => {
      const initialCount = mockDb.getResumes().length;
      await mockResumeApi.delete("1");
      const newCount = mockDb.getResumes().length;

      expect(newCount).toBe(initialCount - 1);
    });

    it("returns void", async () => {
      const result = await mockResumeApi.delete("1");
      expect(result).toBeUndefined();
    });
  });
});
