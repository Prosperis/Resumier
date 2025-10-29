import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import type { Resume } from "@/lib/api/types"

// Mock child components - must be before imports that use them
vi.mock("@/components/features/resume/export/export-menu", () => ({
  ExportMenu: ({ resume }: { resume: Resume }) => (
    <div data-testid="export-menu">Export Menu for {resume.title}</div>
  ),
}))

vi.mock("@/components/features/resume/preview/resume-preview", () => ({
  ResumePreview: ({ resume, template }: { resume: Resume; template: string }) => (
    <div data-testid="resume-preview">
      Preview: {resume.title} - {template}
    </div>
  ),
}))

vi.mock("@/components/features/resume/preview/template-selector", () => ({
  TemplateSelector: ({
    selected,
    onSelect,
  }: {
    selected: string
    onSelect: (template: string) => void
  }) => (
    <div data-testid="template-selector">
      <button onClick={() => onSelect("classic")}>Classic</button>
      <span>Selected: {selected}</span>
    </div>
  ),
}))

vi.mock("@/components/features/resume/resume-builder", () => ({
  ResumeBuilder: () => <div data-testid="resume-builder">Resume Builder</div>,
}))

import { ResumeEditor } from "@/components/features/resume/resume-editor"

describe("ResumeEditor", () => {
  const mockResume: Resume = {
    id: "1",
    title: "My Resume",
    content: {
      personalInfo: {
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        location: "New York, NY",
        summary: "Software Engineer",
      },
      experience: [],
      education: [],
      skills: { technical: [], soft: [], languages: [], tools: [] },
      certifications: [],
      links: [],
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  }

  it("should render with edit tab by default", () => {
    render(<ResumeEditor resume={mockResume} />)

    expect(screen.getByRole("tab", { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByTestId("resume-builder")).toBeInTheDocument()
  })

  it("should render preview tab", () => {
    render(<ResumeEditor resume={mockResume} />)

    expect(screen.getByRole("tab", { name: /preview/i })).toBeInTheDocument()
  })

  it("should switch to preview tab when clicked", async () => {
    const user = userEvent.setup()
    render(<ResumeEditor resume={mockResume} />)

    const previewTab = screen.getByRole("tab", { name: /preview/i })
    await user.click(previewTab)

    expect(screen.getByTestId("resume-preview")).toBeInTheDocument()
  })

  it("should render export menu", () => {
    render(<ResumeEditor resume={mockResume} />)

    expect(screen.getByTestId("export-menu")).toBeInTheDocument()
    expect(screen.getByText(/Export Menu for My Resume/i)).toBeInTheDocument()
  })

  it("should render template selector", () => {
    render(<ResumeEditor resume={mockResume} />)

    expect(screen.getByTestId("template-selector")).toBeInTheDocument()
    expect(screen.getByText(/Selected: modern/i)).toBeInTheDocument()
  })

  it("should change template when selector is used", async () => {
    const user = userEvent.setup()
    render(<ResumeEditor resume={mockResume} />)

    const classicButton = screen.getByRole("button", { name: /classic/i })
    await user.click(classicButton)

    expect(screen.getByText(/Selected: classic/i)).toBeInTheDocument()
  })

  it("should show resume builder in edit tab", () => {
    render(<ResumeEditor resume={mockResume} />)

    const editTab = screen.getByRole("tab", { name: /edit/i })
    expect(editTab).toHaveAttribute("data-state", "active")
    expect(screen.getByTestId("resume-builder")).toBeInTheDocument()
  })

  it("should pass correct props to resume preview", async () => {
    const user = userEvent.setup()
    render(<ResumeEditor resume={mockResume} />)

    const previewTab = screen.getByRole("tab", { name: /preview/i })
    await user.click(previewTab)

    expect(screen.getByText(/Preview: My Resume - modern/i)).toBeInTheDocument()
  })

  it("should update preview with selected template", async () => {
    const user = userEvent.setup()
    render(<ResumeEditor resume={mockResume} />)

    // Change template
    const classicButton = screen.getByRole("button", { name: /classic/i })
    await user.click(classicButton)

    // Switch to preview
    const previewTab = screen.getByRole("tab", { name: /preview/i })
    await user.click(previewTab)

    expect(screen.getByText(/Preview: My Resume - classic/i)).toBeInTheDocument()
  })

  it("should render with different resume", () => {
    const differentResume: Resume = {
      ...mockResume,
      title: "Engineering Resume",
    }

    render(<ResumeEditor resume={differentResume} />)

    expect(screen.getByText(/Export Menu for Engineering Resume/i)).toBeInTheDocument()
  })
})
