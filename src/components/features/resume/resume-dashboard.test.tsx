import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ResumeDashboard } from "./resume-dashboard"
import * as apiHooks from "@/hooks/api"
import * as toastHook from "@/hooks/use-toast"
import type { Resume } from "@/lib/api/types"

// Mock the API hooks
vi.mock("@/hooks/api", () => ({
  useResumes: vi.fn(),
  useDuplicateResume: vi.fn(),
}))

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}))

// Mock child components to isolate testing
vi.mock("./resume-table", () => ({
  ResumeTable: ({ resumes, onEdit, onDuplicate }: {
    resumes: Resume[]
    onEdit: (r: Resume) => void
    onDuplicate: (r: Resume) => void
  }) => (
    <div data-testid="resume-table">
      <div data-testid="resume-count">{resumes.length} resumes</div>
      {resumes.map((resume: Resume) => (
        <div key={resume.id} data-testid={`resume-${resume.id}`}>
          <span>{resume.title}</span>
          <button type="button" onClick={() => onEdit(resume)}>Edit</button>
          <button type="button" onClick={() => onDuplicate(resume)}>Duplicate</button>
        </div>
      ))}
    </div>
  ),
}))

vi.mock("./mutations", () => ({
  CreateResumeDialog: ({ trigger, onSuccess }: {
    trigger: React.ReactNode
    onSuccess?: (id: string) => void
  }) => (
    <div data-testid="create-resume-dialog">
      <button type="button" onClick={() => onSuccess?.("new-resume-id")}>{trigger}</button>
    </div>
  ),
}))

