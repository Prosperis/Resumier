import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";
import type { Link } from "@/lib/api/types";

// Mock @dnd-kit modules
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
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
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

vi.mock("../link-inline-form", () => ({
  LinkInlineForm: () => null,
}));

// Mock the getLinkIcon from shared contact-info
vi.mock("@/components/features/resume/preview/templates/shared/contact-info", () => ({
  getLinkIcon: () => null,
}));

import { LinkList } from "../link-list";

describe("LinkList", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnReorder = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    resumeId: "test-resume-id",
    editingId: null,
    isAddingNew: false,
    onEdit: mockOnEdit,
    onClose: mockOnClose,
    onDelete: mockOnDelete,
    onReorder: mockOnReorder,
  };

  const mockLinks: Link[] = [
    {
      id: "1",
      label: "My Portfolio",
      url: "https://johndoe.com",
      type: "website",
    },
    {
      id: "2",
      label: "LinkedIn Profile",
      url: "https://linkedin.com/in/johndoe",
      type: "linkedin",
    },
    {
      id: "3",
      label: "GitHub Profile",
      url: "https://github.com/johndoe",
      type: "github",
    },
    {
      id: "4",
      label: "Personal Blog",
      url: "https://blog.johndoe.com",
      type: "other",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Empty State", () => {
    it("renders empty state when no links are provided", () => {
      render(<LinkList {...defaultProps} links={[]} />);

      expect(screen.getByText("No links added yet")).toBeInTheDocument();
      expect(
        screen.getByText("Add your portfolio, LinkedIn, GitHub, or other links"),
      ).toBeInTheDocument();
    });

    it("renders empty state card with dashed border", () => {
      const { container } = render(<LinkList {...defaultProps} links={[]} />);

      const card = container.querySelector(".border-dashed");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Link Rendering", () => {
    it("renders all links", () => {
      render(<LinkList {...defaultProps} links={mockLinks} />);

      expect(screen.getByText("My Portfolio")).toBeInTheDocument();
      expect(screen.getByText("LinkedIn Profile")).toBeInTheDocument();
      expect(screen.getByText("GitHub Profile")).toBeInTheDocument();
      expect(screen.getByText("Personal Blog")).toBeInTheDocument();
    });

    it("displays link URLs as clickable links", () => {
      render(<LinkList {...defaultProps} links={mockLinks} />);

      const allLinks = screen.getAllByRole("link");
      const portfolioLink = allLinks.find(
        (link) => link.getAttribute("href") === "https://johndoe.com",
      );

      expect(portfolioLink).toBeInTheDocument();
      expect(portfolioLink).toHaveAttribute("href", "https://johndoe.com");
      expect(portfolioLink).toHaveAttribute("target", "_blank");
      expect(portfolioLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("displays icons for each link", () => {
      const { container } = render(<LinkList {...defaultProps} links={mockLinks} />);

      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Edit Functionality", () => {
    it("calls onEdit with link id when edit button is clicked", async () => {
      const user = userEvent.setup();
      render(<LinkList {...defaultProps} links={mockLinks} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) => btn.querySelector(".lucide-square-pen"));
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith("1");
    });

    it("renders edit button for each link", () => {
      render(<LinkList {...defaultProps} links={mockLinks} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) => btn.querySelector(".lucide-square-pen"));
      expect(editButtons).toHaveLength(4);
    });
  });

  describe("Delete Functionality", () => {
    it("calls onDelete with link ID when delete button is clicked", async () => {
      const user = userEvent.setup();
      render(<LinkList {...defaultProps} links={mockLinks} />);

      const buttons = screen.getAllByRole("button");
      const deleteButtons = buttons.filter((btn) => btn.querySelector(".lucide-trash"));
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });

    it("renders delete button for each link", () => {
      render(<LinkList {...defaultProps} links={mockLinks} />);

      const buttons = screen.getAllByRole("button");
      const deleteButtons = buttons.filter((btn) => btn.querySelector(".lucide-trash"));
      expect(deleteButtons).toHaveLength(4);
    });
  });

  describe("Multiple Links", () => {
    it("renders multiple links in order", () => {
      render(<LinkList {...defaultProps} links={mockLinks} />);

      const linkLabels = screen.getAllByRole("heading", { level: 3 });
      expect(linkLabels).toHaveLength(4);
      expect(linkLabels[0]).toHaveTextContent("My Portfolio");
      expect(linkLabels[1]).toHaveTextContent("LinkedIn Profile");
      expect(linkLabels[2]).toHaveTextContent("GitHub Profile");
      expect(linkLabels[3]).toHaveTextContent("Personal Blog");
    });

    it("each link has its own edit and delete buttons", () => {
      render(<LinkList {...defaultProps} links={mockLinks} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) => btn.querySelector(".lucide-square-pen"));
      const deleteButtons = buttons.filter((btn) => btn.querySelector(".lucide-trash"));

      expect(editButtons).toHaveLength(4);
      expect(deleteButtons).toHaveLength(4);
    });

    it("each link has its own clickable URL", () => {
      render(<LinkList {...defaultProps} links={mockLinks} />);

      const allLinks = screen.getAllByRole("link");
      const portfolioUrl = allLinks.find(
        (link) => link.getAttribute("href") === "https://johndoe.com",
      );
      const linkedinUrl = allLinks.find(
        (link) => link.getAttribute("href") === "https://linkedin.com/in/johndoe",
      );
      const githubUrl = allLinks.find(
        (link) => link.getAttribute("href") === "https://github.com/johndoe",
      );
      const blogUrl = allLinks.find(
        (link) => link.getAttribute("href") === "https://blog.johndoe.com",
      );

      expect(portfolioUrl).toHaveAttribute("href", "https://johndoe.com");
      expect(linkedinUrl).toHaveAttribute("href", "https://linkedin.com/in/johndoe");
      expect(githubUrl).toHaveAttribute("href", "https://github.com/johndoe");
      expect(blogUrl).toHaveAttribute("href", "https://blog.johndoe.com");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long link labels", () => {
      const longLabelLink: Link[] = [
        {
          id: "1",
          label:
            "My Very Long Professional Portfolio Website Showcasing All My Projects and Achievements",
          url: "https://example.com",
          type: "website",
        },
      ];

      render(<LinkList {...defaultProps} links={longLabelLink} />);

      expect(
        screen.getByText(
          "My Very Long Professional Portfolio Website Showcasing All My Projects and Achievements",
        ),
      ).toBeInTheDocument();
    });

    it("handles very long URLs", () => {
      const longUrlLink: Link[] = [
        {
          id: "1",
          label: "Portfolio",
          url: "https://example.com/very/long/path/to/my/portfolio/page/with/many/segments/and/parameters?param1=value1&param2=value2",
          type: "website",
        },
      ];

      render(<LinkList {...defaultProps} links={longUrlLink} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "https://example.com/very/long/path/to/my/portfolio/page/with/many/segments/and/parameters?param1=value1&param2=value2",
      );
    });

    it("handles URLs with special characters", () => {
      const specialCharLink: Link[] = [
        {
          id: "1",
          label: "Portfolio",
          url: "https://example.com/portfolio?name=John%20Doe&year=2023&category=design",
          type: "website",
        },
      ];

      render(<LinkList {...defaultProps} links={specialCharLink} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "https://example.com/portfolio?name=John%20Doe&year=2023&category=design",
      );
    });

    it("handles single link", () => {
      const singleLink: Link[] = [
        {
          id: "1",
          label: "My Portfolio",
          url: "https://example.com",
          type: "website",
        },
      ];

      render(<LinkList {...defaultProps} links={singleLink} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) => btn.querySelector(".lucide-square-pen"));
      const deleteButtons = buttons.filter((btn) => btn.querySelector(".lucide-trash"));
      expect(editButtons).toHaveLength(1);
      expect(deleteButtons).toHaveLength(1);
    });

    it("handles links with HTTPS protocol", () => {
      const httpsLink: Link[] = [
        {
          id: "1",
          label: "Secure Site",
          url: "https://secure.example.com",
          type: "other",
        },
      ];

      render(<LinkList {...defaultProps} links={httpsLink} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://secure.example.com");
    });

    it("handles links with HTTP protocol", () => {
      const httpLink: Link[] = [
        {
          id: "1",
          label: "Legacy Site",
          url: "http://legacy.example.com",
          type: "other",
        },
      ];

      render(<LinkList {...defaultProps} links={httpLink} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "http://legacy.example.com");
    });
  });
});
