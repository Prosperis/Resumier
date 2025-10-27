import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ScaleIn } from "./scale-in"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, bounce, ...props }: {children: React.ReactNode; className?: string; bounce?: boolean}) => (
      <div className={className} data-testid="motion-div" data-bounce={bounce} {...props}>
        {children}
      </div>
    ),
  },
}))

// Mock the animation hooks
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useAnimationVariants: (variants: unknown) => variants,
  useAnimationTransition: (transition: unknown) => transition,
}))

describe("ScaleIn", () => {
  it("renders children correctly", () => {
    render(
      <ScaleIn>
        <span>Test Content</span>
      </ScaleIn>
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <ScaleIn className="custom-class">
        <span>Content</span>
      </ScaleIn>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveClass("custom-class")
  })

  it("defaults to no bounce", () => {
    const { container } = render(
      <ScaleIn>
        <span>Content</span>
      </ScaleIn>
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it("accepts bounce prop", () => {
    render(
      <ScaleIn bounce>
        <span>Bouncy Content</span>
      </ScaleIn>
    )

    expect(screen.getByText("Bouncy Content")).toBeInTheDocument()
  })

  it("accepts custom delay prop", () => {
    render(
      <ScaleIn delay={0.5}>
        <span>Content</span>
      </ScaleIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("accepts custom duration prop", () => {
    render(
      <ScaleIn duration={1.5}>
        <span>Content</span>
      </ScaleIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("passes through additional HTML props", () => {
    render(
      <ScaleIn data-custom="test-value">
        <span>Content</span>
      </ScaleIn>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveAttribute("data-custom", "test-value")
  })

  it("combines bounce with delay", () => {
    render(
      <ScaleIn bounce delay={0.3}>
        <span>Content</span>
      </ScaleIn>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("combines all props (bounce, delay, duration, className)", () => {
    render(
      <ScaleIn bounce delay={0.2} duration={1.0} className="test-class">
        <span>Complex</span>
      </ScaleIn>
    )

    expect(screen.getByText("Complex")).toBeInTheDocument()
    expect(screen.getByTestId("motion-div")).toHaveClass("test-class")
  })
})
