import { render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores"
import { AppSidebar } from "../app-sidebar"

// Mock the auth store
vi.mock("@/stores", () => ({
  useAuthStore: vi.fn(),
}))

// Mock child components
vi.mock("../nav-main", () => ({
  NavMain: ({ items }: { items: Array<{ title: string }> }) => (
    <div data-testid="nav-main">
      {items.map((item) => (
        <div key={item.title}>{item.title}</div>
      ))}
    </div>
  ),
}))

vi.mock("../nav-secondary", () => ({
  NavSecondary: ({ items }: { items: Array<{ title: string }> }) => (
    <div data-testid="nav-secondary">
      {items.map((item) => (
        <div key={item.title}>{item.title}</div>
      ))}
    </div>
  ),
}))

vi.mock("../nav-user", () => ({
  NavUser: ({ user }: { user: { name: string; email: string; avatar: string } }) => (
    <div data-testid="nav-user">
      <span data-testid="user-name">{user.name}</span>
      <span data-testid="user-email">{user.email}</span>
    </div>
  ),
}))

// Mock TanStack Router Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}))

// Helper function to render with SidebarProvider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<SidebarProvider>{ui}</SidebarProvider>)
}

describe("AppSidebar", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  })

  describe("Header Rendering", () => {
    it("renders the sidebar header with logo and title", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      renderWithProvider(<AppSidebar />)

      // Check for logo icon
      const logoIcon = screen.getByRole("link", { name: /resumier/i })
      expect(logoIcon).toBeInTheDocument()

      // Check for application title
      expect(screen.getByText("Resumier")).toBeInTheDocument()
      expect(screen.getByText("Resume Builder")).toBeInTheDocument()
    })

    it("links to dashboard from header", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      renderWithProvider(<AppSidebar />)

      const link = screen.getByRole("link", { name: /resumier/i })
      expect(link).toHaveAttribute("href", "/dashboard")
    })
  })

  describe("Navigation Content", () => {
    it("renders NavMain component with navigation items", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      renderWithProvider(<AppSidebar />)

      const navMain = screen.getByTestId("nav-main")
      expect(navMain).toBeInTheDocument()

      // Check for main navigation items
      expect(within(navMain).getByText("Dashboard")).toBeInTheDocument()
      expect(within(navMain).getByText("Resumes")).toBeInTheDocument()
      expect(within(navMain).getByText("Settings")).toBeInTheDocument()
    })

    it("renders NavSecondary component with secondary navigation items", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      renderWithProvider(<AppSidebar />)

      const navSecondary = screen.getByTestId("nav-secondary")
      expect(navSecondary).toBeInTheDocument()

      // Check for secondary navigation items
      expect(within(navSecondary).getByText("Support")).toBeInTheDocument()
      expect(within(navSecondary).getByText("Feedback")).toBeInTheDocument()
    })
  })

  describe("User Information", () => {
    it("renders NavUser component with user data from auth store", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "/avatars/jane.jpg",
      })

      renderWithProvider(<AppSidebar />)

      const navUser = screen.getByTestId("nav-user")
      expect(navUser).toBeInTheDocument()

      // Check that user data is passed correctly
      expect(screen.getByTestId("user-name")).toHaveTextContent("Jane Smith")
      expect(screen.getByTestId("user-email")).toHaveTextContent("jane.smith@example.com")
    })

    it("renders default user data when user is not logged in", () => {
      ;(useAuthStore as any).mockReturnValue(null)

      renderWithProvider(<AppSidebar />)

      const navUser = screen.getByTestId("nav-user")
      expect(navUser).toBeInTheDocument()

      // Check for default values
      expect(screen.getByTestId("user-name")).toHaveTextContent("User")
      expect(screen.getByTestId("user-email")).toHaveTextContent("user@example.com")
    })

    it("handles partial user data gracefully", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: undefined,
        avatar: undefined,
      })

      renderWithProvider(<AppSidebar />)

      const navUser = screen.getByTestId("nav-user")
      expect(navUser).toBeInTheDocument()

      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe")
      expect(screen.getByTestId("user-email")).toHaveTextContent("user@example.com")
    })
  })

  describe("Sidebar Structure", () => {
    it("renders all main sections in correct order", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      const { container } = renderWithProvider(<AppSidebar />)

      // Get all major sections
      const header = container.querySelector('[data-sidebar="header"]')
      const content = container.querySelector('[data-sidebar="content"]')
      const footer = container.querySelector('[data-sidebar="footer"]')

      expect(header).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(footer).toBeInTheDocument()
    })

    it("renders with inset variant", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      const { container } = renderWithProvider(<AppSidebar />)

      // Check if sidebar has the correct variant
      const sidebar = container.querySelector('[data-sidebar="sidebar"]')
      expect(sidebar).toBeInTheDocument()
    })

    it("forwards props to Sidebar component", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      const { container } = renderWithProvider(<AppSidebar data-testid="custom-sidebar" />)

      const sidebar = container.querySelector('[data-testid="custom-sidebar"]')
      expect(sidebar).toBeInTheDocument()
    })
  })

  describe("Navigation Data Structure", () => {
    it("contains correct main navigation items structure", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      renderWithProvider(<AppSidebar />)

      const navMain = screen.getByTestId("nav-main")

      // Verify Dashboard
      expect(within(navMain).getByText("Dashboard")).toBeInTheDocument()

      // Verify Resumes with subitems
      expect(within(navMain).getByText("Resumes")).toBeInTheDocument()

      // Verify Settings
      expect(within(navMain).getByText("Settings")).toBeInTheDocument()
    })

    it("contains correct secondary navigation items", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      renderWithProvider(<AppSidebar />)

      const navSecondary = screen.getByTestId("nav-secondary")

      // Verify Support
      expect(within(navSecondary).getByText("Support")).toBeInTheDocument()

      // Verify Feedback
      expect(within(navSecondary).getByText("Feedback")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      renderWithProvider(<AppSidebar />)

      // Check for link to dashboard
      const dashboardLink = screen.getByRole("link", { name: /resumier/i })
      expect(dashboardLink).toBeInTheDocument()
    })

    it("renders all navigation sections", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar.jpg",
      })

      renderWithProvider(<AppSidebar />)

      // All main sections should be present
      expect(screen.getByTestId("nav-main")).toBeInTheDocument()
      expect(screen.getByTestId("nav-secondary")).toBeInTheDocument()
      expect(screen.getByTestId("nav-user")).toBeInTheDocument()
    })
  })

  describe("Edge Cases", () => {
    it("handles undefined user gracefully", () => {
      ;(useAuthStore as any).mockReturnValue(undefined)

      renderWithProvider(<AppSidebar />)

      // Should render with default values
      expect(screen.getByTestId("user-name")).toHaveTextContent("User")
      expect(screen.getByTestId("user-email")).toHaveTextContent("user@example.com")
    })

    it("handles empty string user data", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "",
        email: "",
        avatar: "",
      })

      renderWithProvider(<AppSidebar />)

      // Should fallback to defaults
      expect(screen.getByTestId("user-name")).toHaveTextContent("User")
      expect(screen.getByTestId("user-email")).toHaveTextContent("user@example.com")
    })

    it("renders correctly with only name provided", () => {
      ;(useAuthStore as any).mockReturnValue({
        name: "Alice Johnson",
        email: null,
        avatar: null,
      })

      renderWithProvider(<AppSidebar />)

      expect(screen.getByTestId("user-name")).toHaveTextContent("Alice Johnson")
      expect(screen.getByTestId("user-email")).toHaveTextContent("user@example.com")
    })
  })
})
