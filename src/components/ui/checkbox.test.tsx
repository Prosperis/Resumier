import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Checkbox } from "./checkbox"

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders checkbox", () => {
      render(<Checkbox data-testid="checkbox" />)
      expect(screen.getByTestId("checkbox")).toBeInTheDocument()
    })

    it("renders unchecked by default", () => {
      render(<Checkbox data-testid="checkbox" />)
      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("data-state", "unchecked")
    })

    it("renders checked when checked prop is true", () => {
      render(<Checkbox data-testid="checkbox" checked />)
      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("data-state", "checked")
    })

    it("renders with custom className", () => {
      render(<Checkbox data-testid="checkbox" className="custom-class" />)
      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveClass("custom-class")
    })
  })

  describe("interactions", () => {
    it("toggles checked state on click", async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()

      render(<Checkbox data-testid="checkbox" onCheckedChange={onCheckedChange} />)

      const checkbox = screen.getByTestId("checkbox")
      await user.click(checkbox)

      expect(onCheckedChange).toHaveBeenCalledWith(true)
    })

    it("unchecks when clicking checked checkbox", async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()

      render(
        <Checkbox data-testid="checkbox" checked onCheckedChange={onCheckedChange} />,
      )

      const checkbox = screen.getByTestId("checkbox")
      await user.click(checkbox)

      expect(onCheckedChange).toHaveBeenCalledWith(false)
    })

    it("does not toggle when disabled", async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()

      render(
        <Checkbox
          data-testid="checkbox"
          disabled
          onCheckedChange={onCheckedChange}
        />,
      )

      const checkbox = screen.getByTestId("checkbox")
      await user.click(checkbox)

      expect(onCheckedChange).not.toHaveBeenCalled()
    })

    it("toggles on Space key press", async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()

      render(<Checkbox data-testid="checkbox" onCheckedChange={onCheckedChange} />)

      const checkbox = screen.getByTestId("checkbox")
      checkbox.focus()
      await user.keyboard(" ")

      expect(onCheckedChange).toHaveBeenCalledWith(true)
    })

    it("does not toggle on Enter key press", async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()

      render(<Checkbox data-testid="checkbox" onCheckedChange={onCheckedChange} />)

      const checkbox = screen.getByTestId("checkbox")
      checkbox.focus()
      await user.keyboard("{Enter}")

      // Checkboxes only toggle with Space, not Enter (per HTML spec)
      expect(onCheckedChange).not.toHaveBeenCalled()
    })
  })

  describe("accessibility", () => {
    it("is keyboard focusable", () => {
      render(<Checkbox data-testid="checkbox" />)
      const checkbox = screen.getByTestId("checkbox")

      checkbox.focus()
      expect(checkbox).toHaveFocus()
    })

    it("has proper role", () => {
      render(<Checkbox data-testid="checkbox" />)
      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("role", "checkbox")
    })

    it("has aria-checked attribute when checked", () => {
      render(<Checkbox data-testid="checkbox" checked />)
      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("aria-checked", "true")
    })

    it("has aria-checked false when unchecked", () => {
      render(<Checkbox data-testid="checkbox" checked={false} />)
      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("aria-checked", "false")
    })

    it("supports aria-label", () => {
      render(<Checkbox data-testid="checkbox" aria-label="Accept terms" />)
      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("aria-label", "Accept terms")
    })

    it("supports aria-labelledby", () => {
      render(
        <div>
          <span id="label">Terms and Conditions</span>
          <Checkbox data-testid="checkbox" aria-labelledby="label" />
        </div>,
      )

      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("aria-labelledby", "label")
    })
  })

  describe("states", () => {
    it("applies disabled styles when disabled", () => {
      render(<Checkbox data-testid="checkbox" disabled />)
      const checkbox = screen.getByTestId("checkbox")

      expect(checkbox).toBeDisabled()
      expect(checkbox).toHaveClass("disabled:cursor-not-allowed")
      expect(checkbox).toHaveClass("disabled:opacity-50")
    })

    it("shows check icon when checked", () => {
      const { container } = render(<Checkbox checked />)

      // The CheckIcon from lucide-react will be rendered
      const indicator = container.querySelector("[data-state='checked']")
      expect(indicator).toBeInTheDocument()
    })

    it("hides check icon when unchecked", () => {
      const { container } = render(<Checkbox checked={false} />)

      const indicator = container.querySelector("[data-state='unchecked']")
      expect(indicator).toBeInTheDocument()
    })
  })

  describe("styling", () => {
    it("applies default classes", () => {
      render(<Checkbox data-testid="checkbox" />)
      const checkbox = screen.getByTestId("checkbox")

      expect(checkbox).toHaveClass("peer")
      expect(checkbox).toHaveClass("h-4")
      expect(checkbox).toHaveClass("w-4")
      expect(checkbox).toHaveClass("shrink-0")
      expect(checkbox).toHaveClass("rounded-sm")
      expect(checkbox).toHaveClass("border")
      expect(checkbox).toHaveClass("border-primary")
      expect(checkbox).toHaveClass("shadow")
    })

    it("merges custom className with defaults", () => {
      render(<Checkbox data-testid="checkbox" className="h-6 w-6" />)
      const checkbox = screen.getByTestId("checkbox")

      // Should have both default and custom classes
      expect(checkbox).toHaveClass("peer")
      expect(checkbox).toHaveClass("h-6")
      expect(checkbox).toHaveClass("w-6")
    })

    it("applies checked state styles", () => {
      render(<Checkbox data-testid="checkbox" checked />)
      const checkbox = screen.getByTestId("checkbox")

      expect(checkbox).toHaveAttribute("data-state", "checked")
    })
  })

  describe("controlled vs uncontrolled", () => {
    it("works as uncontrolled component", async () => {
      const user = userEvent.setup()
      render(<Checkbox data-testid="checkbox" defaultChecked />)

      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("data-state", "checked")

      await user.click(checkbox)
      expect(checkbox).toHaveAttribute("data-state", "unchecked")
    })

    it("works as controlled component", async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()

      const { rerender } = render(
        <Checkbox
          data-testid="checkbox"
          checked={false}
          onCheckedChange={onCheckedChange}
        />,
      )

      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("data-state", "unchecked")

      await user.click(checkbox)
      expect(onCheckedChange).toHaveBeenCalledWith(true)

      // Parent component updates checked prop
      rerender(
        <Checkbox
          data-testid="checkbox"
          checked={true}
          onCheckedChange={onCheckedChange}
        />,
      )

      expect(checkbox).toHaveAttribute("data-state", "checked")
    })
  })

  describe("props forwarding", () => {
    it("forwards additional props to root element", () => {
      render(<Checkbox data-testid="checkbox" data-custom="value" />)
      const checkbox = screen.getByTestId("checkbox")
      expect(checkbox).toHaveAttribute("data-custom", "value")
    })

    it("forwards ref", () => {
      const ref = { current: null }
      render(<Checkbox ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })
})
