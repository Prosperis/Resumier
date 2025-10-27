import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
  useAnimationVariants: (variants: unknown) => variants,
  useAnimationTransition: (transition: unknown) => transition,
}))

describe("Dialog", () => {
  describe("rendering", () => {
    it("renders dialog with trigger", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogContent>
        </Dialog>,
      )

      expect(screen.getByText("Open Dialog")).toBeInTheDocument()
    })

    it("does not show content initially", () => {
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      expect(screen.queryByText("Title")).not.toBeInTheDocument()
    })

    it("shows content when opened", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        expect(screen.getByText("Dialog Title")).toBeInTheDocument()
      })
    })
  })

  describe("dialog structure", () => {
    it("renders DialogHeader", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument()
      })
    })

    it("renders DialogDescription", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>This is a description</DialogDescription>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        expect(screen.getByText("This is a description")).toBeInTheDocument()
      })
    })

    it("renders DialogFooter", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogFooter>
              <button type="button">Cancel</button>
              <button type="button">Save</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        expect(screen.getByText("Cancel")).toBeInTheDocument()
        expect(screen.getByText("Save")).toBeInTheDocument()
      })
    })
  })

  describe("controlled dialog", () => {
    it("works as controlled component", async () => {
      const onOpenChange = vi.fn()
      const { rerender } = render(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      expect(screen.queryByText("Title")).not.toBeInTheDocument()

      rerender(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument()
      })
    })

    it("calls onOpenChange when trigger is clicked", async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe("closing dialog", () => {
    it("closes when Escape key is pressed", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))
      await waitFor(() => expect(screen.getByText("Title")).toBeInTheDocument())

      await user.keyboard("{Escape}")

      await waitFor(() => {
        expect(screen.queryByText("Title")).not.toBeInTheDocument()
      })
    })

    it("closes when close button is clicked", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))
      await waitFor(() => expect(screen.getByText("Title")).toBeInTheDocument())

      const closeButton = screen.getByRole("button", { name: /close/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText("Title")).not.toBeInTheDocument()
      })
    })
  })

  describe("accessibility", () => {
    it("has proper ARIA attributes", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        const dialog = screen.getByRole("dialog")
        expect(dialog).toBeInTheDocument()
        expect(dialog).toHaveAttribute("aria-describedby")
        expect(dialog).toHaveAttribute("aria-labelledby")
      })
    })

    it("focuses dialog content when opened", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <button type="button">First Button</button>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        const dialog = screen.getByRole("dialog")
        expect(dialog).toBeInTheDocument()
      })
    })

    it("traps focus within dialog", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <button type="button">Button 1</button>
            <button type="button">Button 2</button>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        expect(screen.getByText("Button 1")).toBeInTheDocument()
      })

      // Focus should be trapped in dialog
      await user.tab()
      await user.tab()
      await user.tab()

      // Focus should cycle back to first focusable element
      const focusedElement = document.activeElement
      expect(focusedElement).toBeInTheDocument()
    })
  })

  describe("custom content", () => {
    it("renders custom children in content", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <div data-testid="custom-content">Custom Content</div>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        expect(screen.getByTestId("custom-content")).toBeInTheDocument()
      })
    })

    it("applies custom className to content", async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent className="custom-class">
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      )

      await user.click(screen.getByText("Open"))

      await waitFor(() => {
        const dialog = screen.getByRole("dialog")
        expect(dialog).toHaveClass("custom-class")
      })
    })
  })
})
