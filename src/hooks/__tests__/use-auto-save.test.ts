import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { formatLastSaved, useAutoSave } from "../use-auto-save"

// Mock the useUpdateResume hook
vi.mock("../api", () => ({
  useUpdateResume: vi.fn(),
}))

// Helper to create test update data
const createTestData = (name: string) =>
  ({
    content: { personalInfo: { name } },
  }) as any

describe("useAutoSave", () => {
  let mockMutate: ReturnType<typeof vi.fn>
  let mockUseUpdateResume: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.useFakeTimers()
    mockMutate = vi.fn()
    mockUseUpdateResume = vi.fn().mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    })

    const apiModule = await import("../api")(apiModule.useUpdateResume as any).mockImplementation(
      mockUseUpdateResume as any,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe("Initialization", () => {
    it("initializes with default values", () => {
      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
        }),
      )

      expect(result.current.isSaving).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.lastSaved).toBe(null)
      expect(typeof result.current.save).toBe("function")
    })

    it("uses default debounce time of 1000ms", () => {
      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
        }),
      )

      act(() => {
        result.current.save(createTestData("Test"))
      })

      // Should not call mutate immediately
      expect(mockMutate).not.toHaveBeenCalled()

      // Should call after 1000ms
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(mockMutate).toHaveBeenCalled()
    })

    it("uses custom debounce time", () => {
      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 500,
        }),
      )

      act(() => {
        result.current.save(createTestData("Test"))
      })

      act(() => {
        vi.advanceTimersByTime(499)
      })
      expect(mockMutate).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(mockMutate).toHaveBeenCalled()
    })
  })

  describe("Save Functionality", () => {
    it("saves data after debounce period", () => {
      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 1000,
        }),
      )

      const testData = createTestData("John Doe")

      act(() => {
        result.current.save(testData)
      })

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "resume-123",
          data: testData,
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      )
    })

    it("debounces multiple rapid saves", () => {
      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 1000,
        }),
      )

      act(() => {
        result.current.save(createTestData("First"))
        vi.advanceTimersByTime(500)
        result.current.save(createTestData("Second"))
        vi.advanceTimersByTime(500)
        result.current.save(createTestData("Third"))
      })

      // No calls yet
      expect(mockMutate).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Should only call once with the last data
      expect(mockMutate).toHaveBeenCalledTimes(1)
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "resume-123",
          data: createTestData("Third"),
        },
        expect.any(Object),
      )
    })

    it("does not save when enabled is false", () => {
      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 1000,
          enabled: false,
        }),
      )

      act(() => {
        result.current.save(createTestData("Test"))
        vi.advanceTimersByTime(1000)
      })

      expect(mockMutate).not.toHaveBeenCalled()
    })

    it("updates lastSaved on successful save", () => {
      mockMutate.mockImplementation((_, callbacks) => {
        callbacks.onSuccess()
      })

      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 100,
        }),
      )

      expect(result.current.lastSaved).toBe(null)

      act(() => {
        result.current.save(createTestData("Test"))
        vi.advanceTimersByTime(100)
      })

      expect(result.current.lastSaved).toBeInstanceOf(Date)
    })

    it("clears error on successful save", () => {
      // First, trigger an error
      mockMutate.mockImplementationOnce((_, callbacks) => {
        callbacks.onError(new Error("Save failed"))
      })

      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 100,
        }),
      )

      act(() => {
        result.current.save(createTestData("Test"))
        vi.advanceTimersByTime(100)
      })

      expect(result.current.error).toBeInstanceOf(Error)

      // Now trigger a successful save
      mockMutate.mockImplementationOnce((_, callbacks) => {
        callbacks.onSuccess()
      })

      act(() => {
        result.current.save(createTestData("Test2"))
        vi.advanceTimersByTime(100)
      })

      expect(result.current.error).toBe(null)
    })
  })

  describe("Error Handling", () => {
    it("sets error when save fails", () => {
      mockMutate.mockImplementation((_, callbacks) => {
        callbacks.onError(new Error("Network error"))
      })

      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 100,
        }),
      )

      act(() => {
        result.current.save(createTestData("Test"))
        vi.advanceTimersByTime(100)
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe("Network error")
    })

    it("updates error state when mutation error changes", () => {
      const mutationError = new Error("Mutation error")
      mockUseUpdateResume.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mutationError,
      })

      const { result, rerender } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
        }),
      )

      rerender()

      expect(result.current.error).toBe(mutationError)
    })
  })

  describe("Loading State", () => {
    it("reflects isPending state from mutation", () => {
      mockUseUpdateResume.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        error: null,
      })

      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
        }),
      )

      expect(result.current.isSaving).toBe(true)
    })

    it("updates isSaving when isPending changes", () => {
      mockUseUpdateResume.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      })

      const { result, rerender } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
        }),
      )

      expect(result.current.isSaving).toBe(false)

      // Update mock to return isPending: true
      mockUseUpdateResume.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        error: null,
      })

      rerender()

      expect(result.current.isSaving).toBe(true)
    })
  })

  describe("Cleanup", () => {
    it("clears timeout on unmount", () => {
      const { result, unmount } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 1000,
        }),
      )

      act(() => {
        result.current.save(createTestData("Test"))
      })

      unmount()

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Should not call mutate after unmount
      expect(mockMutate).not.toHaveBeenCalled()
    })
  })

  describe("Integration Scenarios", () => {
    it("handles multiple save cycles", () => {
      mockMutate.mockImplementation((_, callbacks) => {
        callbacks.onSuccess()
      })

      const { result } = renderHook(() =>
        useAutoSave({
          resumeId: "resume-123",
          debounceMs: 100,
        }),
      )

      // First save
      act(() => {
        result.current.save(createTestData("First"))
        vi.advanceTimersByTime(100)
      })

      expect(mockMutate).toHaveBeenCalledTimes(1)

      // Second save
      act(() => {
        result.current.save(createTestData("Second"))
        vi.advanceTimersByTime(100)
      })

      expect(mockMutate).toHaveBeenCalledTimes(2)
    })
  })
})

