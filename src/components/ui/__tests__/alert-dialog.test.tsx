import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

describe("AlertDialog", () => {
  it("renders with trigger and content", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();

    await user.click(screen.getByText("Open Dialog"));

    await waitFor(() => {
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    });
  });

  it("renders with open prop controlled", () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("renders with defaultOpen prop", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("calls onOpenChange when dialog state changes", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <AlertDialog onOpenChange={handleOpenChange}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Open"));

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });
});

describe("AlertDialogTrigger", () => {
  it("renders children correctly", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Trigger Button</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Trigger Button")).toBeInTheDocument();
  });

  it("opens dialog when clicked", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Dialog Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Open"));

    await waitFor(() => {
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    });
  });
});

describe("AlertDialogContent", () => {
  it("renders content with overlay", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent data-testid="content">
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent className="custom-dialog" data-testid="content">
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("content")).toHaveClass("custom-dialog");
  });

  it("applies animation classes", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent data-testid="content">
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    const content = screen.getByTestId("content");
    expect(content).toHaveClass("duration-200");
  });
});

describe("AlertDialogHeader", () => {
  it("renders children correctly", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader data-testid="header">
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("applies flex layout classes", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader data-testid="header">
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("header")).toHaveClass("flex", "flex-col");
  });

  it("renders with custom className", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="custom-header" data-testid="header">
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("header")).toHaveClass("custom-header");
  });
});

describe("AlertDialogFooter", () => {
  it("renders children correctly", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogFooter data-testid="footer">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("applies flex layout classes", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogFooter data-testid="footer">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("footer")).toHaveClass("flex");
  });

  it("renders with custom className", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogFooter className="custom-footer" data-testid="footer">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
  });
});

describe("AlertDialogTitle", () => {
  it("renders title text", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Dialog Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
  });

  it("applies font styling classes", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle data-testid="title">Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("title")).toHaveClass("text-lg", "font-semibold");
  });

  it("renders with custom className", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle className="custom-title" data-testid="title">
            Title
          </AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("title")).toHaveClass("custom-title");
  });
});

describe("AlertDialogDescription", () => {
  it("renders description text", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>This is a description</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("This is a description")).toBeInTheDocument();
  });

  it("applies text styling classes", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription data-testid="description">Description</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("description")).toHaveClass("text-sm", "text-muted-foreground");
  });

  it("renders with custom className", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription className="custom-desc" data-testid="description">
            Description
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("description")).toHaveClass("custom-desc");
  });
});

describe("AlertDialogAction", () => {
  it("renders action button", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("closes dialog when clicked", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
    });
  });

  it("calls onClick handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogAction onClick={handleClick}>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Confirm"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders with custom className", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogAction className="custom-action" data-testid="action">
            Confirm
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("action")).toHaveClass("custom-action");
  });
});

describe("AlertDialogCancel", () => {
  it("renders cancel button", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("closes dialog when clicked", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
    });
  });

  it("calls onClick handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogCancel onClick={handleClick}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByText("Cancel"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders with custom className", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogCancel className="custom-cancel" data-testid="cancel">
            Cancel
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("cancel")).toHaveClass("custom-cancel");
  });
});

describe("AlertDialog accessibility", () => {
  it("has proper role attributes", () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Alert Title</AlertDialogTitle>
          <AlertDialogDescription>Alert Description</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );

    // Radix UI adds proper ARIA roles
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    const trigger = screen.getByText("Open");
    trigger.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });
});
