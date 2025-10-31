import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore, useResumeStore } from "@/stores";

// Mock dependencies
vi.mock("@/stores", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
  useResumeStore: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  createLazyFileRoute: vi.fn(() => (config: any) => ({
    ...config,
    options: config,
  })),
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock("@/components/features/resume/resume-builder", () => ({
  ResumeBuilder: () => <div data-testid="resume-builder">Resume Builder</div>,
}));

vi.mock("@/components/ui/route-error", () => ({
  RouteError: ({ title, error }: { title: string; error: Error }) => (
    <div data-testid="route-error">
      <h1>{title}</h1>
      <p>{error.message}</p>
    </div>
  ),
}));

vi.mock("@/components/ui/route-loading", () => ({
  ResumeEditorLoading: () => <div data-testid="resume-loading">Loading...</div>,
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

vi.mock("@/hooks/api", () => ({
  useCreateResume: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// Import the route module after setting up mocks
const { Route: newResumeRoute } = await import("../new.lazy");

describe("New Resume Route (/resume/new)", () => {
  const mockResetContent = vi.fn();

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    (useAuthStore.getState as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", email: "test@example.com", name: "Test User" },
      login: vi.fn(),
      logout: vi.fn(),
    });
    (useResumeStore as any).mockReturnValue(mockResetContent);
  });

  const renderNewResumeRoute = () => {
    const Component = (newResumeRoute as any).component;
    if (!Component) {
      throw new Error("Component not found in route");
    }
    return render(<Component />);
  };

  describe("Authentication", () => {
    it("allows access when authenticated", () => {
      expect(() => renderNewResumeRoute()).not.toThrow();
    });
  });

  describe("Content", () => {
    it("renders the page heading", () => {
      renderNewResumeRoute();
      expect(screen.getByText("Create New Resume")).toBeInTheDocument();
    });

    it("renders the page description", () => {
      renderNewResumeRoute();
      expect(
        screen.getByText("Enter a title for your resume to get started"),
      ).toBeInTheDocument();
    });

    it("renders the resume title input", () => {
      renderNewResumeRoute();
      expect(screen.getByLabelText("Resume Title")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("renders within a container", () => {
      const { container } = renderNewResumeRoute();
      expect(container.querySelector(".container")).toBeInTheDocument();
    });

    it("renders a Card component", () => {
      const { container } = renderNewResumeRoute();
      const card = container.querySelector(
        "[class*='rounded-lg'][class*='border']",
      );
      expect(card).toBeInTheDocument();
    });

    it("has a form element", () => {
      renderNewResumeRoute();
      const form = screen.getByRole("form", { hidden: true });
      expect(form).toBeInTheDocument();
    });
  });

  describe("Typography", () => {
    it("uses proper heading styles", () => {
      const { container } = renderNewResumeRoute();
      const heading = container.querySelector(
        "[class*='text-2xl'][class*='font-semibold']",
      );
      expect(heading).toBeInTheDocument();
    });

    it("uses muted foreground for description", () => {
      const { container } = renderNewResumeRoute();
      const description = container.querySelector(
        "[class*='text-muted-foreground']",
      );
      expect(description).toBeInTheDocument();
    });
  });

  describe("Route Configuration", () => {
    it("has a component property in options", () => {
      expect((newResumeRoute as any).options).toHaveProperty("component");
    });

    it("has options property", () => {
      expect(newResumeRoute).toHaveProperty("options");
    });

    it("component is a function", () => {
      expect(typeof (newResumeRoute as any).options.component).toBe("function");
    });

    it("route is properly configured", () => {
      expect(newResumeRoute).toBeDefined();
    });
  });

  describe("Heading Text", () => {
    it("displays 'Create New Resume' as h1", () => {
      renderNewResumeRoute();
      const heading = screen.getByRole("heading", {
        level: 1,
        name: /create new resume/i,
      });
      expect(heading).toBeInTheDocument();
    });

    it("displays instructions for creating resume", () => {
      renderNewResumeRoute();
      const instructions = screen.getByText(
        /enter a title for your resume to get started/i,
      );
      expect(instructions).toBeInTheDocument();
    });
  });
});
