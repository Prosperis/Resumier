import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DropdownMenuSeparator, DropdownMenuLabel } from "./dropdown-menu"

// Mock animation hooks
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
  useAnimationVariants: (variants: unknown) => variants,
  useAnimationTransition: (transition: unknown) => transition,
}))

describe("DropdownMenu", () => {
  describe("menu components", () => {
    it("renders menu label", () => {
      render(<DropdownMenuLabel>Actions</DropdownMenuLabel>)

      expect(screen.getByText("Actions")).toBeInTheDocument()
    })

    it("applies custom className to label", () => {
      render(
        <DropdownMenuLabel className="custom-label" data-testid="label">
          Actions
        </DropdownMenuLabel>,
      )

      const label = screen.getByTestId("label")
      expect(label).toHaveClass("custom-label")
    })

    it("renders menu separator", () => {
      render(<DropdownMenuSeparator data-testid="separator" />)

      expect(screen.getByTestId("separator")).toBeInTheDocument()
    })

    it("applies custom className to separator", () => {
      render(<DropdownMenuSeparator className="custom-separator" data-testid="separator" />)

      const separator = screen.getByTestId("separator")
      expect(separator).toHaveClass("custom-separator")
    })

    it("has data-slot attribute on separator", () => {
      render(<DropdownMenuSeparator data-testid="separator" />)

      const separator = screen.getByTestId("separator")
      expect(separator).toHaveAttribute("data-slot", "dropdown-menu-separator")
    })

    it("renders separator as div element", () => {
      render(<DropdownMenuSeparator data-testid="separator" />)

      const separator = screen.getByTestId("separator")
      expect(separator.tagName).toBe("DIV")
    })
  })
})
