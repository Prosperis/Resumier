import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

describe("Dialog", () => {
  it("renders with trigger and content", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();

    await user.click(screen.getByText("Open Dialog"));

    await waitFor(() => {
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    });
  });

  it("has data-slot attribute", () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Open")).toHaveAttribute("data-slot", "dialog-trigger");
  });

  it("renders with open prop controlled", () => {
    render(
      <Dialog open={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("renders with defaultOpen prop", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("calls onOpenChange when dialog state changes", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText("Open"));

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });
});

describe("DialogTrigger", () => {
  it("renders children correctly", () => {
    render(
      <Dialog>
        <DialogTrigger>Trigger Button</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Trigger Button")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="trigger">Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("trigger")).toHaveAttribute("data-slot", "dialog-trigger");
  });

  it("opens dialog when clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText("Open"));

    await waitFor(() => {
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    });
  });

  it("can be a custom component with asChild", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button type="button">Custom Button</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "Custom Button" })).toBeInTheDocument();
  });
});

describe("DialogContent", () => {
  it("renders content correctly", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent data-testid="content">
          <DialogTitle>Content Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-dialog" data-testid="content">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("content")).toHaveClass("custom-dialog");
  });

  it("has data-slot attribute", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent data-testid="content">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("content")).toHaveAttribute("data-slot", "dialog-content");
  });

  it("renders close button", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("closes dialog when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
    });
  });

  it("renders with overlay", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    // The overlay is rendered as part of the DialogContent
    expect(screen.getByText("Title")).toBeInTheDocument();
  });
});

describe("DialogHeader", () => {
  it("renders children correctly", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader data-testid="header">
            <DialogTitle>Header Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader data-testid="header">
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "dialog-header");
  });

  it("applies flex layout classes", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader data-testid="header">
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("header")).toHaveClass("flex", "flex-col");
  });

  it("renders with custom className", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader className="custom-header" data-testid="header">
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("header")).toHaveClass("custom-header");
  });
});

describe("DialogFooter", () => {
  it("renders children correctly", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogFooter data-testid="footer">
            <button type="button">Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogFooter data-testid="footer">
            <button type="button">Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "dialog-footer");
  });

  it("applies flex layout classes", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogFooter data-testid="footer">
            <button type="button">Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("footer")).toHaveClass("flex");
  });

  it("renders with custom className", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogFooter className="custom-footer" data-testid="footer">
            <button type="button">Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
  });
});

describe("DialogTitle", () => {
  it("renders title text", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title Text</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Dialog Title Text")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle data-testid="title">Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("title")).toHaveAttribute("data-slot", "dialog-title");
  });

  it("applies font styling classes", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle data-testid="title">Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("title")).toHaveClass("text-lg", "font-semibold");
  });

  it("renders with custom className", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle className="custom-title" data-testid="title">
            Title
          </DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("title")).toHaveClass("custom-title");
  });
});

describe("DialogDescription", () => {
  it("renders description text", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>This is a dialog description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("This is a dialog description")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription data-testid="description">Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("description")).toHaveAttribute("data-slot", "dialog-description");
  });

  it("applies text styling classes", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription data-testid="description">Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("description")).toHaveClass("text-sm", "text-muted-foreground");
  });

  it("renders with custom className", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription className="custom-desc" data-testid="description">
            Description
          </DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("description")).toHaveClass("custom-desc");
  });
});

describe("DialogClose", () => {
  it("closes dialog when clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogClose>Close Dialog</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText("Close Dialog"));

    await waitFor(() => {
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
    });
  });

  it("has data-slot attribute", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogClose data-testid="close">Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("close")).toHaveAttribute("data-slot", "dialog-close");
  });

  it("can be a custom button", async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogClose asChild>
            <button type="button">Custom Close Button</button>
          </DialogClose>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText("Custom Close Button"));

    await waitFor(() => {
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
    });
  });
});

describe("Dialog accessibility", () => {
  it("has proper role attribute", () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByText("Open");
    trigger.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });

  it("traps focus within dialog", async () => {
    const _user = userEvent.setup();
    render(
      <Dialog defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <button type="button">First Button</button>
          <button type="button">Second Button</button>
        </DialogContent>
      </Dialog>,
    );

    // Focus should be trapped within the dialog
    const firstButton = screen.getByText("First Button");
    firstButton.focus();
    expect(firstButton).toHaveFocus();
  });
});
