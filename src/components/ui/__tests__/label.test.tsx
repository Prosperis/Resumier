import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Label } from "@/components/ui/label"

describe("Label", () => {
  it("renders correctly", () => {
    render(<Label>Test Label</Label>)
    const label = screen.getByText("Test Label")
    expect(label).toBeInTheDocument()
  })

  it("renders with htmlFor attribute", () => {
    render(<Label htmlFor="test-input">Test Label</Label>)
    const label = screen.getByText("Test Label")
    expect(label).toHaveAttribute("for", "test-input")
  })

  it("applies custom className", () => {
    render(<Label className="custom-label">Test</Label>)
    const label = screen.getByText("Test")
    expect(label).toHaveClass("custom-label")
  })

  it("renders children correctly", () => {
    render(
      <Label>
        <span>Icon</span>
        <span>Text</span>
      </Label>,
    )
    expect(screen.getByText("Icon")).toBeInTheDocument()
    expect(screen.getByText("Text")).toBeInTheDocument()
  })

  it("forwards additional props", () => {
    render(<Label data-testid="custom-label">Test</Label>)
    const label = screen.getByTestId("custom-label")
    expect(label).toBeInTheDocument()
  })

  it("renders with correct default classes", () => {
    const { container } = render(<Label>Test</Label>)
    const label = container.firstChild
    expect(label).toHaveClass("text-sm")
    expect(label).toHaveClass("font-medium")
  })

  it("associates with form input", () => {
    render(
      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </div>,
    )
    const label = screen.getByText("Email")
    const input = screen.getByRole("textbox")
    expect(label).toHaveAttribute("for", "email")
    expect(input).toHaveAttribute("id", "email")
  })

  it("renders as required indicator", () => {
    render(<Label>Name *</Label>)
    const label = screen.getByText("Name *")
    expect(label).toBeInTheDocument()
  })
})
