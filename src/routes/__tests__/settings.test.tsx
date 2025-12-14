import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { useAuthStore } from "@/stores";

// Mock dependencies
vi.mock("@/stores", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
  useSettingsStore: vi.fn(() => ({
    settings: {
      theme: "system",
      reducedMotion: false,
      autoSave: true,
      promptExportFilename: true,
    },
    updateSettings: vi.fn(),
    resetSettings: vi.fn(),
  })),
}));

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: "1", email: "test@example.com", name: "Test User" },
    isGuest: false,
    isDemo: false,
  })),
}));

vi.mock("@/app/theme-provider", () => ({
  useTheme: vi.fn(() => ({
    theme: "system",
    setTheme: vi.fn(),
  })),
}));

vi.mock("@/components/features/demo", () => ({
  DemoModeInfo: () => <div data-testid="demo-mode-info">Demo Mode Info</div>,
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  createLazyFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  useRouter: vi.fn(() => ({
    navigate: vi.fn(),
    state: { location: { pathname: "/settings" } },
  })),
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
  SettingsLoading: () => (
    <div data-testid="settings-loading">Loading Settings...</div>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}));

// Mock the reduced motion hook
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

// Mock lucide-react icons - use importOriginal to include all icons
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  return {
    ...actual,
    RotateCcw: () => <span data-testid="rotate-ccw-icon" />,
    Check: () => <span data-testid="check-icon" />,
    ChevronDown: () => <span data-testid="chevron-down-icon" />,
    ChevronUp: () => <span data-testid="chevron-up-icon" />,
  };
});

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

      expect(
        screen.getByRole("heading", { name: /^settings$/i }),
      ).toBeInTheDocument();
    });

    it("renders the page description", () => {
      renderSettingsRoute();

      expect(
        screen.getByText(/manage your preferences and configuration/i),
      ).toBeInTheDocument();
    });

    it("renders the Account section", () => {
      renderSettingsRoute();

      // CardTitle renders as div with data-slot="card-title", not as a heading
      expect(screen.getByText("Account")).toBeInTheDocument();
    });

    it("renders the Appearance section", () => {
      renderSettingsRoute();

      // CardTitle renders as div with data-slot="card-title", not as a heading
      expect(screen.getByText("Appearance")).toBeInTheDocument();
      expect(
        screen.getByText(/customize how resumier looks/i),
      ).toBeInTheDocument();
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

      // Component uses p-4 md:p-8 for responsive padding
      const paddedContainer = container.querySelector(".container.p-4");
      expect(paddedContainer).toBeInTheDocument();
    });

    it("has a header section with margin", () => {
      const { container } = renderSettingsRoute();

      const header = container.querySelector(".mb-8");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Sections", () => {
    it("renders Card sections with rounded corners and borders", () => {
      const { container } = renderSettingsRoute();

      // Card component uses rounded-xl and border classes
      const cardSections = container.querySelectorAll("[data-slot='card']");
      expect(cardSections.length).toBeGreaterThanOrEqual(2);
    });

    it("organizes sections with spacing", () => {
      const { container } = renderSettingsRoute();

      const spacedContainer = container.querySelector(".space-y-6");
      expect(spacedContainer).toBeInTheDocument();
    });

    it("uses section headings appropriately", () => {
      renderSettingsRoute();

      const h1 = screen.getByRole("heading", { level: 1, name: /^settings$/i });

      expect(h1).toBeInTheDocument();
      // CardTitle renders as div, not h2, so we check for the presence of section titles
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Appearance")).toBeInTheDocument();
    });
  });

  describe("Typography", () => {
    it("uses proper heading styles for main title", () => {
      const { container } = renderSettingsRoute();

      const mainHeading = container.querySelector("h1.text-3xl.font-bold");
      expect(mainHeading).toBeInTheDocument();
    });

    it("uses proper styles for Card titles", () => {
      const { container } = renderSettingsRoute();

      // CardTitle uses font-semibold class
      const cardTitles = container.querySelectorAll("[data-slot='card-title']");
      expect(cardTitles.length).toBeGreaterThanOrEqual(2);
    });

    it("uses muted foreground for descriptions", () => {
      const { container } = renderSettingsRoute();

      const descriptions = container.querySelectorAll(".text-muted-foreground");
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe("Content", () => {
    it("displays user status information", () => {
      renderSettingsRoute();

      expect(screen.getByText(/status/i)).toBeInTheDocument();
    });

    it("mentions customization options", () => {
      renderSettingsRoute();

      expect(
        screen.getByText(/customize how resumier looks/i),
      ).toBeInTheDocument();
    });

    it("renders Card sections", () => {
      const { container } = renderSettingsRoute();

      // Check that Card sections exist using data-slot attribute
      const cards = container.querySelectorAll("[data-slot='card']");
      expect(cards.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderSettingsRoute();

      const h1 = screen.getByRole("heading", { level: 1 });

      expect(h1).toBeInTheDocument();
      // CardTitle components render section titles
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Appearance")).toBeInTheDocument();
    });

    it("provides descriptive text for each section", () => {
      renderSettingsRoute();

      const appearanceDesc = screen.getByText(/customize how resumier looks/i);

      expect(appearanceDesc).toBeInTheDocument();
    });
  });

  describe("Visual Design", () => {
    it("applies rounded corners to Card sections", () => {
      const { container } = renderSettingsRoute();

      // Card component uses rounded-xl class
      const roundedSections = container.querySelectorAll(".rounded-xl");
      expect(roundedSections.length).toBeGreaterThan(0);
    });

    it("applies borders to Card sections", () => {
      const { container } = renderSettingsRoute();

      const borderedSections = container.querySelectorAll(".border");
      expect(borderedSections.length).toBeGreaterThan(0);
    });

    it("adds padding to Card content", () => {
      const { container } = renderSettingsRoute();

      // CardContent and CardHeader use px-6 for horizontal padding
      const paddedContent = container.querySelectorAll(".px-6");
      expect(paddedContent.length).toBeGreaterThanOrEqual(2);
    });
  });
});
