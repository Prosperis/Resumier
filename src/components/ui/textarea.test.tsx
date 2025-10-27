import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Textarea } from "./textarea"

vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}))

describe("Textarea", () => {
  describe("rendering", () => {
    it("renders a textarea element", () => {
      render(<Textarea data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe("TEXTAREA")
    })

    it("has data-slot attribute", () => {
      render(<Textarea data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("data-slot", "textarea")
    })

    it("renders with placeholder text", () => {
      render(<Textarea placeholder="Enter description" data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("placeholder", "Enter description")
    })

    it("applies custom className", () => {
      render(<Textarea className="custom-class" data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveClass("custom-class")
    })
  })

  describe("user interaction", () => {
    it("accepts text input", async () => {
      const user = userEvent.setup()
      render(<Textarea data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement

      await user.type(textarea, "Hello World")

      expect(textarea.value).toBe("Hello World")
    })

    it("accepts multiline text", async () => {
      const user = userEvent.setup()
      render(<Textarea data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement

      await user.type(textarea, "Line 1{Enter}Line 2{Enter}Line 3")

      expect(textarea.value).toContain("Line 1\nLine 2\nLine 3")
    })

    it("can be focused", async () => {
      const user = userEvent.setup()
      render(<Textarea data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")

      await user.click(textarea)

      expect(textarea).toHaveFocus()
    })

    it("can be cleared", async () => {
      const user = userEvent.setup()
      render(<Textarea defaultValue="Initial text" data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement

      await user.clear(textarea)

      expect(textarea.value).toBe("")
    })

    it("calls onChange handler", async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Textarea onChange={handleChange} data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")

      await user.type(textarea, "test")

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe("states", () => {
    it("can be disabled", () => {
      render(<Textarea disabled data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toBeDisabled()
    })

    it("can be readonly", () => {
      render(<Textarea readOnly data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("readonly")
    })

    it("can be required", () => {
      render(<Textarea required data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toBeRequired()
    })

    it("applies aria-invalid styling", () => {
      render(<Textarea aria-invalid data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("aria-invalid")
    })
  })

  describe("controlled textarea", () => {
    it("works as controlled component", async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const { rerender } = render(
        <Textarea value="initial" onChange={handleChange} data-testid="textarea" />,
      )
      const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement

      expect(textarea.value).toBe("initial")

      await user.type(textarea, "x")
      expect(handleChange).toHaveBeenCalled()

      rerender(<Textarea value="updated" onChange={handleChange} data-testid="textarea" />)
      expect(textarea.value).toBe("updated")
    })
  })

  describe("sizing", () => {
    it("accepts rows attribute", () => {
      render(<Textarea rows={5} data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("rows", "5")
    })

    it("accepts cols attribute", () => {
      render(<Textarea cols={40} data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("cols", "40")
    })

    it("accepts maxLength attribute", () => {
      render(<Textarea maxLength={100} data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("maxlength", "100")
    })
  })

  describe("accessibility", () => {
    it("accepts aria-label", () => {
      render(<Textarea aria-label="Description" data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("aria-label", "Description")
    })

    it("accepts aria-describedby", () => {
      render(<Textarea aria-describedby="helper-text" data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("aria-describedby", "helper-text")
    })

    it("can be associated with a label", () => {
      render(
        <>
          <label htmlFor="test-textarea">Description</label>
          <Textarea id="test-textarea" data-testid="textarea" />
        </>,
      )
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("id", "test-textarea")
    })
  })

  describe("props forwarding", () => {
    it("forwards additional props", () => {
      render(<Textarea data-custom="value" data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("data-custom", "value")
    })

    it("forwards name attribute", () => {
      render(<Textarea name="description" data-testid="textarea" />)
      const textarea = screen.getByTestId("textarea")
      expect(textarea).toHaveAttribute("name", "description")
    })
  })
})
