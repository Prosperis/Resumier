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
  SettingsLoading: () => <div data-testid="settings-loading">Loading Settings...</div>,
}));

// Import the route module after setting up mocks
const { Route: settingsRoute } = await import("../settings.lazy");

describe("Settings Route", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    (useAuthStore.getState as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", email: "test@example.com", name: "Test User" },
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  const renderSettingsRoute = () => {
    // Get the component from the route definition
    const Component = (settingsRoute as any).component;
    if (!Component) {
      throw new Error("Component not found in route");
    }
    return render(<Component />);
  };

  describe("When Authenticated", () => {
    it("renders the settings page", () => {
      renderSettingsRoute();

      expect(screen.getByRole("heading", { name: /^settings$/i })).toBeInTheDocument();
    });

    it("renders the page description", () => {
      renderSettingsRoute();

      expect(
        screen.getAllByText(/manage your account settings and preferences/i).length
      ).toBeGreaterThan(0);
    });

    it("renders the Account section", () => {
      renderSettingsRoute();

      expect(screen.getByRole("heading", { name: /^account$/i })).toBeInTheDocument();
    });

    it("renders the Appearance section", () => {
      renderSettingsRoute();

      expect(screen.getByRole("heading", { name: /appearance/i })).toBeInTheDocument();
      expect(screen.getByText(/customize how resumier looks/i)).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("renders within a container", () => {
      const { container } = renderSettingsRoute();

      expect(container.querySelector(".container")).toBeInTheDocument();
    });

    it("applies max-width constraint", () => {
      const { container } = renderSettingsRoute();

      expect(container.querySelector(".max-w-4xl")).toBeInTheDocument();
    });

    it("adds padding to the container", () => {
      const { container } = renderSettingsRoute();

      const paddedContainer = container.querySelector(".container.p-8");
      expect(paddedContainer).toBeInTheDocument();
    });

    it("has a header section with margin", () => {
      const { container } = renderSettingsRoute();

      const header = container.querySelector(".mb-8");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Sections", () => {
    it("renders sections with borders", () => {
      const { container } = renderSettingsRoute();

      const borderedSections = container.querySelectorAll(".rounded-lg.border.p-6");
      expect(borderedSections.length).toBeGreaterThanOrEqual(2);
    });

    it("organizes sections with spacing", () => {
      const { container } = renderSettingsRoute();

      const spacedContainer = container.querySelector(".space-y-6");
      expect(spacedContainer).toBeInTheDocument();
    });

    it("uses section headings appropriately", () => {
      renderSettingsRoute();

      const h1 = screen.getByRole("heading", { level: 1, name: /^settings$/i });
      const h2s = screen.getAllByRole("heading", { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Typography", () => {
    it("uses proper heading styles for main title", () => {
      const { container } = renderSettingsRoute();

      const mainHeading = container.querySelector("h1.text-3xl.font-bold");
      expect(mainHeading).toBeInTheDocument();
    });

    it("uses proper heading styles for sections", () => {
      const { container } = renderSettingsRoute();

      const sectionHeadings = container.querySelectorAll("h2.text-xl.font-semibold");
      expect(sectionHeadings.length).toBeGreaterThanOrEqual(2);
    });

    it("uses muted foreground for descriptions", () => {
      const { container } = renderSettingsRoute();

      const descriptions = container.querySelectorAll(".text-muted-foreground");
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe("Content", () => {
    it("mentions account management", () => {
      renderSettingsRoute();

      expect(screen.getAllByText(/manage your account settings/i).length).toBeGreaterThan(0);
    });

    it("mentions customization options", () => {
      renderSettingsRoute();

      expect(screen.getByText(/customize how resumier looks/i)).toBeInTheDocument();
    });

    it("has placeholder comments for future content", () => {
      const { container } = renderSettingsRoute();

      // Check that sections exist even if they're placeholder
      const sections = container.querySelectorAll(".rounded-lg.border");
      expect(sections.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderSettingsRoute();

      const h1 = screen.getByRole("heading", { level: 1 });
      const h2s = screen.getAllByRole("heading", { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
    });

    it("provides descriptive text for each section", () => {
      renderSettingsRoute();

      const accountDesc = screen.getAllByText(/manage your account settings/i);
      const appearanceDesc = screen.getByText(/customize how resumier looks/i);

      expect(accountDesc.length).toBeGreaterThan(0);
      expect(appearanceDesc).toBeInTheDocument();
    });
  });

  describe("Visual Design", () => {
    it("applies rounded corners to sections", () => {
      const { container } = renderSettingsRoute();

      const roundedSections = container.querySelectorAll(".rounded-lg");
      expect(roundedSections.length).toBeGreaterThan(0);
    });

    it("applies borders to sections", () => {
      const { container } = renderSettingsRoute();

      const borderedSections = container.querySelectorAll(".border");
      expect(borderedSections.length).toBeGreaterThan(0);
    });

    it("adds padding to sections", () => {
      const { container } = renderSettingsRoute();

      const paddedSections = container.querySelectorAll(".p-6");
      expect(paddedSections.length).toBeGreaterThanOrEqual(2);
    });
  });
});