describe("formatLastSaved", () => {
  it("returns empty string for null", () => {
    expect(formatLastSaved(null)).toBe("")
  })

  it('returns "Saved just now" for times less than 10 seconds ago', () => {
    const now = new Date()
    const fiveSecondsAgo = new Date(now.getTime() - 5000)
    expect(formatLastSaved(fiveSecondsAgo)).toBe("Saved just now")
  })

  it("returns seconds for times less than 60 seconds ago", () => {
    const now = new Date()
    const thirtySecondsAgo = new Date(now.getTime() - 30000)
    expect(formatLastSaved(thirtySecondsAgo)).toBe("Saved 30 seconds ago")
  })

  it('returns "Saved 1 minute ago" for exactly 1 minute', () => {
    const now = new Date()
    const oneMinuteAgo = new Date(now.getTime() - 60000)
    expect(formatLastSaved(oneMinuteAgo)).toBe("Saved 1 minute ago")
  })

  it("returns minutes for times less than 60 minutes ago", () => {
    const now = new Date()
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000)
    expect(formatLastSaved(fifteenMinutesAgo)).toBe("Saved 15 minutes ago")
  })

  it("returns time for times over 60 minutes ago", () => {
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60000)
    const result = formatLastSaved(twoHoursAgo)
    expect(result).toMatch(/^Saved at \d+:\d+/)
  })

  it("handles edge case of exactly 10 seconds", () => {
    const now = new Date()
    const tenSecondsAgo = new Date(now.getTime() - 10000)
    expect(formatLastSaved(tenSecondsAgo)).toBe("Saved 10 seconds ago")
  })

  it("handles edge case of exactly 60 seconds", () => {
    const now = new Date()
    const sixtySecondsAgo = new Date(now.getTime() - 60000)
    expect(formatLastSaved(sixtySecondsAgo)).toBe("Saved 1 minute ago")
  })
})
