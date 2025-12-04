import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ExportMenu } from "@/components/features/resume/export/export-menu";
import * as exportUtils from "@/components/features/resume/export/export-utils";
import type { Resume } from "@/lib/api/types";

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock settings store
vi.mock("@/stores/settings-store", () => ({
  useSettingsStore: {
    getState: () => ({
      settings: {
        promptExportFilename: false, // Disable prompts in tests
      },
    }),
  },
}));

// Mock export utils
vi.mock("@/components/features/resume/export/export-utils", () => ({
  printResume: vi.fn(),
  downloadDOCX: vi.fn(),
  downloadHTML: vi.fn(),
  downloadMarkdown: vi.fn(),
  downloadPlainText: vi.fn(),
  downloadJSON: vi.fn(),
  downloadPDFWithTemplate: vi.fn(),
}));

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
  };

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  it("should render export button", () => {
    render(<ExportMenu resume={mockResume} />);

    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });

  it("should show dropdown menu when clicked", async () => {
    const user = userEvent.setup();
    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    expect(screen.getByText("Export Formats")).toBeInTheDocument();
  });

  it("should display all export format options", async () => {
    const user = userEvent.setup();
    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    // Check for all format options
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("Word Document")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("Markdown")).toBeInTheDocument();
    expect(screen.getByText("Plain Text")).toBeInTheDocument();
    expect(screen.getByText("JSON")).toBeInTheDocument();
  });

  it("should display PDF download option with description", async () => {
    const user = userEvent.setup();
    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText(/print to pdf/i)).toBeInTheDocument();
  });

  it("should display print option", async () => {
    const user = userEvent.setup();
    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    expect(screen.getByText("Print")).toBeInTheDocument();
    expect(screen.getByText("Open print preview")).toBeInTheDocument();
  });

  it("should call printResume when print option is clicked", async () => {
    const user = userEvent.setup();
    const printResumeSpy = vi.spyOn(exportUtils, "printResume");

    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    const printOption = screen.getByText("Print");
    await user.click(printOption);

    expect(printResumeSpy).toHaveBeenCalledWith(mockResume);
  });

  it("should call downloadPDFWithTemplate when PDF is clicked", async () => {
    const user = userEvent.setup();
    const downloadPDFSpy = vi.spyOn(exportUtils, "downloadPDFWithTemplate");

    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    const pdfOption = screen.getByText("PDF");
    await user.click(pdfOption);

    expect(downloadPDFSpy).toHaveBeenCalledWith(mockResume);
  });

  it("should call downloadDOCX when Word Document is clicked", async () => {
    const user = userEvent.setup();
    const downloadDOCXSpy = vi.spyOn(exportUtils, "downloadDOCX");

    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    const wordOption = screen.getByText("Word Document");
    await user.click(wordOption);

    expect(downloadDOCXSpy).toHaveBeenCalledWith(mockResume);
  });

  it("should call downloadMarkdown when Markdown is clicked", async () => {
    const user = userEvent.setup();
    const downloadMarkdownSpy = vi.spyOn(exportUtils, "downloadMarkdown");

    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    const markdownOption = screen.getByText("Markdown");
    await user.click(markdownOption);

    expect(downloadMarkdownSpy).toHaveBeenCalledWith(mockResume);
  });

  it("should call downloadJSON when JSON is clicked", async () => {
    const user = userEvent.setup();
    const downloadJSONSpy = vi.spyOn(exportUtils, "downloadJSON");

    render(<ExportMenu resume={mockResume} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    await user.click(exportButton);

    const jsonOption = screen.getByText("JSON");
    await user.click(jsonOption);

    expect(downloadJSONSpy).toHaveBeenCalledWith(mockResume);
  });

  it("should render with different resume title", () => {
    const differentResume: Resume = {
      ...mockResume,
      title: "Marketing Manager Resume",
    };

    render(<ExportMenu resume={differentResume} />);

    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });

  it("should render export icon", () => {
    const { container } = render(<ExportMenu resume={mockResume} />);

    // Check for Download icon (lucide-react icon)
    const icon = container.querySelector(".lucide-download");
    expect(icon).toBeInTheDocument();
  });
});
