import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { SlideIn } from "./slide-in"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}))

// Mock the animation hooks
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useAnimationVariants: (variants: any) => variants,
  useAnimationTransition: (transition: any) => transition,
}))

describe("SlideIn", () => {
  it("renders children correctly", () => {
    render(
      <SlideIn>
        <span>Test Content</span>
      </SlideIn>
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <SlideIn className="custom-class">
        <span>Content</span>
      </SlideIn>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveClass("custom-class")
  })

  it("defaults to 'up' direction", () => {
    const { container } = render(
      <SlideIn>
        <span>Content</span>
      </SlideIn>
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it("accepts 'down' direction", () => {
    render(
      <SlideIn direction="down">
        <span>Content</span>
      </SlideIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("accepts 'left' direction", () => {
    render(
      <SlideIn direction="left">
        <span>Content</span>
      </SlideIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("accepts 'right' direction", () => {
    render(
      <SlideIn direction="right">
        <span>Content</span>
      </SlideIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("accepts custom delay prop", () => {
    render(
      <SlideIn delay={0.5}>
        <span>Content</span>
      </SlideIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("accepts custom duration prop", () => {
    render(
      <SlideIn duration={1.5}>
        <span>Content</span>
      </SlideIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("passes through additional HTML props", () => {
    render(
      <SlideIn data-custom="test-value">
        <span>Content</span>
      </SlideIn>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveAttribute("data-custom", "test-value")
  })

  it("combines direction with delay", () => {
    render(
      <SlideIn direction="right" delay={0.3}>
        <span>Content</span>
      </SlideIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("combines all props (direction, delay, duration, className)", () => {
    render(
      <SlideIn direction="left" delay={0.2} duration={1.0} className="test-class">
        <span>Complex</span>
      </SlideIn>
    )

    expect(screen.getByText("Complex")).toBeInTheDocument()
    expect(screen.getByTestId("motion-div")).toHaveClass("test-class")
  })
})
