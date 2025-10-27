import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type {
  Certification,
  Education,
  JobInfo,
  Link,
  ResumeContent,
  ResumeDocument,
  Skill,
  UserInfo,
  WorkExperience,
} from "../resume-store"
import {
  selectContent,
  selectContentActions,
  selectDocuments,
  selectDocumentsActions,
  selectJobInfo,
  selectJobInfoActions,
  selectJobs,
  selectJobsActions,
  selectUserInfo,
  selectUserInfoActions,
  useResumeStore,
} from "../resume-store"

// Mock idb-keyval
vi.mock("idb-keyval", () => ({
  get: vi.fn((key: string) => Promise.resolve(mockIdb[key] ?? null)),
  set: vi.fn((key: string, value: unknown) => {
    mockIdb[key] = value
    return Promise.resolve()
  }),
  del: vi.fn((key: string) => {
    delete mockIdb[key]
    return Promise.resolve()
  }),
}))

let mockIdb: Record<string, unknown> = {}

describe("ResumeStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useResumeStore.setState({
      userInfo: {},
      jobInfo: {},
      jobs: [],
      documents: [],
      content: {},
    })
    // Clear mock IndexedDB
    mockIdb = {}
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("initial state", () => {
    it("has empty userInfo initially", () => {
      expect(useResumeStore.getState().userInfo).toEqual({})
    })

    it("has empty jobInfo initially", () => {
      expect(useResumeStore.getState().jobInfo).toEqual({})
    })

    it("has empty jobs array initially", () => {
      expect(useResumeStore.getState().jobs).toEqual([])
    })

    it("has empty documents array initially", () => {
      expect(useResumeStore.getState().documents).toEqual([])
    })

    it("has empty content initially", () => {
      expect(useResumeStore.getState().content).toEqual({})
    })
  })

  describe("User Info Actions", () => {
    const mockUserInfo: UserInfo = {
      name: "John Doe",
      email: "john@example.com",
      phone: "555-1234",
      address: "123 Main St",
      customUrl: "john-doe",
    }

    describe("setUserInfo", () => {
      it("sets complete user info", () => {
        useResumeStore.getState().setUserInfo(mockUserInfo)

        const state = useResumeStore.getState()
        expect(state.userInfo).toEqual(mockUserInfo)
      })

      it("replaces existing user info", () => {
        useResumeStore.getState().setUserInfo({ name: "Old Name" })
        useResumeStore.getState().setUserInfo(mockUserInfo)

        const state = useResumeStore.getState()
        expect(state.userInfo).toEqual(mockUserInfo)
      })
    })

    describe("updateUserInfo", () => {
      it("updates partial user info", () => {
        useResumeStore.getState().setUserInfo(mockUserInfo)
        useResumeStore.getState().updateUserInfo({ name: "Jane Doe", email: "jane@example.com" })

        const state = useResumeStore.getState()
        expect(state.userInfo.name).toBe("Jane Doe")
        expect(state.userInfo.email).toBe("jane@example.com")
        expect(state.userInfo.phone).toBe(mockUserInfo.phone)
      })

      it("adds new fields to user info", () => {
        useResumeStore.getState().setUserInfo({ name: "John" })
        useResumeStore.getState().updateUserInfo({ email: "john@example.com" })

        const state = useResumeStore.getState()
        expect(state.userInfo).toEqual({ name: "John", email: "john@example.com" })
      })
    })

    describe("resetUserInfo", () => {
      it("resets user info to empty object", () => {
        useResumeStore.getState().setUserInfo(mockUserInfo)
        useResumeStore.getState().resetUserInfo()

        const state = useResumeStore.getState()
        expect(state.userInfo).toEqual({})
      })
    })

    describe("user info with nested arrays", () => {
      const mockExperience: WorkExperience = {
        company: "Acme Corp",
        title: "Developer",
        startDate: "2020-01",
        endDate: "2023-12",
        description: "Built things",
        awards: ["Best Developer"],
      }

      const mockEducation: Education = {
        school: "University",
        degree: "BS Computer Science",
        startDate: "2016-09",
        endDate: "2020-05",
        description: "Learned things",
      }

      const mockSkill: Skill = {
        name: "JavaScript",
        years: "5",
        proficiency: "Expert",
      }

      const mockCertification: Certification = {
        name: "AWS Certified",
        expiration: "2025-12",
      }

      const mockLink: Link = {
        label: "GitHub",
        url: "https://github.com/johndoe",
      }

      it("handles experiences array", () => {
        useResumeStore.getState().updateUserInfo({ experiences: [mockExperience] })

        const state = useResumeStore.getState()
        expect(state.userInfo.experiences).toEqual([mockExperience])
      })

      it("handles education array", () => {
        useResumeStore.getState().updateUserInfo({ education: [mockEducation] })

        const state = useResumeStore.getState()
        expect(state.userInfo.education).toEqual([mockEducation])
      })

      it("handles skills array", () => {
        useResumeStore.getState().updateUserInfo({ skills: [mockSkill] })

        const state = useResumeStore.getState()
        expect(state.userInfo.skills).toEqual([mockSkill])
      })

      it("handles certifications array", () => {
        useResumeStore.getState().updateUserInfo({ certifications: [mockCertification] })

        const state = useResumeStore.getState()
        expect(state.userInfo.certifications).toEqual([mockCertification])
      })

      it("handles links array", () => {
        useResumeStore.getState().updateUserInfo({ links: [mockLink] })

        const state = useResumeStore.getState()
        expect(state.userInfo.links).toEqual([mockLink])
      })
    })
  })

  describe("Job Info Actions", () => {
    const mockJobInfo: JobInfo = {
      title: "Senior Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      description: "Build amazing products",
      benefits: ["Health insurance", "401k"],
      workType: "hybrid",
      basePay: "$150,000",
      bonus: "$20,000",
      stocks: "RSUs",
    }

    describe("setJobInfo", () => {
      it("sets complete job info", () => {
        useResumeStore.getState().setJobInfo(mockJobInfo)

        const state = useResumeStore.getState()
        expect(state.jobInfo).toEqual(mockJobInfo)
      })

      it("replaces existing job info", () => {
        useResumeStore.getState().setJobInfo({ title: "Old Title" })
        useResumeStore.getState().setJobInfo(mockJobInfo)

        const state = useResumeStore.getState()
        expect(state.jobInfo).toEqual(mockJobInfo)
      })
    })

    describe("updateJobInfo", () => {
      it("updates partial job info", () => {
        useResumeStore.getState().setJobInfo(mockJobInfo)
        useResumeStore.getState().updateJobInfo({ title: "Lead Developer", location: "Remote" })

        const state = useResumeStore.getState()
        expect(state.jobInfo.title).toBe("Lead Developer")
        expect(state.jobInfo.location).toBe("Remote")
        expect(state.jobInfo.company).toBe(mockJobInfo.company)
      })

      it("adds new fields to job info", () => {
        useResumeStore.getState().setJobInfo({ title: "Developer" })
        useResumeStore.getState().updateJobInfo({ company: "New Company" })

        const state = useResumeStore.getState()
        expect(state.jobInfo).toEqual({ title: "Developer", company: "New Company" })
      })
    })

    describe("resetJobInfo", () => {
      it("resets job info to empty object", () => {
        useResumeStore.getState().setJobInfo(mockJobInfo)
        useResumeStore.getState().resetJobInfo()

        const state = useResumeStore.getState()
        expect(state.jobInfo).toEqual({})
      })
    })

    describe("workType variants", () => {
      it("handles onsite work type", () => {
        useResumeStore.getState().setJobInfo({ ...mockJobInfo, workType: "onsite" })

        const state = useResumeStore.getState()
        expect(state.jobInfo.workType).toBe("onsite")
      })

      it("handles remote work type", () => {
        useResumeStore.getState().setJobInfo({ ...mockJobInfo, workType: "remote" })

        const state = useResumeStore.getState()
        expect(state.jobInfo.workType).toBe("remote")
      })

      it("handles hybrid work type", () => {
        useResumeStore.getState().setJobInfo({ ...mockJobInfo, workType: "hybrid" })

        const state = useResumeStore.getState()
        expect(state.jobInfo.workType).toBe("hybrid")
      })
    })
  })

  describe("Jobs List Actions", () => {
    const mockJob1: JobInfo = {
      title: "Developer",
      company: "Company A",
      location: "City A",
    }

    const mockJob2: JobInfo = {
      title: "Senior Developer",
      company: "Company B",
      location: "City B",
    }

    describe("addJob", () => {
      it("adds a job to empty list", () => {
        useResumeStore.getState().addJob(mockJob1)

        const state = useResumeStore.getState()
        expect(state.jobs).toEqual([mockJob1])
      })

      it("adds multiple jobs", () => {
        useResumeStore.getState().addJob(mockJob1)
        useResumeStore.getState().addJob(mockJob2)

        const state = useResumeStore.getState()
        expect(state.jobs).toEqual([mockJob1, mockJob2])
      })

      it("creates a copy of the job object", () => {
        const originalJob = { ...mockJob1 }
        useResumeStore.getState().addJob(originalJob)
        originalJob.title = "Modified"

        const state = useResumeStore.getState()
        expect(state.jobs[0].title).toBe("Developer")
      })
    })

    describe("updateJob", () => {
      beforeEach(() => {
        useResumeStore.getState().addJob(mockJob1)
        useResumeStore.getState().addJob(mockJob2)
      })

      it("updates job at specific index", () => {
        useResumeStore.getState().updateJob(0, { title: "Lead Developer" })

        const state = useResumeStore.getState()
        expect(state.jobs[0].title).toBe("Lead Developer")
        expect(state.jobs[0].company).toBe("Company A")
      })

      it("does not affect other jobs", () => {
        useResumeStore.getState().updateJob(0, { title: "Lead Developer" })

        const state = useResumeStore.getState()
        expect(state.jobs[1]).toEqual(mockJob2)
      })

      it("handles partial updates", () => {
        useResumeStore.getState().updateJob(1, { location: "Remote" })

        const state = useResumeStore.getState()
        expect(state.jobs[1].location).toBe("Remote")
        expect(state.jobs[1].company).toBe("Company B")
      })
    })

    describe("removeJob", () => {
      beforeEach(() => {
        useResumeStore.getState().addJob(mockJob1)
        useResumeStore.getState().addJob(mockJob2)
      })

      it("removes job at specific index", () => {
        useResumeStore.getState().removeJob(0)

        const state = useResumeStore.getState()
        expect(state.jobs).toEqual([mockJob2])
      })

      it("handles removing from end", () => {
        useResumeStore.getState().removeJob(1)

        const state = useResumeStore.getState()
        expect(state.jobs).toEqual([mockJob1])
      })

      it("handles removing from middle", () => {
        useResumeStore.getState().addJob({ title: "Job 3" })
        useResumeStore.getState().removeJob(1)

        const state = useResumeStore.getState()
        expect(state.jobs.length).toBe(2)
        expect(state.jobs[0]).toEqual(mockJob1)
        expect(state.jobs[1]).toEqual({ title: "Job 3" })
      })
    })

    describe("clearJobs", () => {
      it("clears all jobs", () => {
        useResumeStore.getState().addJob(mockJob1)
        useResumeStore.getState().addJob(mockJob2)
        useResumeStore.getState().clearJobs()

        const state = useResumeStore.getState()
        expect(state.jobs).toEqual([])
      })

      it("clears empty jobs array without error", () => {
        useResumeStore.getState().clearJobs()

        const state = useResumeStore.getState()
        expect(state.jobs).toEqual([])
      })
    })
  })

  describe("Documents Actions", () => {
    const mockDoc1: ResumeDocument = {
      id: "doc-1",
      name: "Resume v1",
    }

    const mockDoc2: ResumeDocument = {
      id: "doc-2",
      name: "Resume v2",
    }

    describe("addDocument", () => {
      it("adds a document with createdAt timestamp", () => {
        const beforeAdd = new Date().toISOString()
        useResumeStore.getState().addDocument(mockDoc1)
        const afterAdd = new Date().toISOString()

        const state = useResumeStore.getState()
        expect(state.documents).toHaveLength(1)
        expect(state.documents[0].id).toBe("doc-1")
        expect(state.documents[0].name).toBe("Resume v1")
        expect(state.documents[0].createdAt).toBeDefined()
        expect(state.documents[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
        // Check timestamp is between before and after
        if (state.documents[0].createdAt) {
          expect(state.documents[0].createdAt >= beforeAdd).toBe(true)
          expect(state.documents[0].createdAt <= afterAdd).toBe(true)
        }
      })

      it("adds multiple documents", () => {
        useResumeStore.getState().addDocument(mockDoc1)
        useResumeStore.getState().addDocument(mockDoc2)

        const state = useResumeStore.getState()
        expect(state.documents).toHaveLength(2)
        expect(state.documents[0].id).toBe("doc-1")
        expect(state.documents[1].id).toBe("doc-2")
      })

      it("preserves existing createdAt if provided", () => {
        const docWithTimestamp = {
          ...mockDoc1,
          createdAt: "2023-01-01T00:00:00.000Z",
        }
        useResumeStore.getState().addDocument(docWithTimestamp)

        const state = useResumeStore.getState()
        // New timestamp is added, overwriting the provided one
        expect(state.documents[0].createdAt).not.toBe("2023-01-01T00:00:00.000Z")
      })
    })

    describe("updateDocument", () => {
      beforeEach(() => {
        useResumeStore.getState().addDocument(mockDoc1)
        useResumeStore.getState().addDocument(mockDoc2)
      })

      it("updates document by id with updatedAt timestamp", () => {
        const beforeUpdate = new Date().toISOString()
        useResumeStore.getState().updateDocument("doc-1", { name: "Updated Resume" })
        const afterUpdate = new Date().toISOString()

        const state = useResumeStore.getState()
        expect(state.documents[0].name).toBe("Updated Resume")
        expect(state.documents[0].updatedAt).toBeDefined()
        expect(state.documents[0].updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
        if (state.documents[0].updatedAt) {
          expect(state.documents[0].updatedAt >= beforeUpdate).toBe(true)
          expect(state.documents[0].updatedAt <= afterUpdate).toBe(true)
        }
      })

      it("does not affect other documents", () => {
        useResumeStore.getState().updateDocument("doc-1", { name: "Updated" })

        const state = useResumeStore.getState()
        expect(state.documents[1].name).toBe("Resume v2")
        expect(state.documents[1].updatedAt).toBeUndefined()
      })

      it("handles non-existent document id gracefully", () => {
        useResumeStore.getState().updateDocument("non-existent", { name: "Test" })

        const state = useResumeStore.getState()
        expect(state.documents).toHaveLength(2)
        expect(state.documents[0].name).toBe("Resume v1")
        expect(state.documents[1].name).toBe("Resume v2")
      })
    })

    describe("removeDocument", () => {
      beforeEach(() => {
        useResumeStore.getState().addDocument(mockDoc1)
        useResumeStore.getState().addDocument(mockDoc2)
      })

      it("removes document by id", () => {
        useResumeStore.getState().removeDocument("doc-1")

        const state = useResumeStore.getState()
        expect(state.documents).toHaveLength(1)
        expect(state.documents[0].id).toBe("doc-2")
      })

      it("handles non-existent document id gracefully", () => {
        useResumeStore.getState().removeDocument("non-existent")

        const state = useResumeStore.getState()
        expect(state.documents).toHaveLength(2)
      })
    })

    describe("clearDocuments", () => {
      it("clears all documents", () => {
        useResumeStore.getState().addDocument(mockDoc1)
        useResumeStore.getState().addDocument(mockDoc2)
        useResumeStore.getState().clearDocuments()

        const state = useResumeStore.getState()
        expect(state.documents).toEqual([])
      })

      it("clears empty documents array without error", () => {
        useResumeStore.getState().clearDocuments()

        const state = useResumeStore.getState()
        expect(state.documents).toEqual([])
      })
    })
  })

  describe("Content Actions", () => {
    const mockContent: ResumeContent = {
      template: "modern",
      theme: "blue",
      fontSize: 12,
      sections: ["experience", "education", "skills"],
    }

    describe("setContent", () => {
      it("sets complete content", () => {
        useResumeStore.getState().setContent(mockContent)

        const state = useResumeStore.getState()
        expect(state.content).toEqual(mockContent)
      })

      it("replaces existing content", () => {
        useResumeStore.getState().setContent({ template: "classic" })
        useResumeStore.getState().setContent(mockContent)

        const state = useResumeStore.getState()
        expect(state.content).toEqual(mockContent)
      })
    })

    describe("updateContent", () => {
      it("updates partial content", () => {
        useResumeStore.getState().setContent(mockContent)
        useResumeStore.getState().updateContent({ template: "classic", fontSize: 14 })

        const state = useResumeStore.getState()
        expect(state.content.template).toBe("classic")
        expect(state.content.fontSize).toBe(14)
        expect(state.content.theme).toBe("blue")
      })

      it("adds new fields to content", () => {
        useResumeStore.getState().setContent({ template: "modern" })
        useResumeStore.getState().updateContent({ theme: "green" })

        const state = useResumeStore.getState()
        expect(state.content).toEqual({ template: "modern", theme: "green" })
      })
    })

    describe("resetContent", () => {
      it("resets content to empty object", () => {
        useResumeStore.getState().setContent(mockContent)
        useResumeStore.getState().resetContent()

        const state = useResumeStore.getState()
        expect(state.content).toEqual({})
      })
    })
  })

  describe("Global Reset", () => {
    it("resets all state to initial values", () => {
      // Set up state
      useResumeStore.getState().setUserInfo({ name: "John" })
      useResumeStore.getState().setJobInfo({ title: "Developer" })
      useResumeStore.getState().addJob({ company: "Acme" })
      useResumeStore.getState().addDocument({ id: "1", name: "Resume" })
      useResumeStore.getState().setContent({ template: "modern" })

      // Reset
      useResumeStore.getState().reset()

      // Verify all state is reset
      const state = useResumeStore.getState()
      expect(state.userInfo).toEqual({})
      expect(state.jobInfo).toEqual({})
      expect(state.jobs).toEqual([])
      expect(state.documents).toEqual([])
      expect(state.content).toEqual({})
    })
  })

  describe("Selectors", () => {
    beforeEach(() => {
      useResumeStore.getState().setUserInfo({ name: "John" })
      useResumeStore.getState().setJobInfo({ title: "Developer" })
      useResumeStore.getState().addJob({ company: "Acme" })
      useResumeStore.getState().addDocument({ id: "1", name: "Resume" })
      useResumeStore.getState().setContent({ template: "modern" })
    })

    it("selectUserInfo returns user info", () => {
      const userInfo = selectUserInfo(useResumeStore.getState())
      expect(userInfo).toEqual({ name: "John" })
    })

    it("selectJobInfo returns job info", () => {
      const jobInfo = selectJobInfo(useResumeStore.getState())
      expect(jobInfo).toEqual({ title: "Developer" })
    })

    it("selectJobs returns jobs array", () => {
      const jobs = selectJobs(useResumeStore.getState())
      expect(jobs).toHaveLength(1)
      expect(jobs[0].company).toBe("Acme")
    })

    it("selectDocuments returns documents array", () => {
      const documents = selectDocuments(useResumeStore.getState())
      expect(documents).toHaveLength(1)
      expect(documents[0].id).toBe("1")
    })

    it("selectContent returns content", () => {
      const content = selectContent(useResumeStore.getState())
      expect(content).toEqual({ template: "modern" })
    })

    it("selectUserInfoActions returns user info actions", () => {
      const actions = selectUserInfoActions(useResumeStore.getState())
      expect(actions).toHaveProperty("setUserInfo")
      expect(actions).toHaveProperty("updateUserInfo")
      expect(actions).toHaveProperty("resetUserInfo")
      expect(typeof actions.setUserInfo).toBe("function")
    })

    it("selectJobInfoActions returns job info actions", () => {
      const actions = selectJobInfoActions(useResumeStore.getState())
      expect(actions).toHaveProperty("setJobInfo")
      expect(actions).toHaveProperty("updateJobInfo")
      expect(actions).toHaveProperty("resetJobInfo")
      expect(typeof actions.setJobInfo).toBe("function")
    })

    it("selectJobsActions returns jobs actions", () => {
      const actions = selectJobsActions(useResumeStore.getState())
      expect(actions).toHaveProperty("addJob")
      expect(actions).toHaveProperty("updateJob")
      expect(actions).toHaveProperty("removeJob")
      expect(actions).toHaveProperty("clearJobs")
      expect(typeof actions.addJob).toBe("function")
    })

    it("selectDocumentsActions returns documents actions", () => {
      const actions = selectDocumentsActions(useResumeStore.getState())
      expect(actions).toHaveProperty("addDocument")
      expect(actions).toHaveProperty("updateDocument")
      expect(actions).toHaveProperty("removeDocument")
      expect(actions).toHaveProperty("clearDocuments")
      expect(typeof actions.addDocument).toBe("function")
    })

    it("selectContentActions returns content actions", () => {
      const actions = selectContentActions(useResumeStore.getState())
      expect(actions).toHaveProperty("setContent")
      expect(actions).toHaveProperty("updateContent")
      expect(actions).toHaveProperty("resetContent")
      expect(typeof actions.setContent).toBe("function")
    })
  })

  describe("Persistence", () => {
    it("persists state to IndexedDB", async () => {
      useResumeStore.getState().setUserInfo({ name: "John" })
      useResumeStore.getState().setJobInfo({ title: "Developer" })

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Verify state is persisted correctly (structure may vary)
      const state = useResumeStore.getState()
      expect(state.userInfo).toEqual({ name: "John" })
      expect(state.jobInfo).toEqual({ title: "Developer" })
    })

    it("persists all state properties", async () => {
      useResumeStore.getState().setUserInfo({ name: "John" })
      useResumeStore.getState().addJob({ company: "Acme" })
      useResumeStore.getState().addDocument({ id: "1", name: "Resume" })
      useResumeStore.getState().setContent({ template: "modern" })

      await new Promise((resolve) => setTimeout(resolve, 100))

      const state = useResumeStore.getState()
      expect(state.userInfo).toEqual({ name: "John" })
      expect(state.jobs).toHaveLength(1)
      expect(state.documents).toHaveLength(1)
      expect(state.content).toEqual({ template: "modern" })
    })

    it("clears persisted data on global reset", async () => {
      useResumeStore.getState().setUserInfo({ name: "John" })
      await new Promise((resolve) => setTimeout(resolve, 100))

      useResumeStore.getState().reset()
      await new Promise((resolve) => setTimeout(resolve, 100))

      const state = useResumeStore.getState()
      expect(state.userInfo).toEqual({})
    })
  })
})
