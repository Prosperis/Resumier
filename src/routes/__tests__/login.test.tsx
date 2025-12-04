import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => () => ({})),
  createLazyFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  redirect: vi.fn(),
  Navigate: ({ to, ...props }: any) => (
    <div data-testid="navigate" data-to={to} {...props}>
      Navigate to {to}
    </div>
  ),
}));

// Import the route module after setting up mocks
const { Route: loginLazyRoute } = await import("../login.lazy");

describe("Login Route (Deprecated)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Login Lazy Route", () => {
    it("renders Navigate component to redirect to home", () => {
      const Component = (loginLazyRoute as any).component;
      if (!Component) {
        throw new Error("Component not found in route");
      }
      render(<Component />);

      const navigate = screen.getByTestId("navigate");
      expect(navigate).toBeInTheDocument();
      expect(navigate).toHaveAttribute("data-to", "/");
    });

    it("redirects to home page", () => {
      const Component = (loginLazyRoute as any).component;
      if (!Component) {
        throw new Error("Component not found in route");
      }
      render(<Component />);

      expect(screen.getByText(/Navigate to \//)).toBeInTheDocument();
    });
  });
});
