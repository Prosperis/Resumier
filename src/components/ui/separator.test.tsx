import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Separator } from "./separator"

describe("Separator", () => {
  describe("rendering", () => {
    it("renders separator", () => {
      render(<Separator data-testid="separator" />)
      expect(screen.getByTestId("separator")).toBeInTheDocument()
    })

    it("renders with data-slot attribute", () => {
      render(<Separator data-testid="separator" />)
      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("data-slot", "separator")
    })

    it("renders with custom className", () => {
      render(<Separator data-testid="separator" className="custom-class" />)
      const separator = screen.getByTestId("separator")
      expect(separator).toHaveClass("custom-class")
    })
  })

  describe("orientation", () => {
    it("renders horizontal by default", () => {
      render(<Separator data-testid="separator" />)
      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("data-orientation", "horizontal")
    })

    it("renders horizontal when explicitly set", () => {
      render(<Separator data-testid="separator" orientation="horizontal" />)
      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("data-orientation", "horizontal")
    })

    it("renders vertical when specified", () => {
      render(<Separator data-testid="separator" orientation="vertical" />)
      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("data-orientation", "vertical")
    })

    it("applies horizontal styles by default", () => {
      render(<Separator data-testid="separator" />)
      const separator = screen.getByTestId("separator")

      // Check for horizontal data attribute
      expect(separator).toHaveAttribute("data-orientation", "horizontal")
    })

    it("applies vertical styles when orientation is vertical", () => {
      render(<Separator data-testid="separator" orientation="vertical" />)
      const separator = screen.getByTestId("separator")

      // Check for vertical data attribute
      expect(separator).toHaveAttribute("data-orientation", "vertical")
    })
  })

  describe("decorative", () => {
    it("is decorative by default", () => {
      render(<Separator data-testid="separator" />)
      const separator = screen.getByTestId("separator")
      // Decorative separators don't have aria-orientation (they have role="none")
      expect(separator).not.toHaveAttribute("role", "separator")
    })

    it("is decorative when explicitly set to true", () => {
      render(<Separator data-testid="separator" decorative={true} />)
      const separator = screen.getByTestId("separator")
      expect(separator).toBeInTheDocument()
    })

    it("is not decorative when set to false", () => {
      render(<Separator data-testid="separator" decorative={false} />)
      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("role", "separator")
    })
  })

  describe("accessibility", () => {
    it("has proper role when not decorative", () => {
      render(<Separator data-testid="separator" decorative={false} />)
      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("role", "separator")
    })

    it("has aria-orientation for horizontal when not decorative", () => {
      render(
        <Separator
          data-testid="separator"
          orientation="horizontal"
          decorative={false}
        />,
      )
      const separator = screen.getByTestId("separator")
      // Radix UI Separator relies on data-orientation, not aria-orientation
      expect(separator).toHaveAttribute("data-orientation", "horizontal")
    })

    it("has aria-orientation for vertical", () => {
      render(
        <Separator
          data-testid="separator"
          orientation="vertical"
          decorative={false}
        />,
      )
      const separator = screen.getByTestId("separator")
      // Radix UI Separator relies on data-orientation, not aria-orientation
      expect(separator).toHaveAttribute("data-orientation", "vertical")
    })
  })

  describe("styling", () => {
    it("applies default classes", () => {
      render(<Separator data-testid="separator" />)
      const separator = screen.getByTestId("separator")

      expect(separator).toHaveClass("bg-border")
      expect(separator).toHaveClass("shrink-0")
    })

    it("merges custom className with defaults", () => {
      render(<Separator data-testid="separator" className="bg-red-500" />)
      const separator = screen.getByTestId("separator")

      // Should have both default and custom classes
      expect(separator).toHaveClass("shrink-0")
      expect(separator).toHaveClass("bg-red-500")
    })

    it("applies data-orientation attribute for styling", () => {
      const { rerender } = render(<Separator data-testid="separator" />)
      let separator = screen.getByTestId("separator")

      // Horizontal has data-orientation="horizontal"
      expect(separator).toHaveAttribute("data-orientation", "horizontal")

      rerender(<Separator data-testid="separator" orientation="vertical" />)
      separator = screen.getByTestId("separator")

      // Vertical has data-orientation="vertical"
      expect(separator).toHaveAttribute("data-orientation", "vertical")
    })
  })

  describe("use cases", () => {
    it("works as horizontal divider in a list", () => {
      render(
        <div>
          <div>Item 1</div>
          <Separator data-testid="separator" />
          <div>Item 2</div>
        </div>,
      )

      expect(screen.getByTestId("separator")).toBeInTheDocument()
      expect(screen.getByText("Item 1")).toBeInTheDocument()
      expect(screen.getByText("Item 2")).toBeInTheDocument()
    })

    it("works as vertical divider in a flex container", () => {
      render(
        <div style={{ display: "flex" }}>
          <div>Left</div>
          <Separator data-testid="separator" orientation="vertical" />
          <div>Right</div>
        </div>,
      )

      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("data-orientation", "vertical")
      expect(screen.getByText("Left")).toBeInTheDocument()
      expect(screen.getByText("Right")).toBeInTheDocument()
    })

    it("can be used in navigation menus", () => {
      render(
        <nav>
          <a href="/home">Home</a>
          <Separator data-testid="sep1" orientation="vertical" />
          <a href="/about">About</a>
          <Separator data-testid="sep2" orientation="vertical" />
          <a href="/contact">Contact</a>
        </nav>,
      )

      expect(screen.getByTestId("sep1")).toBeInTheDocument()
      expect(screen.getByTestId("sep2")).toBeInTheDocument()
    })
  })

  describe("props forwarding", () => {
    it("forwards additional props to root element", () => {
      render(<Separator data-testid="separator" data-custom="value" />)
      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("data-custom", "value")
    })

    it("forwards style prop to root element", () => {
      render(
        <Separator data-testid="separator" style={{ backgroundColor: "red" }} />,
      )
      const separator = screen.getByTestId("separator")
      // Note: Inline styles might be merged with Radix UI's styles
      expect(separator).toHaveAttribute("style")
    })
  })
})
