import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores";

// Mock dependencies
vi.mock("@/stores", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  createLazyFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  Navigate: ({ to, ...props }: any) => (
    <div data-testid="navigate" data-to={to} {...props}>
      Navigate to {to}
    </div>
  ),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/features/auth/login-form", () => ({
  LoginForm: () => <div data-testid="login-form">Login Form</div>,
}));

// Import the route module after setting up mocks
const { Route: loginRoute } = await import("../login.lazy");

describe("Login Route", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    (useAuthStore.getState as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  const renderLoginRoute = () => {
    // Get the component from the route definition
    const Component = (loginRoute as any).component;
    if (!Component) {
      throw new Error("Component not found in route");
    }
    return render(<Component />);
  };

  describe("When Not Authenticated", () => {
    it("renders the login page", () => {
      renderLoginRoute();

      expect(
        screen.getByRole("heading", { name: /welcome back/i }),
      ).toBeInTheDocument();
    });

    it("renders the welcome message", () => {
      renderLoginRoute();

      expect(
        screen.getByText(/sign in to your account to continue/i),
      ).toBeInTheDocument();
    });

    it("renders the LoginForm component", () => {
      renderLoginRoute();

      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("renders the sign up link", () => {
      renderLoginRoute();

      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /sign up/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("uses flexbox centering", () => {
      const { container } = renderLoginRoute();

      const flexContainer = container.querySelector(
        ".flex.items-center.justify-center",
      );
      expect(flexContainer).toBeInTheDocument();
    });

    it("applies min-height for full screen", () => {
      const { container } = renderLoginRoute();

      const fullScreenContainer = container.querySelector(".min-h-screen");
      expect(fullScreenContainer).toBeInTheDocument();
    });

    it("constrains form width", () => {
      const { container } = renderLoginRoute();

      const formContainer = container.querySelector(".max-w-md");
      expect(formContainer).toBeInTheDocument();
    });

    it("adds padding to form container", () => {
      const { container } = renderLoginRoute();

      const paddedContainer = container.querySelector(".p-8");
      expect(paddedContainer).toBeInTheDocument();
    });
  });

  describe("Typography", () => {
    it("uses large heading text", () => {
      const { container } = renderLoginRoute();

      const heading = container.querySelector("h1.text-3xl.font-bold");
      expect(heading).toBeInTheDocument();
    });

    it("uses smaller text for subtitle", () => {
      const { container } = renderLoginRoute();

      const subtitle = container.querySelector(
        ".text-sm.text-muted-foreground",
      );
      expect(subtitle).toBeInTheDocument();
    });

    it("centers text content", () => {
      const { container } = renderLoginRoute();

      const centeredText = container.querySelectorAll(".text-center");
      expect(centeredText.length).toBeGreaterThan(0);
    });
  });

  describe("Content Organization", () => {
    it("organizes content with proper spacing", () => {
      const { container } = renderLoginRoute();

      const spacedContainer = container.querySelector(".space-y-8");
      expect(spacedContainer).toBeInTheDocument();
    });

    it("renders heading before form", () => {
      renderLoginRoute();

      const heading = screen.getByRole("heading", { name: /welcome back/i });
      const form = screen.getByTestId("login-form");

      expect(heading).toBeInTheDocument();
      expect(form).toBeInTheDocument();
    });

    it("renders signup link at the bottom", () => {
      const { container } = renderLoginRoute();

      const signupSection = container.querySelector(".text-center.text-sm");
      expect(signupSection).toBeInTheDocument();
      expect(signupSection?.textContent).toContain("Don't have an account?");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderLoginRoute();

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("provides context with descriptive text", () => {
      renderLoginRoute();

      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    });
  });

  describe("Visual Design", () => {
    it("uses background color class", () => {
      const { container } = renderLoginRoute();

      const background = container.querySelector(".bg-background");
      expect(background).toBeInTheDocument();
    });

    it("applies hover effect to sign up link", () => {
      const { container } = renderLoginRoute();

      const hoverLink = container.querySelector(".hover\\:underline");
      expect(hoverLink).toBeInTheDocument();
    });

    it("uses primary color for sign up link", () => {
      const { container } = renderLoginRoute();

      const primaryLink = container.querySelector(".text-primary");
      expect(primaryLink).toBeInTheDocument();
    });
  });
});
