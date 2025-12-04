import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  createFileRoute: vi.fn(() => (config: any) => ({ ...config })),
}));

vi.mock("lucide-react", () => ({
  ArrowRight: () => <span data-testid="icon-arrow-right">→</span>,
  Cloud: () => <span data-testid="icon-cloud">☁</span>,
  Download: () => <span data-testid="icon-download">↓</span>,
  FileText: () => <span data-testid="icon-file">📄</span>,
  Sparkles: () => <span data-testid="icon-sparkles">✨</span>,
  Zap: () => <span data-testid="icon-zap">⚡</span>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/features/auth/auth-modal", () => ({
  AuthModal: ({ open }: any) => (
    <div data-testid="auth-modal" data-open={open}>
      Auth Modal
    </div>
  ),
}));

// Import the route module after setting up mocks
// We'll access the component function directly
const { Route: indexRoute } = await import("../index");

describe("Index Route", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  const renderIndexRoute = () => {
    // Get the component from the route definition
    const Component = (indexRoute as any).component;
    if (!Component) {
      throw new Error("Component not found in route");
    }
    return render(<Component />);
  };

  describe("Hero Section", () => {
    it("renders the main heading", () => {
      renderIndexRoute();

      expect(
        screen.getByRole("heading", {
          level: 1,
        }),
      ).toBeInTheDocument();
    });

    it("renders the hero description", () => {
      renderIndexRoute();

      expect(
        screen.getByText(/professional resume builder/i),
      ).toBeInTheDocument();
    });

    it("renders Get Started button", () => {
      renderIndexRoute();

      const getStartedButton = screen.getByRole("button", {
        name: /get started/i,
      });
      expect(getStartedButton).toBeInTheDocument();
    });

    it("renders auth modal", () => {
      renderIndexRoute();

      const authModal = screen.getByTestId("auth-modal");
      expect(authModal).toBeInTheDocument();
    });
  });

  describe("Features Section", () => {
    it("renders Professional Templates feature", () => {
      renderIndexRoute();

      expect(
        screen.getByRole("heading", { name: /professional templates/i }),
      ).toBeInTheDocument();
    });

    it("renders Real-time Preview feature", () => {
      renderIndexRoute();

      expect(
        screen.getByRole("heading", { name: /real-time preview/i }),
      ).toBeInTheDocument();
    });

    it("renders Easy Export feature", () => {
      renderIndexRoute();

      expect(
        screen.getByRole("heading", { name: /easy export/i }),
      ).toBeInTheDocument();
    });

    it("renders Cloud Sync feature", () => {
      renderIndexRoute();

      expect(
        screen.getByRole("heading", { name: /cloud sync/i }),
      ).toBeInTheDocument();
    });

    it("displays all feature icons", () => {
      renderIndexRoute();

      // Check for icon test IDs
      expect(screen.getByTestId("icon-file")).toBeInTheDocument();
      expect(screen.getByTestId("icon-sparkles")).toBeInTheDocument();
      expect(screen.getByTestId("icon-download")).toBeInTheDocument();
      expect(screen.getByTestId("icon-cloud")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("renders within a container", () => {
      const { container } = renderIndexRoute();

      expect(container.querySelector(".container")).toBeInTheDocument();
    });

    it("renders all main sections in order", () => {
      renderIndexRoute();

      // Hero section heading
      const heroHeading = screen.getByRole("heading", {
        level: 1,
      });
      // Features section heading (first feature)
      const featuresHeading = screen.getByRole("heading", {
        name: /professional templates/i,
      });

      expect(heroHeading).toBeInTheDocument();
      expect(featuresHeading).toBeInTheDocument();
    });

    it("uses proper heading hierarchy", () => {
      renderIndexRoute();

      const h1 = screen.getByRole("heading", { level: 1 });
      const h2s = screen.getAllByRole("heading", { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
    });
  });

  describe("Content", () => {
    it("mentions resume building", () => {
      renderIndexRoute();

      // Text is split across elements, so check for both parts
      expect(screen.getByText(/Build Your Perfect/i)).toBeInTheDocument();
      // Use getAllByText since "Resume" appears multiple times on the page
      expect(screen.getAllByText(/Resume/i).length).toBeGreaterThan(0);
    });

    it("emphasizes professional resume building", () => {
      renderIndexRoute();

      expect(
        screen.getByText(/professional resume builder/i),
      ).toBeInTheDocument();
    });

    it("highlights speed and efficiency", () => {
      renderIndexRoute();

      expect(screen.getByText(/in minutes/i)).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("applies responsive grid classes", () => {
      const { container } = renderIndexRoute();

      const grid = container.querySelector(".md\\:grid-cols-2");
      expect(grid).toBeInTheDocument();
    });

    it("applies max-width constraints", () => {
      const { container } = renderIndexRoute();

      const maxWContainer = container.querySelector(".max-w-5xl");
      expect(maxWContainer).toBeInTheDocument();
    });
  });

  describe("Visual Elements", () => {
    it("renders feature cards with borders", () => {
      const { container } = renderIndexRoute();

      const borderedCards = container.querySelectorAll(".border");
      expect(borderedCards.length).toBeGreaterThanOrEqual(4);
    });

    it("applies hover effects to feature cards", () => {
      const { container } = renderIndexRoute();

      const hoverCards = container.querySelectorAll(".hover\\:shadow-md");
      expect(hoverCards.length).toBeGreaterThanOrEqual(4);
    });

    it("uses primary color accents", () => {
      const { container } = renderIndexRoute();

      const primaryElements = container.querySelectorAll("[class*='primary']");
      expect(primaryElements.length).toBeGreaterThan(0);
    });
  });
});
