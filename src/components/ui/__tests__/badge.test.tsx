import { render } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders badge with default variant", () => {
    const { getByText } = render(<Badge>Default</Badge>);
    const badge = getByText("Default");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary");
  });
  it("applies variant classes correctly", () => {
    const { getByText } = render(<Badge variant="destructive">Alert</Badge>);
    const badge = getByText("Alert");
    expect(badge).toHaveClass("bg-destructive");
  });
  it("applies secondary variant", () => {
    const { getByText } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = getByText("Secondary");
    expect(badge).toHaveClass("bg-secondary");
  });
  it("applies outline variant", () => {
    const { getByText } = render(<Badge variant="outline">Outline</Badge>);
    const badge = getByText("Outline");
    expect(badge).toHaveClass("border");
  });
  it("renders as child element when asChild is true", () => {
    const { container } = render(
      <Badge asChild>
        <a href="https://example.com">Link</a>
      </Badge>,
    );
    const anchor = container.querySelector("a");
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "https://example.com");
  });
  it("supports animated prop", () => {
    const { getByText } = render(<Badge animated>Animated</Badge>);
    const badge = getByText("Animated");
    expect(badge).toBeInTheDocument();
  });
  it("applies custom className", () => {
    const { getByText } = render(<Badge className="custom-class">Custom</Badge>);
    const badge = getByText("Custom");
    expect(badge).toHaveClass("custom-class");
  });
});
