import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Label } from "./label"

describe("Label", () => {
  describe("rendering", () => {
    it("renders label with text", () => {
      render(<Label>Email Address</Label>)
      expect(screen.getByText("Email Address")).toBeInTheDocument()
    })

    it("renders label with htmlFor attribute", () => {
      render(<Label htmlFor="email">Email</Label>)
      const label = screen.getByText("Email")
      expect(label).toHaveAttribute("for", "email")
    })

    it("renders with custom className", () => {
      render(<Label className="custom-class">Label Text</Label>)
      const label = screen.getByText("Label Text")
      expect(label).toHaveClass("custom-class")
    })

    it("renders with data-slot attribute", () => {
      render(<Label>Test Label</Label>)
      const label = screen.getByText("Test Label")
      expect(label).toHaveAttribute("data-slot", "label")
    })
  })

  describe("accessibility", () => {
    it("associates with form control via htmlFor", () => {
      const { container } = render(
        <div>
          <Label htmlFor="username">Username</Label>
          <input id="username" type="text" />
        </div>,
      )

      const label = screen.getByText("Username")
      const input = container.querySelector("#username")

      expect(label).toHaveAttribute("for", "username")
      expect(input).toHaveAttribute("id", "username")
    })

    it("handles disabled state styling", () => {
      const { container } = render(
        <div data-disabled="true">
          <Label>Disabled Label</Label>
        </div>,
      )

      const parent = container.firstChild as HTMLElement
      expect(parent).toHaveAttribute("data-disabled", "true")
    })
  })

  describe("styling", () => {
    it("applies default classes", () => {
      render(<Label>Default Label</Label>)
      const label = screen.getByText("Default Label")

      expect(label).toHaveClass("flex")
      expect(label).toHaveClass("items-center")
      expect(label).toHaveClass("gap-2")
      expect(label).toHaveClass("text-sm")
      expect(label).toHaveClass("leading-none")
      expect(label).toHaveClass("font-medium")
      expect(label).toHaveClass("select-none")
    })

    it("merges custom className with defaults", () => {
      render(<Label className="text-lg text-blue-500">Custom Label</Label>)
      const label = screen.getByText("Custom Label")

      // Should have both default and custom classes
      expect(label).toHaveClass("flex")
      expect(label).toHaveClass("text-lg")
      expect(label).toHaveClass("text-blue-500")
    })
  })

  describe("children", () => {
    it("renders text children", () => {
      render(<Label>Simple Text</Label>)
      expect(screen.getByText("Simple Text")).toBeInTheDocument()
    })

    it("renders JSX children", () => {
      render(
        <Label>
          <span>Email</span>
          <span className="required">*</span>
        </Label>,
      )

      expect(screen.getByText("Email")).toBeInTheDocument()
      expect(screen.getByText("*")).toBeInTheDocument()
    })

    it("renders complex children with icons", () => {
      render(
        <Label>
          <svg data-testid="icon" />
          Username
        </Label>,
      )

      expect(screen.getByTestId("icon")).toBeInTheDocument()
      expect(screen.getByText("Username")).toBeInTheDocument()
    })
  })

  describe("props forwarding", () => {
    it("forwards additional props to root element", () => {
      render(<Label data-testid="test-label">Label</Label>)
      expect(screen.getByTestId("test-label")).toBeInTheDocument()
    })

    it("forwards aria attributes", () => {
      render(<Label aria-label="Accessible label">Label</Label>)
      const label = screen.getByText("Label")
      expect(label).toHaveAttribute("aria-label", "Accessible label")
    })

    it("forwards onClick handler", () => {
      let clicked = false
      render(<Label onClick={() => (clicked = true)}>Clickable</Label>)

      const label = screen.getByText("Clickable")
      label.click()
      expect(clicked).toBe(true)
    })
  })
})
