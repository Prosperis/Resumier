import { render, screen } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("Separator", () => {
  it("renders correctly", () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
  });

  it("renders with horizontal orientation by default", () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders with vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("is decorative by default", () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toHaveAttribute("data-orientation");
    // Decorative separators have role="none"
    expect(separator).toHaveAttribute("role", "none");
  });

  it("can be non-decorative", () => {
    render(<Separator decorative={false} />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Separator className="my-custom-class" />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toHaveClass("my-custom-class");
  });

  it("has correct default styles for horizontal", () => {
    const { container } = render(<Separator orientation="horizontal" />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toHaveClass("shrink-0");
    expect(separator).toHaveClass("bg-border");
  });

  it("has correct default styles for vertical", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toHaveClass("shrink-0");
    expect(separator).toHaveClass("bg-border");
  });

  it("forwards additional props", () => {
    render(<Separator data-testid="custom-separator" />);
    const separator = screen.getByTestId("custom-separator");
    expect(separator).toBeInTheDocument();
  });

  it("renders within a layout", () => {
    const { container } = render(
      <div>
        <div>Content above</div>
        <Separator />
        <div>Content below</div>
      </div>,
    );
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
  });

  it("can be used multiple times", () => {
    render(
      <div>
        <Separator data-testid="sep-1" />
        <Separator data-testid="sep-2" />
        <Separator data-testid="sep-3" />
      </div>,
    );
    expect(screen.getByTestId("sep-1")).toBeInTheDocument();
    expect(screen.getByTestId("sep-2")).toBeInTheDocument();
    expect(screen.getByTestId("sep-3")).toBeInTheDocument();
  });
});
