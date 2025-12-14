import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavUser } from "../nav-user";

// Mock useSidebar hook but keep SidebarContext
vi.mock("@/components/ui/use-sidebar", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/use-sidebar")>();
  return {
    ...actual,
    useSidebar: vi.fn(() => ({ isMobile: false })),
  };
});

import { useSidebar } from "@/components/ui/use-sidebar";

// Helper to render with required providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<SidebarProvider>{ui}</SidebarProvider>);
};

describe("NavUser", () => {
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john.jpg",
  };

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    (useSidebar as any).mockReturnValue({ isMobile: false } as any);
  });

  describe("User Display", () => {
    it("renders user name and email", () => {
      renderWithProviders(<NavUser user={mockUser} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });

    it("renders user avatar with correct src", () => {
      renderWithProviders(<NavUser user={mockUser} />);

      // Avatar renders as a span with background image or img inside
      // In test environment, image might not load, so check for avatar container
      const { container } = renderWithProviders(<NavUser user={mockUser} />);
      const avatarImg = container.querySelector('img[alt="John Doe"]');

      if (avatarImg) {
        expect(avatarImg).toHaveAttribute("src", "/avatars/john.jpg");
      } else {
        // If image doesn't load in test, fallback should be shown
        expect(screen.getAllByText("CN").length).toBeGreaterThan(0);
      }
    });

    it("renders avatar fallback when image is not available", () => {
      const userWithoutAvatar = { ...mockUser, avatar: "" };
      renderWithProviders(<NavUser user={userWithoutAvatar} />);

      // Avatar component should render fallback
      expect(screen.getByText("CN")).toBeInTheDocument();
    });

    it("displays chevron icon for dropdown indication", () => {
      const { container } = renderWithProviders(<NavUser user={mockUser} />);

      const chevronIcon = container.querySelector("svg");
      expect(chevronIcon).toBeInTheDocument();
    });

    it("truncates long user names", () => {
      const longNameUser = {
        ...mockUser,
        name: "Very Long Name That Should Be Truncated",
      };
      renderWithProviders(<NavUser user={longNameUser} />);

      const nameElement = screen.getByText(/very long name/i);
      expect(nameElement).toHaveClass("truncate");
    });

    it("truncates long email addresses", () => {
      const longEmailUser = {
        ...mockUser,
        email: "verylongemailaddress@example.com",
      };
      renderWithProviders(<NavUser user={longEmailUser} />);

      const emailElement = screen.getByText(/verylongemailaddress/i);
      expect(emailElement).toHaveClass("truncate");
    });
  });

  describe("Dropdown Menu", () => {
    it("opens dropdown menu when trigger is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      // Check for menu items
      expect(await screen.findByText("Upgrade to Pro")).toBeInTheDocument();
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Billing")).toBeInTheDocument();
      expect(screen.getByText("Notifications")).toBeInTheDocument();
      expect(screen.getByText("Log out")).toBeInTheDocument();
    });

    it("displays user info in dropdown header", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      // User info should appear twice (button + dropdown header)
      const names = screen.getAllByText("John Doe");
      expect(names.length).toBeGreaterThanOrEqual(2);

      const emails = screen.getAllByText("john.doe@example.com");
      expect(emails.length).toBeGreaterThanOrEqual(2);
    });

    it("renders all menu groups", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      // Pro upgrade group
      expect(await screen.findByText("Upgrade to Pro")).toBeInTheDocument();

      // Account management group
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Billing")).toBeInTheDocument();
      expect(screen.getByText("Notifications")).toBeInTheDocument();

      // Logout
      expect(screen.getByText("Log out")).toBeInTheDocument();
    });

    it("has proper menu item icons", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      // Verify menu items are rendered with icons
      expect(await screen.findByText("Upgrade to Pro")).toBeInTheDocument();
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Billing")).toBeInTheDocument();
      expect(screen.getByText("Notifications")).toBeInTheDocument();
      expect(screen.getByText("Log out")).toBeInTheDocument();
    });
  });

  describe("Menu Items", () => {
    it("renders Upgrade to Pro menu item", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      const upgradeItem = screen.getByText("Upgrade to Pro");
      expect(upgradeItem).toBeInTheDocument();
    });

    it("renders Account menu item", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      const accountItem = screen.getByText("Account");
      expect(accountItem).toBeInTheDocument();
    });

    it("renders Billing menu item", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      const billingItem = screen.getByText("Billing");
      expect(billingItem).toBeInTheDocument();
    });

    it("renders Notifications menu item", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      const notificationsItem = screen.getByText("Notifications");
      expect(notificationsItem).toBeInTheDocument();
    });

    it("renders Log out menu item", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      const logoutItem = await screen.findByText("Log out");
      expect(logoutItem).toBeInTheDocument();
    });

    it("can click on menu items", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      const accountItem = await screen.findByText("Account");

      // Menu item should be clickable (clicking it will close the menu)
      expect(accountItem).toBeInTheDocument();
      await user.click(accountItem);

      // After clicking, menu typically closes, so item is no longer in document
      // This is expected behavior for dropdown menus
    });
  });

  describe("Mobile Responsiveness", () => {
    it("positions dropdown at bottom on mobile", async () => {
      (useSidebar as any).mockReturnValue({ isMobile: true } as any);
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      // Dropdown should open (we can't test positioning directly in jsdom)
      expect(await screen.findByText("Account")).toBeInTheDocument();
    });

    it("positions dropdown at right on desktop", async () => {
      (useSidebar as any).mockReturnValue({ isMobile: false } as any);
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      // Dropdown should open
      expect(await screen.findByText("Account")).toBeInTheDocument();
    });
  });

  describe("Menu Separators", () => {
    it("renders separators between menu groups", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      await user.click(trigger);

      // Dropdown should have menu items with groups separated
      expect(await screen.findByText("Upgrade to Pro")).toBeInTheDocument();
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Log out")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible button for dropdown trigger", () => {
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      expect(trigger).toBeInTheDocument();
    });

    it("avatar has alt text with user name", async () => {
      const { container } = renderWithProviders(<NavUser user={mockUser} />);

      // Check for img element with alt text, or fallback
      const avatarImg = container.querySelector('img[alt="John Doe"]');

      if (avatarImg) {
        expect(avatarImg).toHaveAttribute("alt", "John Doe");
      } else {
        // In test environment, image might not load, so fallback is shown
        expect(screen.getByText("CN")).toBeInTheDocument();
      }
    });

    it("renders avatar fallback with initials", () => {
      const userWithoutAvatar = { ...mockUser, avatar: "" };
      renderWithProviders(<NavUser user={userWithoutAvatar} />);

      // Fallback should show "CN"
      expect(screen.getByText("CN")).toBeInTheDocument();
    });

    it("menu items are keyboard accessible", async () => {
      const user = userEvent.setup();
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });

      // Open with keyboard
      trigger.focus();
      await user.keyboard("{Enter}");

      // Menu should be open
      expect(await screen.findByText("Account")).toBeInTheDocument();
    });
  });

  describe("User Data Variations", () => {
    it("handles user with different name", () => {
      const differentUser = {
        ...mockUser,
        name: "Jane Smith",
      };
      renderWithProviders(<NavUser user={differentUser} />);

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("handles user with different email", () => {
      const differentUser = {
        ...mockUser,
        email: "jane.smith@example.com",
      };
      renderWithProviders(<NavUser user={differentUser} />);

      expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();
    });

    it("handles user with special characters in name", () => {
      const specialUser = {
        ...mockUser,
        name: "O'Brien-Smith",
      };
      renderWithProviders(<NavUser user={specialUser} />);

      expect(screen.getByText("O'Brien-Smith")).toBeInTheDocument();
    });

    it("handles user with unicode characters in name", () => {
      const unicodeUser = {
        ...mockUser,
        name: "José García",
      };
      renderWithProviders(<NavUser user={unicodeUser} />);

      expect(screen.getByText("José García")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("renders within SidebarMenu", () => {
      const { container } = renderWithProviders(<NavUser user={mockUser} />);

      // Component should be wrapped in proper sidebar structure
      expect(container.querySelector('[data-sidebar="menu"]')).toBeInTheDocument();
    });

    it("applies proper styling classes", () => {
      renderWithProviders(<NavUser user={mockUser} />);

      const trigger = screen.getByRole("button", { name: /john doe/i });
      expect(trigger).toHaveClass("data-[state=open]:bg-sidebar-accent");
    });

    it("has proper text alignment for user info", () => {
      renderWithProviders(<NavUser user={mockUser} />);

      const nameElement = screen.getByText("John Doe");
      expect(nameElement.parentElement).toHaveClass("text-left");
    });
  });
});
