import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
  createRootRoute: vi.fn((config: any) => ({ ...config })),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

vi.mock("@tanstack/react-router-devtools", () => ({
  TanStackRouterDevtools: ({ position }: { position: string }) => (
    <div data-testid="router-devtools" data-position={position}>
      Router Devtools
    </div>
  ),
}));

vi.mock("@/components/layouts/root-layout", () => ({
  RootLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="root-layout">{children}</div>
  ),
}));

vi.mock("@/components/ui/route-error", () => ({
  NotFoundError: () => <div data-testid="not-found-error">404 Not Found</div>,
}));

// Import the route module after setting up mocks
const { Route: rootRoute } = await import("../__root");

describe("Root Route", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  const renderRootRoute = () => {
    // Get the component from the route definition
    const Component = (rootRoute as any).component;
    if (!Component) {
      throw new Error("Component not found in route");
    }
    return render(<Component />);
  };

  describe("Component Structure", () => {
    it("renders the RootLayout component", () => {
      renderRootRoute();
      expect(screen.getByTestId("root-layout")).toBeInTheDocument();
    });

    it("renders the Outlet component", () => {
      renderRootRoute();
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });

    it("renders outlet content", () => {
      renderRootRoute();
      expect(screen.getByText("Outlet Content")).toBeInTheDocument();
    });
  });

  describe("Development Tools", () => {
    it("renders router devtools in development mode", () => {
      const originalEnv = import.meta.env.DEV;
      // @ts-expect-error - Mocking env variable
      import.meta.env.DEV = true;

      renderRootRoute();

      expect(screen.getByTestId("router-devtools")).toBeInTheDocument();

      // @ts-expect-error - Restoring env variable
      import.meta.env.DEV = originalEnv;
    });

    it("devtools are positioned at bottom-right", () => {
      const originalEnv = import.meta.env.DEV;
      // @ts-expect-error - Mocking env variable
      import.meta.env.DEV = true;

      renderRootRoute();

      const devtools = screen.getByTestId("router-devtools");
      expect(devtools).toHaveAttribute("data-position", "bottom-right");

      // @ts-expect-error - Restoring env variable
      import.meta.env.DEV = originalEnv;
    });
  });

  describe("Route Configuration", () => {
    it("has a component property", () => {
      expect(rootRoute).toHaveProperty("component");
    });

    it("has a notFoundComponent property", () => {
      expect(rootRoute).toHaveProperty("notFoundComponent");
    });
  });

  describe("Layout Wrapping", () => {
    it("wraps content in RootLayout", () => {
      const { container } = renderRootRoute();
      const rootLayout = container.querySelector('[data-testid="root-layout"]');
      const outlet = container.querySelector('[data-testid="outlet"]');

      expect(rootLayout).toBeInTheDocument();
      expect(outlet).toBeInTheDocument();
      expect(rootLayout).toContainElement(outlet);
    });
  });
});
