import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthStore } from "@/stores"

// Mock dependencies
vi.mock("@/stores", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}))

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  useNavigate: vi.fn(() => vi.fn()),
}))

vi.mock("@/components/features/resume/resume-dashboard", () => ({
  ResumeDashboard: ({ onResumeClick }: { onResumeClick: (id: string) => void }) => (
    <div data-testid="resume-dashboard">
      <button onClick={() => onResumeClick("test-id")}>Test Resume</button>
    </div>
  ),
}))

vi.mock("@/components/ui/route-error", () => ({
  RouteError: ({ title, error }: { title: string; error: Error }) => (
    <div data-testid="route-error">
      <h1>{title}</h1>
      <p>{error.message}</p>
    </div>
  ),
}))

vi.mock("@/components/ui/route-loading", () => ({
  DashboardLoading: () => <div data-testid="dashboard-loading">Loading Dashboard...</div>,
}))

// Import the route module after setting up mocks
const { Route: dashboardRoute } = await import("../dashboard")

describe("Dashboard Route", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  })

  const renderDashboardRoute = () => {
    // Get the component from the route definition
    const Component =
      (dashboardRoute as any).options?.component || (dashboardRoute as any).component
    if (!Component) {
      throw new Error("Component not found in route")
    }
    return render(<Component />)
  }

  describe("Authentication", () => {
    it("renders dashboard when authenticated", () => {
      ;(useAuthStore.getState as any).mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        login: vi.fn(),
        logout: vi.fn(),
      })

      renderDashboardRoute()

      expect(screen.getByRole("heading", { name: /my resumes/i })).toBeInTheDocument()
    })

    it("does not throw when authenticated", () => {
      ;(useAuthStore.getState as any).mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        login: vi.fn(),
        logout: vi.fn(),
      })

      expect(() => {
        renderDashboardRoute()
      }).not.toThrow()
    })
  })

  describe("Content", () => {
    beforeEach(() => {
      ;(useAuthStore.getState as any).mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        login: vi.fn(),
        logout: vi.fn(),
      })
    })

    it("renders the page heading", () => {
      renderDashboardRoute()

      expect(screen.getByRole("heading", { name: /my resumes/i })).toBeInTheDocument()
    })

    it("renders the page description", () => {
      renderDashboardRoute()

      expect(screen.getByText(/manage your resumes and create new ones/i)).toBeInTheDocument()
    })

    it("renders the ResumeDashboard component", () => {
      renderDashboardRoute()

      expect(screen.getByTestId("resume-dashboard")).toBeInTheDocument()
    })
  })

  describe("Layout", () => {
    beforeEach(() => {
      ;(useAuthStore.getState as any).mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        login: vi.fn(),
        logout: vi.fn(),
      })
    })

    it("renders within a container", () => {
      const { container } = renderDashboardRoute()

      expect(container.querySelector(".container")).toBeInTheDocument()
    })

    it("applies padding to the container", () => {
      const { container } = renderDashboardRoute()

      const mainContainer = container.querySelector(".container.p-8")
      expect(mainContainer).toBeInTheDocument()
    })

    it("has a header section with margin", () => {
      const { container } = renderDashboardRoute()

      const header = container.querySelector(".mb-8")
      expect(header).toBeInTheDocument()
    })
  })

  describe("Typography", () => {
    beforeEach(() => {
      ;(useAuthStore.getState as any).mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        login: vi.fn(),
        logout: vi.fn(),
      })
    })

    it("uses proper heading styles", () => {
      const { container } = renderDashboardRoute()

      const heading = container.querySelector("h1.text-3xl.font-bold")
      expect(heading).toBeInTheDocument()
    })

    it("uses muted foreground for description", () => {
      const { container } = renderDashboardRoute()

      const description = container.querySelector(".text-muted-foreground")
      expect(description).toBeInTheDocument()
    })
  })
})
