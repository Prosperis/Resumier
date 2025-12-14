import { render, screen } from "@testing-library/react";
import { LifeBuoy, Send } from "lucide-react";
import { vi } from "vitest";
import { NavSecondary } from "../nav-secondary";

// Mock sidebar components
vi.mock("@/components/ui/sidebar", () => ({
  SidebarGroup: ({
    children,
    ...props
  }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
    <div data-testid="sidebar-group" {...props}>
      {children}
    </div>
  ),
  SidebarGroupContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid="sidebar-group-content">{children}</div>
  ),
  SidebarMenu: ({ children }: React.PropsWithChildren) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuButton: ({
    children,
    asChild,
    ...props
  }: React.PropsWithChildren<{ asChild?: boolean } & React.HTMLAttributes<HTMLElement>>) => {
    if (asChild) {
      return (
        <div data-testid="sidebar-menu-button" {...props}>
          {children}
        </div>
      );
    }
    return (
      <button data-testid="sidebar-menu-button" {...props}>
        {children}
      </button>
    );
  },
  SidebarMenuItem: ({ children }: React.PropsWithChildren) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
}));

describe("NavSecondary", () => {
  const mockItems = [
    {
      title: "Support",
      url: "#support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#feedback",
      icon: Send,
    },
  ];

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Rendering", () => {
    it("renders all menu items", () => {
      render(<NavSecondary items={mockItems} />);

      expect(screen.getByText("Support")).toBeInTheDocument();
      expect(screen.getByText("Feedback")).toBeInTheDocument();
    });

    it("renders links with correct URLs", () => {
      render(<NavSecondary items={mockItems} />);

      const supportLink = screen.getByRole("link", { name: /support/i });
      const feedbackLink = screen.getByRole("link", { name: /feedback/i });

      expect(supportLink).toHaveAttribute("href", "#support");
      expect(feedbackLink).toHaveAttribute("href", "#feedback");
    });

    it("renders the correct number of menu items", () => {
      render(<NavSecondary items={mockItems} />);

      const menuItems = screen.getAllByTestId("sidebar-menu-item");
      expect(menuItems).toHaveLength(2);
    });
  });

  describe("Empty State", () => {
    it("renders without items", () => {
      render(<NavSecondary items={[]} />);

      const menu = screen.getByTestId("sidebar-menu");
      expect(menu).toBeInTheDocument();
      expect(screen.queryAllByTestId("sidebar-menu-item")).toHaveLength(0);
    });
  });

  describe("Single Item", () => {
    it("renders with a single item", () => {
      const singleItem = [mockItems[0]];
      render(<NavSecondary items={singleItem} />);

      expect(screen.getByText("Support")).toBeInTheDocument();
      expect(screen.queryByText("Feedback")).not.toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("forwards additional props to SidebarGroup", () => {
      render(<NavSecondary items={mockItems} className="custom-class" data-testid="custom-nav" />);

      const group = screen.getByTestId("custom-nav");
      expect(group).toBeInTheDocument();
      expect(group).toHaveClass("custom-class");
    });

    it("accepts className prop", () => {
      render(<NavSecondary items={mockItems} className="mt-auto" />);

      const group = screen.getByTestId("sidebar-group");
      expect(group).toHaveClass("mt-auto");
    });
  });

  describe("Structure", () => {
    it("has correct component hierarchy", () => {
      render(<NavSecondary items={mockItems} />);

      expect(screen.getByTestId("sidebar-group")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-group-content")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();
    });

    it("uses SidebarMenuButton with size sm", () => {
      render(<NavSecondary items={mockItems} />);

      const buttons = screen.getAllByTestId("sidebar-menu-button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Many Items", () => {
    it("renders multiple items correctly", () => {
      const manyItems = [
        { title: "Item 1", url: "#1", icon: LifeBuoy },
        { title: "Item 2", url: "#2", icon: Send },
        { title: "Item 3", url: "#3", icon: LifeBuoy },
        { title: "Item 4", url: "#4", icon: Send },
      ];

      render(<NavSecondary items={manyItems} />);

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
      expect(screen.getByText("Item 4")).toBeInTheDocument();
    });
  });
});
