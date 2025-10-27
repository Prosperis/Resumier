import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { StaggerChildren, StaggerItem } from "./stagger-children"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: {children: React.ReactNode; className?: string}) => (
      <div className={className} data-testid="motion-div" {...props}>
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

describe("StaggerChildren", () => {
  it("renders children correctly", () => {
    render(
      <StaggerChildren>
        <span>Test Content</span>
      </StaggerChildren>
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <StaggerChildren className="custom-class">
        <span>Content</span>
      </StaggerChildren>
    )

    const motionDivs = screen.getAllByTestId("motion-div")
    expect(motionDivs[0]).toHaveClass("custom-class")
  })

  it("defaults to staggerDelay of 0.1", () => {
    const { container } = render(
      <StaggerChildren>
        <span>Content</span>
      </StaggerChildren>
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it("accepts custom staggerDelay prop", () => {
    render(
      <StaggerChildren staggerDelay={0.2}>
        <span>Content</span>
      </StaggerChildren>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("renders multiple children", () => {
    render(
      <StaggerChildren>
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </StaggerChildren>
    )

    expect(screen.getByText("First")).toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
    expect(screen.getByText("Third")).toBeInTheDocument()
  })

  it("passes through additional HTML props", () => {
    render(
      <StaggerChildren data-custom="test-value">
        <span>Content</span>
      </StaggerChildren>
    )

    const motionDivs = screen.getAllByTestId("motion-div")
    expect(motionDivs[0]).toHaveAttribute("data-custom", "test-value")
  })
})

describe("StaggerItem", () => {
  it("renders children correctly", () => {
    render(
      <StaggerItem>
        <span>Item Content</span>
      </StaggerItem>
    )

    expect(screen.getByText("Item Content")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <StaggerItem className="item-class">
        <span>Content</span>
      </StaggerItem>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveClass("item-class")
  })

  it("passes through additional HTML props", () => {
    render(
      <StaggerItem data-item="test">
        <span>Content</span>
      </StaggerItem>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveAttribute("data-item", "test")
  })

  it("works within StaggerChildren", () => {
    render(
      <StaggerChildren>
        <StaggerItem>Item 1</StaggerItem>
        <StaggerItem>Item 2</StaggerItem>
        <StaggerItem>Item 3</StaggerItem>
      </StaggerChildren>
    )

    expect(screen.getByText("Item 1")).toBeInTheDocument()
    expect(screen.getByText("Item 2")).toBeInTheDocument()
    expect(screen.getByText("Item 3")).toBeInTheDocument()
  })
})
