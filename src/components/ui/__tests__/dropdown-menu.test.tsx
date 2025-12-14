import { render, screen } from "@testing-library/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../dropdown-menu";

describe("DropdownMenu Components", () => {
  describe("DropdownMenu and Trigger", () => {
    it("renders DropdownMenu with trigger", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>,
      );
      expect(screen.getByText("Open Menu")).toBeInTheDocument();
    });

    it("renders trigger with custom children", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span>Custom Trigger</span>
          </DropdownMenuTrigger>
        </DropdownMenu>,
      );
      expect(screen.getByText("Custom Trigger")).toBeInTheDocument();
    });

    it("renders trigger as child", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button">Button Trigger</button>
          </DropdownMenuTrigger>
        </DropdownMenu>,
      );
      expect(screen.getByRole("button")).toHaveTextContent("Button Trigger");
    });
  });

  describe("DropdownMenuLabel", () => {
    it("renders label with text", () => {
      render(<DropdownMenuLabel>Section Label</DropdownMenuLabel>);
      expect(screen.getByText("Section Label")).toBeInTheDocument();
    });

    it("applies inset prop", () => {
      render(<DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>);
      const label = screen.getByText("Inset Label");
      expect(label.className).toContain("pl-8");
    });

    it("has data-slot attribute", () => {
      const { container } = render(<DropdownMenuLabel>Label</DropdownMenuLabel>);
      const label = container.querySelector('[data-slot="dropdown-menu-label"]');
      expect(label).toBeInTheDocument();
    });
  });

  describe("DropdownMenuSeparator", () => {
    it("renders separator", () => {
      const { container } = render(<DropdownMenuSeparator />);
      const separator = container.querySelector('[role="separator"]');
      expect(separator).toBeInTheDocument();
    });

    it("has correct styling", () => {
      const { container } = render(<DropdownMenuSeparator />);
      const separator = container.querySelector('[role="separator"]');
      expect(separator).toBeTruthy();
      expect(separator?.className).toContain("bg-border");
    });

    it("has data-slot attribute", () => {
      const { container } = render(<DropdownMenuSeparator />);
      const separator = container.querySelector('[data-slot="dropdown-menu-separator"]');
      expect(separator).toBeInTheDocument();
    });
  });

  describe("DropdownMenuShortcut", () => {
    it("renders shortcut text", () => {
      render(<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>);
      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("renders with multiple keyboard shortcuts", () => {
      render(<DropdownMenuShortcut>⌘⇧P</DropdownMenuShortcut>);
      expect(screen.getByText("⌘⇧P")).toBeInTheDocument();
    });

    it("has correct styling for muted appearance", () => {
      render(<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>);
      const shortcut = screen.getByText("⌘S");
      expect(shortcut.className).toContain("text-muted-foreground");
    });

    it("has data-slot attribute", () => {
      const { container } = render(<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>);
      const shortcut = container.querySelector('[data-slot="dropdown-menu-shortcut"]');
      expect(shortcut).toBeInTheDocument();
    });
  });

  describe("DropdownMenuContent Structure", () => {
    it("renders content within menu and portal", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuLabel>Content Label</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>,
      );
      expect(screen.getByText("Open")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("renders complete dropdown structure without errors", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        </DropdownMenu>,
      );
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("renders label and separator together", () => {
      const { container } = render(
        <div>
          <DropdownMenuLabel>Section</DropdownMenuLabel>
          <DropdownMenuSeparator />
        </div>,
      );
      expect(screen.getByText("Section")).toBeInTheDocument();
      expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
    });

    it("renders shortcut within structure", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>
            Menu <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
          </DropdownMenuTrigger>
        </DropdownMenu>,
      );
      expect(screen.getByText("Menu")).toBeInTheDocument();
      expect(screen.getByText("⌘M")).toBeInTheDocument();
    });
  });
});
