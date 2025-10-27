import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useUpdateResume } from "./use-update-resume"
import { apiClient } from "@/lib/api/client"
import type { Resume, UpdateResumeDto } from "@/lib/api/types"
import type { ReactNode } from "react"
import { createMockResume } from "./test-helpers"

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    put: vi.fn(),
  },
}))

describe("useUpdateResume", () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const mockResume = createMockResume({
    id: "resume-1",
    title: "Original Title",
    template: "modern",
  })

  const updatedResume: Resume = {
    ...mockResume,
    title: "Updated Title",
    updatedAt: "2024-01-02T00:00:00.000Z",
  }

  describe("mutation", () => {
    it("updates a resume successfully", async () => {
      const updateDto: UpdateResumeDto = {
        title: "Updated Title",
      }

      vi.mocked(apiClient.put).mockResolvedValueOnce(updatedResume)

      const { result } = renderHook(() => useUpdateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: "resume-1", data: updateDto })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(apiClient.put).toHaveBeenCalledWith("/api/resumes/resume-1", updateDto)
      expect(result.current.data).toEqual(updatedResume)
    })

    it("handles API errors", async () => {
      const error = new Error("Failed to update resume")
      vi.mocked(apiClient.put).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useUpdateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: "resume-1", data: { title: "Updated" } })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toEqual(error)
    })

    it("optimistically updates resume in cache", async () => {
      vi.mocked(apiClient.put).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(updatedResume), 100)),
      )

      // Pre-populate cache
      queryClient.setQueryData(["resumes", "resume-1"], mockResume)

      const { result } = renderHook(() => useUpdateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: "resume-1", data: { title: "Updated Title" } })

      // Should be updated optimistically
      await waitFor(() => {
        const cachedResume = queryClient.getQueryData<Resume>(["resumes", "resume-1"])
        expect(cachedResume?.title).toBe("Updated Title")
      })
    })

    it("optimistically updates resume in list cache", async () => {
      vi.mocked(apiClient.put).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(updatedResume), 100)),
      )

      const resumes = [mockResume, createMockResume({ id: "resume-2" })]

      // Pre-populate cache
      queryClient.setQueryData(["resumes"], resumes)

      const { result } = renderHook(() => useUpdateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: "resume-1", data: { title: "Updated Title" } })

      // Should be updated optimistically in list
      await waitFor(() => {
        const cachedResumes = queryClient.getQueryData<Resume[]>(["resumes"])
        const updatedInList = cachedResumes?.find((r) => r.id === "resume-1")
        expect(updatedInList?.title).toBe("Updated Title")
      })
    })

    it("merges content updates correctly", async () => {
      vi.mocked(apiClient.put).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(updatedResume), 100)),
      )

      // Pre-populate cache
      queryClient.setQueryData(["resumes", "resume-1"], mockResume)

      const { result } = renderHook(() => useUpdateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        id: "resume-1",
        data: {
          content: {
            personalInfo: { name: "Updated Name", email: "updated@example.com" },
          },
        },
      })

      // Should merge content
      await waitFor(() => {
        const cachedResume = queryClient.getQueryData<Resume>(["resumes", "resume-1"])
        expect(cachedResume?.content.personalInfo.name).toBe("Updated Name")
      })
    })

    it("rolls back on error", async () => {
      const error = new Error("Update failed")
      vi.mocked(apiClient.put).mockRejectedValueOnce(error)

      // Pre-populate cache
      queryClient.setQueryData(["resumes", "resume-1"], mockResume)

      const { result } = renderHook(() => useUpdateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: "resume-1", data: { title: "Updated Title" } })

      await waitFor(() => expect(result.current.isError).toBe(true))

      // Should be rolled back
      const cachedResume = queryClient.getQueryData<Resume>(["resumes", "resume-1"])
      expect(cachedResume?.title).toBe("Original Title")
    })

    it("invalidates queries after success", async () => {
      vi.mocked(apiClient.put).mockResolvedValueOnce(updatedResume)

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

      const { result } = renderHook(() => useUpdateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: "resume-1", data: { title: "Updated" } })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["resumes", "resume-1"] })
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["resumes"] })
    })
  })

  describe("loading states", () => {
    it("transitions through loading states correctly", async () => {
      let resolveUpdate: ((value: Resume) => void) | undefined
      const updatePromise = new Promise<Resume>((resolve) => {
        resolveUpdate = resolve
      })

      vi.mocked(apiClient.put).mockReturnValueOnce(updatePromise)

      const { result } = renderHook(() => useUpdateResume(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isIdle).toBe(true)

      result.current.mutate({ id: "resume-1", data: { title: "Updated" } })

      await waitFor(() => expect(result.current.isPending).toBe(true))

      if (resolveUpdate) {
        resolveUpdate(updatedResume)
      }

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.isPending).toBe(false)
    })
  })
})
