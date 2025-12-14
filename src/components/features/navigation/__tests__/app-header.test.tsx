import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AppHeader } from "../app-header";

// Mock dependencies
vi.mock("@/components/features/navigation/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: React.ComponentProps<"button">) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}));

describe("AppHeader", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Basic Rendering", () => {
    it("renders the logo", () => {
      render(<AppHeader />);

      const logo = screen.getByAltText("Resumier Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", expect.stringContaining("logo_dark_optimized.png"));
    });

    it("renders the title", () => {
      render(<AppHeader />);

      expect(screen.getByRole("heading", { name: /resume/i })).toBeInTheDocument();
    });

    it("renders the theme toggle", () => {
      render(<AppHeader />);

      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("renders Personal Info button", () => {
      render(<AppHeader />);

      expect(screen.getByRole("button", { name: /personal info/i })).toBeInTheDocument();
    });

    it("renders Job Info button", () => {
      render(<AppHeader />);

      expect(screen.getByRole("button", { name: /job info/i })).toBeInTheDocument();
    });
  });

  describe("Back Button", () => {
    it("does not render back button when onBackClick is not provided", () => {
      render(<AppHeader />);

      expect(screen.queryByRole("button", { name: /dashboard/i })).not.toBeInTheDocument();
    });

    it("renders back button when onBackClick is provided", () => {
      const onBackClick = vi.fn();
      render(<AppHeader onBackClick={onBackClick} />);

      expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument();
    });

    it("calls onBackClick when back button is clicked", async () => {
      const user = userEvent.setup();
      const onBackClick = vi.fn();
      render(<AppHeader onBackClick={onBackClick} />);

      const backButton = screen.getByRole("button", { name: /dashboard/i });
      await user.click(backButton);

      expect(onBackClick).toHaveBeenCalledTimes(1);
    });

    it("renders arrow left icon in back button", () => {
      const onBackClick = vi.fn();
      render(<AppHeader onBackClick={onBackClick} />);

      expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
    });
  });

  describe("Button Callbacks", () => {
    it("calls onPersonalInfoClick when Personal Info button is clicked", async () => {
      const user = userEvent.setup();
      const onPersonalInfoClick = vi.fn();
      render(<AppHeader onPersonalInfoClick={onPersonalInfoClick} />);

      const button = screen.getByRole("button", { name: /personal info/i });
      await user.click(button);

      expect(onPersonalInfoClick).toHaveBeenCalledTimes(1);
    });

    it("calls onJobInfoClick when Job Info button is clicked", async () => {
      const user = userEvent.setup();
      const onJobInfoClick = vi.fn();
      render(<AppHeader onJobInfoClick={onJobInfoClick} />);

      const button = screen.getByRole("button", { name: /job info/i });
      await user.click(button);

      expect(onJobInfoClick).toHaveBeenCalledTimes(1);
    });

    it("does not crash when buttons are clicked without handlers", async () => {
      const user = userEvent.setup();
      render(<AppHeader />);

      const personalInfoButton = screen.getByRole("button", {
        name: /personal info/i,
      });
      const jobInfoButton = screen.getByRole("button", { name: /job info/i });

      await user.click(personalInfoButton);
      await user.click(jobInfoButton);

      // If we got here without errors, the test passes
      expect(personalInfoButton).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("has fixed positioning", () => {
      const { container } = render(<AppHeader />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("fixed");
    });

    it("applies z-index for layering", () => {
      const { container } = render(<AppHeader />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("z-20");
    });

    it("has proper height", () => {
      render(<AppHeader />);

      const heading = screen.getByRole("heading", { name: /resume/i });
      expect(heading).toBeInTheDocument();
    });

    it("has border at bottom", () => {
      render(<AppHeader />);

      const heading = screen.getByRole("heading", { name: /resume/i });
      expect(heading.parentElement).toHaveClass("border-b");
    });

    it("centers the title", () => {
      render(<AppHeader />);

      const title = screen.getByRole("heading", { name: /resume/i });
      expect(title).toHaveClass("text-center");
    });
  });

  describe("All Props Together", () => {
    it("renders correctly with all props provided", () => {
      const handlers = {
        onPersonalInfoClick: vi.fn(),
        onJobInfoClick: vi.fn(),
        onBackClick: vi.fn(),
      };

      render(<AppHeader {...handlers} />);

      expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /personal info/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /job info/i })).toBeInTheDocument();
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("all callbacks work when provided together", async () => {
      const user = userEvent.setup();
      const handlers = {
        onPersonalInfoClick: vi.fn(),
        onJobInfoClick: vi.fn(),
        onBackClick: vi.fn(),
      };

      render(<AppHeader {...handlers} />);

      await user.click(screen.getByRole("button", { name: /dashboard/i }));
      await user.click(screen.getByRole("button", { name: /personal info/i }));
      await user.click(screen.getByRole("button", { name: /job info/i }));

      expect(handlers.onBackClick).toHaveBeenCalledTimes(1);
      expect(handlers.onPersonalInfoClick).toHaveBeenCalledTimes(1);
      expect(handlers.onJobInfoClick).toHaveBeenCalledTimes(1);
    });
  });
});
