import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Select } from "./select"

describe("Select", () => {
  describe("rendering", () => {
    it("renders a select element", () => {
      render(
        <Select data-testid="select">
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select.tagName).toBe("SELECT")
    })

    it("renders with data-slot attribute", () => {
      render(
        <Select data-testid="select">
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveAttribute("data-slot", "select")
    })

    it("renders with custom className", () => {
      render(
        <Select data-testid="select" className="custom-class">
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveClass("custom-class")
    })

    it("renders multiple options", () => {
      render(
        <Select data-testid="select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Select>,
      )
      const options = screen.getAllByRole("option")
      expect(options).toHaveLength(3)
    })
  })

  describe("selection", () => {
    it("allows selecting an option by click", async () => {
      const user = userEvent.setup()
      render(
        <Select data-testid="select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>,
      )
      const select = screen.getByTestId("select") as HTMLSelectElement

      await user.selectOptions(select, "2")

      expect(select.value).toBe("2")
      expect(screen.getByRole("option", { name: "Option 2" })).toHaveProperty("selected", true)
    })

    it("calls onChange when selection changes", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <Select data-testid="select" onChange={onChange}>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>,
      )
      const select = screen.getByTestId("select")

      await user.selectOptions(select, "2")

      expect(onChange).toHaveBeenCalled()
    })

    it("works with defaultValue prop", () => {
      render(
        <Select data-testid="select" defaultValue="2">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>,
      )
      const select = screen.getByTestId("select") as HTMLSelectElement

      expect(select.value).toBe("2")
    })
  })

  describe("states", () => {
    it("handles disabled state", () => {
      render(
        <Select data-testid="select" disabled>
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toBeDisabled()
    })

    it("handles required attribute", () => {
      render(
        <Select data-testid="select" required>
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toBeRequired()
    })

    it("handles aria-invalid state", () => {
      render(
        <Select data-testid="select" aria-invalid>
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveAttribute("aria-invalid")
    })
  })

  describe("controlled component", () => {
    it("works as controlled component with value prop", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { rerender } = render(
        <Select data-testid="select" value="1" onChange={onChange}>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>,
      )
      const select = screen.getByTestId("select") as HTMLSelectElement

      expect(select.value).toBe("1")

      await user.selectOptions(select, "2")

      // Value should still be "1" until parent updates it
      expect(select.value).toBe("1")
      expect(onChange).toHaveBeenCalled()

      // Parent updates the value
      rerender(
        <Select data-testid="select" value="2" onChange={onChange}>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>,
      )

      expect(select.value).toBe("2")
    })
  })

  describe("accessibility", () => {
    it("supports aria-label", () => {
      render(
        <Select data-testid="select" aria-label="Choose option">
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveAttribute("aria-label", "Choose option")
    })

    it("supports aria-describedby", () => {
      render(
        <>
          <span id="helper-text">Select an option</span>
          <Select data-testid="select" aria-describedby="helper-text">
            <option value="1">Option 1</option>
          </Select>
        </>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveAttribute("aria-describedby", "helper-text")
    })

    it("associates with label via htmlFor", () => {
      render(
        <>
          <label htmlFor="select-input">Choose option</label>
          <Select id="select-input" data-testid="select">
            <option value="1">Option 1</option>
          </Select>
        </>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveAccessibleName("Choose option")
    })
  })

  describe("props forwarding", () => {
    it("forwards data attributes", () => {
      render(
        <Select data-testid="select" data-custom="value">
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveAttribute("data-custom", "value")
    })

    it("forwards name attribute", () => {
      render(
        <Select data-testid="select" name="country">
          <option value="1">Option 1</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveAttribute("name", "country")
    })

    it("supports multiple attribute", () => {
      render(
        <Select data-testid="select" multiple>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>,
      )
      const select = screen.getByTestId("select")
      expect(select).toHaveAttribute("multiple")
    })
  })

  describe("option groups", () => {
    it("renders optgroup elements", () => {
      render(
        <Select data-testid="select">
          <optgroup label="Group 1">
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </optgroup>
          <optgroup label="Group 2">
            <option value="3">Option 3</option>
          </optgroup>
        </Select>,
      )

      const groups = screen.getAllByRole("group")
      expect(groups).toHaveLength(2)
      expect(groups[0]).toHaveAccessibleName("Group 1")
      expect(groups[1]).toHaveAccessibleName("Group 2")
    })
  })
})
