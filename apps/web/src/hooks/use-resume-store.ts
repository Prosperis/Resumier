import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { get, set, del } from "idb-keyval"

export interface WorkExperience {
  company?: string
  title?: string
  startDate?: string
  endDate?: string
  current?: boolean
  description?: string
}

export interface Education {
  school?: string
  degree?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface UserInfo {
  name?: string
  email?: string
  phone?: string
  address?: string
  experiences?: WorkExperience[]
  education?: Education[]
  skills?: string[]
  certifications?: string[]
  [key: string]: unknown
}

export interface JobInfo {
  description?: string
  [key: string]: unknown
}

export interface ResumeContent {
  [key: string]: unknown
}

export interface ResumeStore {
  userInfo: UserInfo
  jobInfo: JobInfo
  content: ResumeContent
  setUserInfo: (info: UserInfo) => void
  setJobInfo: (info: JobInfo) => void
  setContent: (data: ResumeContent) => void
  reset: () => void
}

export const useResumeStore = create<ResumeStore>()(
  persist<ResumeStore>(
    (set) => ({
      userInfo: {},
      jobInfo: {},
      content: {},
      setUserInfo: (info) => set({ userInfo: { ...info } }),
      setJobInfo: (info) => set({ jobInfo: { ...info } }),
      setContent: (data) => set({ content: { ...data } }),
      reset: () => set({ userInfo: {}, jobInfo: {}, content: {} }),
    }),
    {
      name: "resumier-web-store",
      storage: createJSONStorage(() => ({
        async getItem(name: string) {
          const value = await get(name)
          return value ?? null
        },
        async setItem(name: string, value: unknown) {
          await set(name, value)
        },
        async removeItem(name: string) {
          await del(name)
        },
      })),
    },
  ),
)
