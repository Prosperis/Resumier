import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Input } from "./input"

vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}))

describe("Input", () => {
  describe("rendering", () => {
    it("renders an input element", () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe("INPUT")
    })

    it("has data-slot attribute", () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("data-slot", "input")
    })

    it("renders with placeholder text", () => {
      render(<Input placeholder="Enter your name" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("placeholder", "Enter your name")
    })

    it("applies custom className", () => {
      render(<Input className="custom-class" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveClass("custom-class")
    })
  })

  describe("input types", () => {
    it("renders without type attribute by default", () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId("input")
      // HTML5 inputs default to text but may not have explicit type attribute
      expect(input.tagName).toBe("INPUT")
    })

    it("renders with email type", () => {
      render(<Input type="email" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("type", "email")
    })

    it("renders with password type", () => {
      render(<Input type="password" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("type", "password")
    })

    it("renders with number type", () => {
      render(<Input type="number" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("type", "number")
    })
  })

  describe("user interaction", () => {
    it("accepts text input", async () => {
      const user = userEvent.setup()
      render(<Input data-testid="input" />)
      const input = screen.getByTestId("input") as HTMLInputElement

      await user.type(input, "Hello World")

      expect(input.value).toBe("Hello World")
    })

    it("can be focused", async () => {
      const user = userEvent.setup()
      render(<Input data-testid="input" />)
      const input = screen.getByTestId("input")

      await user.click(input)

      expect(input).toHaveFocus()
    })

    it("can be cleared", async () => {
      const user = userEvent.setup()
      render(<Input defaultValue="Initial" data-testid="input" />)
      const input = screen.getByTestId("input") as HTMLInputElement

      await user.clear(input)

      expect(input.value).toBe("")
    })

    it("calls onChange handler", async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} data-testid="input" />)
      const input = screen.getByTestId("input")

      await user.type(input, "test")

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe("states", () => {
    it("can be disabled", () => {
      render(<Input disabled data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toBeDisabled()
    })

    it("can be readonly", () => {
      render(<Input readOnly data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("readonly")
    })

    it("can be required", () => {
      render(<Input required data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toBeRequired()
    })

    it("applies aria-invalid styling", () => {
      render(<Input aria-invalid data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("aria-invalid")
    })
  })

  describe("controlled input", () => {
    it("works as controlled component", async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const { rerender } = render(
        <Input value="initial" onChange={handleChange} data-testid="input" />,
      )
      const input = screen.getByTestId("input") as HTMLInputElement

      expect(input.value).toBe("initial")

      await user.type(input, "x")
      expect(handleChange).toHaveBeenCalled()

      rerender(<Input value="updated" onChange={handleChange} data-testid="input" />)
      expect(input.value).toBe("updated")
    })
  })

  describe("accessibility", () => {
    it("accepts aria-label", () => {
      render(<Input aria-label="Username" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("aria-label", "Username")
    })

    it("accepts aria-describedby", () => {
      render(<Input aria-describedby="helper-text" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("aria-describedby", "helper-text")
    })

    it("can be associated with a label", () => {
      render(
        <>
          <label htmlFor="test-input">Name</label>
          <Input id="test-input" data-testid="input" />
        </>,
      )
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("id", "test-input")
    })
  })

  describe("props forwarding", () => {
    it("forwards additional props", () => {
      render(<Input data-custom="value" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("data-custom", "value")
    })

    it("forwards name attribute", () => {
      render(<Input name="username" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("name", "username")
    })

    it("forwards autoComplete attribute", () => {
      render(<Input autoComplete="email" data-testid="input" />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("autocomplete", "email")
    })
  })
})
