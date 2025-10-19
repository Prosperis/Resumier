import type { Resume } from "./types"

/**
 * In-Memory Mock Database
 * Simulates a backend database for development
 */
class MockDatabase {
  private resumes: Map<string, Resume> = new Map()
  private idCounter = 1

  constructor() {
    // Initialize with sample data
    this.seedData()
  }

  /**
   * Seed initial data
   */
  private seedData() {
    const sampleResume: Resume = {
      id: "1",
      userId: "user-1",
      title: "Software Engineer Resume",
      content: {
        personalInfo: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          summary:
            "Experienced software engineer with 5+ years building scalable web applications.",
        },
        experience: [
          {
            id: "exp-1",
            company: "Tech Corp",
            position: "Senior Software Engineer",
            startDate: "2020-01",
            endDate: "2024-10",
            current: false,
            description: "Led development of customer-facing web applications",
            highlights: [
              "Built React applications serving 1M+ users",
              "Reduced page load time by 60%",
              "Mentored 5 junior engineers",
            ],
          },
          {
            id: "exp-2",
            company: "StartupXYZ",
            position: "Full Stack Developer",
            startDate: "2018-06",
            endDate: "2020-01",
            current: false,
            description: "Developed MVP and scaled to production",
            highlights: ["Built full-stack application from scratch", "Implemented CI/CD pipeline"],
          },
        ],
        education: [
          {
            id: "edu-1",
            institution: "University of California",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2014-09",
            endDate: "2018-05",
            current: false,
            gpa: "3.8",
            honors: ["Dean's List", "Cum Laude"],
          },
        ],
        skills: {
          technical: ["React", "TypeScript", "Node.js", "Python"],
          languages: ["JavaScript", "TypeScript", "Python", "SQL"],
          tools: ["Git", "Docker", "AWS", "VS Code"],
          soft: ["Leadership", "Communication", "Problem Solving"],
        },
        certifications: [
          {
            id: "cert-1",
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023-06",
            expiryDate: "2026-06",
            credentialId: "ABC123XYZ",
            url: "https://aws.amazon.com/certification/",
          },
        ],
        links: [
          {
            id: "link-1",
            label: "Portfolio",
            url: "https://johndoe.dev",
            type: "portfolio",
          },
          {
            id: "link-2",
            label: "LinkedIn",
            url: "https://linkedin.com/in/johndoe",
            type: "linkedin",
          },
          {
            id: "link-3",
            label: "GitHub",
            url: "https://github.com/johndoe",
            type: "github",
          },
        ],
      },
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-10-15T14:30:00Z",
    }

    this.resumes.set(sampleResume.id, sampleResume)
    this.idCounter = 2
  }

  /**
   * Generate new ID
   */
  private generateId(): string {
    return `${this.idCounter++}`
  }

  /**
   * Get all resumes for a user (or all if no userId provided)
   */
  getResumes(userId?: string): Resume[] {
    const allResumes = Array.from(this.resumes.values())
    if (!userId) return allResumes
    return allResumes.filter((resume) => resume.userId === userId)
  }

  /**
   * Get single resume by ID
   */
  getResume(id: string): Resume | undefined {
    return this.resumes.get(id)
  }

  /**
   * Create new resume
   */
  createResume(data: Omit<Resume, "id" | "createdAt" | "updatedAt">): Resume {
    const now = new Date().toISOString()
    const resume: Resume = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    }

    this.resumes.set(resume.id, resume)
    return resume
  }

  /**
   * Update existing resume
   */
  updateResume(id: string, updates: Partial<Omit<Resume, "id" | "createdAt">>): Resume | null {
    const existing = this.resumes.get(id)
    if (!existing) return null

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
              ? { ...existing.content.personalInfo, ...updates.content.personalInfo }
              : existing.content.personalInfo,
            skills: updates.content.skills
              ? { ...existing.content.skills, ...updates.content.skills }
              : existing.content.skills,
          }
        : existing.content,
    }

    this.resumes.set(id, updated)
    return updated
  }

  /**
   * Delete resume
   */
  deleteResume(id: string): boolean {
    return this.resumes.delete(id)
  }

  /**
   * Check if resume exists
   */
  exists(id: string): boolean {
    return this.resumes.has(id)
  }

  /**
   * Clear all data (for testing)
   */
  clear() {
    this.resumes.clear()
    this.idCounter = 1
  }

  /**
   * Reset to initial state (for testing)
   */
  reset() {
    this.clear()
    this.seedData()
  }
}

// Singleton instance
export const mockDb = new MockDatabase()
