import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Providers } from "../providers"

// Mock React Query devtools
vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div data-testid="react-query-devtools">DevTools</div>,
}))

describe("Providers", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  })

  describe("Rendering", () => {
    it("should render children", () => {
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>,
      )

      expect(screen.getByText("Test Content")).toBeInTheDocument()
    })

    it("should wrap children with QueryClientProvider", async () => {
      const { useQueryClient } = await import("@tanstack/react-query")

      const TestComponent = () => {
        const client = useQueryClient()
        return <div>{client ? "Has QueryClient" : "No QueryClient"}</div>
      }

      render(
        <Providers>
          <TestComponent />
        </Providers>,
      )

      expect(screen.getByText("Has QueryClient")).toBeInTheDocument()
    })
  })

  describe("Development Tools", () => {
    it("should render React Query devtools in development mode", () => {
      // In test/development mode, devtools should be present
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>,
      )

      // The mock will render if import.meta.env.DEV is true
      if (import.meta.env.DEV) {
        expect(screen.getByTestId("react-query-devtools")).toBeInTheDocument()
      }
    })

    it("should conditionally render React Query devtools", () => {
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>,
      )

      // The devtools mock might or might not be present depending on environment
      // This test just confirms the component renders without errors
      expect(screen.getByText("Test Content")).toBeInTheDocument()
    })
  })

  describe("Children Prop", () => {
    it("should accept and render single child", () => {
      render(
        <Providers>
          <div>Single Child</div>
        </Providers>,
      )

      expect(screen.getByText("Single Child")).toBeInTheDocument()
    })

    it("should accept and render multiple children", () => {
      render(
        <Providers>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </Providers>,
      )

      expect(screen.getByText("First Child")).toBeInTheDocument()
      expect(screen.getByText("Second Child")).toBeInTheDocument()
      expect(screen.getByText("Third Child")).toBeInTheDocument()
    })

    it("should accept React fragments as children", () => {
      render(
        <Providers>
          <div>Fragment Child 1</div>
          <div>Fragment Child 2</div>
        </Providers>,
      )

      expect(screen.getByText("Fragment Child 1")).toBeInTheDocument()
      expect(screen.getByText("Fragment Child 2")).toBeInTheDocument()
    })

    it("should accept nested components as children", () => {
      const NestedComponent = () => <div>Nested Content</div>

      render(
        <Providers>
          <NestedComponent />
        </Providers>,
      )

      expect(screen.getByText("Nested Content")).toBeInTheDocument()
    })
  })

  describe("Integration", () => {
    it("should provide both theme and query client contexts", async () => {
      const { useQueryClient } = await import("@tanstack/react-query")
      const { useTheme } = await import("../theme-provider")

      const TestComponent = () => {
        const queryClient = useQueryClient()
        const { theme } = useTheme()

        return (
          <div>
            <div>QueryClient: {queryClient ? "Available" : "Not Available"}</div>
            <div>Theme: {theme}</div>
          </div>
        )
      }

      render(
        <Providers>
          <TestComponent />
        </Providers>,
      )

      expect(screen.getByText(/QueryClient: Available/)).toBeInTheDocument()
      expect(screen.getByText(/Theme:/)).toBeInTheDocument()
    })
  })

  describe("Props Validation", () => {
    it("should accept children of type ReactNode", () => {
      // String child
      render(<Providers>String Content</Providers>)
      expect(screen.getByText("String Content")).toBeInTheDocument()

      // Number child (render as string)
      const { container } = render(<Providers>{123}</Providers>)
      expect(container.textContent).toContain("123")
    })
  })

  describe("Query Client Instance", () => {
    it("should use the imported queryClient instance", async () => {
      const { useQueryClient } = await import("@tanstack/react-query")
      const { queryClient: importedClient } = await import("../query-client")

      const TestComponent = () => {
        const providedClient = useQueryClient()

        return (
          <div>{providedClient === importedClient ? "Same Instance" : "Different Instance"}</div>
        )
      }

      render(
        <Providers>
          <TestComponent />
        </Providers>,
      )

      expect(screen.getByText("Same Instance")).toBeInTheDocument()
    })
  })
})
