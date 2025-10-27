import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock idb-keyval before importing the store
vi.mock("idb-keyval", () => ({
	get: vi.fn(() => Promise.resolve(null)),
	set: vi.fn(() => Promise.resolve()),
	del: vi.fn(() => Promise.resolve()),
}))

// Import store after mocking dependencies
import { useResumeStore } from "./use-resume-store"

describe("useResumeStore", () => {
	beforeEach(() => {
		// Reset store to initial state before each test
		useResumeStore.setState({
			userInfo: {},
			jobInfo: {},
			jobs: [],
			education: [],
			skills: [],
			certifications: [],
			links: [],
			content: {},
		})
	})

	describe("Job Management", () => {
		it("adds a new job", () => {
			const job = {
				company: "Test Company",
				title: "Software Engineer",
				startDate: "2024-01-01",
				description: "Test description",
			}

			useResumeStore.getState().addJob(job)
			const state = useResumeStore.getState()

			expect(state.jobs).toHaveLength(1)
			expect(state.jobs[0]).toMatchObject(job)
		})

		it("adds multiple jobs", () => {
			useResumeStore.getState().addJob({ title: "Job 1" })
			useResumeStore.getState().addJob({ title: "Job 2" })
			useResumeStore.getState().addJob({ title: "Job 3" })

			const state = useResumeStore.getState()
			expect(state.jobs).toHaveLength(3)
		})

		it("removes a job by index", () => {
			const store = useResumeStore.getState()
			store.addJob({ title: "Job A" })
			store.addJob({ title: "Job B" })
			store.addJob({ title: "Job C" })

			store.removeJob(1) // Remove "Job B"


		const finalState = useResumeStore.getState()
		expect(finalState.jobs).toHaveLength(2)
		expect(finalState.jobs[0].title).toBe("Job A")
		expect(finalState.jobs[1].title).toBe("Job C")
	})

	it("reorders experiences within userInfo", () => {
		const store = useResumeStore.getState()
		store.setUserInfo({
			experiences: [
				{ company: "Company 1", title: "Role 1" },
				{ company: "Company 2", title: "Role 2" },
				{ company: "Company 3", title: "Role 3" },
			],
		})

		store.reorderExperiences(0, 2) // Move first experience to last

		const state = useResumeStore.getState()
		expect(state.userInfo.experiences?.[0]?.company).toBe("Company 2")
		expect(state.userInfo.experiences?.[1]?.company).toBe("Company 3")
		expect(state.userInfo.experiences?.[2]?.company).toBe("Company 1")
	})
})
	describe("User Info Management", () => {
		it("sets user info", () => {
			const userInfo = {
				name: "John Doe",
				email: "john@example.com",
				phone: "123-456-7890",
			}

			useResumeStore.getState().setUserInfo(userInfo)
			const state = useResumeStore.getState()

			expect(state.userInfo).toMatchObject(userInfo)
		})


		it("updates user info partially", () => {
			// setUserInfo replaces the entire userInfo object, so we need to spread existing data
			const store1 = useResumeStore.getState()
			store1.setUserInfo({ name: "Alice" })

			// Get fresh state after first update
			const store2 = useResumeStore.getState()
			store2.setUserInfo({ ...store2.userInfo, email: "alice@example.com" })

			const state = useResumeStore.getState()
			expect(state.userInfo.name).toBe("Alice")
			expect(state.userInfo.email).toBe("alice@example.com")
		})
	})
	describe("State Reset", () => {
		it("resets all state to initial values", () => {
			const store = useResumeStore.getState()
			store.setUserInfo({ name: "Test User" })
			store.addJob({ title: "Test Job" })
			store.setJobInfo({ title: "Test Position" })

			store.reset()

			const state = useResumeStore.getState()
			expect(state.userInfo).toEqual({})
			expect(state.jobInfo).toEqual({})
			expect(state.jobs).toHaveLength(0)
			expect(state.content).toEqual({})
		})
	})

	describe("Education Management", () => {
		it("adds education entry to userInfo", () => {
			const store = useResumeStore.getState()
			const education = {
				school: "Test University",
				degree: "Bachelor's",
				startDate: "2020-01-01",
			}

			// Education is part of userInfo
			store.setUserInfo({ education: [education] })
			const state = useResumeStore.getState()

			expect(state.userInfo.education).toHaveLength(1)
			expect(state.userInfo.education?.[0]).toMatchObject(education)
		})

		it("reorders education entries", () => {
			const store = useResumeStore.getState()
			store.setUserInfo({
				education: [
					{ school: "School 1", degree: "Degree 1" },
					{ school: "School 2", degree: "Degree 2" },
					{ school: "School 3", degree: "Degree 3" },
				],
			})

			store.reorderEducation(0, 2) // Move first to last

			const state = useResumeStore.getState()
			expect(state.userInfo.education).toHaveLength(3)
			expect(state.userInfo.education?.[0]?.school).toBe("School 2")
			expect(state.userInfo.education?.[1]?.school).toBe("School 3")
			expect(state.userInfo.education?.[2]?.school).toBe("School 1")
		})
	})
})

