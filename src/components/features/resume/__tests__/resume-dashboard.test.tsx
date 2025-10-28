import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Resume } from "@/lib/api/types"
import { ResumeDashboard } from "../resume-dashboard"

// Mock dependencies
vi.mock("@/hooks/api", () => ({
  useResumes: vi.fn(),
  useDuplicateResume: vi.fn(),
}))

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}))

vi.mock("../mutations", () => ({
  CreateResumeDialog: ({ trigger, onSuccess }: any) => (
    <div data-testid="create-resume-dialog">
      <button onClick={() => onSuccess?.("new-resume-id")}>{trigger}</button>
    </div>
  ),
}))

vi.mock("../resume-table", () => ({
  ResumeTable: ({ resumes, onEdit, onDuplicate }: any) => (
    <div data-testid="resume-table">
      <div data-testid="resume-count">{resumes.length} resumes</div>
      {resumes.map((resume: Resume) => (
        <div key={resume.id} data-testid={`resume-${resume.id}`}>
          {resume.title}
          <button onClick={() => onEdit(resume)}>Edit</button>
          <button onClick={() => onDuplicate(resume)}>Duplicate</button>
        </div>
      ))}
    </div>
  ),
}))

vi.mock("@/components/ui/route-loading", () => ({
  RouteLoadingFallback: ({ message }: any) => <div data-testid="loading">{message}</div>,
}))

vi.mock("@/components/ui/animated", () => ({
  FadeIn: ({ children }: any) => <div data-testid="fade-in">{children}</div>,
}))

import { useDuplicateResume, useResumes } from "@/hooks/api"
import { useToast } from "@/hooks/use-toast"

