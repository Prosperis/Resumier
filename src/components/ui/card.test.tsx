import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"

describe("Card", () => {
  it("renders all subcomponents", () => {
    const { getByText, getByTestId } = render(
      <Card>
        <CardHeader data-testid="header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent data-testid="content">Body</CardContent>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>,
    )
    expect(getByTestId("header").getAttribute("data-slot")).toBe("card-header")
    expect(getByText("Title").getAttribute("data-slot")).toBe("card-title")
    expect(getByTestId("content").getAttribute("data-slot")).toBe("card-content")
    expect(getByTestId("footer").getAttribute("data-slot")).toBe("card-footer")
  })
})
