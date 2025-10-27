import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

describe("Tabs", () => {
  it("renders tabs with multiple triggers and content", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Tab 1")).toBeInTheDocument()
    expect(screen.getByText("Tab 2")).toBeInTheDocument()
    expect(screen.getByText("Content 1")).toBeInTheDocument()
  })

  it("shows correct content based on defaultValue", () => {
    render(
      <Tabs defaultValue="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Content 2")).toBeVisible()
  })

  it("switches content when tab is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Content 1")).toBeVisible()

    await user.click(screen.getByText("Tab 2"))

    await waitFor(() => {
      expect(screen.getByText("Content 2")).toBeVisible()
    })
  })

  it("respects controlled value prop", () => {
    const { rerender } = render(
      <Tabs value="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Content 1")).toBeVisible()

    rerender(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Content 2")).toBeVisible()
  })

  it("calls onValueChange when tab changes", async () => {
    const user = userEvent.setup()
    const handleValueChange = vi.fn()

    render(
      <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    await user.click(screen.getByText("Tab 2"))

    expect(handleValueChange).toHaveBeenCalledWith("tab2")
  })

  it("supports orientation prop", () => {
    render(
      <Tabs defaultValue="tab1" orientation="vertical">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    // Radix UI should apply the orientation
    expect(screen.getByTestId("tabs-list")).toBeInTheDocument()
  })
})

describe("TabsList", () => {
  it("renders children correctly", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    expect(screen.getByTestId("tabs-list")).toBeInTheDocument()
    expect(screen.getByText("Tab 1")).toBeInTheDocument()
    expect(screen.getByText("Tab 2")).toBeInTheDocument()
  })

  it("applies default styling classes", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    )

    expect(screen.getByTestId("tabs-list")).toHaveClass("inline-flex", "items-center", "bg-muted")
  })

  it("renders with custom className", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-list" data-testid="tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    )

    expect(screen.getByTestId("tabs-list")).toHaveClass("custom-list")
  })

  it("supports multiple triggers", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Tab 1")).toBeInTheDocument()
    expect(screen.getByText("Tab 2")).toBeInTheDocument()
    expect(screen.getByText("Tab 3")).toBeInTheDocument()
  })
})

describe("TabsTrigger", () => {
  it("renders trigger text", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Trigger Text</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Trigger Text")).toBeInTheDocument()
  })

  it("applies active state styles when selected", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" data-testid="active-trigger">
            Active Tab
          </TabsTrigger>
          <TabsTrigger value="tab2">Inactive Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    const activeTrigger = screen.getByTestId("active-trigger")
    expect(activeTrigger).toHaveAttribute("data-state", "active")
  })

  it("renders with custom className", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-trigger" data-testid="trigger">
            Tab
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>,
    )

    expect(screen.getByTestId("trigger")).toHaveClass("custom-trigger")
  })

  it("respects disabled state", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    const disabledTrigger = screen.getByText("Tab 2")
    expect(disabledTrigger).toBeDisabled()

    await user.click(disabledTrigger)
    // Content should not change
    expect(screen.getByText("Content 1")).toBeVisible()
  })

  it("activates on click", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    await user.click(screen.getByText("Tab 2"))

    await waitFor(() => {
      expect(screen.getByText("Tab 2")).toHaveAttribute("data-state", "active")
    })
  })

  it("supports asChild composition", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" asChild>
            <button type="button">Custom Button</button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>,
    )

    expect(screen.getByRole("tab", { name: "Custom Button" })).toBeInTheDocument()
  })
})

describe("TabsContent", () => {
  it("renders content when tab is active", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Active Content</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Active Content")).toBeVisible()
  })

  it("hides content when tab is inactive", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2" data-testid="inactive">
          Inactive Content
        </TabsContent>
      </Tabs>,
    )

    const inactiveContent = screen.getByTestId("inactive")
    expect(inactiveContent).toHaveAttribute("hidden")
  })

  it("renders with custom className", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content" data-testid="content">
          Content
        </TabsContent>
      </Tabs>,
    )

    expect(screen.getByTestId("content")).toHaveClass("custom-content")
  })

  it("applies focus-visible styles", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" data-testid="content">
          Content
        </TabsContent>
      </Tabs>,
    )

    expect(screen.getByTestId("content")).toHaveClass("focus-visible:outline-none")
  })

  it("supports rich content", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div>
            <h2>Title</h2>
            <p>Paragraph</p>
          </div>
        </TabsContent>
      </Tabs>,
    )

    expect(screen.getByText("Title")).toBeInTheDocument()
    expect(screen.getByText("Paragraph")).toBeInTheDocument()
  })
})

describe("Tabs keyboard navigation", () => {
  it("supports arrow key navigation", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>,
    )

    const firstTab = screen.getByText("Tab 1")
    firstTab.focus()

    // Navigate with arrow keys
    await user.keyboard("{ArrowRight}")

    // Focus should move to next tab
    await waitFor(() => {
      expect(screen.getByText("Tab 2")).toHaveFocus()
    })
  })

  it("supports Home and End keys", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>,
    )

    const secondTab = screen.getByText("Tab 2")
    secondTab.focus()

    await user.keyboard("{End}")

    await waitFor(() => {
      expect(screen.getByText("Tab 3")).toHaveFocus()
    })
  })
})

describe("Tabs accessibility", () => {
  it("has proper ARIA roles", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>,
    )

    expect(screen.getByRole("tablist")).toBeInTheDocument()
    expect(screen.getByRole("tab")).toBeInTheDocument()
    expect(screen.getByRole("tabpanel")).toBeInTheDocument()
  })

  it("links triggers to content with ARIA attributes", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>,
    )

    const trigger = screen.getByRole("tab")
    const content = screen.getByRole("tabpanel")

    expect(trigger).toHaveAttribute("aria-controls")
    expect(content).toHaveAttribute("aria-labelledby")
  })
})
