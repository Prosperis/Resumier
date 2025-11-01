import { get } from "idb-keyval";
import { ConflictError, NotFoundError } from "../errors";
import type { CreateResumeDto, Resume, UpdateResumeDto } from "../types";
import { delay, mockDb } from "./db";

const IDB_STORE_KEY = "resumier-web-store";

/**
 * Mock Resume API Endpoints
 * Simulates a REST API with network delays
 */

/**
 * Simulated network delay range (in ms)
 */
const MIN_DELAY = 100;
const MAX_DELAY = 500;

/**
 * Get random delay
 */
function randomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

/**
 * Mock Resume API
 */
export const mockResumeApi = {
  /**
   * GET /api/resumes
   * Fetch all resumes (checks IndexedDB first for demo mode)
   */
  async getAll(): Promise<Resume[]> {
    await delay(randomDelay());

    console.log("MockAPI: Fetching all resumes...");

    // Check IndexedDB first (for demo mode data)
    try {
      const idbData = await get(IDB_STORE_KEY);
      console.log("MockAPI: IndexedDB data:", idbData);

      if (idbData && typeof idbData === "object" && "resumes" in idbData) {
        const resumes = (idbData as { resumes: Resume[] }).resumes;
        if (resumes && resumes.length > 0) {
          console.log(
            `MockAPI: ✅ Returning ${resumes.length} resume(s) from IndexedDB`,
          );
          return resumes;
        }
      }
    } catch (error) {
      console.warn(
        "MockAPI: Failed to load from IndexedDB, falling back to localStorage:",
        error,
      );
    }

    // Fallback to localStorage mock DB
    const localResumes = mockDb.getResumes();
    console.log(
      `MockAPI: ✅ Returning ${localResumes.length} resume(s) from localStorage`,
    );
    return localResumes;
  },

  /**
   * GET /api/resumes/:id
   * Fetch resume by ID (checks IndexedDB first for demo mode)
   */
  async getById(id: string): Promise<Resume> {
    await delay(randomDelay());

    // Check IndexedDB first (for demo mode data)
    try {
      const idbData = await get(IDB_STORE_KEY);
      if (idbData && typeof idbData === "object" && "resumes" in idbData) {
        const resumes = (idbData as { resumes: Resume[] }).resumes;
        const resume = resumes.find((r) => r.id === id);
        if (resume) {
          return resume;
        }
      }
    } catch (error) {
      console.warn(
        "Failed to load from IndexedDB, falling back to localStorage:",
        error,
      );
    }

    // Fallback to localStorage mock DB
    const resume = mockDb.getResumeById(id);
    if (!resume) {
      throw new NotFoundError(`Resume with ID "${id}" not found`);
    }

    return resume;
  },

  /**
   * POST /api/resumes
   * Create new resume
   */
  async create(data: CreateResumeDto): Promise<Resume> {
    await delay(randomDelay());

    // Validate title
    if (!data.title || data.title.trim().length === 0) {
      throw new Error("Resume title is required");
    }

    // Check for duplicate title
    const existing = mockDb.getResumes().find((r) => r.title === data.title);
    if (existing) {
      throw new ConflictError(
        `Resume with title "${data.title}" already exists`,
      );
    }

    return mockDb.createResume(data);
  },

  /**
   * PUT /api/resumes/:id
   * Update resume
   */
  async update(id: string, data: UpdateResumeDto): Promise<Resume> {
    await delay(randomDelay());

    // Check if resume exists
    const existing = mockDb.getResumeById(id);
    if (!existing) {
      throw new NotFoundError(`Resume with ID "${id}" not found`);
    }

    // Validate title if provided
    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new Error("Resume title cannot be empty");
    }

    // Check for duplicate title
    if (data.title && data.title !== existing.title) {
      const duplicate = mockDb
        .getResumes()
        .find((r) => r.id !== id && r.title === data.title);
      if (duplicate) {
        throw new ConflictError(
          `Resume with title "${data.title}" already exists`,
        );
      }
    }

    const updated = mockDb.updateResume(id, data);
    if (!updated) {
      throw new NotFoundError(`Resume with ID "${id}" not found`);
    }

    return updated;
  },

  /**
   * DELETE /api/resumes/:id
   * Delete resume
   */
  async delete(id: string): Promise<void> {
    await delay(randomDelay());

    const success = mockDb.deleteResume(id);
    if (!success) {
      throw new NotFoundError(`Resume with ID "${id}" not found`);
    }
  },
};
