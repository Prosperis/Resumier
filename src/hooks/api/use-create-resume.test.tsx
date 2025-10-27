import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useCreateResume } from "./use-create-resume"
import { apiClient } from "@/lib/api/client"
import type { CreateResumeDto, Resume } from "@/lib/api/types"
import type { ReactNode } from "react"

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

describe("useCreateResume", () => {
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

  const mockResume: Resume = {
    id: "test-resume-1",
    title: "Test Resume",
    content: {
      personalInfo: { name: "John Doe", email: "john@example.com" },
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      links: [],
    },
    template: "modern",
    updatedAt: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
  }

  describe("mutation", () => {
    it("creates a new resume successfully", async () => {
      const createDto: CreateResumeDto = {
        title: "Test Resume",
        template: "modern",
      }

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResume)

      const { result } = renderHook(() => useCreateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(createDto)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(apiClient.post).toHaveBeenCalledWith("/api/resumes", createDto)
      expect(result.current.data).toEqual(mockResume)
    })

    it("handles API errors", async () => {
      const error = new Error("Failed to create resume")
      vi.mocked(apiClient.post).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useCreateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ title: "Test", template: "modern" })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toEqual(error)
    })

    it("invalidates resumes query after success", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResume)

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

      const { result } = renderHook(() => useCreateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ title: "Test", template: "modern" })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["resumes"] })
    })

    it("optimistically updates the resumes cache", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResume)

      const { result } = renderHook(() => useCreateResume(), {
        wrapper: createWrapper(),
      })

      // Pre-populate cache
      queryClient.setQueryData(["resumes"], [])

      result.current.mutate({ title: "Test", template: "modern" })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const cachedResumes = queryClient.getQueryData<Resume[]>(["resumes"])
      expect(cachedResumes).toContainEqual(mockResume)
    })

    it("adds new resume to cache for detail view", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResume)

      const { result } = renderHook(() => useCreateResume(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ title: "Test", template: "modern" })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const cachedResume = queryClient.getQueryData(["resumes", mockResume.id])
      expect(cachedResume).toEqual(mockResume)
    })
  })

  describe("loading states", () => {
    it("transitions through loading states correctly", async () => {
      let resolveCreate: ((value: Resume) => void) | undefined
      const createPromise = new Promise<Resume>((resolve) => {
        resolveCreate = resolve
      })

      vi.mocked(apiClient.post).mockReturnValueOnce(createPromise)

      const { result } = renderHook(() => useCreateResume(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isIdle).toBe(true)

      result.current.mutate({ title: "Test", template: "modern" })

      await waitFor(() => expect(result.current.isPending).toBe(true))

      if (resolveCreate) {
        resolveCreate(mockResume)
      }

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.isPending).toBe(false)
    })
  })
})
