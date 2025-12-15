import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { ColorScheme, TemplateType, Typography } from "@/lib/types/templates";

// Re-export types from the API for external use
export type {
  ResumeContent,
  PersonalInfo,
  Experience,
  Education,
  Skills,
  SkillWithLevel,
  Certification,
  Link,
  LinkType,
  NameOrder,
  PhoneFormat,
  ExperienceFormat,
} from "@/lib/api/types";

// Import types for internal use
import type { ResumeContent } from "@/lib/api/types";

// Custom Font Type
export interface CustomFont {
  name: string;
  fontFamily: string; // CSS font-family value
  dataUrl: string; // Base64 data URL for the font file
}

// Style Customization Types
export interface StyleCustomization {
  // Color theme preset name (e.g., "navy", "purple", "coral")
  colorTheme: string;
  // Individual color overrides
  colorOverrides: Partial<ColorScheme>;
  // Font theme preset name (e.g., "modern", "classic", "creative")
  fontTheme: string;
  // Individual font overrides
  fontOverrides: Partial<Typography>;
  // Custom uploaded fonts
  customFonts: CustomFont[];
}

/**
 * Legacy work experience type used in the store's UserInfo.
 * @deprecated Use Experience from @/lib/api/types for new code.
 */
export interface WorkExperience {
  company?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  awards?: string[];
}

/**
 * Legacy education type used in the store's UserInfo.
 * @deprecated Use Education from @/lib/api/types for new code.
 */
export interface LegacyEducation {
  school?: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

/**
 * Legacy skill type used in the store's UserInfo.
 * @deprecated Use Skills from @/lib/api/types for new code.
 */
export interface LegacySkill {
  name?: string;
  years?: string;
  proficiency?: string;
}

/**
 * Legacy certification type used in the store's UserInfo.
 * @deprecated Use Certification from @/lib/api/types for new code.
 */
export interface LegacyCertification {
  name?: string;
  expiration?: string;
}

/**
 * Legacy link type used in the store's UserInfo.
 * @deprecated Use Link from @/lib/api/types for new code.
 */
export interface LegacyLink {
  label?: string;
  url?: string;
}

/**
 * User information stored in the resume store.
 * This is the legacy format used for direct user input.
 * For resume content, use ResumeContent from @/lib/api/types.
 */
export interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  customUrl?: string;
  links?: LegacyLink[];
  experiences?: WorkExperience[];
  education?: LegacyEducation[];
  skills?: LegacySkill[];
  certifications?: LegacyCertification[];
}

/**
 * Job information for job applications.
 * Contains details about a job posting the user is applying to.
 */
export interface JobInfo {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  benefits?: string[];
  workType?: "onsite" | "remote" | "hybrid";
  basePay?: string;
  bonus?: string;
  stocks?: string;
}

export interface ResumeDocument {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Store interface
interface ResumeStore {
  // Template
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;

  // Style Customization
  styleCustomization: StyleCustomization;
  setColorTheme: (theme: string) => void;
  setColorOverride: (key: keyof ColorScheme, value: string) => void;
  setFontTheme: (theme: string) => void;
  setFontOverride: (key: keyof Typography, value: Typography[keyof Typography]) => void;
  addCustomFont: (font: CustomFont) => void;
  removeCustomFont: (fontName: string) => void;
  resetStyleCustomization: () => void;

  // User Info
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  resetUserInfo: () => void;

  // Job Info
  jobInfo: JobInfo;
  setJobInfo: (info: JobInfo) => void;
  updateJobInfo: (updates: Partial<JobInfo>) => void;
  resetJobInfo: () => void;

  // Jobs List
  jobs: JobInfo[];
  addJob: (job: JobInfo) => void;
  updateJob: (index: number, updates: Partial<JobInfo>) => void;
  removeJob: (index: number) => void;
  clearJobs: () => void;

  // Documents (merged from use-resume-documents)
  documents: ResumeDocument[];
  addDocument: (doc: ResumeDocument) => void;
  updateDocument: (id: string, updates: Partial<ResumeDocument>) => void;
  removeDocument: (id: string) => void;
  clearDocuments: () => void;

  // Content - uses Partial since content is built incrementally
  content: Partial<ResumeContent>;
  setContent: (data: Partial<ResumeContent>) => void;
  updateContent: (updates: Partial<ResumeContent>) => void;
  resetContent: () => void;

  // Global reset
  reset: () => void;
}

const initialStyleCustomization: StyleCustomization = {
  colorTheme: "purple", // Default theme matching modern template
  colorOverrides: {},
  fontTheme: "modern", // Default font theme
  fontOverrides: {},
  customFonts: [],
};

const initialState = {
  template: "modern" as TemplateType,
  styleCustomization: initialStyleCustomization,
  userInfo: {},
  jobInfo: {},
  jobs: [],
  documents: [],
  content: {},
};

export const useResumeStore = create<ResumeStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Template Actions
        setTemplate: (template) => set({ template }),

