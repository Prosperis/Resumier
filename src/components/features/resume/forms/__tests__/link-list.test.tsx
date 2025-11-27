import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LinkFormData } from "@/lib/validations/links";
import { LinkList } from "../link-list";

// Mock @dnd-kit modules
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  closestCenter: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
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
  SortableItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../dnd/drag-handle", () => ({
  DragHandle: () => <div>Drag Handle</div>,
}));

describe("LinkList", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnReorder = vi.fn();

  const mockLinks: LinkFormData[] = [
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
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Empty State", () => {
    it("renders empty state when no links are provided", () => {
      render(
        <LinkList
          links={[]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText("No links added yet")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Add your portfolio, LinkedIn, GitHub, or other professional links",
        ),
      ).toBeInTheDocument();
    });

    it("renders empty state card with dashed border", () => {
      const { container } = render(
        <LinkList
          links={[]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const card = container.querySelector(".border-dashed");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Link Rendering", () => {
    it("renders all links", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText("My Portfolio")).toBeInTheDocument();
      expect(screen.getByText("LinkedIn Profile")).toBeInTheDocument();
      expect(screen.getByText("GitHub Profile")).toBeInTheDocument();
      expect(screen.getByText("Personal Blog")).toBeInTheDocument();
    });

    it("displays link URLs as clickable links", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const allLinks = screen.getAllByRole("link");
      const portfolioLink = allLinks.find(
        (link) => link.getAttribute("href") === "https://johndoe.com",
      );

      expect(portfolioLink).toBeInTheDocument();
      expect(portfolioLink).toHaveAttribute("href", "https://johndoe.com");
      expect(portfolioLink).toHaveAttribute("target", "_blank");
      expect(portfolioLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("displays correct link type labels", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText("Portfolio")).toBeInTheDocument();
      expect(screen.getByText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByText("GitHub")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
    });

    it("displays correct icons for each link type", () => {
      const { container } = render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("renders link type labels in badge style", () => {
      const { container } = render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const badge = container.querySelector(".rounded-full.bg-muted");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Edit Functionality", () => {
    it("calls onEdit with link when edit button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const editButton = screen.getAllByText("Edit")[0];
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockLinks[0]);
    });

    it("renders edit button for each link", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const editButtons = screen.getAllByText("Edit");
      expect(editButtons).toHaveLength(4);
    });

    it("edit button has outline variant", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const editButton = screen.getAllByText("Edit")[0];
      expect(editButton.className).toContain("outline");
    });
  });

  describe("Delete Functionality", () => {
    it("calls onDelete with link ID when delete button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const deleteButton = screen.getAllByText("Delete")[0];
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });

    it("renders delete button for each link", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const deleteButtons = screen.getAllByText("Delete");
      expect(deleteButtons).toHaveLength(4);
    });

    it("delete button has outline variant", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const deleteButton = screen.getAllByText("Delete")[0];
      expect(deleteButton.className).toContain("outline");
    });
  });

  describe("Link Type Icons", () => {
    it("displays portfolio icon for portfolio type", () => {
      const portfolioLink: LinkFormData[] = [
        {
          id: "1",
          label: "My Portfolio Site",
          url: "https://example.com",
          type: "website",
        },
      ];

      render(
        <LinkList
          links={portfolioLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("Portfolio")).toHaveLength(1);
    });

    it("displays LinkedIn icon for linkedin type", () => {
      const linkedinLink: LinkFormData[] = [
        {
          id: "1",
          label: "My LinkedIn Profile",
          url: "https://linkedin.com",
          type: "linkedin",
        },
      ];

      render(
        <LinkList
          links={linkedinLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("LinkedIn")).toHaveLength(1);
    });

    it("displays GitHub icon for github type", () => {
      const githubLink: LinkFormData[] = [
        {
          id: "1",
          label: "My GitHub Profile",
          url: "https://github.com",
          type: "github",
        },
      ];

      render(
        <LinkList
          links={githubLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("GitHub")).toHaveLength(1);
    });

    it("displays generic icon for other type", () => {
      const otherLink: LinkFormData[] = [
        {
          id: "1",
          label: "My Other Link",
          url: "https://example.com",
          type: "other",
        },
      ];

      render(
        <LinkList
          links={otherLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("Other")).toHaveLength(1);
    });
  });

  describe("Multiple Links", () => {
    it("renders multiple links in order", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const linkLabels = screen.getAllByRole("heading", { level: 3 });
      expect(linkLabels).toHaveLength(4);
      expect(linkLabels[0]).toHaveTextContent("My Portfolio");
      expect(linkLabels[1]).toHaveTextContent("LinkedIn Profile");
      expect(linkLabels[2]).toHaveTextContent("GitHub Profile");
      expect(linkLabels[3]).toHaveTextContent("Personal Blog");
    });

    it("each link has its own edit and delete buttons", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const editButtons = screen.getAllByText("Edit");
      const deleteButtons = screen.getAllByText("Delete");

      expect(editButtons).toHaveLength(4);
      expect(deleteButtons).toHaveLength(4);
    });

    it("each link has its own clickable URL", () => {
      render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const allLinks = screen.getAllByRole("link");
      const portfolioUrl = allLinks.find(
        (link) => link.getAttribute("href") === "https://johndoe.com",
      );
      const linkedinUrl = allLinks.find(
        (link) =>
          link.getAttribute("href") === "https://linkedin.com/in/johndoe",
      );
      const githubUrl = allLinks.find(
        (link) => link.getAttribute("href") === "https://github.com/johndoe",
      );
      const blogUrl = allLinks.find(
        (link) => link.getAttribute("href") === "https://blog.johndoe.com",
      );

      expect(portfolioUrl).toHaveAttribute("href", "https://johndoe.com");
      expect(linkedinUrl).toHaveAttribute(
        "href",
        "https://linkedin.com/in/johndoe",
      );
      expect(githubUrl).toHaveAttribute("href", "https://github.com/johndoe");
      expect(blogUrl).toHaveAttribute("href", "https://blog.johndoe.com");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long link labels", () => {
      const longLabelLink: LinkFormData[] = [
        {
          id: "1",
          label:
            "My Very Long Professional Portfolio Website Showcasing All My Projects and Achievements",
          url: "https://example.com",
          type: "website",
        },
      ];

      render(
        <LinkList
          links={longLabelLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByText(
          "My Very Long Professional Portfolio Website Showcasing All My Projects and Achievements",
        ),
      ).toBeInTheDocument();
    });

    it("handles very long URLs", () => {
      const longUrlLink: LinkFormData[] = [
        {
          id: "1",
          label: "Portfolio",
          url: "https://example.com/very/long/path/to/my/portfolio/page/with/many/segments/and/parameters?param1=value1&param2=value2",
          type: "website",
        },
      ];

      render(
        <LinkList
          links={longUrlLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const link = screen.getByRole("link", {
        name: /example.com\/very\/long\/path/i,
      });
      expect(link).toHaveAttribute(
        "href",
        "https://example.com/very/long/path/to/my/portfolio/page/with/many/segments/and/parameters?param1=value1&param2=value2",
      );
    });

    it("handles URLs with special characters", () => {
      const specialCharLink: LinkFormData[] = [
        {
          id: "1",
          label: "Portfolio",
          url: "https://example.com/portfolio?name=John%20Doe&year=2023&category=design",
          type: "website",
        },
      ];

      render(
        <LinkList
          links={specialCharLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const link = screen.getByRole("link", {
        name: /example.com\/portfolio/i,
      });
      expect(link).toHaveAttribute(
        "href",
        "https://example.com/portfolio?name=John%20Doe&year=2023&category=design",
      );
    });

    it("handles single link", () => {
      const singleLink: LinkFormData[] = [
        {
          id: "1",
          label: "My Portfolio",
          url: "https://example.com",
          type: "website",
        },
      ];

      render(
        <LinkList
          links={singleLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("Portfolio")).toHaveLength(1);
      expect(screen.getAllByText("Edit")).toHaveLength(1);
      expect(screen.getAllByText("Delete")).toHaveLength(1);
    });

    it("displays external link icon on URL links", () => {
      const { container } = render(
        <LinkList
          links={mockLinks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const externalLinkIcons = container.querySelectorAll(".h-3.w-3");
      expect(externalLinkIcons.length).toBeGreaterThan(0);
    });

    it("handles links with HTTPS protocol", () => {
      const httpsLink: LinkFormData[] = [
        {
          id: "1",
          label: "Secure Site",
          url: "https://secure.example.com",
          type: "other",
        },
      ];

      render(
        <LinkList
          links={httpsLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const link = screen.getByRole("link", { name: /secure.example.com/i });
      expect(link).toHaveAttribute("href", "https://secure.example.com");
    });

    it("handles links with HTTP protocol", () => {
      const httpLink: LinkFormData[] = [
        {
          id: "1",
          label: "Legacy Site",
          url: "http://legacy.example.com",
          type: "other",
        },
      ];

      render(
        <LinkList
          links={httpLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const link = screen.getByRole("link", { name: /legacy.example.com/i });
      expect(link).toHaveAttribute("href", "http://legacy.example.com");
    });
  });

  describe("Link Type Labels", () => {
    it("capitalizes LinkedIn correctly", () => {
      const linkedinLink: LinkFormData[] = [
        {
          id: "1",
          label: "My LinkedIn Profile",
          url: "https://linkedin.com",
          type: "linkedin",
        },
      ];

      render(
        <LinkList
          links={linkedinLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("LinkedIn")).toHaveLength(1);
    });

    it("capitalizes GitHub correctly", () => {
      const githubLink: LinkFormData[] = [
        {
          id: "1",
          label: "My GitHub Profile",
          url: "https://github.com",
          type: "github",
        },
      ];

      render(
        <LinkList
          links={githubLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("GitHub")).toHaveLength(1);
    });

    it("capitalizes Portfolio correctly", () => {
      const portfolioLink: LinkFormData[] = [
        {
          id: "1",
          label: "My Portfolio Website",
          url: "https://example.com",
          type: "website",
        },
      ];

      render(
        <LinkList
          links={portfolioLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("Portfolio")).toHaveLength(1);
    });

    it("capitalizes Other correctly", () => {
      const otherLink: LinkFormData[] = [
        {
          id: "1",
          label: "Some Other Link",
          url: "https://example.com",
          type: "other",
        },
      ];

      render(
        <LinkList
          links={otherLink}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getAllByText("Other")).toHaveLength(1);
    });
  });
});
