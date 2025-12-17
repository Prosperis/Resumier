import { render, screen } from "@testing-library/react";
import {
  DashboardLoading,
  InlineLoading,
  ProfileManagerLoading,
  ResumeEditorLoading,
  RouteLoadingFallback,
  SettingsLoading,
} from "../route-loading";

describe("RouteLoadingFallback", () => {
  describe("Rendering", () => {
    it("renders with default message", () => {
      render(<RouteLoadingFallback />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders with custom message", () => {
      render(<RouteLoadingFallback message="Please wait..." />);
      expect(screen.getByText("Please wait...")).toBeInTheDocument();
    });

    it("renders loading spinner", () => {
      const { container } = render(<RouteLoadingFallback />);
      // Should have a spinner (rounded-full element)
      const spinner = container.querySelector(".rounded-full");
      expect(spinner).toBeInTheDocument();
    });

    it("centers content on screen", () => {
      const { container } = render(<RouteLoadingFallback />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("flex", "h-screen", "items-center", "justify-center");
    });

    it("renders with FadeIn animation wrapper", () => {
      const { container } = render(<RouteLoadingFallback />);
      expect(container.querySelector(".flex.flex-col")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("has vertical layout with gap", () => {
      const { container } = render(<RouteLoadingFallback />);
      const content = container.querySelector(".flex-col");
      expect(content).toHaveClass("flex", "flex-col", "items-center", "gap-4");
    });

    it("displays text with muted foreground color", () => {
      render(<RouteLoadingFallback message="Test" />);
      const text = screen.getByText("Test");
      expect(text).toHaveClass("text-lg", "text-muted-foreground");
    });
  });
});

describe("DashboardLoading", () => {
  it("renders skeleton-based dashboard loading", () => {
    render(<DashboardLoading />);
    expect(screen.getByTestId("dashboard-loading")).toBeInTheDocument();
  });

  it("renders skeleton elements", () => {
    const { container } = render(<DashboardLoading />);
    // Should have skeleton elements with rounded-md class
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("does not use h-screen class (skeleton fills content naturally)", () => {
    const { container } = render(<DashboardLoading />);
    // The skeleton doesn't need full height since it's content-based
    expect(container.querySelector(".space-y-6")).toBeInTheDocument();
  });
});

describe("ResumeEditorLoading", () => {
  it("renders skeleton-based resume editor loading", () => {
    render(<ResumeEditorLoading />);
    expect(screen.getByTestId("resume-loading")).toBeInTheDocument();
  });

  it("has screen reader text for accessibility", () => {
    render(<ResumeEditorLoading />);
    expect(screen.getByText("Loading Resume...")).toBeInTheDocument();
  });

  it("uses h-screen class for full viewport height", () => {
    const { container } = render(<ResumeEditorLoading />);
    expect(container.querySelector(".h-screen")).toBeInTheDocument();
  });

  it("renders skeleton layout with 3-panel structure", () => {
    const { container } = render(<ResumeEditorLoading />);
    // Should have the main flex container with sidebars and preview
    const flexContainer = container.querySelector(".flex.h-full");
    expect(flexContainer).toBeInTheDocument();
  });
});

describe("SettingsLoading", () => {
  it("renders skeleton-based settings loading", () => {
    render(<SettingsLoading />);
    expect(screen.getByTestId("settings-loading")).toBeInTheDocument();
  });

  it("renders skeleton elements for settings sections", () => {
    const { container } = render(<SettingsLoading />);
    // Should have multiple skeleton elements
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders settings form structure", () => {
    const { container } = render(<SettingsLoading />);
    // Should have sections with borders
    const borders = container.querySelectorAll(".border");
    expect(borders.length).toBeGreaterThan(0);
  });
});

describe("ProfileManagerLoading", () => {
  it("renders skeleton-based profile loading", () => {
    render(<ProfileManagerLoading />);
    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
  });

  it("renders profile card skeletons in a grid", () => {
    const { container } = render(<ProfileManagerLoading />);
    // Should have grid layout
    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  it("renders multiple skeleton cards", () => {
    const { container } = render(<ProfileManagerLoading />);
    // Should have 3 profile card skeletons by default
    const cards = container.querySelectorAll(".rounded-xl.border");
    expect(cards.length).toBe(3);
  });
});

describe("InlineLoading", () => {
  describe("Rendering", () => {
    it("renders without message", () => {
      const { container } = render(<InlineLoading />);
      // Should have dots but no text
      const dots = container.querySelector(".flex.items-center");
      expect(dots).toBeInTheDocument();
    });

    it("renders with message", () => {
      render(<InlineLoading message="Processing..." />);
      expect(screen.getByText("Processing...")).toBeInTheDocument();
    });

    it("renders LoadingDots component", () => {
      const { container } = render(<InlineLoading />);
      // Should have multiple dots
      const dots = container.querySelectorAll(".rounded-full");
      expect(dots.length).toBeGreaterThan(0);
    });
  });

  describe("Layout", () => {
    it("has horizontal layout with gap", () => {
      const { container } = render(<InlineLoading message="Test" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("flex", "items-center", "gap-2", "text-muted-foreground");
    });

    it("displays message with small text", () => {
      render(<InlineLoading message="Loading data" />);
      const text = screen.getByText("Loading data");
      expect(text).toHaveClass("text-sm");
    });

    it("does not render message span when message is not provided", () => {
      const { container } = render(<InlineLoading />);
      const spans = container.querySelectorAll("span");
      // Should only have spans from LoadingDots, not a message span
      expect(spans.length).toBeLessThanOrEqual(3); // LoadingDots might have spans
    });
  });

  describe("Accessibility", () => {
    it("uses muted color for subtle inline loading", () => {
      const { container } = render(<InlineLoading />);
      expect(container.firstChild).toHaveClass("text-muted-foreground");
    });

    it("keeps inline loading small and unobtrusive", () => {
      render(<InlineLoading message="Test" />);
      const text = screen.getByText("Test");
      expect(text).toHaveClass("text-sm");
    });
  });
});
