import { render, screen } from "@testing-library/react"
import { FileText, LayoutDashboard, Settings2 } from "lucide-react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { NavMain } from "../nav-main"

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: React.ComponentProps<"a"> & { to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("lucide-react", async () => {
  const actual = await vi.importActual<typeof import("lucide-react")>("lucide-react")
  return {
    ...actual,
    ChevronRight: () => <span data-testid="chevron-icon">›</span>,
  }
})

vi.mock("@/components/ui/collapsible", () => ({
  Collapsible: ({
    children,
    ...props
  }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
    <div data-testid="collapsible" {...props}>
      {children}
    </div>
  ),
  CollapsibleContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid="collapsible-content">{children}</div>
  ),
  CollapsibleTrigger: ({ children, asChild }: React.PropsWithChildren<{ asChild?: boolean }>) => {
    if (asChild) return <div data-testid="collapsible-trigger">{children}</div>
    return <button data-testid="collapsible-trigger">{children}</button>
  },
}))

vi.mock("@/components/ui/sidebar", () => ({
  SidebarGroup: ({ children }: React.PropsWithChildren) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupLabel: ({ children }: React.PropsWithChildren) => (
    <div data-testid="sidebar-group-label">{children}</div>
  ),
  SidebarMenu: ({ children }: React.PropsWithChildren) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuItem: ({ children }: React.PropsWithChildren) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
  SidebarMenuButton: ({
    children,
    asChild,
    tooltip,
    ...props
  }: React.PropsWithChildren<
    { asChild?: boolean; tooltip?: string } & React.HTMLAttributes<HTMLElement>
  >) => {
    if (asChild)
      return (
        <div data-testid="sidebar-menu-button" title={tooltip} {...props}>
          {children}
        </div>
      )
    return (
      <button data-testid="sidebar-menu-button" title={tooltip} {...props}>
        {children}
      </button>
    )
  },
  SidebarMenuAction: ({
    children,
    ...props
  }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
    <div data-testid="sidebar-menu-action" {...props}>
      {children}
    </div>
  ),
  SidebarMenuSub: ({ children }: React.PropsWithChildren) => (
    <ul data-testid="sidebar-menu-sub">{children}</ul>
  ),
  SidebarMenuSubItem: ({ children }: React.PropsWithChildren) => (
    <li data-testid="sidebar-menu-sub-item">{children}</li>
  ),
  SidebarMenuSubButton: ({
    children,
    asChild,
    ...props
  }: React.PropsWithChildren<{ asChild?: boolean } & React.HTMLAttributes<HTMLElement>>) => {
    if (asChild)
      return (
        <div data-testid="sidebar-menu-sub-button" {...props}>
          {children}
        </div>
      )
    return (
      <button data-testid="sidebar-menu-sub-button" {...props}>
        {children}
      </button>
    )
  },
}))

describe("NavMain", () => {
  const mockItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Resumes",
      url: "/dashboard",
      icon: FileText,
      items: [
        {
          title: "All Resumes",
          url: "/dashboard",
        },
        {
          title: "Create New",
          url: "/resume/new",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ]

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  })

  describe("Rendering", () => {
    it("renders the Navigation label", () => {
      render(<NavMain items={mockItems} />)

      expect(screen.getByText("Navigation")).toBeInTheDocument()
    })

    it("renders all main menu items", () => {
      render(<NavMain items={mockItems} />)

      expect(screen.getByText("Dashboard")).toBeInTheDocument()
      expect(screen.getByText("Resumes")).toBeInTheDocument()
      expect(screen.getByText("Settings")).toBeInTheDocument()
    })

    it("renders the correct number of main items", () => {
      render(<NavMain items={mockItems} />)

      const menuItems = screen.getAllByTestId("sidebar-menu-item")
      expect(menuItems).toHaveLength(3)
    })
  })

  describe("Links", () => {
    it("renders links with correct URLs", () => {
      render(<NavMain items={mockItems} />)

      const dashboardLink = screen.getByRole("link", { name: /dashboard/i })
      expect(dashboardLink).toHaveAttribute("href", "/dashboard")
    })

    it("renders all links", () => {
      render(<NavMain items={mockItems} />)

      const links = screen.getAllByRole("link")
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe("Subitems", () => {
    it("renders subitems when present", () => {
      render(<NavMain items={mockItems} />)

      expect(screen.getByText("All Resumes")).toBeInTheDocument()
      expect(screen.getByText("Create New")).toBeInTheDocument()
    })

    it("renders submenu structure for items with subitems", () => {
      render(<NavMain items={mockItems} />)

      const submenu = screen.getByTestId("sidebar-menu-sub")
      expect(submenu).toBeInTheDocument()
    })

    it("renders correct number of subitems", () => {
      render(<NavMain items={mockItems} />)

      const subItems = screen.getAllByTestId("sidebar-menu-sub-item")
      expect(subItems).toHaveLength(2)
    })

    it("renders chevron icon for expandable items", () => {
      render(<NavMain items={mockItems} />)

      const chevron = screen.getByTestId("chevron-icon")
      expect(chevron).toBeInTheDocument()
    })

    it("renders CollapsibleTrigger for items with subitems", () => {
      render(<NavMain items={mockItems} />)

      const trigger = screen.getByTestId("collapsible-trigger")
      expect(trigger).toBeInTheDocument()
    })
  })

  describe("Active State", () => {
    it("renders items with isActive property", () => {
      render(<NavMain items={mockItems} />)

      // Dashboard is marked as active
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
    })

    it("opens collapsible for active items", () => {
      render(<NavMain items={mockItems} />)

      // The first item is active and should have defaultOpen
      const collapsible = screen.getAllByTestId("collapsible")[0]
      expect(collapsible).toBeInTheDocument()
    })
  })

  describe("Items Without Subitems", () => {
    it("does not render collapsible content for simple items", () => {
      const simpleItems = [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ]

      render(<NavMain items={simpleItems} />)

      expect(screen.queryByTestId("collapsible-content")).not.toBeInTheDocument()
    })

    it("renders simple items correctly", () => {
      const simpleItems = [
        {
          title: "Settings",
          url: "/settings",
          icon: Settings2,
        },
      ]

      render(<NavMain items={simpleItems} />)

      expect(screen.getByText("Settings")).toBeInTheDocument()
      const link = screen.getByRole("link", { name: /settings/i })
      expect(link).toHaveAttribute("href", "/settings")
    })
  })

  describe("Empty State", () => {
    it("renders without items", () => {
      render(<NavMain items={[]} />)

      expect(screen.getByText("Navigation")).toBeInTheDocument()
      expect(screen.queryAllByTestId("sidebar-menu-item")).toHaveLength(0)
    })
  })

  describe("Structure", () => {
    it("has correct component hierarchy", () => {
      render(<NavMain items={mockItems} />)

      expect(screen.getByTestId("sidebar-group")).toBeInTheDocument()
      expect(screen.getByTestId("sidebar-group-label")).toBeInTheDocument()
      expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument()
    })

    it("uses Collapsible for each menu item", () => {
      render(<NavMain items={mockItems} />)

      const collapsibles = screen.getAllByTestId("collapsible")
      expect(collapsibles).toHaveLength(3)
    })
  })

  describe("Tooltips", () => {
    it("adds tooltip to menu buttons", () => {
      render(<NavMain items={mockItems} />)

      const buttons = screen.getAllByTestId("sidebar-menu-button")
      // First button should have Dashboard tooltip
      expect(buttons[0]).toHaveAttribute("title", "Dashboard")
    })
  })
})
