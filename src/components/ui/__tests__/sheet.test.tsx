import { render, screen } from "@testing-library/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet";

describe("Sheet Components", () => {
  describe("Sheet", () => {
    it("renders sheet root with trigger", () => {
      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
        </Sheet>,
      );
      expect(screen.getByText("Open")).toBeInTheDocument();
    });

    it("renders sheet with controlled open state", () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open</SheetTrigger>
        </Sheet>,
      );
      expect(screen.getByText("Open")).toBeInTheDocument();
    });
  });

  describe("SheetTrigger", () => {
    it("renders trigger button", () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
        </Sheet>,
      );
      expect(screen.getByText("Open Sheet")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <Sheet>
          <SheetTrigger>Trigger</SheetTrigger>
        </Sheet>,
      );
      const trigger = container.querySelector('[data-slot="sheet-trigger"]');
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("SheetClose", () => {
    it("renders close button", () => {
      render(
        <Sheet>
          <SheetClose>Close</SheetClose>
        </Sheet>,
      );
      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <Sheet>
          <SheetClose>Close</SheetClose>
        </Sheet>,
      );
      const close = container.querySelector('[data-slot="sheet-close"]');
      expect(close).toBeInTheDocument();
    });
  });

  describe("SheetHeader", () => {
    it("renders header with children", () => {
      render(<SheetHeader>Header Content</SheetHeader>);
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<SheetHeader>Header</SheetHeader>);
      const header = container.querySelector('[data-slot="sheet-header"]');
      expect(header).toBeInTheDocument();
    });

    it("applies flex layout classes", () => {
      const { container } = render(<SheetHeader>Header</SheetHeader>);
      const header = container.querySelector("div");
      expect(header?.className).toContain("flex");
      expect(header?.className).toContain("flex-col");
    });

    it("renders with custom className", () => {
      const { container } = render(<SheetHeader className="custom-header">Header</SheetHeader>);
      const header = container.querySelector("div");
      expect(header).toHaveClass("custom-header");
    });
  });

  describe("SheetFooter", () => {
    it("renders footer with children", () => {
      render(<SheetFooter>Footer Content</SheetFooter>);
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<SheetFooter>Footer</SheetFooter>);
      const footer = container.querySelector('[data-slot="sheet-footer"]');
      expect(footer).toBeInTheDocument();
    });

    it("applies flex layout classes", () => {
      const { container } = render(<SheetFooter>Footer</SheetFooter>);
      const footer = container.querySelector("div");
      expect(footer?.className).toContain("flex");
      expect(footer?.className).toContain("flex-col");
    });

    it("applies mt-auto class", () => {
      const { container } = render(<SheetFooter>Footer</SheetFooter>);
      const footer = container.querySelector("div");
      expect(footer?.className).toContain("mt-auto");
    });

    it("renders with custom className", () => {
      const { container } = render(<SheetFooter className="custom-footer">Footer</SheetFooter>);
      const footer = container.querySelector("div");
      expect(footer).toHaveClass("custom-footer");
    });
  });

  describe("SheetTitle", () => {
    it("renders title text", () => {
      render(
        <Sheet>
          <SheetTitle>Sheet Title</SheetTitle>
        </Sheet>,
      );
      expect(screen.getByText("Sheet Title")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <Sheet>
          <SheetTitle>Title</SheetTitle>
        </Sheet>,
      );
      const title = container.querySelector('[data-slot="sheet-title"]');
      expect(title).toBeInTheDocument();
    });

    it("applies font semibold class", () => {
      render(
        <Sheet>
          <SheetTitle>Title</SheetTitle>
        </Sheet>,
      );
      const title = screen.getByText("Title");
      expect(title.className).toContain("font-semibold");
    });

    it("renders with custom className", () => {
      render(
        <Sheet>
          <SheetTitle className="custom-title">Title</SheetTitle>
        </Sheet>,
      );
      const title = screen.getByText("Title");
      expect(title).toHaveClass("custom-title");
    });
  });

  describe("SheetDescription", () => {
    it("renders description text", () => {
      render(
        <Sheet>
          <SheetDescription>This is a description</SheetDescription>
        </Sheet>,
      );
      expect(screen.getByText("This is a description")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <Sheet>
          <SheetDescription>Description</SheetDescription>
        </Sheet>,
      );
      const desc = container.querySelector('[data-slot="sheet-description"]');
      expect(desc).toBeInTheDocument();
    });

    it("applies muted text color", () => {
      render(
        <Sheet>
          <SheetDescription>Description</SheetDescription>
        </Sheet>,
      );
      const desc = screen.getByText("Description");
      expect(desc.className).toContain("text-muted-foreground");
    });

    it("applies small text size", () => {
      render(
        <Sheet>
          <SheetDescription>Description</SheetDescription>
        </Sheet>,
      );
      const desc = screen.getByText("Description");
      expect(desc.className).toContain("text-sm");
    });

    it("renders with custom className", () => {
      render(
        <Sheet>
          <SheetDescription className="custom-desc">Description</SheetDescription>
        </Sheet>,
      );
      const desc = screen.getByText("Description");
      expect(desc).toHaveClass("custom-desc");
    });
  });

  describe("Complete Sheet Example", () => {
    it("renders complete sheet structure", () => {
      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description text</SheetDescription>
            </SheetHeader>
            <div>Sheet content goes here</div>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>,
      );

      expect(screen.getByText("Open")).toBeInTheDocument();
    });
  });
});
