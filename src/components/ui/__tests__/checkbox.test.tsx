import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Checkbox } from "@/components/ui/checkbox"

describe("Checkbox", () => {
  it("renders correctly", () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeInTheDocument()
  })

  it("renders with checked state", () => {
    render(<Checkbox checked />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("data-state", "checked")
  })

  it("renders with unchecked state", () => {
    render(<Checkbox checked={false} />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("data-state", "unchecked")
  })

  it("calls onCheckedChange when clicked", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(<Checkbox onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole("checkbox")

    await user.click(checkbox)

    expect(onCheckedChange).toHaveBeenCalledTimes(1)
  })

  it("renders with custom className", () => {
    render(<Checkbox className="custom-class" />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveClass("custom-class")
  })

  it("renders as disabled", () => {
    render(<Checkbox disabled />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeDisabled()
  })

  it("does not call onCheckedChange when disabled", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(<Checkbox disabled onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole("checkbox")

    await user.click(checkbox)

    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("displays check icon when checked", () => {
    const { container } = render(<Checkbox checked />)
    const indicator = container.querySelector('[data-state="checked"]')
    expect(indicator).toBeInTheDocument()
  })

  it("accepts and forwards additional props", () => {
    render(<Checkbox data-testid="custom-checkbox" />)
    const checkbox = screen.getByTestId("custom-checkbox")
    expect(checkbox).toBeInTheDocument()
  })

  it("works with uncontrolled state", async () => {
    const user = userEvent.setup()
    render(<Checkbox defaultChecked={false} />)
    const checkbox = screen.getByRole("checkbox")

    expect(checkbox).toHaveAttribute("data-state", "unchecked")

    await user.click(checkbox)

    expect(checkbox).toHaveAttribute("data-state", "checked")
  })
})
