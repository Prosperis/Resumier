import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useResumes } from "./use-resumes"
import { apiClient } from "@/lib/api/client"
import type { Resume } from "@/lib/api/types"
import type { ReactNode } from "react"
import { createMockResume } from "./test-helpers"

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe("useResumes", () => {
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

  const mockResumes: Resume[] = [
    createMockResume({ id: "resume-1", title: "Resume 1" }),
    createMockResume({ id: "resume-2", title: "Resume 2" }),
    createMockResume({ id: "resume-3", title: "Resume 3" }),
  ]

  describe("query", () => {
    it("fetches all resumes successfully", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResumes)

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(apiClient.get).toHaveBeenCalledWith("/api/resumes")
      expect(result.current.data).toEqual(mockResumes)
      expect(result.current.data).toHaveLength(3)
    })

    it("handles empty resume list", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce([])

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual([])
      expect(result.current.data).toHaveLength(0)
    })

    it("handles API errors", async () => {
      const error = new Error("Failed to fetch resumes")
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toEqual(error)
    })

    it("uses correct query key", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResumes)

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const cachedData = queryClient.getQueryData(["resumes"])
      expect(cachedData).toEqual(mockResumes)
    })
  })

  describe("loading states", () => {
    it("shows loading state while fetching", async () => {
      let resolveGet: ((value: Resume[]) => void) | undefined
      const getPromise = new Promise<Resume[]>((resolve) => {
        resolveGet = resolve
      })

      vi.mocked(apiClient.get).mockReturnValueOnce(getPromise)

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      if (resolveGet) {
        resolveGet(mockResumes)
      }

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual(mockResumes)
    })
  })

  describe("caching", () => {
    it("uses cached data when available", async () => {
      // Pre-populate cache
      queryClient.setQueryData(["resumes"], mockResumes)

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      // Should immediately have data from cache
      expect(result.current.data).toEqual(mockResumes)
      expect(result.current.isSuccess).toBe(true)
    })

    it("respects stale time", async () => {
      vi.mocked(apiClient.get).mockResolvedValue(mockResumes)

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // First call
      expect(apiClient.get).toHaveBeenCalledTimes(1)

      // Unmount and remount within stale time
      const { result: result2 } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      // Should use cached data without refetching
      expect(result2.current.data).toEqual(mockResumes)
      expect(apiClient.get).toHaveBeenCalledTimes(1)
    })

    it("refetches when invalidated", async () => {
      vi.mocked(apiClient.get).mockResolvedValue(mockResumes)

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(apiClient.get).toHaveBeenCalledTimes(1)

      // Invalidate query
      await queryClient.invalidateQueries({ queryKey: ["resumes"] })

      await waitFor(() => expect(apiClient.get).toHaveBeenCalledTimes(2))
    })
  })

  describe("data manipulation", () => {
    it("handles sorting resumes by date", async () => {
      const unsortedResumes = [
        createMockResume({ id: "1", updatedAt: "2024-01-03T00:00:00.000Z" }),
        createMockResume({ id: "2", updatedAt: "2024-01-01T00:00:00.000Z" }),
        createMockResume({ id: "3", updatedAt: "2024-01-02T00:00:00.000Z" }),
      ]

      vi.mocked(apiClient.get).mockResolvedValueOnce(unsortedResumes)

      const { result } = renderHook(() => useResumes(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Data should be available for sorting in UI
      expect(result.current.data).toEqual(unsortedResumes)

      // Sort by updatedAt descending
      const sorted = [...(result.current.data || [])].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )

      expect(sorted[0].id).toBe("1")
      expect(sorted[1].id).toBe("3")
      expect(sorted[2].id).toBe("2")
    })
  })
})
