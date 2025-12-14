import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

describe("TooltipProvider", () => {
  it("renders children correctly", () => {
    render(
      <TooltipProvider>
        <div data-testid="child">Content</div>
      </TooltipProvider>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("accepts custom delayDuration", () => {
    render(
      <TooltipProvider delayDuration={500}>
        <div>Content</div>
      </TooltipProvider>,
    );
    // Component should render without errors
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("Tooltip", () => {
  it("renders tooltip with trigger and content", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
        <TooltipContent data-testid="content">Tooltip content</TooltipContent>
      </Tooltip>,
    );

    expect(screen.getByTestId("trigger")).toBeInTheDocument();

    // Hover over trigger
    await user.hover(screen.getByTestId("trigger"));

    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  it("responds to hover interactions", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
        <TooltipContent data-testid="content">Tooltip content</TooltipContent>
      </Tooltip>,
    );

    const trigger = screen.getByTestId("trigger");

    // Hover over trigger
    await user.hover(trigger);

    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    // Verify trigger state changes
    expect(trigger).toHaveAttribute("data-state", "delayed-open");
  });

  it("renders with open prop controlled", async () => {
    render(
      <Tooltip open={true}>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent data-testid="content">Tooltip content</TooltipContent>
      </Tooltip>,
    );

    // Tooltip should be visible immediately (wait for portal)
    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  it("renders with defaultOpen prop", async () => {
    render(
      <Tooltip defaultOpen={true}>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent data-testid="content">Tooltip content</TooltipContent>
      </Tooltip>,
    );

    // Tooltip should be visible initially (wait for portal)
    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });
});

describe("TooltipTrigger", () => {
  it("renders children correctly", () => {
    render(
      <Tooltip>
        <TooltipTrigger>Trigger Button</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>,
    );
    expect(screen.getByText("Trigger Button")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(
      <Tooltip>
        <TooltipTrigger data-testid="trigger">Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>,
    );
    expect(screen.getByTestId("trigger")).toHaveAttribute(
      "data-slot",
      "tooltip-trigger",
    );
  });

  it("can be a button element", () => {
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">Button Trigger</button>
        </TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Button Trigger" });
    expect(button).toBeInTheDocument();
  });
});

describe("TooltipContent", () => {
  it("renders content correctly", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <TooltipTrigger data-testid="trigger">Hover</TooltipTrigger>
        <TooltipContent data-testid="content">
          This is tooltip content
        </TooltipContent>
      </Tooltip>,
    );

    await user.hover(screen.getByTestId("trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
      expect(screen.getByTestId("content").textContent).toContain(
        "This is tooltip content",
      );
    });
  });

  it("renders with custom className", async () => {
    render(
      <Tooltip defaultOpen={true}>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent className="custom-tooltip" data-testid="content">
          Content
        </TooltipContent>
      </Tooltip>,
    );

    await waitFor(() => {
      const content = screen.getByTestId("content");
      expect(content).toHaveClass("custom-tooltip");
    });
  });

  it("has data-slot attribute", async () => {
    render(
      <Tooltip defaultOpen={true}>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent data-testid="content">Content</TooltipContent>
      </Tooltip>,
    );

    await waitFor(() => {
      const content = screen.getByTestId("content");
      expect(content).toHaveAttribute("data-slot", "tooltip-content");
    });
  });

  it("accepts custom sideOffset", async () => {
    render(
      <Tooltip defaultOpen={true}>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent sideOffset={10} data-testid="content">
          Content
        </TooltipContent>
      </Tooltip>,
    );

    // Component should render without errors
    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  it("renders with side prop for positioning", async () => {
    render(
      <Tooltip defaultOpen={true}>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent side="top" data-testid="content">
          Content
        </TooltipContent>
      </Tooltip>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  it("renders arrow element", async () => {
    render(
      <Tooltip defaultOpen={true}>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent data-testid="content">Content</TooltipContent>
      </Tooltip>,
    );

    // The arrow is rendered as part of the component
    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });
});

describe("Tooltip accessibility", () => {
  it("trigger has appropriate aria attributes", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>,
    );

    const trigger = screen.getByTestId("trigger");
    await user.hover(trigger);

    // Radix UI should add appropriate aria attributes
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-describedby");
    });
  });
});

describe("Tooltip with custom components", () => {
  it("renders with icon as trigger", async () => {
    const user = userEvent.setup();
    const Icon = () => (
      <svg data-testid="icon" role="img" aria-label="Icon">
        <title>Icon</title>
        Icon
      </svg>
    );

    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">
            <Icon />
          </button>
        </TooltipTrigger>
        <TooltipContent data-testid="content">Icon tooltip</TooltipContent>
      </Tooltip>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  it("renders with rich content", async () => {
    render(
      <Tooltip defaultOpen={true}>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent data-testid="content">
          <div>
            <strong>Bold text</strong>
            <p>Paragraph text</p>
          </div>
        </TooltipContent>
      </Tooltip>,
    );

    await waitFor(() => {
      const content = screen.getByTestId("content");
      expect(content).toBeInTheDocument();
      expect(content.textContent).toContain("Bold text");
      expect(content.textContent).toContain("Paragraph text");
    });
  });
});
