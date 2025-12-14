/**
 * Profile Types
 * Master profile that stores all professional data which can be reused across multiple resumes
 */

import type { Certification, Education, Experience, Link, PersonalInfo, Skills } from "./types";

/**
 * Profile Document
 * A master profile containing all professional data that can be referenced by multiple resumes
 */
export interface Profile {
  id: string;
  userId?: string; // Optional - for multi-user support in future
  name: string; // Profile name (e.g., "Software Engineer Profile", "Product Manager Profile")
  description?: string; // Optional description of what this profile is for
  content: ProfileContent;
  createdAt: string;
  updatedAt: string;
  version?: number; // Optional - for versioning in future
}

/**
 * Profile Content Structure
 * Contains all the professional data that can be reused across resumes
 */
export interface ProfileContent {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  links: Link[];
}

/**
 * Section selection for a resume linked to a profile
 * Allows selecting which items from the profile to include in a specific resume
 */
export interface SectionSelection {
  // IDs of selected items from the profile (empty array = include all, null = exclude section)
  experienceIds?: string[] | null;
  educationIds?: string[] | null;
  certificationIds?: string[] | null;
  linkIds?: string[] | null;
  // For skills, select by category
  skills?: {
    technical?: string[] | null; // Skill names to include
    languages?: string[] | null;
    tools?: string[] | null;
    soft?: string[] | null;
  } | null;
  // Personal info is usually included in full, but can have overrides
  includePersonalInfo?: boolean;
  includeSummary?: boolean;
}

/**
 * Resume-specific overrides when linked to a profile
 * Allows customizing content for a specific resume without modifying the profile
 */
export interface ResumeOverrides {
  // Override personal info fields for this resume
  personalInfo?: Partial<PersonalInfo>;
  // Override specific experience descriptions (keyed by experience ID)
  experienceOverrides?: Record<string, Partial<Experience>>;
  // Override specific education entries (keyed by education ID)
  educationOverrides?: Record<string, Partial<Education>>;
  // Additional resume-specific content not in the profile
  additionalExperience?: Experience[];
  additionalEducation?: Education[];
  additionalCertifications?: Certification[];
  additionalLinks?: Link[];
  additionalSkills?: Partial<Skills>;
}

/**
 * Profile link configuration in a Resume
 * Defines how a resume connects to and uses a profile
 */
export interface ProfileLink {
  profileId: string;
  // What sections/items to include from the profile
  selection: SectionSelection;
  // Resume-specific customizations
  overrides?: ResumeOverrides;
  // Order of sections in the resume (for section reordering)
  sectionOrder?: (
    | "personalInfo"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "certifications"
    | "links"
  )[];
}

/**
 * DTOs (Data Transfer Objects)
 */

/**
 * Create Profile Request
 */
export interface CreateProfileDto {
  name: string;
  description?: string;
  content?: Partial<ProfileContent>;
}

/**
 * Update Profile Request
 */
export interface UpdateProfileDto {
  name?: string;
  description?: string;
  content?: Partial<ProfileContent>;
}

/**
 * Helper type: Resume with optional profile link
 * Extended from base Resume type
 */
export interface LinkedResume {
  id: string;
  userId?: string;
  title: string;
  // If profileLink is present, content is computed from profile + overrides
  // If profileLink is absent, content is standalone (current behavior)
  profileLink?: ProfileLink;
  // Standalone content (used when no profileLink)
  content: ProfileContent;
  createdAt: string;
  updatedAt: string;
  version?: number;
}
