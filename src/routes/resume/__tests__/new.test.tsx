import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthStore, useResumeStore } from "@/stores"

// Mock dependencies
vi.mock("@/stores", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
  useResumeStore: vi.fn(),
}))

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => (config: any) => ({ ...config })),
}))

vi.mock("@/components/features/resume/resume-builder", () => ({
  ResumeBuilder: () => <div data-testid="resume-builder">Resume Builder</div>,
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
  ResumeEditorLoading: () => <div data-testid="resume-loading">Loading...</div>,
}))

// Import the route module after setting up mocks
const { Route: newResumeRoute } = await import("../new")

describe("New Resume Route (/resume/new)", () => {
  const mockResetContent = vi.fn()

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    ;(useAuthStore.getState as any)
      .mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        login: vi.fn(),
        logout: vi.fn(),
      })(useResumeStore as any)
      .mockReturnValue(mockResetContent)
  })

  const renderNewResumeRoute = () => {
    const Component =
      (newResumeRoute as any).options?.component || (newResumeRoute as any).component
    if (!Component) {
      throw new Error("Component not found in route")
    }
    return render(<Component />)
  }

  describe("Authentication", () => {
    it("allows access when authenticated", () => {
      expect(() => renderNewResumeRoute()).not.toThrow()
    })
  })

  describe("Content", () => {
    it("renders the page heading", () => {
      renderNewResumeRoute()
      expect(screen.getByText("Create New Resume")).toBeInTheDocument()
    })

    it("renders the page description", () => {
      renderNewResumeRoute()
      expect(
        screen.getByText("Fill in your information to create a professional resume"),
      ).toBeInTheDocument()
    })

    it("renders the ResumeBuilder component", () => {
      renderNewResumeRoute()
      expect(screen.getByTestId("resume-builder")).toBeInTheDocument()
    })
  })

  describe("Layout", () => {
    it("renders within a container", () => {
      const { container } = renderNewResumeRoute()
      expect(container.querySelector(".container")).toBeInTheDocument()
    })

    it("applies proper container styling", () => {
      const { container } = renderNewResumeRoute()
      const mainContainer = container.querySelector(".container.mx-auto.p-8")
      expect(mainContainer).toBeInTheDocument()
    })

    it("has a header section with margin", () => {
      const { container } = renderNewResumeRoute()
      const header = container.querySelector(".mb-8")
      expect(header).toBeInTheDocument()
    })
  })

  describe("Typography", () => {
    it("uses proper heading styles", () => {
      const { container } = renderNewResumeRoute()
      const heading = container.querySelector("h1.text-3xl.font-bold")
      expect(heading).toBeInTheDocument()
    })

    it("uses muted foreground for description", () => {
      const { container } = renderNewResumeRoute()
      const description = container.querySelector(".text-muted-foreground")
      expect(description).toBeInTheDocument()
    })
  })

  describe("Route Configuration", () => {
    it("has a component property", () => {
      expect(newResumeRoute).toHaveProperty("component")
    })

    it("has a pendingComponent property", () => {
      expect(newResumeRoute).toHaveProperty("pendingComponent")
    })

    it("has an errorComponent property", () => {
      expect(newResumeRoute).toHaveProperty("errorComponent")
    })

    it("has a beforeLoad property", () => {
      expect(newResumeRoute).toHaveProperty("beforeLoad")
    })
  })

  describe("Heading Text", () => {
    it("displays 'Create New Resume' as h1", () => {
      renderNewResumeRoute()
      const heading = screen.getByRole("heading", { level: 1, name: /create new resume/i })
      expect(heading).toBeInTheDocument()
    })

    it("displays instructions for creating resume", () => {
      renderNewResumeRoute()
      const instructions = screen.getByText(
        /fill in your information to create a professional resume/i,
      )
      expect(instructions).toBeInTheDocument()
    })
  })
})
