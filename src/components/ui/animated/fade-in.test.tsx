import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { FadeIn } from "./fade-in"

// Mock framer-motion to avoid animation complexities in tests
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

describe("FadeIn", () => {
  it("renders children correctly", () => {
    render(
      <FadeIn>
        <span>Test Content</span>
      </FadeIn>
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <FadeIn className="custom-class">
        <span>Content</span>
      </FadeIn>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveClass("custom-class")
  })

  it("renders with default delay of 0", () => {
    const { container } = render(
      <FadeIn>
        <span>Content</span>
      </FadeIn>
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it("accepts custom delay prop", () => {
    const { container } = render(
      <FadeIn delay={0.5}>
        <span>Content</span>
      </FadeIn>
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it("accepts custom duration prop", () => {
    const { container } = render(
      <FadeIn duration={1.5}>
        <span>Content</span>
      </FadeIn>
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it("passes through additional HTML props", () => {
    render(
      <FadeIn data-custom="test-value">
        <span>Content</span>
      </FadeIn>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveAttribute("data-custom", "test-value")
  })

  it("renders multiple children", () => {
    render(
      <FadeIn>
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </FadeIn>
    )

    expect(screen.getByText("First")).toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
    expect(screen.getByText("Third")).toBeInTheDocument()
  })
})
