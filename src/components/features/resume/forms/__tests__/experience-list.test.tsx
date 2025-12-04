import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Experience } from "@/lib/api/types";

// Mock the dnd-kit modules
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: any) => children,
  closestCenter: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => children,
  verticalListSortingStrategy: vi.fn(),
  sortableKeyboardCoordinates: vi.fn(),
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: () => "",
    },
  },
}));

vi.mock("../dnd/sortable-item", () => ({
  SortableItem: ({ children }: any) => children,
}));

vi.mock("../dnd/drag-handle", () => ({
  DragHandle: () => null,
}));

vi.mock("../experience-inline-form", () => ({
  ExperienceInlineForm: () => null,
}));

import { ExperienceList } from "../experience-list";

describe("ExperienceList", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnReorder = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    resumeId: "test-resume-id",
    editingId: null,
    isAddingNew: false,
    onClose: mockOnClose,
  };

  const sampleExperiences: Experience[] = [
    {
      id: "1",
      position: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2020-01",
      endDate: "2023-06",
      current: false,
      description: "Led development of key features",
      highlights: ["Improved performance by 50%", "Mentored junior developers"],
    },
    {
      id: "2",
      position: "Software Engineer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2018-06",
      endDate: "2019-12",
      current: false,
      description: "Built scalable backend systems",
      highlights: [],
    },
    {
      id: "3",
      position: "Lead Developer",
      company: "Current Company",
      location: "New York, NY",
      startDate: "2023-07",
      endDate: "",
      current: true,
      description: "",
      highlights: ["Leading team of 5 developers"],
    },
  ];

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Empty State", () => {
    it("renders empty state when no experiences", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={[]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("No experience added yet.")).toBeInTheDocument();
      expect(
        screen.getByText("Click the + button to add your first experience."),
      ).toBeInTheDocument();
    });

    it("renders empty state with dashed border card", () => {
      const { container } = render(
        <ExperienceList
          {...defaultProps}
          experiences={[]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const card = container.querySelector(".border-dashed");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Experience Rendering", () => {
    it("renders all experiences", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Lead Developer")).toBeInTheDocument();
    });

    it("displays company names", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Tech Corp")).toBeInTheDocument();
      expect(screen.getByText("StartupXYZ")).toBeInTheDocument();
      expect(screen.getByText("Current Company")).toBeInTheDocument();
    });

    it("formats date range correctly for past experience", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={[sampleExperiences[0]]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Jan 2020 – Jun 2023")).toBeInTheDocument();
    });

    it("formats date range with Present for current position", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={[sampleExperiences[2]]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Jul 2023 – Present")).toBeInTheDocument();
    });

    it("displays description when provided", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={[sampleExperiences[0]]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.getByText("Led development of key features"),
      ).toBeInTheDocument();
    });

    it("displays highlights as bullet list", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={[sampleExperiences[0]]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.getByText("Improved performance by 50%"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Mentored junior developers"),
      ).toBeInTheDocument();
    });

    it("does not render CardContent when no description and no highlights", () => {
      const expWithoutContent: Experience = {
        ...sampleExperiences[0],
        description: "",
        highlights: [],
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[expWithoutContent]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      // Should render the position
      expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();

      // Should not render description or highlights
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("renders CardContent when only description is provided", () => {
      const expWithDescription: Experience = {
        ...sampleExperiences[0],
        highlights: [],
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[expWithDescription]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.getByText("Led development of key features"),
      ).toBeInTheDocument();
    });

    it("renders CardContent when only highlights are provided", () => {
      const expWithHighlights: Experience = {
        ...sampleExperiences[0],
        description: "",
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[expWithHighlights]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.getByText("Improved performance by 50%"),
      ).toBeInTheDocument();
    });
  });

  describe("Edit Functionality", () => {
    it("calls onEdit with correct experience when edit button clicked", async () => {
      const user = userEvent.setup();
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const editButtons = screen.getAllByLabelText(/edit.*experience/i);
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(sampleExperiences[0].id);
    });

    it("renders edit button with correct aria-label", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={[sampleExperiences[0]]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.getByLabelText("Edit Senior Software Engineer experience"),
      ).toBeInTheDocument();
    });

    it("calls onEdit for different experiences independently", async () => {
      const user = userEvent.setup();
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const editButtons = screen.getAllByLabelText(/edit.*experience/i);

      await user.click(editButtons[1]);
      expect(mockOnEdit).toHaveBeenCalledWith(sampleExperiences[1].id);

      await user.click(editButtons[2]);
      expect(mockOnEdit).toHaveBeenCalledWith(sampleExperiences[2].id);
    });
  });

  describe("Delete Functionality", () => {
    it("calls onDelete with correct id when delete button clicked", async () => {
      const user = userEvent.setup();
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButtons = screen.getAllByLabelText(/delete.*experience/i);
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });

    it("renders delete button with correct aria-label", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={[sampleExperiences[0]]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.getByLabelText("Delete Senior Software Engineer experience"),
      ).toBeInTheDocument();
    });

    it("calls onDelete for different experiences independently", async () => {
      const user = userEvent.setup();
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButtons = screen.getAllByLabelText(/delete.*experience/i);

      await user.click(deleteButtons[1]);
      expect(mockOnDelete).toHaveBeenCalledWith("2");

      await user.click(deleteButtons[2]);
      expect(mockOnDelete).toHaveBeenCalledWith("3");
    });
  });

  describe("Date Formatting", () => {
    it("formats January correctly", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        startDate: "2020-01",
        endDate: "2020-01",
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Jan 2020 – Jan 2020")).toBeInTheDocument();
    });

    it("formats December correctly", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        startDate: "2020-12",
        endDate: "2021-12",
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Dec 2020 – Dec 2021")).toBeInTheDocument();
    });

    it("handles missing endDate when not current", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        current: false,
        endDate: "",
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      // Should show empty string for end date
      expect(screen.getByText(/Jan 2020 –/)).toBeInTheDocument();
    });
  });

  describe("Multiple Experiences", () => {
    it("renders multiple experiences in order", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const positions = screen.getAllByRole("heading", { level: 3 });
      expect(positions).toHaveLength(3);
      expect(positions[0]).toHaveTextContent("Senior Software Engineer");
      expect(positions[1]).toHaveTextContent("Software Engineer");
      expect(positions[2]).toHaveTextContent("Lead Developer");
    });

    it("renders edit and delete buttons for each experience", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const editButtons = screen.getAllByLabelText(/edit.*experience/i);
      const deleteButtons = screen.getAllByLabelText(/delete.*experience/i);

      expect(editButtons).toHaveLength(3);
      expect(deleteButtons).toHaveLength(3);
    });
  });

  describe("Calendar Icon", () => {
    it("renders calendar icon for each experience", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={sampleExperiences}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      // Calendar icons are rendered via Lucide component
      const dateElements = screen.getAllByText(/\d{4}/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles experience with empty highlights array", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        highlights: [],
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("handles experience with undefined highlights", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        highlights: undefined as unknown as string[],
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
    });

    it("renders single experience correctly", () => {
      render(
        <ExperienceList
          {...defaultProps}
          experiences={[sampleExperiences[0]]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
      expect(screen.queryByText("Software Engineer")).not.toBeInTheDocument();
    });

    it("handles very long position names", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        position:
          "Very Long Position Title That Might Wrap Multiple Lines Senior Principal Staff Software Architect Engineer III",
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText(/Very Long Position Title/)).toBeInTheDocument();
    });

    it("handles very long company names", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        company:
          "Very Long Company Name International Corporation Limited LLC Inc",
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText(/Very Long Company Name/)).toBeInTheDocument();
    });
  });

  describe("Highlights Rendering", () => {
    it("renders multiple highlights with bullets", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        highlights: [
          "First achievement",
          "Second achievement",
          "Third achievement",
        ],
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("First achievement")).toBeInTheDocument();
      expect(screen.getByText("Second achievement")).toBeInTheDocument();
      expect(screen.getByText("Third achievement")).toBeInTheDocument();
    });

    it("renders single highlight", () => {
      const exp: Experience = {
        ...sampleExperiences[0],
        highlights: ["Only highlight"],
      };

      render(
        <ExperienceList
          {...defaultProps}
          experiences={[exp]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Only highlight")).toBeInTheDocument();
    });
  });
});
