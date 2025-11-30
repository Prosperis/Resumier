import {
  demoProfile,
  demoResumes,
  DEMO_PROFILE_ID,
} from "./demo-data";
import type { Profile } from "./profile-types";
import type { Resume } from "./types";

// Re-export for backwards compatibility
export { DEMO_PROFILE_ID, demoProfile };

/**
 * In-Memory Mock Database
 * Simulates a backend database for development
 */
class MockDatabase {
  private resumes: Map<string, Resume> = new Map();
  private profiles: Map<string, Profile> = new Map();
  private idCounter = 1;

  constructor() {
    // Initialize with sample data
    this.seedData();
  }

  /**
   * Seed initial data
   */
  private seedData() {
    // First, seed the demo profile
    this.profiles.set(demoProfile.id, demoProfile);

    // Then seed demo resumes linked to the profile
    for (const resume of demoResumes) {
      this.resumes.set(resume.id, resume);
    }

    this.idCounter = 10; // Start counter higher to avoid conflicts
  }

  // ============ Profile Methods ============

  /**
   * Get all profiles for a user (or all if no userId provided)
   */
  getProfiles(userId?: string): Profile[] {
    const allProfiles = Array.from(this.profiles.values());
    if (!userId) return allProfiles;
    return allProfiles.filter((profile) => profile.userId === userId);
  }

  /**
   * Get single profile by ID
   */
  getProfile(id: string): Profile | undefined {
    return this.profiles.get(id);
  }

  /**
   * Create new profile
   */
  createProfile(
    data: Omit<Profile, "id" | "createdAt" | "updatedAt">,
  ): Profile {
    const now = new Date().toISOString();
    const profile: Profile = {
      ...data,
      id: `profile-${this.idCounter++}`,
      createdAt: now,
      updatedAt: now,
    };

    this.profiles.set(profile.id, profile);
    return profile;
  }

  /**
   * Update existing profile
   */
  updateProfile(
    id: string,
    updates: Partial<Omit<Profile, "id" | "createdAt">>,
  ): Profile | null {
    const existing = this.profiles.get(id);
    if (!existing) return null;

    const updated: Profile = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
      content: updates.content
        ? {
            ...existing.content,
            ...updates.content,
            personalInfo: updates.content.personalInfo
              ? {
                  ...existing.content.personalInfo,
                  ...updates.content.personalInfo,
                }
              : existing.content.personalInfo,
            skills: updates.content.skills
              ? { ...existing.content.skills, ...updates.content.skills }
              : existing.content.skills,
          }
        : existing.content,
    };

    this.profiles.set(id, updated);
    return updated;
  }

  /**
   * Delete profile
   */
  deleteProfile(id: string): boolean {
    return this.profiles.delete(id);
  }

  // ============ Resume Methods ============

  /**
   * Generate new ID
   */
  private generateId(): string {
    return `${this.idCounter++}`;
  }

  /**
   * Get all resumes for a user (or all if no userId provided)
   */
  getResumes(userId?: string): Resume[] {
    const allResumes = Array.from(this.resumes.values());
    if (!userId) return allResumes;
    return allResumes.filter((resume) => resume.userId === userId);
  }

  /**
   * Get single resume by ID
   */
  getResume(id: string): Resume | undefined {
    return this.resumes.get(id);
  }

  /**
   * Create new resume
   */
  createResume(data: Omit<Resume, "id" | "createdAt" | "updatedAt">): Resume {
    const now = new Date().toISOString();
    const resume: Resume = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };

    this.resumes.set(resume.id, resume);
    return resume;
  }

  /**
   * Update existing resume
   */
  updateResume(
    id: string,
    updates: Partial<Omit<Resume, "id" | "createdAt">>,
  ): Resume | null {
    const existing = this.resumes.get(id);
    if (!existing) return null;

    const updated: Resume = {
      ...existing,
      ...updates,
      id: existing.id, // Ensure ID doesn't change
      createdAt: existing.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
      // Deep merge content if provided
      content: updates.content
        ? {
            ...existing.content,
            ...updates.content,
            // Merge nested objects properly
            personalInfo: updates.content.personalInfo
              ? {
                  ...existing.content.personalInfo,
                  ...updates.content.personalInfo,
                }
              : existing.content.personalInfo,
            skills: updates.content.skills
              ? { ...existing.content.skills, ...updates.content.skills }
              : existing.content.skills,
          }
        : existing.content,
    };

    this.resumes.set(id, updated);
    return updated;
  }

  /**
   * Delete resume
   */
  deleteResume(id: string): boolean {
    return this.resumes.delete(id);
  }

  /**
   * Check if resume exists
   */
  exists(id: string): boolean {
    return this.resumes.has(id);
  }

  /**
   * Clear all data (for testing)
   */
  clear() {
    this.resumes.clear();
    this.profiles.clear();
    this.idCounter = 1;
  }

  /**
   * Reset to initial state (for testing)
   */
  reset() {
    this.clear();
    this.seedData();
  }
}

// Singleton instance
export const mockDb = new MockDatabase();
