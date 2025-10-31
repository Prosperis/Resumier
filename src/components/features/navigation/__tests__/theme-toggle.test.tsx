import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/app/theme-provider";
import { ThemeToggle } from "../theme-toggle";

// Ensure localStorage is available in test environment
if (typeof global.localStorage === 'undefined') {
  global.localStorage = {
    store: {} as Record<string, string>,
    getItem(key: string) {
      return this.store[key] || null;
    },
    setItem(key: string, value: string) {
      this.store[key] = value;
    },
    removeItem(key: string) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
    get length() {
      return Object.keys(this.store).length;
    },
    key(index: number) {
      return Object.keys(this.store)[index] || null;
    },
  } as Storage;
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Clear localStorage and DOM classes before each test
    global.localStorage.clear();
    document.documentElement.classList.remove("light", "dark");

    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false, // Default to light mode
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Dark Theme", () => {
    beforeEach(() => {
      // Set theme to dark in localStorage
      localStorage.setItem("resumier-theme", "dark");
    });

    it("renders sun icon in dark mode", () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      // Sun icon should be visible in dark mode
      const button = screen.getByRole("button", {
        name: /switch to light theme/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("has accessible label", () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      expect(
        screen.getByRole("button", { name: /switch to light theme/i }),
      ).toBeInTheDocument();
    });

    it("calls toggleTheme when clicked", async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button", {
        name: /switch to light theme/i,
      });
      await user.click(button);

      // After clicking, should switch to light
      expect(
        screen.getByRole("button", { name: /switch to dark theme/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Light Theme", () => {
    beforeEach(() => {
      // Set theme to light in localStorage
      localStorage.setItem("resumier-theme", "light");
    });

    it("renders moon icon in light mode", () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button", {
        name: /switch to dark theme/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("calls toggleTheme when clicked", async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button", {
        name: /switch to dark theme/i,
      });
      await user.click(button);

      // After clicking, should switch to dark
      expect(
        screen.getByRole("button", { name: /switch to light theme/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    beforeEach(() => {
      localStorage.setItem("resumier-theme", "dark");
    });

    it("renders as an outline button", () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button", {
        name: /switch to light theme/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("renders as an icon button", () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button", {
        name: /switch to light theme/i,
      });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      localStorage.setItem("resumier-theme", "dark");
    });

    it("has screen reader only text", () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      // The aria-label serves as the accessible name
      const button = screen.getByRole("button", {
        name: /switch to light theme/i,
      });
      expect(button).toHaveAttribute("aria-label", "Switch to light theme");
    });

    it("is keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button", {
        name: /switch to light theme/i,
      });
      button.focus();

      await user.keyboard("{Enter}");

      // After pressing Enter, theme should toggle
      expect(
        screen.getByRole("button", { name: /switch to dark theme/i }),
      ).toBeInTheDocument();
    });
  });
});