        // Style Customization Actions
        setColorTheme: (theme) =>
          set((state) => ({
            styleCustomization: {
              ...state.styleCustomization,
              colorTheme: theme,
              colorOverrides: {}, // Reset overrides when theme changes
            },
          })),
        setColorOverride: (key, value) =>
          set((state) => ({
            styleCustomization: {
              ...state.styleCustomization,
              colorOverrides: {
                ...state.styleCustomization.colorOverrides,
                [key]: value,
              },
            },
          })),
        setFontTheme: (theme) =>
          set((state) => ({
            styleCustomization: {
              ...state.styleCustomization,
              fontTheme: theme,
              fontOverrides: {}, // Reset overrides when theme changes
            },
          })),
        setFontOverride: (key, value) =>
          set((state) => ({
            styleCustomization: {
              ...state.styleCustomization,
              fontOverrides: {
                ...state.styleCustomization.fontOverrides,
                [key]: value,
              },
            },
          })),
        addCustomFont: (font) =>
          set((state) => ({
            styleCustomization: {
              ...state.styleCustomization,
              customFonts: [
                ...state.styleCustomization.customFonts.filter((f) => f.name !== font.name),
                font,
              ],
            },
          })),
        removeCustomFont: (fontName) =>
          set((state) => ({
            styleCustomization: {
              ...state.styleCustomization,
              customFonts: state.styleCustomization.customFonts.filter((f) => f.name !== fontName),
            },
          })),
        resetStyleCustomization: () => set({ styleCustomization: initialStyleCustomization }),

        // User Info Actions
        setUserInfo: (info) => set({ userInfo: { ...info } }),
        updateUserInfo: (updates) =>
          set((state) => ({
            userInfo: { ...state.userInfo, ...updates },
          })),
        resetUserInfo: () => set({ userInfo: {} }),

        // Job Info Actions
        setJobInfo: (info) => set({ jobInfo: { ...info } }),
        updateJobInfo: (updates) =>
          set((state) => ({
            jobInfo: { ...state.jobInfo, ...updates },
          })),
        resetJobInfo: () => set({ jobInfo: {} }),

        // Jobs List Actions
        addJob: (job) => set((state) => ({ jobs: [...state.jobs, { ...job }] })),
        updateJob: (index, updates) =>
          set((state) => ({
            jobs: state.jobs.map((job, i) => (i === index ? { ...job, ...updates } : job)),
          })),
        removeJob: (index) =>
          set((state) => ({
            jobs: state.jobs.filter((_, i) => i !== index),
          })),
        clearJobs: () => set({ jobs: [] }),

        // Documents Actions (merged from use-resume-documents)
        addDocument: (doc) =>
          set((state) => ({
            documents: [...state.documents, { ...doc, createdAt: new Date().toISOString() }],
          })),
        updateDocument: (id, updates) =>
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc,
            ),
          })),
        removeDocument: (id) =>
          set((state) => ({
            documents: state.documents.filter((doc) => doc.id !== id),
          })),
        clearDocuments: () => set({ documents: [] }),

        // Content Actions
        setContent: (data) => set({ content: { ...data } }),
        updateContent: (updates) =>
          set((state) => ({
            content: { ...state.content, ...updates },
          })),
        resetContent: () => set({ content: {} }),

        // Global Reset
        reset: () => set(initialState),
      }),
      {
        name: "resumier-resume-store",
        storage: createJSONStorage(() => ({
          async getItem(name: string) {
            const value = await get(name);
            return value ?? null;
          },
          async setItem(name: string, value: unknown) {
            await set(name, value);
          },
          async removeItem(name: string) {
            await del(name);
          },
        })),
      },
    ),
    { name: "ResumeStore" },
  ),
);

// Selectors for optimized access
export const selectUserInfo = (state: ResumeStore) => state.userInfo;
export const selectJobInfo = (state: ResumeStore) => state.jobInfo;
export const selectJobs = (state: ResumeStore) => state.jobs;
export const selectDocuments = (state: ResumeStore) => state.documents;
export const selectContent = (state: ResumeStore) => state.content;
export const selectStyleCustomization = (state: ResumeStore) => state.styleCustomization;

// Action selectors
export const selectUserInfoActions = (state: ResumeStore) => ({
  setUserInfo: state.setUserInfo,
  updateUserInfo: state.updateUserInfo,
  resetUserInfo: state.resetUserInfo,
});

export const selectJobInfoActions = (state: ResumeStore) => ({
  setJobInfo: state.setJobInfo,
  updateJobInfo: state.updateJobInfo,
  resetJobInfo: state.resetJobInfo,
});

export const selectJobsActions = (state: ResumeStore) => ({
  addJob: state.addJob,
  updateJob: state.updateJob,
  removeJob: state.removeJob,
  clearJobs: state.clearJobs,
});

export const selectDocumentsActions = (state: ResumeStore) => ({
  addDocument: state.addDocument,
  updateDocument: state.updateDocument,
  removeDocument: state.removeDocument,
  clearDocuments: state.clearDocuments,
});

export const selectContentActions = (state: ResumeStore) => ({
  setContent: state.setContent,
  updateContent: state.updateContent,
  resetContent: state.resetContent,
});

export const selectStyleActions = (state: ResumeStore) => ({
  setColorTheme: state.setColorTheme,
  setColorOverride: state.setColorOverride,
  setFontTheme: state.setFontTheme,
  setFontOverride: state.setFontOverride,
  addCustomFont: state.addCustomFont,
  removeCustomFont: state.removeCustomFont,
  resetStyleCustomization: state.resetStyleCustomization,
});