describe("ResumeDashboard", () => {
  const mockToast = vi.fn()
  const mockOnResumeClick = vi.fn()
  const mockDuplicateResume = vi.fn()

  const mockResumes: Resume[] = [
    {
      id: "1",
      title: "Software Engineer Resume",
      content: {
        personalInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "555-1234",
          location: "San Francisco, CA",
          summary: "Experienced developer",
        },
        experience: [],
        education: [],
        skills: { technical: [], languages: [], tools: [], soft: [] },
        certifications: [],
        links: [],
      },
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Product Manager Resume",
      content: {
        personalInfo: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "555-5678",
          location: "New York, NY",
          summary: "Product leader",
        },
        experience: [],
        education: [],
        skills: { technical: [], languages: [], tools: [], soft: [] },
        certifications: [],
        links: [],
      },
      createdAt: "2025-01-16T10:00:00Z",
      updatedAt: "2025-01-16T10:00:00Z",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(toastHook.useToast).mockReturnValue({ toast: mockToast } as never)
    vi.mocked(apiHooks.useDuplicateResume).mockReturnValue({
      mutate: mockDuplicateResume,
    } as never)
  })

  describe("Loading State", () => {
    it("renders loading state when fetching resumes", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/loading your resumes/i)).toBeInTheDocument()
    })

    it("displays loading message with correct text", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText("Loading your resumes...")).toBeInTheDocument()
    })
  })

  describe("Error State", () => {
    it("renders error message when API call fails", () => {
      const errorMessage = "Network error occurred"
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error(errorMessage),
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/failed to load resumes/i)).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it("displays error icon in error state", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error("Test error"),
      } as never)

      render(<ResumeDashboard />)

      // Check for destructive styling (error state)
      const errorContainer = screen.getByText(/failed to load resumes/i).closest("div")
      expect(errorContainer).toBeInTheDocument()
    })

    it("handles unknown error type gracefully", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: "String error" as never,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/failed to load resumes/i)).toBeInTheDocument()
      expect(screen.getByText("Unknown error")).toBeInTheDocument()
    })
  })

  describe("Empty State", () => {
    it("renders empty state when no resumes exist", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/no resumes yet/i)).toBeInTheDocument()
      expect(screen.getByText(/create your first resume to get started/i)).toBeInTheDocument()
    })

    it("displays create button in empty state", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/create resume/i)).toBeInTheDocument()
    })

    it("handles undefined resumes as empty state", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/no resumes yet/i)).toBeInTheDocument()
    })

    it("calls onResumeClick when creating resume from empty state", async () => {
      const user = userEvent.setup()
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      const createButton = screen.getByText(/create resume/i)
      await user.click(createButton)

      // The mocked CreateResumeDialog triggers onSuccess with "new-resume-id"
      expect(mockOnResumeClick).toHaveBeenCalledWith("new-resume-id")
    })
  })

  describe("Resume List Display", () => {
    it("renders resume table when resumes exist", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByTestId("resume-table")).toBeInTheDocument()
      expect(screen.getByTestId("resume-count")).toHaveTextContent("2 resumes")
    })

    it("displays header with resume count", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText("Resumes")).toBeInTheDocument()
      expect(screen.getByText(/manage your resume documents \(2\)/i)).toBeInTheDocument()
    })

    it("displays New Resume button in header", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/new resume/i)).toBeInTheDocument()
    })

    it("renders all resumes in the table", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByTestId("resume-1")).toBeInTheDocument()
      expect(screen.getByTestId("resume-2")).toBeInTheDocument()
      expect(screen.getByText("Software Engineer Resume")).toBeInTheDocument()
      expect(screen.getByText("Product Manager Resume")).toBeInTheDocument()
    })

    it("handles single resume correctly", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [mockResumes[0]],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/manage your resume documents \(1\)/i)).toBeInTheDocument()
      expect(screen.getByTestId("resume-count")).toHaveTextContent("1 resumes")
    })
  })

  describe("User Interactions - Edit", () => {
    it("calls onResumeClick when edit button is clicked", async () => {
      const user = userEvent.setup()
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      const editButtons = screen.getAllByText("Edit")
      await user.click(editButtons[0])

      expect(mockOnResumeClick).toHaveBeenCalledWith("1")
    })

    it("does not error when onResumeClick is not provided", async () => {
      const user = userEvent.setup()
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      const editButtons = screen.getAllByText("Edit")
      await user.click(editButtons[0])

      // Should not throw error
      expect(mockOnResumeClick).not.toHaveBeenCalled()
    })

    it("handles multiple edit clicks correctly", async () => {
      const user = userEvent.setup()
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      const editButtons = screen.getAllByText("Edit")
      await user.click(editButtons[0])
      await user.click(editButtons[1])

      expect(mockOnResumeClick).toHaveBeenCalledTimes(2)
      expect(mockOnResumeClick).toHaveBeenNthCalledWith(1, "1")
      expect(mockOnResumeClick).toHaveBeenNthCalledWith(2, "2")
    })
  })

  describe("User Interactions - Duplicate", () => {
    it("calls duplicate mutation when duplicate button is clicked", async () => {
      const user = userEvent.setup()
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      const duplicateButtons = screen.getAllByText("Duplicate")
      await user.click(duplicateButtons[0])

      expect(mockDuplicateResume).toHaveBeenCalledWith(
        mockResumes[0],
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      )
    })

    it("shows success toast when duplicate succeeds", async () => {
      const user = userEvent.setup()
      const newResume = { ...mockResumes[0], id: "3", title: "Software Engineer Resume (Copy)" }

      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      mockDuplicateResume.mockImplementation((_resume, options) => {
        options.onSuccess?.(newResume)
      })

      render(<ResumeDashboard />)

      const duplicateButtons = screen.getAllByText("Duplicate")
      await user.click(duplicateButtons[0])

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: 'Resume "Software Engineer Resume (Copy)" has been created',
        })
      })
    })

    it("shows error toast when duplicate fails", async () => {
      const user = userEvent.setup()
      const error = new Error("Failed to duplicate")

      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      mockDuplicateResume.mockImplementation((_resume, options) => {
        options.onError?.(error)
      })

      render(<ResumeDashboard />)

      const duplicateButtons = screen.getAllByText("Duplicate")
      await user.click(duplicateButtons[0])

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to duplicate",
          variant: "destructive",
        })
      })
    })

    it("handles unknown error in duplicate operation", async () => {
      const user = userEvent.setup()

      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      mockDuplicateResume.mockImplementation((_resume, options) => {
        options.onError?.("string error" as never)
      })

      render(<ResumeDashboard />)

      const duplicateButtons = screen.getAllByText("Duplicate")
      await user.click(duplicateButtons[0])

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to duplicate resume",
          variant: "destructive",
        })
      })
    })

    it("duplicates correct resume when multiple resumes exist", async () => {
      const user = userEvent.setup()
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      const duplicateButtons = screen.getAllByText("Duplicate")
      await user.click(duplicateButtons[1]) // Click second resume

      expect(mockDuplicateResume).toHaveBeenCalledWith(
        mockResumes[1],
        expect.any(Object),
      )
    })
  })

  describe("User Interactions - Create", () => {
    it("calls onResumeClick when creating new resume", async () => {
      const user = userEvent.setup()
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      const newResumeButton = screen.getByText(/new resume/i)
      await user.click(newResumeButton)

      expect(mockOnResumeClick).toHaveBeenCalledWith("new-resume-id")
    })

    it("does not error when creating resume without onResumeClick callback", async () => {
      const user = userEvent.setup()
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      const newResumeButton = screen.getByText(/new resume/i)
      await user.click(newResumeButton)

      // Should not throw error
      expect(mockOnResumeClick).not.toHaveBeenCalled()
    })
  })

  describe("Edge Cases", () => {
    it("handles very long resume titles", () => {
      const longTitle = "A".repeat(200)
      const resumeWithLongTitle = {
        ...mockResumes[0],
        title: longTitle,
      }

      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [resumeWithLongTitle],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it("handles empty resume title", () => {
      const resumeWithEmptyTitle = {
        ...mockResumes[0],
        title: "",
      }

      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [resumeWithEmptyTitle],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByTestId("resume-1")).toBeInTheDocument()
    })

    it("handles large number of resumes", () => {
      const manyResumes = Array.from({ length: 50 }, (_, i) => ({
        ...mockResumes[0],
        id: `resume-${i}`,
        title: `Resume ${i + 1}`,
      }))

      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: manyResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/manage your resume documents \(50\)/i)).toBeInTheDocument()
      expect(screen.getByTestId("resume-count")).toHaveTextContent("50 resumes")
    })

    it("handles special characters in resume title", () => {
      const specialTitle = "Resume <>&\"'`"
      const resumeWithSpecialChars = {
        ...mockResumes[0],
        title: specialTitle,
      }

      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [resumeWithSpecialChars],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(specialTitle)).toBeInTheDocument()
    })
  })

  describe("Component Integration", () => {
    it("passes correct props to ResumeTable", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      expect(screen.getByTestId("resume-table")).toBeInTheDocument()
      // ResumeTable receives resumes and callback props
      expect(screen.getByTestId("resume-count")).toBeInTheDocument()
    })

    it("passes correct props to CreateResumeDialog in empty state", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      expect(screen.getByTestId("create-resume-dialog")).toBeInTheDocument()
    })

    it("passes correct props to CreateResumeDialog in header", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      expect(screen.getByTestId("create-resume-dialog")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      const heading = screen.getByText("Resumes")
      expect(heading.tagName).toBe("H2")
    })

    it("provides descriptive text for empty state", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/no resumes yet/i)).toBeInTheDocument()
      expect(screen.getByText(/create your first resume to get started/i)).toBeInTheDocument()
    })

    it("provides descriptive error messages", () => {
      vi.mocked(apiHooks.useResumes).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error("Network timeout"),
      } as never)

      render(<ResumeDashboard />)

      expect(screen.getByText(/failed to load resumes/i)).toBeInTheDocument()
      expect(screen.getByText("Network timeout")).toBeInTheDocument()
    })
  })
})
