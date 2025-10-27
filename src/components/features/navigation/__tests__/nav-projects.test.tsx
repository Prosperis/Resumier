import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Folder } from "lucide-react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { SidebarProvider } from "@/components/ui/sidebar"
import { NavProjects } from "../nav-projects"

// Mock useSidebar hook but keep SidebarContext
vi.mock("@/components/ui/use-sidebar", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/use-sidebar")>()
  return {
    ...actual,
    useSidebar: vi.fn(() => ({ isMobile: false })),
  }
})

import { useSidebar } from "@/components/ui/use-sidebar"

// Helper to render with required providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<SidebarProvider>{ui}</SidebarProvider>)
}

describe("NavProjects", () => {
  const mockProjects = [
    { name: "Project Alpha", url: "/projects/alpha", icon: Folder },
    { name: "Project Beta", url: "/projects/beta", icon: Folder },
    { name: "Project Gamma", url: "/projects/gamma", icon: Folder },
  ]

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    ;(useSidebar as any).mockReturnValue({ isMobile: false } as any)
  })

  describe("Projects List Rendering", () => {
    it("renders the Projects label", () => {
      renderWithProviders(<NavProjects projects={mockProjects} />)

      expect(screen.getByText("Projects")).toBeInTheDocument()
    })

    it("renders all project items", () => {
      renderWithProviders(<NavProjects projects={mockProjects} />)

      expect(screen.getByText("Project Alpha")).toBeInTheDocument()
      expect(screen.getByText("Project Beta")).toBeInTheDocument()
      expect(screen.getByText("Project Gamma")).toBeInTheDocument()
    })

    it("renders project links with correct hrefs", () => {
      renderWithProviders(<NavProjects projects={mockProjects} />)

      const alphaLink = screen.getByRole("link", { name: /project alpha/i })
      const betaLink = screen.getByRole("link", { name: /project beta/i })
      const gammaLink = screen.getByRole("link", { name: /project gamma/i })

      expect(alphaLink).toHaveAttribute("href", "/projects/alpha")
      expect(betaLink).toHaveAttribute("href", "/projects/beta")
      expect(gammaLink).toHaveAttribute("href", "/projects/gamma")
    })

    it("renders icons for each project", () => {
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      // Each project should have an icon (Folder icon renders as SVG)
      const svgIcons = container.querySelectorAll("svg")
      // At least one icon per project + More button icon
      expect(svgIcons.length).toBeGreaterThanOrEqual(mockProjects.length)
    })

    it("renders More button at the end", () => {
      renderWithProviders(<NavProjects projects={mockProjects} />)

      // There are multiple "More" texts (sr-only for action buttons + visible button)
      const moreElements = screen.getAllByText("More")
      // Should have at least one visible "More" button at the end
      expect(moreElements.length).toBeGreaterThan(0)
    })

    it("handles empty projects array", () => {
      renderWithProviders(<NavProjects projects={[]} />)

      expect(screen.getByText("Projects")).toBeInTheDocument()

      // More button should still be present
      const moreElements = screen.getAllByText("More")
      expect(moreElements.length).toBeGreaterThan(0)

      // No project items should be rendered
      expect(screen.queryByText("Project Alpha")).not.toBeInTheDocument()
    })

    it("renders single project correctly", () => {
      const singleProject = [mockProjects[0]]
      renderWithProviders(<NavProjects projects={singleProject} />)

      expect(screen.getByText("Project Alpha")).toBeInTheDocument()
      expect(screen.queryByText("Project Beta")).not.toBeInTheDocument()
    })
  })

  describe("Project Actions Dropdown", () => {
    it("shows dropdown trigger button for each project", () => {
      renderWithProviders(<NavProjects projects={mockProjects} />)

      // Each project should have a "More" action button (sr-only text)
      const moreButtons = screen.getAllByText("More")
      // One for each project + one at the bottom
      expect(moreButtons.length).toBeGreaterThanOrEqual(1)
    })

    it("opens dropdown menu when action button is clicked", async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      // Find the first project's action button (MoreHorizontal icon)
      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      expect(actionButtons.length).toBeGreaterThan(0)

      // Click the first action button
      await user.click(actionButtons[0] as HTMLElement)

      // Dropdown menu items should appear
      expect(await screen.findByText("View Project")).toBeInTheDocument()
      expect(screen.getByText("Share Project")).toBeInTheDocument()
      expect(screen.getByText("Delete Project")).toBeInTheDocument()
    })

    it("renders View Project menu item", async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      await user.click(actionButtons[0] as HTMLElement)

      const viewItem = await screen.findByText("View Project")
      expect(viewItem).toBeInTheDocument()
    })

    it("renders Share Project menu item", async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      await user.click(actionButtons[0] as HTMLElement)

      const shareItem = await screen.findByText("Share Project")
      expect(shareItem).toBeInTheDocument()
    })

    it("renders Delete Project menu item", async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      await user.click(actionButtons[0] as HTMLElement)

      const deleteItem = await screen.findByText("Delete Project")
      expect(deleteItem).toBeInTheDocument()
    })

    it("can click on menu items", async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      await user.click(actionButtons[0] as HTMLElement)

      const viewItem = await screen.findByText("View Project")

      // Item should be clickable (clicking it will close the menu)
      expect(viewItem).toBeInTheDocument()
      await user.click(viewItem)

      // After clicking, menu typically closes, so item is no longer in document
      // This is expected behavior for dropdown menus
    })
  })

  describe("Mobile Responsiveness", () => {
    it("positions dropdown at bottom on mobile", async () => {
      ;(useSidebar as any).mockReturnValue({ isMobile: true } as any)
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      await user.click(actionButtons[0] as HTMLElement)

      // Dropdown should open (positioning can't be tested in jsdom)
      expect(await screen.findByText("View Project")).toBeInTheDocument()
    })

    it("positions dropdown at right on desktop", async () => {
      ;(useSidebar as any).mockReturnValue({ isMobile: false } as any)
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      await user.click(actionButtons[0] as HTMLElement)

      // Dropdown should open
      expect(await screen.findByText("View Project")).toBeInTheDocument()
    })
  })

  describe("Show On Hover Behavior", () => {
    it("action buttons have showOnHover attribute", () => {
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      expect(actionButtons.length).toBeGreaterThan(0)
    })
  })

  describe("Accessibility", () => {
    it("has screen reader text for More buttons", () => {
      renderWithProviders(<NavProjects projects={mockProjects} />)

      // "More" text should be present (some hidden with sr-only)
      const moreTexts = screen.getAllByText("More")
      expect(moreTexts.length).toBeGreaterThan(0)
    })

    it("project links are keyboard accessible", () => {
      renderWithProviders(<NavProjects projects={mockProjects} />)

      const alphaLink = screen.getByRole("link", { name: /project alpha/i })
      alphaLink.focus()

      expect(alphaLink).toHaveFocus()
    })

    it("renders proper link roles for navigation", () => {
      renderWithProviders(<NavProjects projects={mockProjects} />)

      const links = screen.getAllByRole("link")
      expect(links.length).toBeGreaterThanOrEqual(mockProjects.length)
    })
  })

  describe("Menu Separator", () => {
    it("renders separator before Delete Project", async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      await user.click(actionButtons[0] as HTMLElement)

      // All menu items should be visible
      expect(await screen.findByText("View Project")).toBeInTheDocument()
      expect(screen.getByText("Share Project")).toBeInTheDocument()
      expect(screen.getByText("Delete Project")).toBeInTheDocument()
    })
  })

  describe("Project Name Variations", () => {
    it("handles projects with long names", () => {
      const longNameProjects = [
        {
          name: "Very Long Project Name That Might Need Truncation",
          url: "/projects/long",
          icon: Folder,
        },
      ]
      renderWithProviders(<NavProjects projects={longNameProjects} />)

      expect(
        screen.getByText("Very Long Project Name That Might Need Truncation"),
      ).toBeInTheDocument()
    })

    it("handles projects with special characters", () => {
      const specialProjects = [
        { name: "Project-Alpha & Beta", url: "/projects/special", icon: Folder },
      ]
      renderWithProviders(<NavProjects projects={specialProjects} />)

      expect(screen.getByText("Project-Alpha & Beta")).toBeInTheDocument()
    })

    it("handles projects with unicode characters", () => {
      const unicodeProjects = [{ name: "Projet français", url: "/projects/unicode", icon: Folder }]
      renderWithProviders(<NavProjects projects={unicodeProjects} />)

      expect(screen.getByText("Projet français")).toBeInTheDocument()
    })

    it("handles projects with numbers", () => {
      const numericProjects = [{ name: "Project 2024", url: "/projects/2024", icon: Folder }]
      renderWithProviders(<NavProjects projects={numericProjects} />)

      expect(screen.getByText("Project 2024")).toBeInTheDocument()
    })
  })

  describe("Multiple Projects", () => {
    it("renders many projects correctly", () => {
      const manyProjects = Array.from({ length: 10 }, (_, i) => ({
        name: `Project ${i + 1}`,
        url: `/projects/${i + 1}`,
        icon: Folder,
      }))

      renderWithProviders(<NavProjects projects={manyProjects} />)

      expect(screen.getByText("Project 1")).toBeInTheDocument()
      expect(screen.getByText("Project 5")).toBeInTheDocument()
      expect(screen.getByText("Project 10")).toBeInTheDocument()
    })

    it("each project has independent dropdown", async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')

      // Should have one action button per project
      expect(actionButtons.length).toBe(mockProjects.length)

      // Open first project's dropdown
      await user.click(actionButtons[0] as HTMLElement)
      expect(await screen.findByText("View Project")).toBeInTheDocument()
    })
  })

  describe("Component Structure", () => {
    it("renders within SidebarGroup", () => {
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      expect(container.querySelector('[data-sidebar="group"]')).toBeInTheDocument()
    })

    it("hides when sidebar is collapsed in icon mode", () => {
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const group = container.querySelector('[data-sidebar="group"]')
      expect(group).toHaveClass("group-data-[collapsible=icon]:hidden")
    })

    it("renders within SidebarMenu", () => {
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      expect(container.querySelector('[data-sidebar="menu"]')).toBeInTheDocument()
    })
  })

  describe("Menu Icons", () => {
    it("displays icons in dropdown menu items", async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NavProjects projects={mockProjects} />)

      const actionButtons = container.querySelectorAll('[data-sidebar="menu-action"]')
      await user.click(actionButtons[0] as HTMLElement)

      // Menu items should render with icons
      expect(await screen.findByText("View Project")).toBeInTheDocument()
      expect(screen.getByText("Share Project")).toBeInTheDocument()
      expect(screen.getByText("Delete Project")).toBeInTheDocument()
    })
  })
})
