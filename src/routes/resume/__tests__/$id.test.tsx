import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockResume } from "@/hooks/api/test-helpers"
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

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
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
const { apiClient } = await import("@/lib/api/client")

describe("Resume Edit Route (/resume/$id)", () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    return ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    // Clear the query client before each test
    if (queryClient) {
      queryClient.clear()
    }
    // Explicitly clear mock call history
    vi.clearAllMocks()
    // Mock reset handled by vitest config (clearMocks: true)
    ;(useAuthStore.getState as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", email: "test@example.com", name: "Test User" },
      login: vi.fn(),
      logout: vi.fn(),
    })
  })

  const renderResumeRoute = () => {
    const Component = (resumeIdRoute as any).component
    if (!Component) {
      throw new Error("Component not found in route")
    }
    const Wrapper = createWrapper()
    return render(
      <Wrapper>
        <Component />
      </Wrapper>,
    )
  }

  describe("Authentication", () => {
    it("allows access when authenticated", async () => {
      const mockResume = createMockResume({ id: "test-resume-id", title: "My Resume" })
      ;(apiClient.get as any).mockResolvedValueOnce(mockResume)

      expect(() => renderResumeRoute()).not.toThrow()
    })
  })

  describe("Loading State", () => {
    it("shows loading indicator when fetching resume", () => {
      // Create a promise that won't resolve immediately to simulate loading
      const pendingPromise = new Promise(() => {}) // Never resolves
      ;(apiClient.get as any).mockReturnValueOnce(pendingPromise)

      renderResumeRoute()

      expect(screen.getByTestId("resume-loading")).toBeInTheDocument()
      expect(screen.getByText("Loading Resume...")).toBeInTheDocument()
    })
  })

  describe("Error State", () => {
    it("shows error component when resume fetch fails", async () => {
      const testError = new Error("Failed to load resume")
      ;(apiClient.get as any).mockRejectedValueOnce(testError)

      renderResumeRoute()

      await waitFor(() => {
        expect(screen.getByTestId("route-error")).toBeInTheDocument()
      })
      const errorElements = screen.getAllByText("Failed to load resume")
      expect(errorElements.length).toBeGreaterThan(0)
    })

    it("shows error when resume is not found", async () => {
      const notFoundError = new Error("Resume not found")
      ;(apiClient.get as any).mockRejectedValueOnce(notFoundError)

      renderResumeRoute()

      await waitFor(() => {
        expect(screen.getByTestId("route-error")).toBeInTheDocument()
      })
      const errorElements = screen.getAllByText("Resume not found")
      expect(errorElements.length).toBeGreaterThan(0)
    })
  })

  describe("Success State", () => {
    it("renders resume editor with resume data", async () => {
      const mockResume = createMockResume({ id: "test-resume-id", title: "My Test Resume" })
      ;(apiClient.get as any).mockResolvedValueOnce(mockResume)

      renderResumeRoute()

      await waitFor(() => {
        expect(screen.getByTestId("resume-editor")).toBeInTheDocument()
      })
      expect(screen.getByText("My Test Resume")).toBeInTheDocument()
    })

    it("renders within a container", async () => {
      const mockResume = createMockResume({ id: "test-resume-id", title: "My Resume" })
      ;(apiClient.get as any).mockResolvedValueOnce(mockResume)

      const { container } = renderResumeRoute()

      await waitFor(() => {
        expect(container.querySelector(".container")).toBeInTheDocument()
      })
    })

    it("applies proper styling to container", async () => {
      const mockResume = createMockResume({ id: "test-resume-id", title: "My Resume" })
      ;(apiClient.get as any).mockResolvedValueOnce(mockResume)

      const { container } = renderResumeRoute()

      await waitFor(() => {
        const mainContainer = container.querySelector(".container.mx-auto.p-8")
        expect(mainContainer).toBeInTheDocument()
      })
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
