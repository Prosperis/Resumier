import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useDeleteResume } from "./use-delete-resume"
import { apiClient } from "@/lib/api/client"
import type { Resume } from "@/lib/api/types"
import type { ReactNode } from "react"
import { createMockResume } from "./test-helpers"

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    delete: vi.fn(),
  },
}))

describe("useDeleteResume", () => {
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

  const mockResumes: Resume[] = [
    createMockResume({ id: "resume-1", title: "Resume 1" }),
    createMockResume({ id: "resume-2", title: "Resume 2" }),
    createMockResume({ id: "resume-3", title: "Resume 3" }),
  ]

  describe("mutation", () => {
    it("deletes a resume successfully", async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useDeleteResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate("resume-1")

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(apiClient.delete).toHaveBeenCalledWith("/api/resumes/resume-1")
    })

    it("handles API errors", async () => {
      const error = new Error("Failed to delete resume")
      vi.mocked(apiClient.delete).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useDeleteResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate("resume-1")

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toEqual(error)
    })

    it("optimistically removes resume from cache", async () => {
      vi.mocked(apiClient.delete).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(undefined), 100)),
      )

      // Pre-populate cache
      queryClient.setQueryData(["resumes"], mockResumes)

      const { result } = renderHook(() => useDeleteResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate("resume-2")

      // Should be removed optimistically
      await waitFor(() => {
        const cachedResumes = queryClient.getQueryData<Resume[]>(["resumes"])
        expect(cachedResumes).toHaveLength(2)
        expect(cachedResumes?.find((r) => r.id === "resume-2")).toBeUndefined()
      })
    })

    it("rolls back on error", async () => {
      const error = new Error("Delete failed")
      vi.mocked(apiClient.delete).mockRejectedValueOnce(error)

      // Pre-populate cache
      queryClient.setQueryData(["resumes"], mockResumes)

      const { result } = renderHook(() => useDeleteResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate("resume-2")

      await waitFor(() => expect(result.current.isError).toBe(true))

      // Should be rolled back
      const cachedResumes = queryClient.getQueryData<Resume[]>(["resumes"])
      expect(cachedResumes).toHaveLength(3)
      expect(cachedResumes?.find((r) => r.id === "resume-2")).toBeDefined()
    })

    it("invalidates resumes query after success", async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce(undefined)

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

      const { result } = renderHook(() => useDeleteResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate("resume-1")

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["resumes"] })
    })

    it("removes individual resume from cache", async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce(undefined)

      // Pre-populate individual resume cache
      queryClient.setQueryData(["resumes", "resume-1"], mockResumes[0])

      const removeSpy = vi.spyOn(queryClient, "removeQueries")

      const { result } = renderHook(() => useDeleteResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate("resume-1")

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(removeSpy).toHaveBeenCalledWith({ queryKey: ["resumes", "resume-1"] })
    })
  })

  describe("loading states", () => {
    it("transitions through loading states correctly", async () => {
      let resolveDelete: (() => void) | undefined
      const deletePromise = new Promise<void>((resolve) => {
        resolveDelete = resolve
      })

      vi.mocked(apiClient.delete).mockReturnValueOnce(deletePromise)

      const { result } = renderHook(() => useDeleteResume(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isIdle).toBe(true)

      result.current.mutate("resume-1")

      await waitFor(() => expect(result.current.isPending).toBe(true))

      if (resolveDelete) {
        resolveDelete()
      }

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.isPending).toBe(false)
    })
  })
})
