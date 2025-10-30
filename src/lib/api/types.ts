/**
 * API Types and Schemas
 * Type definitions for API requests and responses
 */

/**
 * Resume Document (from store types)
 */
export interface Resume {
  id: string;
  userId?: string; // Optional - for multi-user support in future
  title: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
  version?: number; // Optional - for versioning in future
}

/**
 * Resume Content Structure
 */
export interface ResumeContent {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  links: Link[];
}

/**
 * Personal Information
 */
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

/**
 * Work Experience
 */
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
  highlights: string[];
} /**
 * Education
 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  honors?: string[];
}

/**
 * Skills
 */
export interface Skills {
  technical: string[];
  languages: string[];
  tools: string[];
  soft: string[];
}

/**
 * Certification
 */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

/**
 * Link (Portfolio, LinkedIn, etc.)
 */
export interface Link {
  id: string;
  label: string;
  url: string;
  type: "portfolio" | "linkedin" | "github" | "other";
}

/**
 * DTOs (Data Transfer Objects)
 */

/**
 * Create Resume Request
 */
export interface CreateResumeDto {
  title: string;
  content?: Partial<ResumeContent>;
}

/**
 * Update Resume Request
 */
export interface UpdateResumeDto {
  title?: string;
  content?: Partial<ResumeContent>;
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Error Response
 */
export interface ErrorResponse {
  error: string;
  message: string;
  code: string;
  details?: unknown;
}

/**
 * Validation Error Response
 */
export interface ValidationErrorResponse extends ErrorResponse {
  errors: Record<string, string[]>;
}
