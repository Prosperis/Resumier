import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Resume } from "@/lib/api/types";
import { ResumeTable } from "../resume-table";

// Mock DataTable
vi.mock("@/components/ui/data-table", () => ({
  DataTable: ({ columns, data, searchKey, searchPlaceholder, initialColumnVisibility }: any) => (
    <div data-testid="data-table">
      <div data-testid="search-key">{searchKey}</div>
      <div data-testid="search-placeholder">{searchPlaceholder}</div>
      <div data-testid="column-count">{columns.length}</div>
      <div data-testid="data-count">{data.length}</div>
      {initialColumnVisibility && (
        <div data-testid="initial-visibility">{JSON.stringify(initialColumnVisibility)}</div>
      )}
      {data.map((resume: Resume) => (
        <div key={resume.id} data-testid={`resume-${resume.id}`}>
          {resume.title}
        </div>
      ))}
    </div>
  ),
}));

// Mock columns
vi.mock("../resume-table-columns", () => ({
  createResumeColumns: vi.fn(({ onEdit, onDuplicate }) => [
    {
      id: "title",
      header: "Title",
      cell: ({ row }: any) => row.original.title,
      onEdit,
      onDuplicate,
    },
    {
      id: "createdAt",
      header: "Created",
      cell: ({ row }: any) => row.original.createdAt,
    },
    {
      id: "updatedAt",
      header: "Updated",
      cell: ({ row }: any) => row.original.updatedAt,
    },
    {
      id: "actions",
      header: "Actions",
    },
  ]),
}));

import { createResumeColumns } from "../resume-table-columns";

describe("ResumeTable", () => {
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
  ];

  const mockOnEdit = vi.fn();
  const mockOnDuplicate = vi.fn();

  // Store original innerWidth
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    // Reset window size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  describe("Rendering", () => {
    it("renders DataTable component", () => {
      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.getByTestId("data-table")).toBeInTheDocument();
    });

    it("passes correct search configuration", () => {
      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.getByTestId("search-key")).toHaveTextContent("title");
      expect(screen.getByTestId("search-placeholder")).toHaveTextContent("Search resumes...");
    });

    it("renders all resumes", () => {
      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.getByTestId("data-count")).toHaveTextContent("2");
      expect(screen.getByTestId("resume-resume-1")).toHaveTextContent("Software Engineer Resume");
      expect(screen.getByTestId("resume-resume-2")).toHaveTextContent("Product Manager Resume");
    });

    it("renders with empty array", () => {
      render(<ResumeTable resumes={[]} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />);

      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByTestId("data-count")).toHaveTextContent("0");
    });
  });

  describe("Column Configuration", () => {
    it("creates columns with callbacks", () => {
      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(createResumeColumns).toHaveBeenCalledWith({
        onEdit: mockOnEdit,
        onDuplicate: mockOnDuplicate,
      });
    });

    it("passes columns to DataTable", () => {
      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      // Should have 4 columns: title, createdAt, updatedAt, actions
      expect(screen.getByTestId("column-count")).toHaveTextContent("4");
    });
  });

  describe("Mobile Responsiveness", () => {
    it("hides date columns on mobile", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500, // Mobile width
      });

      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      const visibility = screen.getByTestId("initial-visibility");
      expect(visibility).toHaveTextContent('{"createdAt":false,"updatedAt":false}');
    });

    it("shows all columns on desktop", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024, // Desktop width
      });

      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.queryByTestId("initial-visibility")).not.toBeInTheDocument();
    });

    it("uses 768px as mobile breakpoint", () => {
      // Test just below breakpoint
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 767,
      });

      const { unmount } = render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.getByTestId("initial-visibility")).toBeInTheDocument();
      unmount();

      // Test just above breakpoint
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.queryByTestId("initial-visibility")).not.toBeInTheDocument();
    });
  });

  describe("Data Handling", () => {
    it("passes resume data to DataTable", () => {
      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.getByTestId("resume-resume-1")).toBeInTheDocument();
      expect(screen.getByTestId("resume-resume-2")).toBeInTheDocument();
    });

    it("handles single resume", () => {
      render(
        <ResumeTable resumes={[mockResumes[0]]} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.getByTestId("data-count")).toHaveTextContent("1");
      expect(screen.getByTestId("resume-resume-1")).toBeInTheDocument();
    });

    it("handles many resumes", () => {
      const manyResumes = Array.from({ length: 50 }, (_, i) => ({
        ...mockResumes[0],
        id: `resume-${i}`,
        title: `Resume ${i}`,
      }));

      render(
        <ResumeTable resumes={manyResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(screen.getByTestId("data-count")).toHaveTextContent("50");
    });
  });

  describe("Callback Props", () => {
    it("passes onEdit callback to columns", () => {
      const customOnEdit = vi.fn();
      render(
        <ResumeTable resumes={mockResumes} onEdit={customOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(createResumeColumns).toHaveBeenCalledWith(
        expect.objectContaining({
          onEdit: customOnEdit,
        })
      );
    });

    it("passes onDuplicate callback to columns", () => {
      const customOnDuplicate = vi.fn();
      render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={customOnDuplicate} />
      );

      expect(createResumeColumns).toHaveBeenCalledWith(
        expect.objectContaining({
          onDuplicate: customOnDuplicate,
        })
      );
    });

    it("creates new columns when callbacks change", () => {
      // Clear mock call count from previous tests
      vi.clearAllMocks();

      const { rerender } = render(
        <ResumeTable resumes={mockResumes} onEdit={mockOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(createResumeColumns).toHaveBeenCalledTimes(1);

      const newOnEdit = vi.fn();
      rerender(
        <ResumeTable resumes={mockResumes} onEdit={newOnEdit} onDuplicate={mockOnDuplicate} />
      );

      expect(createResumeColumns).toHaveBeenCalledTimes(2);
    });
  });
});
