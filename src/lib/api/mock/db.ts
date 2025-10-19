import type { CreateResumeDto, Resume, ResumeContent, UpdateResumeDto } from "../types"

/**
 * In-Memory Mock Database
 * Simulates a database with localStorage persistence
 */

const STORAGE_KEY = "resumier-mock-db"

/**
 * Database state
 */
interface DbState {
  resumes: Resume[]
  nextId: number
}

/**
 * Load state from localStorage
 */
function loadState(): DbState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn("Failed to load mock DB from localStorage:", error)
  }

  // Return initial state with sample data
  return {
    resumes: generateSampleResumes(),
    nextId: 3,
  }
}

/**
 * Save state to localStorage
 */
function saveState(state: DbState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn("Failed to save mock DB to localStorage:", error)
  }
}

/**
 * Generate sample resumes for development
 */
function generateSampleResumes(): Resume[] {
  const now = new Date().toISOString()

  const defaultContent: ResumeContent = {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
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
  }

  return [
    {
      id: "1",
      title: "Software Engineer Resume",
      content: {
        ...defaultContent,
        personalInfo: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          summary:
            "Experienced software engineer with 5+ years of experience in full-stack development.",
        },
        experience: [
          {
            id: "exp-1",
            company: "Tech Corp",
            position: "Senior Software Engineer",
            startDate: "2020-01",
            endDate: "",
            current: true,
            description: "Lead development of cloud-native applications",
            highlights: [
              "Built scalable microservices architecture",
              "Improved system performance by 40%",
              "Mentored junior developers",
            ],
          },
        ],
        skills: {
          technical: ["JavaScript", "TypeScript", "React", "Node.js"],
          languages: ["English", "Spanish"],
          tools: ["Git", "Docker", "AWS"],
          soft: ["Leadership", "Communication", "Problem Solving"],
        },
      },
      createdAt: now,
      updatedAt: now,
      version: 1,
    },
    {
      id: "2",
      title: "Product Manager Resume",
      content: {
        ...defaultContent,
        personalInfo: {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1 (555) 987-6543",
          location: "New York, NY",
          summary: "Results-driven product manager with expertise in agile methodologies.",
        },
      },
      createdAt: now,
      updatedAt: now,
      version: 1,
    },
  ]
}

/**
 * Mock Database API
 */
class MockDatabase {
  private state: DbState

  constructor() {
    this.state = loadState()
  }

  /**
   * Get all resumes
   */
  getResumes(): Resume[] {
    return [...this.state.resumes]
  }

  /**
   * Get resume by ID
   */
  getResumeById(id: string): Resume | null {
    return this.state.resumes.find((r) => r.id === id) || null
  }

  /**
   * Create resume
   */
  createResume(data: CreateResumeDto): Resume {
    const now = new Date().toISOString()

    const defaultContent: ResumeContent = {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
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
    }

    const resume: Resume = {
      id: String(this.state.nextId++),
      title: data.title,
      content: { ...defaultContent, ...data.content },
      createdAt: now,
      updatedAt: now,
      version: 1,
    }

    this.state.resumes.push(resume)
    saveState(this.state)

    return resume
  }

  /**
   * Update resume
   */
  updateResume(id: string, data: UpdateResumeDto): Resume | null {
    const index = this.state.resumes.findIndex((r) => r.id === id)
    if (index === -1) return null

    const existing = this.state.resumes[index]
    const updated: Resume = {
      ...existing,
      ...(data.title && { title: data.title }),
      ...(data.content && {
        content: { ...existing.content, ...data.content },
      }),
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    }

    this.state.resumes[index] = updated
    saveState(this.state)

    return updated
  }

  /**
   * Delete resume
   */
  deleteResume(id: string): boolean {
    const index = this.state.resumes.findIndex((r) => r.id === id)
    if (index === -1) return false

    this.state.resumes.splice(index, 1)
    saveState(this.state)

    return true
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.state = {
      resumes: [],
      nextId: 1,
    }
    saveState(this.state)
  }

  /**
   * Reset to sample data
   */
  reset(): void {
    this.state = {
      resumes: generateSampleResumes(),
      nextId: 3,
    }
    saveState(this.state)
  }
}

/**
 * Singleton database instance
 */
export const mockDb = new MockDatabase()

/**
 * Simulate network delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
