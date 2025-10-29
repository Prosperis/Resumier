import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ExportMenu } from "@/components/features/resume/export/export-menu"
import * as exportUtils from "@/components/features/resume/export/export-utils"
import type { Resume } from "@/lib/api/types"

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

// Mock export utils
vi.mock("./export-utils", () => ({
  printResume: vi.fn(),
}))

describe("ExportMenu", () => {
  const mockResume: Resume = {
    id: "1",
    title: "Software Engineer Resume",
    content: {
      personalInfo: {
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        location: "New York, NY",
        summary: "Experienced software engineer",
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

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  })

  it("should render export button", () => {
    render(<ExportMenu resume={mockResume} />)

    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument()
  })

  it("should show dropdown menu when clicked", async () => {
    const user = userEvent.setup()
    render(<ExportMenu resume={mockResume} />)

    const exportButton = screen.getByRole("button", { name: /export/i })
    await user.click(exportButton)

    expect(screen.getByText("Export Options")).toBeInTheDocument()
  })

  it("should display PDF download option", async () => {
    const user = userEvent.setup()
    render(<ExportMenu resume={mockResume} />)

    const exportButton = screen.getByRole("button", { name: /export/i })
    await user.click(exportButton)

    expect(screen.getByText("Download as PDF")).toBeInTheDocument()
    expect(screen.getByText("Via browser print dialog")).toBeInTheDocument()
  })

  it("should display print option", async () => {
    const user = userEvent.setup()
    render(<ExportMenu resume={mockResume} />)

    const exportButton = screen.getByRole("button", { name: /export/i })
    await user.click(exportButton)

    expect(screen.getByText("Print")).toBeInTheDocument()
    expect(screen.getByText("Open print preview")).toBeInTheDocument()
  })

  it("should call printResume when print option is clicked", async () => {
    const user = userEvent.setup()
    const printResumeSpy = vi.spyOn(exportUtils, "printResume")

    render(<ExportMenu resume={mockResume} />)

    const exportButton = screen.getByRole("button", { name: /export/i })
    await user.click(exportButton)

    const printOption = screen.getByText("Print")
    await user.click(printOption)

    expect(printResumeSpy).toHaveBeenCalledWith("Software Engineer Resume")
  })

  it("should call printResume when download PDF is clicked", async () => {
    const user = userEvent.setup()
    const printResumeSpy = vi.spyOn(exportUtils, "printResume")

    render(<ExportMenu resume={mockResume} />)

    const exportButton = screen.getByRole("button", { name: /export/i })
    await user.click(exportButton)

    const downloadOption = screen.getByText("Download as PDF")
    await user.click(downloadOption)

    expect(printResumeSpy).toHaveBeenCalledWith("Software Engineer Resume")
  })

  it("should render with different resume title", () => {
    const differentResume: Resume = {
      ...mockResume,
      title: "Marketing Manager Resume",
    }

    render(<ExportMenu resume={differentResume} />)

    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument()
  })

  it("should render export icon", () => {
    const { container } = render(<ExportMenu resume={mockResume} />)

    // Check for Download icon (lucide-react icon)
    const icon = container.querySelector(".lucide-download")
    expect(icon).toBeInTheDocument()
  })
})
