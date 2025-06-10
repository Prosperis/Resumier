import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

export interface WorkExperience {
  company?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
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
  name?: string
  years?: string
  proficiency?: string
}

export interface Certification {
  name?: string;
  expiration?: string;
}

export interface Link {
  label?: string
  url?: string
}

export interface UserInfo {
  name?: string
  email?: string
  phone?: string
  address?: string
  customUrl?: string
  links?: Link[]
  experiences?: WorkExperience[]
  education?: Education[]
  skills?: Skill[]
  certifications?: Certification[]
  [key: string]: unknown
}

export interface JobInfo {
  title?: string
  company?: string
  location?: string
  description?: string
  workType?: "onsite" | "remote" | "hybrid"
  basePay?: string
  bonus?: string
  stocks?: string
  [key: string]: unknown
}

export interface ResumeContent {
  [key: string]: unknown;
}

export interface ResumeStore {
  userInfo: UserInfo
  jobInfo: JobInfo
  jobs: JobInfo[]
  content: ResumeContent
  setUserInfo: (info: UserInfo) => void
  setJobInfo: (info: JobInfo) => void
  addJob: (job: JobInfo) => void
  removeJob: (index: number) => void
  setContent: (data: ResumeContent) => void
  reset: () => void
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
      removeJob: (index) =>
        set((state) => ({ jobs: state.jobs.filter((_, i) => i !== index) })),
      setContent: (data) => set({ content: { ...data } }),
      reset: () => set({ userInfo: {}, jobInfo: {}, jobs: [], content: {} }),
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
