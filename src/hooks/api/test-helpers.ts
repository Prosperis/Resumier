import type { Resume, ResumeContent } from "../../lib/api/types";

/**
 * Helper function to create mock resume content
 */
export const createMockResumeContent = (): ResumeContent => ({
  personalInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-0100",
    location: "San Francisco, CA",
    summary: "Software Engineer",
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
});

/**
 * Helper function to create a complete mock resume
 */
export const createMockResume = (overrides?: Partial<Resume>): Resume => ({
  id: "resume-1",
  title: "My Resume",
  userId: "user-1",
  content: createMockResumeContent(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});
