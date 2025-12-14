import { render } from "@testing-library/react";
import { vi } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders children", () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText("Click me")).toBeInTheDocument();
  });
  it("applies variant classes correctly", () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-destructive");
  });
  it("applies size classes correctly", () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("h-8");
  });
  it("supports rendering as child element with asChild", () => {
    const { container } = render(
      <Button asChild>
        <a href="https://example.com">Link</a>
      </Button>,
    );
    const anchor = container.querySelector("a");
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "https://example.com");
  });
  it("handles click events", () => {
    const handleClick = vi.fn();
    const { getByText } = render(<Button onClick={handleClick}>Click me</Button>);
    getByText("Click me").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it("is disabled when disabled prop is true", () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector("button");
    expect(button).toBeDisabled();
  });
});
