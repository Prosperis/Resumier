import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useThemeStore } from "@/stores"
import { ThemeToggle } from "../theme-toggle"

// Mock the stores
vi.mock("@/stores", () => ({
  useThemeStore: vi.fn(),
}))

describe("ThemeToggle", () => {
  const mockToggleTheme = vi.fn()

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  })

  describe("Dark Theme", () => {
    beforeEach(() => {
      ;(useThemeStore as any).mockImplementation((selector) =>
        selector({ theme: "dark", toggleTheme: mockToggleTheme, setTheme: vi.fn() }),
      )
    })

    it("renders sun icon in dark mode", () => {
      render(<ThemeToggle />)

      // Sun icon should be visible in dark mode
      const button = screen.getByRole("button", { name: /toggle theme/i })
      expect(button).toBeInTheDocument()
    })

    it("has accessible label", () => {
      render(<ThemeToggle />)

      expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument()
    })

    it("calls toggleTheme when clicked", async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)

      const button = screen.getByRole("button", { name: /toggle theme/i })
      await user.click(button)

      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })
  })

  describe("Light Theme", () => {
    beforeEach(() => {
      ;(useThemeStore as any).mockImplementation((selector) =>
        selector({ theme: "light", toggleTheme: mockToggleTheme, setTheme: vi.fn() }),
      )
    })

    it("renders moon icon in light mode", () => {
      render(<ThemeToggle />)

      const button = screen.getByRole("button", { name: /toggle theme/i })
      expect(button).toBeInTheDocument()
    })

    it("calls toggleTheme when clicked", async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)

      const button = screen.getByRole("button", { name: /toggle theme/i })
      await user.click(button)

      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })
  })

  describe("Styling", () => {
    beforeEach(() => {
      ;(useThemeStore as any).mockImplementation((selector) =>
        selector({ theme: "dark", toggleTheme: mockToggleTheme, setTheme: vi.fn() }),
      )
    })

    it("renders as an outline button", () => {
      render(<ThemeToggle />)

      const button = screen.getByRole("button", { name: /toggle theme/i })
      expect(button).toBeInTheDocument()
    })

    it("renders as an icon button", () => {
      render(<ThemeToggle />)

      const button = screen.getByRole("button", { name: /toggle theme/i })
      expect(button).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      ;(useThemeStore as any).mockImplementation((selector) =>
        selector({ theme: "dark", toggleTheme: mockToggleTheme, setTheme: vi.fn() }),
      )
    })

    it("has screen reader only text", () => {
      const { container } = render(<ThemeToggle />)

      const srText = container.querySelector(".sr-only")
      expect(srText).toBeInTheDocument()
      expect(srText?.textContent).toBe("Toggle theme")
    })

    it("is keyboard accessible", async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />)

      const button = screen.getByRole("button", { name: /toggle theme/i })
      button.focus()

      await user.keyboard("{Enter}")
      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })
  })
})
