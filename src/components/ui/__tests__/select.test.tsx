import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Select } from "@/components/ui/select"

describe("Select", () => {
  it("renders correctly", () => {
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    )
    const select = screen.getByRole("combobox")
    expect(select).toBeInTheDocument()
  })

  it("renders with default value", () => {
    render(
      <Select defaultValue="2">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    )
    const select = screen.getByRole("combobox") as HTMLSelectElement
    expect(select.value).toBe("2")
  })

  it("renders with custom className", () => {
    render(
      <Select className="custom-select">
        <option value="1">Option 1</option>
      </Select>,
    )
    const select = screen.getByRole("combobox")
    expect(select).toHaveClass("custom-select")
  })

  it("renders as disabled", () => {
    render(
      <Select disabled>
        <option value="1">Option 1</option>
      </Select>,
    )
    const select = screen.getByRole("combobox")
    expect(select).toBeDisabled()
  })

  it("handles onChange event", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Select onChange={onChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>,
    )

    const select = screen.getByRole("combobox")
    await user.selectOptions(select, "2")

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("displays multiple options", () => {
    render(
      <Select>
        <option value="1">First</option>
        <option value="2">Second</option>
        <option value="3">Third</option>
      </Select>,
    )

    expect(screen.getByText("First")).toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
    expect(screen.getByText("Third")).toBeInTheDocument()
  })

  it("forwards additional props", () => {
    render(
      <Select data-testid="custom-select" name="test-select">
        <option value="1">Option</option>
      </Select>,
    )

    const select = screen.getByTestId("custom-select")
    expect(select).toHaveAttribute("name", "test-select")
  })

  it("works with option groups", () => {
    render(
      <Select>
        <optgroup label="Group 1">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </optgroup>
        <optgroup label="Group 2">
          <option value="3">Option 3</option>
        </optgroup>
      </Select>,
    )

    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 3")).toBeInTheDocument()
  })

  it("updates value on selection", async () => {
    const user = userEvent.setup()

    render(
      <Select>
        <option value="a">Apple</option>
        <option value="b">Banana</option>
        <option value="c">Cherry</option>
      </Select>,
    )

    const select = screen.getByRole("combobox") as HTMLSelectElement
    expect(select.value).toBe("a") // First option is selected by default

    await user.selectOptions(select, "c")
    expect(select.value).toBe("c")
  })

  it("renders with placeholder option", () => {
    render(
      <Select defaultValue="">
        <option value="" disabled>
          Select an option...
        </option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    )

    expect(screen.getByText("Select an option...")).toBeInTheDocument()
    const select = screen.getByRole("combobox") as HTMLSelectElement
    expect(select.value).toBe("")
  })
})
