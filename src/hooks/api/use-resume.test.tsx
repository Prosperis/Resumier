import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useResume } from "./use-resume"
import { apiClient } from "@/lib/api/client"
import type { Resume } from "@/lib/api/types"
import type { ReactNode } from "react"
import { createMockResume } from "./test-helpers"

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe("useResume", () => {
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
      },
    })
    vi.clearAllMocks()
  })

  const mockResume = createMockResume({
    id: "resume-1",
    title: "Test Resume",
  })

  describe("query", () => {
    it("fetches a resume by id successfully", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResume)

      const { result } = renderHook(() => useResume("resume-1"), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(apiClient.get).toHaveBeenCalledWith("/api/resumes/resume-1")
      expect(result.current.data).toEqual(mockResume)
    })

    it("handles API errors", async () => {
      const error = new Error("Failed to fetch resume")
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useResume("resume-1"), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toEqual(error)
    })

    it("is disabled when id is empty", () => {
      const { result } = renderHook(() => useResume(""), {
        wrapper: createWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
      expect(apiClient.get).not.toHaveBeenCalled()
    })

    it("uses correct query key", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResume)

      const { result } = renderHook(() => useResume("resume-1"), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockResume)

      const cachedData = queryClient.getQueryData(["resumes", "resume-1"])
      expect(cachedData).toEqual(mockResume)
    })

    it("refetches when id changes", async () => {
      const mockResume2 = createMockResume({ id: "resume-2", title: "Resume 2" })

      vi.mocked(apiClient.get)
        .mockResolvedValueOnce(mockResume)
        .mockResolvedValueOnce(mockResume2)

      const { result, rerender } = renderHook(({ id }) => useResume(id), {
        wrapper: createWrapper(),
        initialProps: { id: "resume-1" },
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(mockResume)

      rerender({ id: "resume-2" })

      await waitFor(() => expect(result.current.data).toEqual(mockResume2))
      expect(apiClient.get).toHaveBeenCalledWith("/api/resumes/resume-2")
    })
  })

  describe("loading states", () => {
    it("shows loading state while fetching", async () => {
      let resolveGet: ((value: Resume) => void) | undefined
      const getPromise = new Promise<Resume>((resolve) => {
        resolveGet = resolve
      })

      vi.mocked(apiClient.get).mockReturnValueOnce(getPromise)

      const { result } = renderHook(() => useResume("resume-1"), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      if (resolveGet) {
        resolveGet(mockResume)
      }

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual(mockResume)
    })
  })

  describe("caching", () => {
    it("uses cached data when available", async () => {
      // Pre-populate cache
      queryClient.setQueryData(["resumes", "resume-1"], mockResume)

      const { result } = renderHook(() => useResume("resume-1"), {
        wrapper: createWrapper(),
      })

      // Should immediately have data from cache
      expect(result.current.data).toEqual(mockResume)
      expect(result.current.isSuccess).toBe(true)
    })

    it("respects stale time", async () => {
      vi.mocked(apiClient.get).mockResolvedValue(mockResume)

      const { result } = renderHook(() => useResume("resume-1"), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // First call
      expect(apiClient.get).toHaveBeenCalledTimes(1)

      // Unmount and remount within stale time
      const { result: result2 } = renderHook(() => useResume("resume-1"), {
        wrapper: createWrapper(),
      })

      // Should use cached data without refetching
      expect(result2.current.data).toEqual(mockResume)
      expect(apiClient.get).toHaveBeenCalledTimes(1)
    })
  })
})
