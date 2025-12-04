import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import type { Resume } from "@/lib/api/types";
import { ResumeTable } from "../resume-table";

// Mock the RowContextMenu to simplify testing
vi.mock("../resume-table-columns", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../resume-table-columns")>();
  return {
    ...actual,
    RowContextMenu: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Mock the mutations module to avoid complex dialog rendering
vi.mock("../mutations", () => ({
  DeleteResumeDialog: () => null,
  RenameResumeDialog: () => null,
}));

describe("ResumeTable", () => {
  const mockResumes: Resume[] = [
    {
      id: "resume-1",
      userId: "user-1",
      title: "Software Engineer Resume",
      content: {
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          nameOrder: "firstLast",
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
          firstName: "Jane",
          lastName: "Smith",
          nameOrder: "firstLast",
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the table component", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      // Should render a table element
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("renders the search input with correct placeholder", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      expect(
        screen.getByPlaceholderText("Search resumes by title..."),
      ).toBeInTheDocument();
    });

    it("renders all resume titles", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      expect(screen.getByText("Software Engineer Resume")).toBeInTheDocument();
      expect(screen.getByText("Product Manager Resume")).toBeInTheDocument();
    });

    it("renders empty state when no resumes", () => {
      render(
        <ResumeTable
          resumes={[]}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      expect(screen.getByText("No results.")).toBeInTheDocument();
    });
  });

  describe("Column Headers", () => {
    it("renders Title column header", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("renders Status column header", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      // Status button in filter and column header
      const statusElements = screen.getAllByText("Status");
      expect(statusElements.length).toBeGreaterThan(0);
    });

    it("renders Last Modified column header", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      expect(screen.getByText("Last Modified")).toBeInTheDocument();
    });
  });

  describe("Status Display", () => {
    it("shows Draft status for incomplete resumes", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      // Both resumes should show Draft status since they have minimal content
      const draftBadges = screen.getAllByText("Draft");
      expect(draftBadges.length).toBe(2);
    });

    it("shows Complete status for fully filled resume", () => {
      const completeResume: Resume = {
        id: "complete-resume",
        userId: "user-1",
        title: "Complete Resume",
        content: {
          personalInfo: {
            firstName: "John",
            lastName: "Doe",
            nameOrder: "firstLast",
            email: "john@example.com",
            phone: "555-1234",
            location: "New York",
            summary: "Experienced developer",
          },
          experience: [
            {
              id: "exp-1",
              company: "Tech Corp",
              position: "Developer",
              startDate: "2020-01-01",
              endDate: "2024-01-01",
              current: false,
              description: "Did stuff",
              highlights: [],
            },
          ],
          education: [
            {
              id: "edu-1",
              institution: "University",
              degree: "BS",
              field: "CS",
              startDate: "2016-01-01",
              endDate: "2020-01-01",
              current: false,
            },
          ],
          skills: {
            technical: ["JavaScript"],
            languages: [],
            tools: [],
            soft: ["Communication"],
          },
          certifications: [],
          links: [],
        },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      render(
        <ResumeTable
          resumes={[completeResume]}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      expect(screen.getByText("Complete")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("renders pagination controls", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      // Check for pagination text
      expect(screen.getByText(/row\(s\) selected/)).toBeInTheDocument();
      expect(screen.getByText("Rows per page")).toBeInTheDocument();
    });
  });

  describe("Data Handling", () => {
    it("renders single resume correctly", () => {
      render(
        <ResumeTable
          resumes={[mockResumes[0]]}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      expect(screen.getByText("Software Engineer Resume")).toBeInTheDocument();
      expect(
        screen.queryByText("Product Manager Resume"),
      ).not.toBeInTheDocument();
    });

    it("handles many resumes", () => {
      const manyResumes: Resume[] = Array.from({ length: 15 }, (_, i) => ({
        ...mockResumes[0],
        id: `resume-${i}`,
        title: `Resume ${i}`,
      }));

      render(
        <ResumeTable
          resumes={manyResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      // Table should render (pagination will limit visible rows)
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("Selection", () => {
    it("renders checkboxes for row selection", () => {
      render(
        <ResumeTable
          resumes={mockResumes}
          onEdit={mockOnEdit}
          onDuplicate={mockOnDuplicate}
        />,
      );

      // Find checkboxes by their aria-label
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: "Select all",
      });
      expect(selectAllCheckbox).toBeInTheDocument();

      const rowCheckboxes = screen.getAllByRole("checkbox", {
        name: "Select row",
      });
      expect(rowCheckboxes).toHaveLength(2);
    });
  });
});
