import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { NotificationBadge, PulseBadge, StatusBadge } from "./animated-badge"

// Mock Badge component
vi.mock("./badge", () => ({
  Badge: ({ children, ...props }: any) => (
    <div data-testid="badge" {...props}>
      {children}
    </div>
  ),
}))

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock useReducedMotion
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}))

describe("NotificationBadge", () => {
  it("renders with count within max", () => {
    render(<NotificationBadge count={5} />)
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("renders with count exceeding max", () => {
    render(<NotificationBadge count={150} max={99} />)
    expect(screen.getByText("99+")).toBeInTheDocument()
  })

  it("does not render when count is 0", () => {
    const { container } = render(<NotificationBadge count={0} />)
    expect(container.firstChild).toBeNull()
  })

  it("applies custom className", () => {
    const { container } = render(<NotificationBadge count={3} className="custom-class" />)
    expect(container.firstChild).toHaveClass("custom-class")
  })

  it("uses default variant", () => {
    render(<NotificationBadge count={5} />)
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("accepts custom variant", () => {
    render(<NotificationBadge count={5} variant="secondary" />)
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("uses default max value of 99", () => {
    render(<NotificationBadge count={100} />)
    expect(screen.getByText("99+")).toBeInTheDocument()
  })
})

describe("PulseBadge", () => {
  it("renders children", () => {
    render(<PulseBadge>New</PulseBadge>)
    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("renders with pulse enabled by default", () => {
    render(<PulseBadge>Pulsing</PulseBadge>)
    expect(screen.getByText("Pulsing")).toBeInTheDocument()
  })

  it("renders without pulse when disabled", () => {
    render(<PulseBadge pulse={false}>Static</PulseBadge>)
    expect(screen.getByText("Static")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(<PulseBadge className="pulse-custom">Badge</PulseBadge>)
    expect(container.firstChild).toHaveClass("pulse-custom")
  })

  it("accepts custom variant", () => {
    render(<PulseBadge variant="destructive">Alert</PulseBadge>)
    expect(screen.getByText("Alert")).toBeInTheDocument()
  })

  it("uses default variant", () => {
    render(<PulseBadge>Default</PulseBadge>)
    expect(screen.getByText("Default")).toBeInTheDocument()
  })
})

describe("StatusBadge", () => {
  it("renders online status", () => {
    const { container } = render(<StatusBadge status="online" />)
    expect(container.querySelector(".bg-green-500")).toBeInTheDocument()
  })

  it("renders offline status", () => {
    const { container } = render(<StatusBadge status="offline" />)
    expect(container.querySelector(".bg-gray-500")).toBeInTheDocument()
  })

  it("renders away status", () => {
    const { container } = render(<StatusBadge status="away" />)
    expect(container.querySelector(".bg-yellow-500")).toBeInTheDocument()
  })

  it("renders busy status", () => {
    const { container } = render(<StatusBadge status="busy" />)
    expect(container.querySelector(".bg-red-500")).toBeInTheDocument()
  })

  it("shows status text when showText is true", () => {
    render(<StatusBadge status="online" showText />)
    expect(screen.getByText("Online")).toBeInTheDocument()
  })

  it("does not show status text by default", () => {
    render(<StatusBadge status="online" />)
    expect(screen.queryByText("Online")).not.toBeInTheDocument()
  })

  it("shows correct text for offline status", () => {
    render(<StatusBadge status="offline" showText />)
    expect(screen.getByText("Offline")).toBeInTheDocument()
  })

  it("shows correct text for away status", () => {
    render(<StatusBadge status="away" showText />)
    expect(screen.getByText("Away")).toBeInTheDocument()
  })

  it("shows correct text for busy status", () => {
    render(<StatusBadge status="busy" showText />)
    expect(screen.getByText("Busy")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(<StatusBadge status="online" className="status-custom" />)
    expect(container.firstChild).toHaveClass("status-custom")
  })

  it("renders pulse indicator for online status", () => {
    const { container } = render(<StatusBadge status="online" />)
    expect(container.querySelector(".bg-green-500")).toBeInTheDocument()
  })

  it("renders pulse indicator for busy status", () => {
    const { container } = render(<StatusBadge status="busy" />)
    expect(container.querySelector(".bg-red-500")).toBeInTheDocument()
  })
})
