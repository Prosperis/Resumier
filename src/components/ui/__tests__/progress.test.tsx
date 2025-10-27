import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CircularProgress, IndeterminateProgress, Progress } from "../progress"

// Mock the animation hook
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: vi.fn(() => false),
}))

describe("Progress", () => {
  describe("Basic Rendering", () => {
    it("renders progress bar", () => {
      const { container } = render(<Progress value={50} />)
      const progress = container.querySelector(".rounded-full")
      expect(progress).toBeInTheDocument()
    })

    it("calculates percentage correctly", () => {
      const { container } = render(<Progress value={75} max={100} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it("clamps value to 0-100 range", () => {
      const { container } = render(<Progress value={150} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it("handles negative values", () => {
      const { container } = render(<Progress value={-10} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe("Size Variants", () => {
    it("renders small size", () => {
      const { container } = render(<Progress value={50} size="sm" />)
      const bar = container.querySelector(".h-1")
      expect(bar).toBeInTheDocument()
    })

    it("renders medium size (default)", () => {
      const { container } = render(<Progress value={50} size="md" />)
      const bar = container.querySelector(".h-2")
      expect(bar).toBeInTheDocument()
    })

    it("renders large size", () => {
      const { container } = render(<Progress value={50} size="lg" />)
      const bar = container.querySelector(".h-3")
      expect(bar).toBeInTheDocument()
    })
  })

  describe("Color Variants", () => {
    it("renders default variant", () => {
      const { container } = render(<Progress value={50} variant="default" />)
      const bar = container.querySelector(".bg-muted-foreground")
      expect(bar).toBeInTheDocument()
    })

    it("renders primary variant", () => {
      const { container } = render(<Progress value={50} variant="primary" />)
      const bar = container.querySelector(".bg-primary")
      expect(bar).toBeInTheDocument()
    })

    it("renders success variant", () => {
      const { container } = render(<Progress value={50} variant="success" />)
      const bar = container.querySelector(".bg-green-500")
      expect(bar).toBeInTheDocument()
    })

    it("renders warning variant", () => {
      const { container } = render(<Progress value={50} variant="warning" />)
      const bar = container.querySelector(".bg-yellow-500")
      expect(bar).toBeInTheDocument()
    })

    it("renders destructive variant", () => {
      const { container } = render(<Progress value={50} variant="destructive" />)
      const bar = container.querySelector(".bg-destructive")
      expect(bar).toBeInTheDocument()
    })
  })

  describe("Value Display", () => {
    it("hides value by default", () => {
      render(<Progress value={75} />)
      expect(screen.queryByText("75%")).not.toBeInTheDocument()
    })

    it("shows value when showValue is true", () => {
      render(<Progress value={75} showValue />)
      expect(screen.getByText("75%")).toBeInTheDocument()
    })

    it("rounds percentage for display", () => {
      render(<Progress value={66.7} showValue />)
      expect(screen.getByText("67%")).toBeInTheDocument()
    })
  })

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      const { container } = render(<Progress value={50} className="custom-progress" />)
      expect(container.firstChild).toHaveClass("custom-progress")
    })
  })
})

describe("CircularProgress", () => {
  describe("Basic Rendering", () => {
    it("renders circular progress svg", () => {
      const { container } = render(<CircularProgress value={50} />)
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })

    it("has proper aria-label", () => {
      const { container } = render(<CircularProgress value={75} />)
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("aria-label", "Progress: 75%")
    })

    it("has role img", () => {
      const { container } = render(<CircularProgress value={50} />)
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("role", "img")
    })

    it("includes title for accessibility", () => {
      render(<CircularProgress value={50} />)
      expect(screen.getByText("Circular progress indicator")).toBeInTheDocument()
    })
  })

  describe("Size Configuration", () => {
    it("renders with default size", () => {
      const { container } = render(<CircularProgress value={50} />)
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("width", "120")
      expect(svg).toHaveAttribute("height", "120")
    })

    it("renders with custom size", () => {
      const { container } = render(<CircularProgress value={50} size={80} />)
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("width", "80")
      expect(svg).toHaveAttribute("height", "80")
    })

    it("handles custom stroke width", () => {
      const { container } = render(<CircularProgress value={50} strokeWidth={12} />)
      expect(container.querySelector("svg")).toBeInTheDocument()
    })
  })

  describe("Color Variants", () => {
    it("renders default variant", () => {
      const { container } = render(<CircularProgress value={50} variant="default" />)
      const circle = container.querySelector(".stroke-muted-foreground")
      expect(circle).toBeInTheDocument()
    })

    it("renders primary variant", () => {
      const { container } = render(<CircularProgress value={50} variant="primary" />)
      const circle = container.querySelector(".stroke-primary")
      expect(circle).toBeInTheDocument()
    })

    it("renders success variant", () => {
      const { container } = render(<CircularProgress value={50} variant="success" />)
      const circle = container.querySelector(".stroke-green-500")
      expect(circle).toBeInTheDocument()
    })

    it("renders warning variant", () => {
      const { container } = render(<CircularProgress value={50} variant="warning" />)
      const circle = container.querySelector(".stroke-yellow-500")
      expect(circle).toBeInTheDocument()
    })

    it("renders destructive variant", () => {
      const { container } = render(<CircularProgress value={50} variant="destructive" />)
      const circle = container.querySelector(".stroke-destructive")
      expect(circle).toBeInTheDocument()
    })
  })

  describe("Value Display", () => {
    it("hides value by default", () => {
      render(<CircularProgress value={75} />)
      expect(screen.queryByText("75%")).not.toBeInTheDocument()
    })

    it("shows value when showValue is true", () => {
      render(<CircularProgress value={75} showValue />)
      expect(screen.getByText("75%")).toBeInTheDocument()
    })

    it("displays centered value text", () => {
      render(<CircularProgress value={75} showValue />)
      const text = screen.getByText("75%")
      expect(text.className).toContain("font-semibold")
    })
  })

  describe("Progress Calculation", () => {
    it("handles different max values", () => {
      const { container } = render(<CircularProgress value={50} max={200} />)
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("aria-label", "Progress: 25%")
    })

    it("clamps values above 100%", () => {
      const { container } = render(<CircularProgress value={150} />)
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("aria-label", "Progress: 100%")
    })

    it("clamps negative values", () => {
      const { container } = render(<CircularProgress value={-10} />)
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("aria-label", "Progress: 0%")
    })
  })
})

describe("IndeterminateProgress", () => {
  describe("Basic Rendering", () => {
    it("renders indeterminate progress", () => {
      const { container } = render(<IndeterminateProgress />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it("renders with different variants", () => {
      const { container } = render(<IndeterminateProgress variant="primary" />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it("renders with different sizes", () => {
      const { container } = render(<IndeterminateProgress size="lg" />)
      const bar = container.querySelector(".h-3")
      expect(bar).toBeInTheDocument()
    })

    it("applies custom className", () => {
      const { container } = render(<IndeterminateProgress className="custom-loading" />)
      expect(container.firstChild).toHaveClass("custom-loading")
    })

    it("shows continuous animation", () => {
      const { container } = render(<IndeterminateProgress />)
      const animatedDiv = container.querySelector(".absolute")
      expect(animatedDiv).toBeInTheDocument()
    })
  })
})

describe("Reduced Motion", () => {
  it("respects reduced motion preference", async () => {
    const { useReducedMotion } = await import("@/lib/animations/hooks/use-reduced-motion")(
      useReducedMotion as any,
    ).mockReturnValue(true)

    const { container } = render(<Progress value={50} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("respects reduced motion for circular progress", async () => {
    const { useReducedMotion } = await import("@/lib/animations/hooks/use-reduced-motion")(
      useReducedMotion as any,
    ).mockReturnValue(true)

    const { container } = render(<CircularProgress value={50} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
