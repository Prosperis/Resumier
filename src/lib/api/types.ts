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
 * Name display order
 * - "firstLast": First name followed by last name (e.g., "John Doe")
 * - "lastFirst": Last name followed by first name (e.g., "Doe John" or "田中 太郎")
 */
export type NameOrder = "firstLast" | "lastFirst";

/**
 * Phone number display format
 * - "national": (555) 123-4567
 * - "international": +1 555 123 4567
 * - "e164": +15551234567
 */
export type PhoneFormat = "national" | "international" | "e164";

/**
 * Personal Information
 */
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  nameOrder: NameOrder;
  email: string;
  phone: string;
  phoneFormat?: PhoneFormat;
  location: string;
  summary: string;
}

/**
 * Experience description format
 * - "structured": Separate description paragraph + bullet highlights (default)
 * - "freeform": Single text block for free-flowing content
 * - "bullets": Only bullet points, no description paragraph
 */
export type ExperienceFormat = "structured" | "freeform" | "bullets";

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
  format?: ExperienceFormat;
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
 * Link type for social/professional links
 * Only includes types with distinct icons
 */
export type LinkType =
  | "website" // Globe icon - for portfolio, blog, personal site, etc.
  | "linkedin"
  | "github"
  | "twitter"
  | "facebook"
  | "instagram"
  | "youtube"
  | "dribbble"
  | "codepen"
  | "figma"
  | "twitch"
  | "slack"
  | "email"
  | "other"; // Generic link icon

/**
 * Link (Portfolio, LinkedIn, etc.)
 */
export interface Link {
  id: string;
  label: string;
  url: string;
  type: LinkType;
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
