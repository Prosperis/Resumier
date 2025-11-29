import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import type { Resume } from "@/lib/api/types";

// Mock child components - must be before imports that use them
vi.mock("@/components/features/resume/export/export-menu", () => ({
  ExportMenu: ({ resume }: { resume: Resume }) => (
    <div data-testid="export-menu">Export Menu for {resume.title}</div>
  ),
}));

vi.mock(
  "@/components/features/resume/preview/interactive-resume-preview",
  () => ({
    InteractiveResumePreview: ({
      resume,
      template,
      isInteractive,
    }: {
      resume: Resume;
      template: string;
      isInteractive: boolean;
    }) => (
      <div data-testid="interactive-resume-preview">
        Preview: {resume.title} - {template} -{" "}
        {isInteractive ? "interactive" : "static"}
      </div>
    ),
  }),
);

vi.mock("@/components/features/resume/resume-builder", () => ({
  ResumeBuilder: () => <div data-testid="resume-builder">Resume Builder</div>,
}));

import { ResumeEditor } from "@/components/features/resume/resume-editor";

// Create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("ResumeEditor", () => {
  const mockResume: Resume = {
    id: "1",
    title: "My Resume",
    content: {
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        nameOrder: "firstLast",
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
  };

  it("should render with interactive preview always visible", () => {
    render(<ResumeEditor resume={mockResume} />, { wrapper: createWrapper() });

    // Preview should be visible and in interactive mode
    expect(
      screen.getByTestId("interactive-resume-preview"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Preview: My Resume - modern - interactive/i),
    ).toBeInTheDocument();
  });

  it("should render mini sidebar with section icons", () => {
    render(<ResumeEditor resume={mockResume} />, { wrapper: createWrapper() });

    // Section icons should be visible - check for the buttons
    const buttons = screen.getAllByRole("button");
    // Should have at least 6 section buttons + expand button
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  it("should have resume builder in the sidebar", () => {
    render(<ResumeEditor resume={mockResume} />, { wrapper: createWrapper() });

    // Resume builder is in the DOM (in the collapsed sidebar)
    expect(screen.getByTestId("resume-builder")).toBeInTheDocument();
  });

  it("should render preview with correct props", () => {
    render(<ResumeEditor resume={mockResume} />, { wrapper: createWrapper() });

    expect(
      screen.getByText(/Preview: My Resume - modern - interactive/i),
    ).toBeInTheDocument();
  });

  it("should render with different resume", () => {
    const differentResume: Resume = {
      ...mockResume,
      title: "Engineering Resume",
    };

    render(<ResumeEditor resume={differentResume} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText(/Preview: Engineering Resume/i),
    ).toBeInTheDocument();
  });
});
