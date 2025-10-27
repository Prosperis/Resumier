import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useDuplicateResume } from "./use-duplicate-resume"
import { apiClient } from "@/lib/api/client"
import type { Resume } from "@/lib/api/types"
import type { ReactNode } from "react"
import { createMockResume } from "./test-helpers"

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

describe("useDuplicateResume", () => {
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
    title: "My Resume",
    template: "modern",
  })

  const duplicatedResume: Resume = {
    ...mockResume,
    id: "resume-2",
    title: "My Resume (Copy)",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  }

  describe("mutation", () => {
    it("duplicates a resume successfully", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(duplicatedResume)

      const { result } = renderHook(() => useDuplicateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockResume)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(apiClient.post).toHaveBeenCalledWith("/api/resumes", {
        title: "My Resume (Copy)",
        content: mockResume.content,
      })
      expect(result.current.data).toEqual(duplicatedResume)
    })

    it("adds (Copy) suffix to title", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(duplicatedResume)

      const { result } = renderHook(() => useDuplicateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockResume)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/resumes",
        expect.objectContaining({
          title: "My Resume (Copy)",
        }),
      )
    })

    it("copies content from original resume", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(duplicatedResume)

      const { result } = renderHook(() => useDuplicateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockResume)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/resumes",
        expect.objectContaining({
          content: mockResume.content,
        }),
      )
    })

    it("handles API errors", async () => {
      const error = new Error("Failed to duplicate resume")
      vi.mocked(apiClient.post).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useDuplicateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockResume)

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toEqual(error)
    })

    it("invalidates resumes query after success", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(duplicatedResume)

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

      const { result } = renderHook(() => useDuplicateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockResume)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["resumes"] })
    })

    it("optimistically updates the resumes cache", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(duplicatedResume)

      const { result } = renderHook(() => useDuplicateResume(), {
        wrapper: createWrapper(),
      })

      // Pre-populate cache
      queryClient.setQueryData(["resumes"], [mockResume])

      result.current.mutate(mockResume)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const cachedResumes = queryClient.getQueryData<Resume[]>(["resumes"])
      expect(cachedResumes).toHaveLength(2)
      expect(cachedResumes).toContainEqual(duplicatedResume)
    })

    it("adds duplicated resume to cache for detail view", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(duplicatedResume)

      const { result } = renderHook(() => useDuplicateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockResume)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const cachedResume = queryClient.getQueryData(["resumes", duplicatedResume.id])
      expect(cachedResume).toEqual(duplicatedResume)
    })
  })

  describe("loading states", () => {
    it("transitions through loading states correctly", async () => {
      let resolveDuplicate: ((value: Resume) => void) | undefined
      const duplicatePromise = new Promise<Resume>((resolve) => {
        resolveDuplicate = resolve
      })

      vi.mocked(apiClient.post).mockReturnValueOnce(duplicatePromise)

      const { result } = renderHook(() => useDuplicateResume(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isIdle).toBe(true)

      result.current.mutate(mockResume)

      await waitFor(() => expect(result.current.isPending).toBe(true))

      if (resolveDuplicate) {
        resolveDuplicate(duplicatedResume)
      }

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.isPending).toBe(false)
    })
  })
})
