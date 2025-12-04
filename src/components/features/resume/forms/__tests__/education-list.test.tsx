import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Education } from "@/lib/api/types";

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

vi.mock("../education-inline-form", () => ({
  EducationInlineForm: () => null,
}));

import { EducationList } from "../education-list";

describe("EducationList", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const _mockOnReorder = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    resumeId: "test-resume-id",
    editingId: null,
    isAddingNew: false,
    onEdit: mockOnEdit,
    onClose: mockOnClose,
    onDelete: mockOnDelete,
  };

  const sampleEducation: Education[] = [
    {
      id: "1",
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "2015-09",
      endDate: "2019-06",
      current: false,
      gpa: "3.8",
      honors: ["Dean's List", "Summa Cum Laude"],
    },
    {
      id: "2",
      degree: "Master of Science",
      field: "Software Engineering",
      institution: "MIT",
      location: "Cambridge, MA",
      startDate: "2019-09",
      endDate: "",
      current: true,
      gpa: "4.0",
      honors: [],
    },
    {
      id: "3",
      degree: "Associate Degree",
      field: "Web Development",
      institution: "Community College",
      location: "Local",
      startDate: "2013-09",
      endDate: "2015-06",
      current: false,
      gpa: "",
      honors: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Empty State", () => {
    it("renders empty state when no education", () => {
      render(<EducationList {...defaultProps} education={[]} />);

      expect(screen.getByText("No education added yet.")).toBeInTheDocument();
      expect(
        screen.getByText("Click the + button to add your education."),
      ).toBeInTheDocument();
    });

    it("renders empty state with dashed border card", () => {
      const { container } = render(
        <EducationList {...defaultProps} education={[]} />,
      );

      const card = container.querySelector(".border-dashed");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Education Rendering", () => {
    it("renders all education entries", () => {
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
      expect(screen.getByText("Master of Science")).toBeInTheDocument();
      expect(screen.getByText("Associate Degree")).toBeInTheDocument();
    });

    it("displays institution names", () => {
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      expect(screen.getByText("Stanford University")).toBeInTheDocument();
      expect(screen.getByText("MIT")).toBeInTheDocument();
      expect(screen.getByText("Community College")).toBeInTheDocument();
    });

    it("displays field of study", () => {
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      expect(screen.getByText("Computer Science")).toBeInTheDocument();
      expect(screen.getByText("Software Engineering")).toBeInTheDocument();
      expect(screen.getByText("Web Development")).toBeInTheDocument();
    });

    it("formats date range correctly for completed education", () => {
      render(
        <EducationList {...defaultProps} education={[sampleEducation[0]]} />,
      );

      expect(screen.getByText(/Sep 2015.*Jun 2019/)).toBeInTheDocument();
    });

    it("formats date range with Present for current education", () => {
      render(
        <EducationList {...defaultProps} education={[sampleEducation[1]]} />,
      );

      expect(screen.getByText(/Sep 2019.*Present/)).toBeInTheDocument();
    });

    it("displays GPA when provided", () => {
      render(
        <EducationList {...defaultProps} education={[sampleEducation[0]]} />,
      );

      expect(screen.getByText("GPA:")).toBeInTheDocument();
      expect(screen.getByText("3.8")).toBeInTheDocument();
    });

    it("displays honors as bullet list", () => {
      render(
        <EducationList {...defaultProps} education={[sampleEducation[0]]} />,
      );

      expect(screen.getByText("Honors & Awards:")).toBeInTheDocument();
      expect(screen.getByText("Dean's List")).toBeInTheDocument();
      expect(screen.getByText("Summa Cum Laude")).toBeInTheDocument();
    });

    it("does not render CardContent when no GPA and no honors", () => {
      render(
        <EducationList {...defaultProps} education={[sampleEducation[2]]} />,
      );

      expect(screen.getByText("Associate Degree")).toBeInTheDocument();
      expect(screen.queryByText("GPA:")).not.toBeInTheDocument();
      expect(screen.queryByText("Honors & Awards:")).not.toBeInTheDocument();
    });

    it("renders CardContent when only GPA is provided", () => {
      const eduWithGPA: Education = {
        ...sampleEducation[1],
        honors: [],
      };

      render(<EducationList {...defaultProps} education={[eduWithGPA]} />);

      expect(screen.getByText("GPA:")).toBeInTheDocument();
      expect(screen.getByText("4.0")).toBeInTheDocument();
    });

    it("renders CardContent when only honors are provided", () => {
      const eduWithHonors: Education = {
        ...sampleEducation[0],
        gpa: "",
      };

      render(<EducationList {...defaultProps} education={[eduWithHonors]} />);

      expect(screen.getByText("Honors & Awards:")).toBeInTheDocument();
      expect(screen.getByText("Dean's List")).toBeInTheDocument();
    });

    it("does not render GPA when it contains only whitespace", () => {
      const eduWithWhitespaceGPA: Education = {
        ...sampleEducation[0],
        gpa: "   ",
        honors: [],
      };

      render(
        <EducationList {...defaultProps} education={[eduWithWhitespaceGPA]} />,
      );

      expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
      expect(screen.queryByText("GPA:")).not.toBeInTheDocument();
      expect(screen.queryByText("Honors & Awards:")).not.toBeInTheDocument();
    });
  });

  describe("Edit Functionality", () => {
    it("calls onEdit with correct id when edit button clicked", async () => {
      const user = userEvent.setup();
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) =>
        btn.querySelector(".lucide-square-pen"),
      );
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith("1");
    });

    it("calls onEdit for different education entries independently", async () => {
      const user = userEvent.setup();
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) =>
        btn.querySelector(".lucide-square-pen"),
      );

      await user.click(editButtons[1]);
      expect(mockOnEdit).toHaveBeenCalledWith("2");

      await user.click(editButtons[2]);
      expect(mockOnEdit).toHaveBeenCalledWith("3");
    });
  });

  describe("Delete Functionality", () => {
    it("calls onDelete with correct id when delete button clicked", async () => {
      const user = userEvent.setup();
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      const buttons = screen.getAllByRole("button");
      const deleteButtons = buttons.filter((btn) =>
        btn.querySelector(".lucide-trash"),
      );
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });

    it("calls onDelete for different education entries independently", async () => {
      const user = userEvent.setup();
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      const buttons = screen.getAllByRole("button");
      const deleteButtons = buttons.filter((btn) =>
        btn.querySelector(".lucide-trash"),
      );

      await user.click(deleteButtons[1]);
      expect(mockOnDelete).toHaveBeenCalledWith("2");

      await user.click(deleteButtons[2]);
      expect(mockOnDelete).toHaveBeenCalledWith("3");
    });
  });

  describe("Date Formatting", () => {
    it("formats January correctly", () => {
      const edu: Education = {
        ...sampleEducation[0],
        startDate: "2020-01",
        endDate: "2024-01",
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(screen.getByText(/Jan 2020.*Jan 2024/)).toBeInTheDocument();
    });

    it("formats December correctly", () => {
      const edu: Education = {
        ...sampleEducation[0],
        startDate: "2020-12",
        endDate: "2024-12",
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(screen.getByText(/Dec 2020.*Dec 2024/)).toBeInTheDocument();
    });
  });

  describe("Multiple Education Entries", () => {
    it("renders multiple entries in order", () => {
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      const degrees = screen.getAllByRole("heading", { level: 3 });
      expect(degrees).toHaveLength(3);
      expect(degrees[0]).toHaveTextContent("Bachelor of Science");
      expect(degrees[1]).toHaveTextContent("Master of Science");
      expect(degrees[2]).toHaveTextContent("Associate Degree");
    });

    it("renders edit and delete buttons for each entry", () => {
      render(<EducationList {...defaultProps} education={sampleEducation} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) =>
        btn.querySelector(".lucide-square-pen"),
      );
      const deleteButtons = buttons.filter((btn) =>
        btn.querySelector(".lucide-trash"),
      );

      expect(editButtons).toHaveLength(3);
      expect(deleteButtons).toHaveLength(3);
    });
  });

  describe("Honors Rendering", () => {
    it("renders multiple honors with bullets", () => {
      const edu: Education = {
        ...sampleEducation[0],
        honors: ["First Honor", "Second Honor", "Third Honor"],
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(screen.getByText("First Honor")).toBeInTheDocument();
      expect(screen.getByText("Second Honor")).toBeInTheDocument();
      expect(screen.getByText("Third Honor")).toBeInTheDocument();
    });

    it("renders single honor", () => {
      const edu: Education = {
        ...sampleEducation[0],
        honors: ["Only Honor"],
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(screen.getByText("Only Honor")).toBeInTheDocument();
    });

    it("does not render honors section when array is empty", () => {
      const edu: Education = {
        ...sampleEducation[0],
        gpa: "",
        honors: [],
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(screen.queryByText("Honors & Awards:")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles education with undefined honors", () => {
      const edu: Education = {
        ...sampleEducation[0],
        honors: undefined as unknown as string[],
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
    });

    it("renders single education entry correctly", () => {
      render(
        <EducationList {...defaultProps} education={[sampleEducation[0]]} />,
      );

      expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
      expect(screen.queryByText("Master of Science")).not.toBeInTheDocument();
    });

    it("handles very long degree names", () => {
      const edu: Education = {
        ...sampleEducation[0],
        degree:
          "Bachelor of Science in Advanced Computer Science and Software Engineering Technology",
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(
        screen.getByText(/Bachelor of Science in Advanced/),
      ).toBeInTheDocument();
    });

    it("handles very long institution names", () => {
      const edu: Education = {
        ...sampleEducation[0],
        institution:
          "The Very Long Name University of Technology and Applied Sciences International",
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(
        screen.getByText(/The Very Long Name University/),
      ).toBeInTheDocument();
    });

    it("handles GPA with trailing spaces", () => {
      const edu: Education = {
        ...sampleEducation[0],
        gpa: "3.8  ",
        honors: [],
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(screen.getByText("GPA:")).toBeInTheDocument();
      expect(screen.getByText("3.8")).toBeInTheDocument();
    });
  });

  describe("GPA Display", () => {
    it("displays GPA with correct formatting", () => {
      const edu: Education = {
        ...sampleEducation[0],
        gpa: "3.95",
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      const gpaText = screen.getByText((content, element) => {
        return element?.textContent === "GPA: 3.95";
      });
      expect(gpaText).toBeInTheDocument();
    });

    it("displays perfect GPA", () => {
      const edu: Education = {
        ...sampleEducation[1],
        gpa: "4.0",
      };

      render(<EducationList {...defaultProps} education={[edu]} />);

      expect(screen.getByText("4.0")).toBeInTheDocument();
    });
  });
});
