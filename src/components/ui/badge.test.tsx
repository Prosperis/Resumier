import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Badge } from "./badge"

describe("Badge", () => {
  it("applies variant classes", () => {
    const { getByText } = render(<Badge variant="destructive">Alert</Badge>)
    const el = getByText("Alert")
    expect(el.className).toContain("bg-destructive")
  })

  it("renders as child element when asChild is true", () => {
    const { container } = render(
      <Badge asChild>
        <a href="#">Link</a>
      </Badge>,
    )
    const anchor = container.querySelector("a")
    expect(anchor).not.toBeNull()
    expect(anchor?.getAttribute("data-slot")).toBe("badge")
  })
})
