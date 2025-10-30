import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Reorder an array by moving an item from one index to another
 */
function reorderArray<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export interface WorkExperience {
  company?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  awards?: string[];
}

export interface Education {
  school?: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Skill {
  name?: string;
  years?: string;
  proficiency?: string;
}

export interface Certification {
  name?: string;
  expiration?: string;
}

export interface Link {
  label?: string;
  url?: string;
}

export interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  customUrl?: string;
  links?: Link[];
  experiences?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
  certifications?: Certification[];
  [key: string]: unknown;
}

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
  [key: string]: unknown;
}

export interface ResumeContent {
  [key: string]: unknown;
}

export interface ResumeStore {
  userInfo: UserInfo;
  jobInfo: JobInfo;
  jobs: JobInfo[];
  content: ResumeContent;
  setUserInfo: (info: UserInfo) => void;
  setJobInfo: (info: JobInfo) => void;
  addJob: (job: JobInfo) => void;
  removeJob: (index: number) => void;
  setContent: (data: ResumeContent) => void;
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
    }
  )
);
