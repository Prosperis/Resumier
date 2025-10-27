import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../breadcrumb"

describe("Breadcrumb Components", () => {
  describe("Breadcrumb", () => {
    it("renders breadcrumb nav", () => {
      const { container } = render(<Breadcrumb />)
      const nav = container.querySelector("nav")
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute("aria-label", "breadcrumb")
    })

    it("has data-slot attribute", () => {
      const { container } = render(<Breadcrumb />)
      const nav = container.querySelector('[data-slot="breadcrumb"]')
      expect(nav).toBeInTheDocument()
    })

    it("forwards additional props", () => {
      const { container } = render(<Breadcrumb data-testid="custom-breadcrumb" />)
      expect(container.querySelector('[data-testid="custom-breadcrumb"]')).toBeInTheDocument()
    })
  })

  describe("BreadcrumbList", () => {
    it("renders ordered list", () => {
      const { container } = render(<BreadcrumbList />)
      const list = container.querySelector("ol")
      expect(list).toBeInTheDocument()
    })

    it("has data-slot attribute", () => {
      const { container } = render(<BreadcrumbList />)
      const list = container.querySelector('[data-slot="breadcrumb-list"]')
      expect(list).toBeInTheDocument()
    })

    it("applies default styling classes", () => {
      const { container } = render(<BreadcrumbList />)
      const list = container.querySelector("ol")
      expect(list?.className).toContain("flex")
      expect(list?.className).toContain("items-center")
      expect(list?.className).toContain("gap-1.5")
    })

    it("renders with custom className", () => {
      const { container } = render(<BreadcrumbList className="custom-list" />)
      const list = container.querySelector("ol")
      expect(list).toHaveClass("custom-list")
    })
  })

  describe("BreadcrumbItem", () => {
    it("renders list item", () => {
      const { container } = render(<BreadcrumbItem>Item</BreadcrumbItem>)
      const item = container.querySelector("li")
      expect(item).toBeInTheDocument()
      expect(item).toHaveTextContent("Item")
    })

    it("has data-slot attribute", () => {
      const { container } = render(<BreadcrumbItem />)
      const item = container.querySelector('[data-slot="breadcrumb-item"]')
      expect(item).toBeInTheDocument()
    })

    it("applies default flex classes", () => {
      const { container } = render(<BreadcrumbItem />)
      const item = container.querySelector("li")
      expect(item?.className).toContain("inline-flex")
      expect(item?.className).toContain("items-center")
    })
  })

  describe("BreadcrumbLink", () => {
    it("renders anchor link", () => {
      render(<BreadcrumbLink href="/test">Test Link</BreadcrumbLink>)
      const link = screen.getByText("Test Link")
      expect(link.tagName).toBe("A")
      expect(link).toHaveAttribute("href", "/test")
    })

    it("has data-slot attribute", () => {
      const { container } = render(<BreadcrumbLink>Link</BreadcrumbLink>)
      const link = container.querySelector('[data-slot="breadcrumb-link"]')
      expect(link).toBeInTheDocument()
    })

    it("applies hover transition classes", () => {
      const { container } = render(<BreadcrumbLink>Link</BreadcrumbLink>)
      const link = container.querySelector("a")
      expect(link?.className).toContain("transition-colors")
    })

    it("renders with custom className", () => {
      const { container } = render(<BreadcrumbLink className="custom-link">Link</BreadcrumbLink>)
      const link = container.querySelector("a")
      expect(link).toHaveClass("custom-link")
    })

    it("supports asChild prop", () => {
      render(
        <BreadcrumbLink asChild>
          <button type="button">Button Link</button>
        </BreadcrumbLink>,
      )
      const button = screen.getByRole("button")
      expect(button).toHaveTextContent("Button Link")
    })
  })

  describe("BreadcrumbPage", () => {
    it("renders current page span", () => {
      render(<BreadcrumbPage>Current Page</BreadcrumbPage>)
      const page = screen.getByText("Current Page")
      expect(page.tagName).toBe("SPAN")
    })

    it("has aria-current attribute", () => {
      render(<BreadcrumbPage>Page</BreadcrumbPage>)
      const page = screen.getByText("Page")
      expect(page).toHaveAttribute("aria-current", "page")
    })

    it("has aria-disabled attribute", () => {
      render(<BreadcrumbPage>Page</BreadcrumbPage>)
      const page = screen.getByText("Page")
      expect(page).toHaveAttribute("aria-disabled", "true")
    })

    it("has role link", () => {
      render(<BreadcrumbPage>Page</BreadcrumbPage>)
      const page = screen.getByText("Page")
      expect(page).toHaveAttribute("role", "link")
    })

    it("has data-slot attribute", () => {
      render(<BreadcrumbPage>Page</BreadcrumbPage>)
      const page = screen.getByText("Page")
      expect(page.getAttribute("data-slot")).toBe("breadcrumb-page")
    })

    it("applies font styling", () => {
      const { container } = render(<BreadcrumbPage>Page</BreadcrumbPage>)
      const page = screen.getByText("Page")
      expect(page.className).toContain("font-normal")
    })
  })

  describe("BreadcrumbSeparator", () => {
    it("renders separator with default icon", () => {
      const { container } = render(<BreadcrumbSeparator />)
      const separator = container.querySelector("li")
      expect(separator).toBeInTheDocument()
      const svg = separator?.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })

    it("has role presentation", () => {
      const { container } = render(<BreadcrumbSeparator />)
      const separator = container.querySelector("li")
      expect(separator).toHaveAttribute("role", "presentation")
    })

    it("has aria-hidden attribute", () => {
      const { container } = render(<BreadcrumbSeparator />)
      const separator = container.querySelector("li")
      expect(separator).toHaveAttribute("aria-hidden", "true")
    })

    it("has data-slot attribute", () => {
      const { container } = render(<BreadcrumbSeparator />)
      const separator = container.querySelector('[data-slot="breadcrumb-separator"]')
      expect(separator).toBeInTheDocument()
    })

    it("renders custom separator content", () => {
      render(<BreadcrumbSeparator>/</BreadcrumbSeparator>)
      expect(screen.getByText("/")).toBeInTheDocument()
    })

    it("renders with custom className", () => {
      const { container } = render(<BreadcrumbSeparator className="custom-sep" />)
      const separator = container.querySelector("li")
      expect(separator).toHaveClass("custom-sep")
    })
  })

  describe("BreadcrumbEllipsis", () => {
    it("renders ellipsis with icon", () => {
      const { container } = render(<BreadcrumbEllipsis />)
      const ellipsis = container.querySelector("span")
      expect(ellipsis).toBeInTheDocument()
      const svg = ellipsis?.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })

    it("has role presentation", () => {
      const { container } = render(<BreadcrumbEllipsis />)
      const ellipsis = container.querySelector("span")
      expect(ellipsis).toHaveAttribute("role", "presentation")
    })

    it("has aria-hidden attribute", () => {
      const { container } = render(<BreadcrumbEllipsis />)
      const ellipsis = container.querySelector("span")
      expect(ellipsis).toHaveAttribute("aria-hidden", "true")
    })

    it("has data-slot attribute", () => {
      const { container } = render(<BreadcrumbEllipsis />)
      const ellipsis = container.querySelector('[data-slot="breadcrumb-ellipsis"]')
      expect(ellipsis).toBeInTheDocument()
    })

    it("includes screen reader text", () => {
      render(<BreadcrumbEllipsis />)
      const srText = screen.getByText("More")
      expect(srText.className).toContain("sr-only")
    })

    it("applies flex and centering classes", () => {
      const { container } = render(<BreadcrumbEllipsis />)
      const ellipsis = container.querySelector("span")
      expect(ellipsis?.className).toContain("flex")
      expect(ellipsis?.className).toContain("items-center")
      expect(ellipsis?.className).toContain("justify-center")
    })
  })

  describe("Complete Breadcrumb Example", () => {
    it("renders complete breadcrumb structure", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(screen.getByText("Docs")).toBeInTheDocument()
      expect(screen.getByText("Current")).toBeInTheDocument()
    })

    it("renders breadcrumb with ellipsis", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )

      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(screen.getByText("More")).toBeInTheDocument()
      expect(screen.getByText("Page")).toBeInTheDocument()
    })
  })
})