describe("ResumeDashboard", () => {
  const mockResumes: Resume[] = [
    {
      id: "resume-1",
      userId: "user-1",
      title: "Software Engineer Resume",
      content: {
        personalInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "",
          location: "",
          summary: "",
        },
        experience: [],
        education: [],
        skills: { technical: [], languages: [], tools: [], soft: [] },
        certifications: [],
        links: [],
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "resume-2",
      userId: "user-1",
      title: "Product Manager Resume",
      content: {
        personalInfo: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "",
          location: "",
          summary: "",
        },
        experience: [],
        education: [],
        skills: { technical: [], languages: [], tools: [], soft: [] },
        certifications: [],
        links: [],
      },
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    },
  ]

  const mockToast = vi.fn()
  const mockDuplicateResume = vi.fn()
  const mockOnResumeClick = vi.fn()

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    ;(useToast as any)
      .mockReturnValue({ toast: mockToast } as any)(useDuplicateResume as any)
      .mockReturnValue({
        mutate: mockDuplicateResume,
      } as any)
  })

  describe("Loading State", () => {
    it("shows loading indicator when loading", () => {
      ;(useResumes as any).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      render(<ResumeDashboard />)

      expect(screen.getByTestId("loading")).toBeInTheDocument()
      expect(screen.getByText("Loading your resumes...")).toBeInTheDocument()
    })

    it("does not show content while loading", () => {
      ;(useResumes as any).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      render(<ResumeDashboard />)

      expect(screen.queryByText("Resumes")).not.toBeInTheDocument()
      expect(screen.queryByTestId("resume-table")).not.toBeInTheDocument()
    })
  })

  describe("Error State", () => {
    it("shows error message when error occurs", () => {
      const error = new Error("Network error")
      ;(useResumes as any).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
      } as any)

      render(<ResumeDashboard />)

      expect(screen.getByText("Failed to load resumes")).toBeInTheDocument()
      expect(screen.getByText("Network error")).toBeInTheDocument()
    })

    it("shows error icon in error state", () => {
      const error = new Error("Test error")
      ;(useResumes as any).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
      } as any)

      const { container } = render(<ResumeDashboard />)

      // AlertCircle icon should be rendered
      expect(container.querySelector("svg")).toBeInTheDocument()
    })

    it("handles non-Error error objects", () => {
      ;(useResumes as any).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: "String error",
      } as any)

      render(<ResumeDashboard />)

      expect(screen.getByText("Failed to load resumes")).toBeInTheDocument()
      expect(screen.getByText("Unknown error")).toBeInTheDocument()
    })
  })

  describe("Empty State", () => {
    it("shows empty state when no resumes exist", () => {
      ;(useResumes as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      render(<ResumeDashboard />)

      expect(screen.getByText("No resumes yet")).toBeInTheDocument()
      expect(screen.getByText("Create your first resume to get started")).toBeInTheDocument()
    })

    it("shows create button in empty state", () => {
      ;(useResumes as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      render(<ResumeDashboard />)

      expect(screen.getByText("Create Resume")).toBeInTheDocument()
    })

    it("calls onResumeClick when resume is created from empty state", async () => {
      ;(useResumes as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      const user = userEvent.setup()
      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      const createButton = screen.getByText("Create Resume")
      await user.click(createButton)

      expect(mockOnResumeClick).toHaveBeenCalledWith("new-resume-id")
    })

    it("handles undefined resumes as empty", () => {
      ;(useResumes as any).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as any)

      render(<ResumeDashboard />)

      expect(screen.getByText("No resumes yet")).toBeInTheDocument()
    })
  })

  describe("Content Rendering", () => {
    beforeEach(() => {
      ;(useResumes as any).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as any)
    })

    it("renders header with title", () => {
      render(<ResumeDashboard />)

      expect(screen.getByText("Resumes")).toBeInTheDocument()
    })

    it("renders header with resume count", () => {
      render(<ResumeDashboard />)

      expect(screen.getByText(/Manage your resume documents \(2\)/i)).toBeInTheDocument()
    })

    it("renders create button in header", () => {
      render(<ResumeDashboard />)

      expect(screen.getByText("New Resume")).toBeInTheDocument()
    })

    it("renders resume table", () => {
      render(<ResumeDashboard />)

      expect(screen.getByTestId("resume-table")).toBeInTheDocument()
      expect(screen.getByText("2 resumes")).toBeInTheDocument()
    })

    it("renders all resumes in table", () => {
      render(<ResumeDashboard />)

      expect(screen.getByText("Software Engineer Resume")).toBeInTheDocument()
      expect(screen.getByText("Product Manager Resume")).toBeInTheDocument()
    })

    it("wraps content in FadeIn animation", () => {
      render(<ResumeDashboard />)

      expect(screen.getByTestId("fade-in")).toBeInTheDocument()
    })
  })

  describe("Resume Actions", () => {
    beforeEach(() => {
      ;(useResumes as any).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as any)
    })

    it("calls onResumeClick when edit is triggered", async () => {
      const user = userEvent.setup()
      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      const editButton = screen.getAllByText("Edit")[0]
      await user.click(editButton)

      expect(mockOnResumeClick).toHaveBeenCalledWith("resume-1")
    })

    it("calls onResumeClick when new resume is created", async () => {
      const user = userEvent.setup()
      render(<ResumeDashboard onResumeClick={mockOnResumeClick} />)

      const createButton = screen.getByText("New Resume")
      await user.click(createButton)

      expect(mockOnResumeClick).toHaveBeenCalledWith("new-resume-id")
    })

    it("does not crash when onResumeClick is not provided", async () => {
      const user = userEvent.setup()
      render(<ResumeDashboard />)

      const editButton = screen.getAllByText("Edit")[0]
      await user.click(editButton)

      // Should not throw
      expect(editButton).toBeInTheDocument()
    })
  })

  describe("Duplicate Functionality", () => {
    beforeEach(() => {
      ;(useResumes as any).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as any)
    })

    it("calls duplicate mutation when duplicate button is clicked", async () => {
      const user = userEvent.setup()
      render(<ResumeDashboard />)

      const duplicateButton = screen.getAllByText("Duplicate")[0]
      await user.click(duplicateButton)

      expect(mockDuplicateResume).toHaveBeenCalledWith(mockResumes[0], expect.any(Object))
    })

    it("shows success toast after successful duplication", async () => {
      const user = userEvent.setup()
      mockDuplicateResume.mockImplementation((_, { onSuccess }) => {
        onSuccess({
          ...mockResumes[0],
          id: "duplicated-resume",
          title: "Copy of Software Engineer Resume",
        })
      })

      render(<ResumeDashboard />)

      const duplicateButton = screen.getAllByText("Duplicate")[0]
      await user.click(duplicateButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: 'Resume "Copy of Software Engineer Resume" has been created',
        })
      })
    })

    it("shows error toast when duplication fails", async () => {
      const user = userEvent.setup()
      mockDuplicateResume.mockImplementation((_, { onError }) => {
        onError(new Error("Duplication failed"))
      })

      render(<ResumeDashboard />)

      const duplicateButton = screen.getAllByText("Duplicate")[0]
      await user.click(duplicateButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Duplication failed",
          variant: "destructive",
        })
      })
    })

    it("handles non-Error duplication failures", async () => {
      const user = userEvent.setup()
      mockDuplicateResume.mockImplementation((_, { onError }) => {
        onError("String error")
      })

      render(<ResumeDashboard />)

      const duplicateButton = screen.getAllByText("Duplicate")[0]
      await user.click(duplicateButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Error",
            description: "Failed to duplicate resume",
            variant: "destructive",
          }),
        )
      })
    })
  })

  describe("Layout and Styling", () => {
    beforeEach(() => {
      ;(useResumes as any).mockReturnValue({
        data: mockResumes,
        isLoading: false,
        error: null,
      } as any)
    })

    it("applies proper spacing", () => {
      const { container } = render(<ResumeDashboard />)

      const mainDiv = container.querySelector(".space-y-4")
      expect(mainDiv).toBeInTheDocument()
    })

    it("applies padding", () => {
      const { container } = render(<ResumeDashboard />)

      const paddedDiv = container.querySelector(".p-4")
      expect(paddedDiv).toBeInTheDocument()
    })

    it("uses flexbox for header layout", () => {
      const { container } = render(<ResumeDashboard />)

      const header = container.querySelector(".flex.items-center.justify-between")
      expect(header).toBeInTheDocument()
    })
  })
})
