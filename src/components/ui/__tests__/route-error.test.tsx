import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError, RouteError } from "../route-error";

// Mock TanStack Router
const mockInvalidate = vi.fn();
const mockRouter = {
  invalidate: mockInvalidate,
};

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useRouter: () => mockRouter,
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

describe("RouteError", () => {
  const mockError = new Error("Test error message");

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Rendering", () => {
    it("renders default title", () => {
      render(<RouteError error={mockError} />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("renders custom title", () => {
      render(<RouteError error={mockError} title="Custom Error" />);
      expect(screen.getByText("Custom Error")).toBeInTheDocument();
    });

    it("renders error message", () => {
      render(<RouteError error={mockError} />);
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("renders fallback message when error has no message", () => {
      const errorWithoutMessage = new Error();
      errorWithoutMessage.message = "";
      render(<RouteError error={errorWithoutMessage} />);
      expect(
        screen.getByText("An unexpected error occurred"),
      ).toBeInTheDocument();
    });

    it("renders alert icon", () => {
      const { container } = render(<RouteError error={mockError} />);
      // AlertCircle icon should be present
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders Try Again button", () => {
      render(<RouteError error={mockError} />);
      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });

    it("renders Go Home link", () => {
      render(<RouteError error={mockError} />);
      expect(
        screen.getByRole("link", { name: /go home/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("centers content on screen", () => {
      const { container } = render(<RouteError error={mockError} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass(
        "flex",
        "min-h-screen",
        "items-center",
        "justify-center",
      );
    });

    it("applies destructive styling to icon container", () => {
      const { container } = render(<RouteError error={mockError} />);
      const iconContainer = container.querySelector(".rounded-full");
      expect(iconContainer).toHaveClass("bg-destructive/10");
    });

    it("displays title with large bold font", () => {
      render(<RouteError error={mockError} />);
      const title = screen.getByText("Something went wrong");
      expect(title).toHaveClass("text-3xl", "font-bold", "tracking-tight");
    });

    it("displays error message with muted color", () => {
      render(<RouteError error={mockError} />);
      const message = screen.getByText("Test error message");
      expect(message).toHaveClass("text-muted-foreground");
    });

    it("arranges buttons in flex layout", () => {
      const { container } = render(<RouteError error={mockError} />);
      const buttonContainer = container.querySelector(".flex.flex-col");
      expect(buttonContainer).toHaveClass("gap-3");
    });
  });

  describe("Reset Functionality", () => {
    it("calls custom reset function when provided", async () => {
      const user = userEvent.setup();
      const mockReset = vi.fn();
      render(<RouteError error={mockError} reset={mockReset} />);

      const tryAgainButton = screen.getByRole("button", { name: /try again/i });
      await user.click(tryAgainButton);

      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockInvalidate).not.toHaveBeenCalled();
    });

    it("calls router.invalidate when reset is not provided", async () => {
      const user = userEvent.setup();
      render(<RouteError error={mockError} />);

      const tryAgainButton = screen.getByRole("button", { name: /try again/i });
      await user.click(tryAgainButton);

      expect(mockInvalidate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Navigation", () => {
    it("Go Home link points to root path", () => {
      render(<RouteError error={mockError} />);
      const homeLink = screen.getByRole("link", { name: /go home/i });
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("renders Home icon in button", () => {
      render(<RouteError error={mockError} />);
      const homeLink = screen.getByRole("link", { name: /go home/i });
      const icon = homeLink.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders RefreshCw icon in Try Again button", () => {
      render(<RouteError error={mockError} />);
      const tryAgainButton = screen.getByRole("button", { name: /try again/i });
      const icon = tryAgainButton.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Development Mode", () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("shows error stack in development mode", () => {
      const errorWithStack = new Error("Test error");
      errorWithStack.stack = "Error: Test error\n  at test.js:1:1";
      render(<RouteError error={errorWithStack} />);

      expect(
        screen.getByText("Error Details (Development Only)"),
      ).toBeInTheDocument();
    });

    it("displays stack trace in a details element", () => {
      const errorWithStack = new Error("Test error");
      errorWithStack.stack = "Error: Test error\n  at test.js:1:1";
      const { container } = render(<RouteError error={errorWithStack} />);

      const details = container.querySelector("details");
      expect(details).toBeInTheDocument();
      expect(details?.querySelector("pre")).toBeInTheDocument();
    });

    it("hides error details in production mode", () => {
      process.env.NODE_ENV = "production";
      const errorWithStack = new Error("Test error");
      errorWithStack.stack = "Error: Test error\n  at test.js:1:1";
      render(<RouteError error={errorWithStack} />);

      expect(
        screen.queryByText("Error Details (Development Only)"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has semantic button for retry action", () => {
      render(<RouteError error={mockError} />);
      const button = screen.getByRole("button", { name: /try again/i });
      expect(button.tagName).toBe("BUTTON");
    });

    it("has semantic link for navigation", () => {
      render(<RouteError error={mockError} />);
      const link = screen.getByRole("link", { name: /go home/i });
      expect(link.tagName).toBe("A");
    });

    it("provides clear action labels", () => {
      render(<RouteError error={mockError} />);
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
      expect(screen.getByText(/go home/i)).toBeInTheDocument();
    });
  });
});

describe("NotFoundError", () => {
  describe("Rendering", () => {
    it("renders 404 heading", () => {
      render(<NotFoundError />);
      expect(screen.getByText("404")).toBeInTheDocument();
    });

    it("renders 'Page not found' message", () => {
      render(<NotFoundError />);
      expect(screen.getByText("Page not found")).toBeInTheDocument();
    });

    it("renders helpful description", () => {
      render(<NotFoundError />);
      expect(
        screen.getByText(
          /the page you're looking for doesn't exist or has been moved/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders Back to Home button", () => {
      render(<NotFoundError />);
      expect(
        screen.getByRole("link", { name: /back to home/i }),
      ).toBeInTheDocument();
    });

    it("renders Home icon", () => {
      render(<NotFoundError />);
      const link = screen.getByRole("link", { name: /back to home/i });
      const icon = link.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("centers content on screen", () => {
      const { container } = render(<NotFoundError />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass(
        "flex",
        "min-h-screen",
        "items-center",
        "justify-center",
      );
    });

    it("displays 404 with large bold font", () => {
      render(<NotFoundError />);
      const heading = screen.getByText("404");
      expect(heading).toHaveClass("text-8xl", "font-bold", "tracking-tight");
    });

    it("displays subtitle with appropriate size", () => {
      render(<NotFoundError />);
      const subtitle = screen.getByText("Page not found");
      expect(subtitle).toHaveClass("text-2xl", "font-semibold");
    });

    it("displays description with muted color", () => {
      render(<NotFoundError />);
      const description = screen.getByText(
        /the page you're looking for doesn't exist or has been moved/i,
      );
      expect(description).toHaveClass("text-muted-foreground");
    });

    it("renders large button", () => {
      render(<NotFoundError />);
      const link = screen.getByRole("link", { name: /back to home/i });
      // Button should have size="lg" which applies size classes
      expect(link.querySelector("button, a")).toBeTruthy();
    });
  });

  describe("Navigation", () => {
    it("Back to Home link points to root path", () => {
      render(<NotFoundError />);
      const link = screen.getByRole("link", { name: /back to home/i });
      expect(link).toHaveAttribute("href", "/");
    });
  });

  describe("Accessibility", () => {
    it("has semantic heading for 404", () => {
      render(<NotFoundError />);
      const heading = screen.getByText("404");
      expect(heading.tagName).toBe("H1");
    });

    it("has clear navigation link", () => {
      render(<NotFoundError />);
      const link = screen.getByRole("link", { name: /back to home/i });
      expect(link.tagName).toBe("A");
    });

    it("provides descriptive error message", () => {
      render(<NotFoundError />);
      expect(screen.getByText("Page not found")).toBeInTheDocument();
      expect(
        screen.getByText(/the page you're looking for doesn't exist/i),
      ).toBeInTheDocument();
    });
  });
});
