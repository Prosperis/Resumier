import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Re-export types from the main resume store for backward compatibility
export type {
  UserInfo,
  JobInfo,
  WorkExperience,
  LegacyEducation as Education,
  LegacySkill as Skill,
  LegacyCertification as Certification,
  LegacyLink as Link,
} from "@/stores/resume-store";

// Import types for internal use
import type { UserInfo, JobInfo } from "@/stores/resume-store";

import type { ResumeContent } from "@/lib/api/types";

// Re-export ResumeContent for external use
export type { ResumeContent } from "@/lib/api/types";

/**
 * Reorder an array by moving an item from one index to another
 */
function reorderArray<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Resume store state and actions.
 * Uses Partial<ResumeContent> since content is built incrementally.
 */
export interface ResumeStore {
  userInfo: UserInfo;
  jobInfo: JobInfo;
  jobs: JobInfo[];
  content: Partial<ResumeContent>;
  setUserInfo: (info: UserInfo) => void;
  setJobInfo: (info: JobInfo) => void;
  addJob: (job: JobInfo) => void;
  removeJob: (index: number) => void;
  setContent: (data: Partial<ResumeContent>) => void;
  reset: () => void;
  // Reordering actions for drag and drop
  reorderExperiences: (startIndex: number, endIndex: number) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;
  reorderCertifications: (startIndex: number, endIndex: number) => void;
  reorderLinks: (startIndex: number, endIndex: number) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist<ResumeStore>(
    (set) => ({
      userInfo: {},
      jobInfo: {},
      jobs: [],
      content: {},
      setUserInfo: (info) => set({ userInfo: { ...info } }),
      setJobInfo: (info) => set({ jobInfo: { ...info } }),
      addJob: (job) => set((state) => ({ jobs: [...state.jobs, { ...job }] })),
      removeJob: (index) => set((state) => ({ jobs: state.jobs.filter((_, i) => i !== index) })),
      setContent: (data) => set({ content: { ...data } }),
      reset: () => set({ userInfo: {}, jobInfo: {}, jobs: [], content: {} }),
      // Reordering actions for drag and drop
      reorderExperiences: (startIndex, endIndex) =>
        set((state) => ({
          userInfo: {
            ...state.userInfo,
            experiences: reorderArray(state.userInfo.experiences || [], startIndex, endIndex),
          },
        })),
      reorderEducation: (startIndex, endIndex) =>
        set((state) => ({
          userInfo: {
            ...state.userInfo,
            education: reorderArray(state.userInfo.education || [], startIndex, endIndex),
          },
        })),
      reorderSkills: (startIndex, endIndex) =>
        set((state) => ({
          userInfo: {
            ...state.userInfo,
            skills: reorderArray(state.userInfo.skills || [], startIndex, endIndex),
          },
        })),
      reorderCertifications: (startIndex, endIndex) =>
        set((state) => ({
          userInfo: {
            ...state.userInfo,
            certifications: reorderArray(state.userInfo.certifications || [], startIndex, endIndex),
          },
        })),
      reorderLinks: (startIndex, endIndex) =>
        set((state) => ({
          userInfo: {
            ...state.userInfo,
            links: reorderArray(state.userInfo.links || [], startIndex, endIndex),
          },
        })),
    }),
    {
      name: "resumier-web-store",
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
);
