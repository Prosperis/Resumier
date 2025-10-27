import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PageTransition } from "./page-transition"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: {children: React.ReactNode}) => <div data-testid="animate-presence">{children}</div>,
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

describe("PageTransition", () => {
  it("renders children correctly", () => {
    render(
      <PageTransition pageKey="page1">
        <span>Test Content</span>
      </PageTransition>
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("wraps content in AnimatePresence", () => {
    render(
      <PageTransition pageKey="page1">
        <span>Content</span>
      </PageTransition>
    )

    expect(screen.getByTestId("animate-presence")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <PageTransition pageKey="page1" className="custom-class">
        <span>Content</span>
      </PageTransition>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveClass("custom-class")
  })

  it("uses pageKey for unique identification", () => {
    const { rerender } = render(
      <PageTransition pageKey="page1">
        <span>Page 1</span>
      </PageTransition>
    )

    expect(screen.getByText("Page 1")).toBeInTheDocument()

    rerender(
      <PageTransition pageKey="page2">
        <span>Page 2</span>
      </PageTransition>
    )

    expect(screen.getByText("Page 2")).toBeInTheDocument()
  })

  it("defaults to wait mode", () => {
    render(
      <PageTransition pageKey="page1">
        <span>Content</span>
      </PageTransition>
    )

    expect(screen.getByTestId("animate-presence")).toBeInTheDocument()
  })

  it("accepts sync mode", () => {
    render(
      <PageTransition pageKey="page1" mode="sync">
        <span>Content</span>
      </PageTransition>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("accepts popLayout mode", () => {
    render(
      <PageTransition pageKey="page1" mode="popLayout">
        <span>Content</span>
      </PageTransition>
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("passes through additional HTML props", () => {
    render(
      <PageTransition pageKey="page1" data-custom="test-value">
        <span>Content</span>
      </PageTransition>
    )

    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toHaveAttribute("data-custom", "test-value")
  })

  it("changes content when pageKey changes", () => {
    const { rerender } = render(
      <PageTransition pageKey="home">
        <div>Home Page</div>
      </PageTransition>
    )

    expect(screen.getByText("Home Page")).toBeInTheDocument()

    rerender(
      <PageTransition pageKey="about">
        <div>About Page</div>
      </PageTransition>
    )

    expect(screen.getByText("About Page")).toBeInTheDocument()
  })
})
