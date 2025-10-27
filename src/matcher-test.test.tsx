import { render } from "@testing-library/react"

describe("jest-dom matchers test", () => {
  it("should have toBeInTheDocument matcher", () => {
    const { container } = render(<div>Hello</div>)
    const div = container.querySelector("div")

    // Try to call the matcher
    console.log("expect object keys:", Object.keys(expect))
    console.log("Has toBeInTheDocument?", typeof (expect as any).toBeInTheDocument)

    // This should work if matchers are loaded
    expect(div).toBeInTheDocument()
  })
})
