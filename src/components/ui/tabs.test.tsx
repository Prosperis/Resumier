import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

describe("Tabs", () => {
  describe("rendering", () => {
    it("renders tabs with multiple triggers", () => {
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
    })

    it("shows default tab content", () => {
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

      expect(screen.getByText("Content 1")).toBeInTheDocument()
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument()
    })
  })

  describe("tab switching", () => {
    it("switches tabs when trigger is clicked", async () => {
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

      expect(screen.getByText("Content 1")).toBeInTheDocument()

      await user.click(screen.getByText("Tab 2"))

      expect(screen.getByText("Content 2")).toBeInTheDocument()
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
    })

    it("switches tabs with keyboard navigation", async () => {
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

      const tab1 = screen.getByText("Tab 1")
      tab1.focus()

      await user.keyboard("{ArrowRight}")
      expect(screen.getByText("Content 2")).toBeInTheDocument()

      await user.keyboard("{ArrowRight}")
      expect(screen.getByText("Content 3")).toBeInTheDocument()

      await user.keyboard("{ArrowLeft}")
      expect(screen.getByText("Content 2")).toBeInTheDocument()
    })
  })

  describe("controlled tabs", () => {
    it("works as controlled component", () => {
      const onValueChange = vi.fn()
      const { rerender } = render(
        <Tabs value="tab1" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      expect(screen.getByText("Content 1")).toBeInTheDocument()

      rerender(
        <Tabs value="tab2" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      expect(screen.getByText("Content 2")).toBeInTheDocument()
    })

    it("calls onValueChange when tab is clicked", async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(
        <Tabs defaultValue="tab1" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      )

      await user.click(screen.getByText("Tab 2"))

      expect(onValueChange).toHaveBeenCalledWith("tab2")
    })
  })

  describe("disabled tabs", () => {
    it("does not switch to disabled tab", async () => {
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

      const tab2 = screen.getByText("Tab 2")
      expect(tab2).toHaveAttribute("data-disabled")

      await user.click(tab2)

      expect(screen.getByText("Content 1")).toBeInTheDocument()
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument()
    })
  })

  describe("accessibility", () => {
    it("has proper ARIA attributes", () => {
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

      const tab1 = screen.getByText("Tab 1")
      expect(tab1).toHaveAttribute("role", "tab")
      expect(tab1).toHaveAttribute("aria-selected")
    })

    it("associates tabs with their content", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>,
      )

      const tab = screen.getByText("Tab 1")
      const tabpanel = screen.getByText("Content 1").closest('[role="tabpanel"]')

      expect(tab).toHaveAttribute("aria-controls")
      expect(tabpanel).toHaveAttribute("role", "tabpanel")
    })
  })

  describe("styling", () => {
    it("applies active state styling", () => {
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

      const tab1 = screen.getByText("Tab 1")
      expect(tab1).toHaveAttribute("data-state", "active")
    })

    it("applies custom className to TabsList", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>,
      )

      const tabsList = screen.getByText("Tab 1").parentElement
      expect(tabsList).toHaveClass("custom-list")
    })

    it("applies custom className to TabsTrigger", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>,
      )

      const trigger = screen.getByText("Tab 1")
      expect(trigger).toHaveClass("custom-trigger")
    })
  })
})
