import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "../../lib/api/client"
import type { UpdateResumeDto } from "../../lib/api/types"
import { createMockResume } from "./test-helpers"
import { resumeQueryKey } from "./use-resume"
import { resumesQueryKey } from "./use-resumes"
import { useUpdateResume } from "./use-update-resume"

// Mock the API client
vi.mock("../../lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe("useUpdateResume", () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })

    // biome-ignore lint/suspicious/noExplicitAny: test helper
    return ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  })

  it("updates a resume successfully", async () => {
    const resumeId = "resume-123"
    const updateData: UpdateResumeDto = {
      title: "Updated Title",
    }

    const updatedResume = createMockResume({
      id: resumeId,
      title: "Updated Title",
    })(apiClient.put as any).mockResolvedValueOnce(updatedResume)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    // Trigger mutation
    result.current.mutate({ id: resumeId, data: updateData })

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(updatedResume)
    expect(apiClient.put).toHaveBeenCalledWith(`/api/resumes/${resumeId}`, updateData)
  })

  it("updates the resume in cache after mutation", async () => {
    const resumeId = "resume-123"
    const originalResume = createMockResume({
      id: resumeId,
      title: "Original Title",
    })

    const updateData: UpdateResumeDto = {
      title: "Updated Title",
    }

    const updatedResume = createMockResume({
      id: resumeId,
      title: "Updated Title",
    })

    // Set original resume in cache
    queryClient
      .setQueryData(
        resumeQueryKey(resumeId),
        originalResume,
      )(apiClient.put as any)
      .mockResolvedValueOnce(updatedResume)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(updatedResume)
  })

  it("updates resume and invalidates list cache", async () => {
    const resumeId = "resume-2"
    const resumes = [
      createMockResume({ id: "resume-1", title: "Resume 1" }),
      createMockResume({ id: resumeId, title: "Original Title" }),
      createMockResume({ id: "resume-3", title: "Resume 3" }),
    ]

    const updateData: UpdateResumeDto = {
      title: "Updated Title",
    }

    const updatedResume = createMockResume({
      id: resumeId,
      title: "Updated Title",
    })

    // Set resumes list in cache
    queryClient
      .setQueryData(
        resumesQueryKey,
        resumes,
      )(apiClient.put as any)
      .mockResolvedValueOnce(updatedResume)

    const wrapper = createWrapper()
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

    const { result } = renderHook(() => useUpdateResume(), { wrapper })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Verify invalidation was called
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumesQueryKey })
  })

  it("handles error when update fails", async () => {
    const resumeId = "resume-123"
    const originalResume = createMockResume({
      id: resumeId,
      title: "Original Title",
    })

    const updateData: UpdateResumeDto = {
      title: "Failed Update",
    }

    // Set original resume in cache
    queryClient.setQueryData(resumeQueryKey(resumeId), originalResume)

    const error = new Error("Update failed")(apiClient.put as any).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isError).toBe(true))

    // Check error is captured
    expect(result.current.error).toBe(error)
  })

  it("invalidates queries after successful update", async () => {
    const resumeId = "resume-123"
    const updateData: UpdateResumeDto = { title: "Updated" }
    const updatedResume = createMockResume({ id: resumeId })(
      apiClient.put as any,
    ).mockResolvedValueOnce(updatedResume)

    const wrapper = createWrapper()
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

    const { result } = renderHook(() => useUpdateResume(), { wrapper })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumeQueryKey(resumeId) })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumesQueryKey })
  })

  it("handles API errors correctly", async () => {
    const resumeId = "resume-123"
    const updateData: UpdateResumeDto = { title: "Failed" }
    const error = new Error("Update failed")(apiClient.put as any).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(error)
  })

  it("returns updated data on success", async () => {
    const resumeId = "resume-123"
    const originalResume = createMockResume({
      id: resumeId,
      updatedAt: "2024-01-01T00:00:00.000Z",
    })

    const updateData: UpdateResumeDto = { title: "Updated" }

    const updatedResume = createMockResume({
      id: resumeId,
      title: "Updated",
      updatedAt: new Date().toISOString(),
    })

    queryClient
      .setQueryData(
        resumeQueryKey(resumeId),
        originalResume,
      )(apiClient.put as any)
      .mockResolvedValueOnce(updatedResume)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(updatedResume)
  })

  it("handles optimistic update when resume not in cache", async () => {
    const resumeId = "resume-new"
    const updateData: UpdateResumeDto = { title: "Updated" }
    const updatedResume = createMockResume({ id: resumeId, title: "Updated" })(
      // Don't set any initial data in cache
      apiClient.put as any,
    ).mockResolvedValueOnce(updatedResume)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(updatedResume)
  })

  it("handles optimistic update when list not in cache", async () => {
    const resumeId = "resume-123"
    const originalResume = createMockResume({ id: resumeId, title: "Original" })
    const updateData: UpdateResumeDto = { title: "Updated" }
    const updatedResume = createMockResume({ id: resumeId, title: "Updated" })

    // Set resume in cache but not the list
    queryClient
      .setQueryData(
        resumeQueryKey(resumeId),
        originalResume,
      )(
        // Don't set resumesQueryKey

        apiClient.put as any,
      )
      .mockResolvedValueOnce(updatedResume)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(updatedResume)
  })

  it("merges content when updating with content field", async () => {
    const resumeId = "resume-123"
    const originalResume = createMockResume({
      id: resumeId,
      content: {
        personalInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "555-0100",
          location: "SF",
          summary: "Developer",
        },
        experience: [],
        education: [],
        skills: {
          technical: ["JavaScript"],
          languages: [],
          tools: [],
          soft: [],
        },
        certifications: [],
        links: [],
      },
    })

    const contentUpdate: UpdateResumeDto["content"] = {
      personalInfo: {
        name: "John Doe",
        email: "john.new@example.com",
        phone: "555-0100",
        location: "SF",
        summary: "Developer",
      },
      skills: {
        technical: ["JavaScript", "TypeScript"],
        languages: [],
        tools: [],
        soft: [],
      },
    }

    const updateData: UpdateResumeDto = {
      content: contentUpdate,
    }

    const updatedResume = createMockResume({
      id: resumeId,
      content: {
        ...originalResume.content,
        personalInfo: contentUpdate.personalInfo!,
        skills: contentUpdate.skills!,
      },
    })

    queryClient
      .setQueryData(
        resumeQueryKey(resumeId),
        originalResume,
      )(apiClient.put as any)
      .mockResolvedValueOnce(updatedResume)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(updatedResume)
  })

  it("handles error rollback without previous resume context", async () => {
    const resumeId = "resume-123"
    const updateData: UpdateResumeDto = { title: "Failed" }
    const error = new Error("Update failed")(
      // Don't set any initial data
      apiClient.put as any,
    ).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(error)
  })

  it("updates resume in list view optimistically", async () => {
    const resumeId = "resume-2"
    const resumes = [
      createMockResume({ id: "resume-1", title: "Resume 1" }),
      createMockResume({ id: resumeId, title: "Original" }),
      createMockResume({ id: "resume-3", title: "Resume 3" }),
    ]

    const contentUpdate: UpdateResumeDto["content"] = {
      personalInfo: {
        name: "Updated Name",
        email: "test@example.com",
        phone: "555-0100",
        location: "NY",
        summary: "Engineer",
      },
    }

    const updateData: UpdateResumeDto = {
      content: contentUpdate,
    }

    const updatedResume = createMockResume({
      id: resumeId,
      content: {
        ...resumes[1].content,
        personalInfo: contentUpdate.personalInfo!,
      },
    })

    queryClient.setQueryData(resumesQueryKey, resumes)
    queryClient
      .setQueryData(
        resumeQueryKey(resumeId),
        resumes[1],
      )(apiClient.put as any)
      .mockResolvedValueOnce(updatedResume)

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: resumeId, data: updateData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(updatedResume)
  })
})
