import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthStore } from "@/stores"

// Mock dependencies
vi.mock("@/stores", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
  useResumeStore: vi.fn(),
}))

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  useParams: vi.fn(() => ({ id: "test-resume-id" })),
}))

vi.mock("@/hooks/api", () => ({
  useResume: vi.fn(),
}))

vi.mock("@/components/features/resume/resume-editor", () => ({
  ResumeEditor: ({ resume }: { resume: any }) => (
    <div data-testid="resume-editor">
      <h2>{resume.title}</h2>
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
  ResumeEditorLoading: () => <div data-testid="resume-loading">Loading Resume...</div>,
}))

// Import the route module and hooks after setting up mocks
const { Route: resumeIdRoute } = await import("../$id")
const { useResume } = await import("@/hooks/api")

describe("Resume Edit Route (/resume/$id)", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    ;(useAuthStore.getState as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", email: "test@example.com", name: "Test User" },
      login: vi.fn(),
      logout: vi.fn(),
    })
  })

  const renderResumeRoute = () => {
    const Component = (resumeIdRoute as any).options?.component || (resumeIdRoute as any).component
    if (!Component) {
      throw new Error("Component not found in route")
    }
    return render(<Component />)
  }

  describe("Authentication", () => {
    it("allows access when authenticated", () => {
      ;(useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Resume", content: {} },
        isLoading: false,
        error: null,
      } as any)

      expect(() => renderResumeRoute()).not.toThrow()
    })
  })

  describe("Loading State", () => {
    it("shows loading indicator when fetching resume", () => {
      ;(useResume as any).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      renderResumeRoute()

      expect(screen.getByTestId("resume-loading")).toBeInTheDocument()
      expect(screen.getByText("Loading Resume...")).toBeInTheDocument()
    })
  })

  describe("Error State", () => {
    it("shows error component when resume fetch fails", () => {
      const testError = new Error("Failed to load resume")
      ;(useResume as any).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: testError,
      } as any)

      renderResumeRoute()

      expect(screen.getByTestId("route-error")).toBeInTheDocument()
      const errorElements = screen.getAllByText("Failed to load resume")
      expect(errorElements.length).toBeGreaterThan(0)
    })

    it("shows error when resume is not found", () => {
      ;(useResume as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any)

      renderResumeRoute()

      expect(screen.getByTestId("route-error")).toBeInTheDocument()
      const errorElements = screen.getAllByText("Resume not found")
      expect(errorElements.length).toBeGreaterThan(0)
    })
  })

  describe("Success State", () => {
    it("renders resume editor with resume data", () => {
      ;(useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Test Resume", content: {} },
        isLoading: false,
        error: null,
      } as any)

      renderResumeRoute()

      expect(screen.getByTestId("resume-editor")).toBeInTheDocument()
      expect(screen.getByText("My Test Resume")).toBeInTheDocument()
    })

    it("renders within a container", () => {
      ;(useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Resume", content: {} },
        isLoading: false,
        error: null,
      } as any)

      const { container } = renderResumeRoute()

      expect(container.querySelector(".container")).toBeInTheDocument()
    })

    it("applies proper styling to container", () => {
      ;(useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Resume", content: {} },
        isLoading: false,
        error: null,
      } as any)

      const { container } = renderResumeRoute()

      const mainContainer = container.querySelector(".container.mx-auto.p-8")
      expect(mainContainer).toBeInTheDocument()
    })
  })

  describe("Route Configuration", () => {
    it("has a component property", () => {
      expect(resumeIdRoute).toHaveProperty("component")
    })

    it("has a pendingComponent property", () => {
      expect(resumeIdRoute).toHaveProperty("pendingComponent")
    })

    it("has an errorComponent property", () => {
      expect(resumeIdRoute).toHaveProperty("errorComponent")
    })

    it("has a beforeLoad property", () => {
      expect(resumeIdRoute).toHaveProperty("beforeLoad")
    })
  })
})
