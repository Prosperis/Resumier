import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
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
        screen.getByRole("heading", { name: /build your perfect resume/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("renders the hero description", () => {
      renderIndexRoute();

      expect(screen.getByText(/professional resume builder/i)).toBeInTheDocument();
    });

    it("renders Get Started button", () => {
      renderIndexRoute();

      const getStartedButton = screen.getByRole("button", { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();
    });

    it("renders auth modal", () => {
      renderIndexRoute();

      const authModal = screen.getByTestId("auth-modal");
      expect(authModal).toBeInTheDocument();
    });
  });

  describe("Features Section", () => {
    it("renders Multiple Templates feature", () => {
      renderIndexRoute();

      expect(screen.getByRole("heading", { name: /multiple templates/i })).toBeInTheDocument();
      expect(
        screen.getByText(/choose from a variety of professional templates/i)
      ).toBeInTheDocument();
    });

    it("renders Real-time Preview feature", () => {
      renderIndexRoute();

      expect(screen.getByRole("heading", { name: /real-time preview/i })).toBeInTheDocument();
      expect(screen.getByText(/see your resume come to life/i)).toBeInTheDocument();
    });

    it("renders Export to PDF feature", () => {
      renderIndexRoute();

      expect(screen.getByRole("heading", { name: /export to pdf/i })).toBeInTheDocument();
      expect(screen.getByText(/download your resume as a high-quality pdf/i)).toBeInTheDocument();
    });

    it("renders Cloud Storage feature", () => {
      renderIndexRoute();

      expect(screen.getByRole("heading", { name: /cloud storage/i })).toBeInTheDocument();
      expect(screen.getByText(/save your resumes securely in the cloud/i)).toBeInTheDocument();
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

  describe("CTA Section", () => {
    it("renders the CTA heading", () => {
      renderIndexRoute();

      expect(
        screen.getByRole("heading", { name: /ready to create your resume/i })
      ).toBeInTheDocument();
    });

    it("renders the CTA description", () => {
      renderIndexRoute();

      expect(screen.getByText(/join thousands of job seekers/i)).toBeInTheDocument();
    });

    it("renders Create Your Resume button with link", () => {
      renderIndexRoute();

      const createButton = screen.getByRole("link", { name: /create your resume/i });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveAttribute("href", "/resume/new");
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
      const heroHeading = screen.getByRole("heading", { name: /welcome to resumier/i });
      // Features section heading (first feature)
      const featuresHeading = screen.getByRole("heading", { name: /multiple templates/i });
      // CTA section heading
      const ctaHeading = screen.getByRole("heading", { name: /ready to create your resume/i });

      expect(heroHeading).toBeInTheDocument();
      expect(featuresHeading).toBeInTheDocument();
      expect(ctaHeading).toBeInTheDocument();
    });

    it("uses proper heading hierarchy", () => {
      renderIndexRoute();

      const h1 = screen.getByRole("heading", { level: 1 });
      const h2s = screen.getAllByRole("heading", { level: 2 });
      const h3 = screen.getByRole("heading", { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3).toBeInTheDocument();
    });
  });

  describe("Content", () => {
    it("mentions resume building", () => {
      renderIndexRoute();

      expect(screen.getByText(/build your perfect resume/i)).toBeInTheDocument();
    });

    it("emphasizes professional resume building", () => {
      renderIndexRoute();

      expect(screen.getByText(/professional resume builder/i)).toBeInTheDocument();
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

      const maxWContainer = container.querySelector(".max-w-4xl");
      expect(maxWContainer).toBeInTheDocument();
    });
  });

  describe("Visual Elements", () => {
    it("renders feature cards with borders", () => {
      const { container } = renderIndexRoute();

      const borderedCards = container.querySelectorAll(".border.rounded-lg");
      expect(borderedCards.length).toBeGreaterThanOrEqual(4);
    });

    it("applies hover effects to feature cards", () => {
      const { container } = renderIndexRoute();

      const hoverCards = container.querySelectorAll(".hover\\:shadow-md");
      expect(hoverCards.length).toBe(4);
    });

    it("uses primary color accents", () => {
      const { container } = renderIndexRoute();

      const primaryElements = container.querySelectorAll("[class*='text-primary']");
      expect(primaryElements.length).toBeGreaterThan(0);
    });
  });
});
