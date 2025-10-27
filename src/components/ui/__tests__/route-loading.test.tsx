import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  DashboardLoading,
  InlineLoading,
  ResumeEditorLoading,
  RouteLoadingFallback,
  SettingsLoading,
} from "../route-loading"

describe("RouteLoadingFallback", () => {
  describe("Rendering", () => {
    it("renders with default message", () => {
      render(<RouteLoadingFallback />)
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("renders with custom message", () => {
      render(<RouteLoadingFallback message="Please wait..." />)
      expect(screen.getByText("Please wait...")).toBeInTheDocument()
    })

    it("renders loading spinner", () => {
      const { container } = render(<RouteLoadingFallback />)
      // Should have a spinner (rounded-full element)
      const spinner = container.querySelector(".rounded-full")
      expect(spinner).toBeInTheDocument()
    })

    it("centers content on screen", () => {
      const { container } = render(<RouteLoadingFallback />)
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass("flex", "h-screen", "items-center", "justify-center")
    })

    it("renders with FadeIn animation wrapper", () => {
      const { container } = render(<RouteLoadingFallback />)
      expect(container.querySelector(".flex.flex-col")).toBeInTheDocument()
    })
  })

  describe("Layout", () => {
    it("has vertical layout with gap", () => {
      const { container } = render(<RouteLoadingFallback />)
      const content = container.querySelector(".flex-col")
      expect(content).toHaveClass("flex", "flex-col", "items-center", "gap-4")
    })

    it("displays text with muted foreground color", () => {
      render(<RouteLoadingFallback message="Test" />)
      const text = screen.getByText("Test")
      expect(text).toHaveClass("text-lg", "text-muted-foreground")
    })
  })
})

describe("DashboardLoading", () => {
  it("renders dashboard-specific message", () => {
    render(<DashboardLoading />)
    expect(screen.getByText("Loading your resumes...")).toBeInTheDocument()
  })

  it("uses RouteLoadingFallback component", () => {
    const { container } = render(<DashboardLoading />)
    expect(container.querySelector(".h-screen")).toBeInTheDocument()
  })

  it("renders loading spinner", () => {
    const { container } = render(<DashboardLoading />)
    const spinner = container.querySelector(".rounded-full")
    expect(spinner).toBeInTheDocument()
  })
})

describe("ResumeEditorLoading", () => {
  it("renders resume editor-specific message", () => {
    render(<ResumeEditorLoading />)
    expect(screen.getByText("Loading resume editor...")).toBeInTheDocument()
  })

  it("uses RouteLoadingFallback component", () => {
    const { container } = render(<ResumeEditorLoading />)
    expect(container.querySelector(".h-screen")).toBeInTheDocument()
  })

  it("renders loading spinner", () => {
    const { container } = render(<ResumeEditorLoading />)
    const spinner = container.querySelector(".rounded-full")
    expect(spinner).toBeInTheDocument()
  })
})

describe("SettingsLoading", () => {
  it("renders settings-specific message", () => {
    render(<SettingsLoading />)
    expect(screen.getByText("Loading settings...")).toBeInTheDocument()
  })

  it("uses RouteLoadingFallback component", () => {
    const { container } = render(<SettingsLoading />)
    expect(container.querySelector(".h-screen")).toBeInTheDocument()
  })

  it("renders loading spinner", () => {
    const { container } = render(<SettingsLoading />)
    const spinner = container.querySelector(".rounded-full")
    expect(spinner).toBeInTheDocument()
  })
})

describe("InlineLoading", () => {
  describe("Rendering", () => {
    it("renders without message", () => {
      const { container } = render(<InlineLoading />)
      // Should have dots but no text
      const dots = container.querySelector(".flex.items-center")
      expect(dots).toBeInTheDocument()
    })

    it("renders with message", () => {
      render(<InlineLoading message="Processing..." />)
      expect(screen.getByText("Processing...")).toBeInTheDocument()
    })

    it("renders LoadingDots component", () => {
      const { container } = render(<InlineLoading />)
      // Should have multiple dots
      const dots = container.querySelectorAll(".rounded-full")
      expect(dots.length).toBeGreaterThan(0)
    })
  })

  describe("Layout", () => {
    it("has horizontal layout with gap", () => {
      const { container } = render(<InlineLoading message="Test" />)
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass("flex", "items-center", "gap-2", "text-muted-foreground")
    })

    it("displays message with small text", () => {
      render(<InlineLoading message="Loading data" />)
      const text = screen.getByText("Loading data")
      expect(text).toHaveClass("text-sm")
    })

    it("does not render message span when message is not provided", () => {
      const { container } = render(<InlineLoading />)
      const spans = container.querySelectorAll("span")
      // Should only have spans from LoadingDots, not a message span
      expect(spans.length).toBeLessThanOrEqual(3) // LoadingDots might have spans
    })
  })

  describe("Accessibility", () => {
    it("uses muted color for subtle inline loading", () => {
      const { container } = render(<InlineLoading />)
      expect(container.firstChild).toHaveClass("text-muted-foreground")
    })

    it("keeps inline loading small and unobtrusive", () => {
      render(<InlineLoading message="Test" />)
      const text = screen.getByText("Test")
      expect(text).toHaveClass("text-sm")
    })
  })
})
