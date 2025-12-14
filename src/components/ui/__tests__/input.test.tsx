import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<Input className="custom-class" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-class");
  });

  it("renders with correct type", () => {
    render(<Input type="email" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "email");
  });

  it("handles text input", async () => {
    const user = userEvent.setup();
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");

    await user.type(input, "Hello World");
    expect(input).toHaveValue("Hello World");
  });

  it("calls onChange when value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    const input = screen.getByTestId("input");

    await user.type(input, "a");
    expect(handleChange).toHaveBeenCalled();
  });

  it("respects disabled state", async () => {
    const user = userEvent.setup();
    render(<Input disabled data-testid="input" />);
    const input = screen.getByTestId("input");

    expect(input).toBeDisabled();
    await user.type(input, "test");
    expect(input).toHaveValue("");
  });

  it("renders with value prop", () => {
    render(<Input value="Initial Value" onChange={() => {}} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveValue("Initial Value");
  });

  it("applies aria-invalid attribute when invalid", () => {
    render(<Input aria-invalid={true} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders with data-slot attribute", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("handles focus events", async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} data-testid="input" />);
    const input = screen.getByTestId("input");

    await user.click(input);
    expect(handleFocus).toHaveBeenCalled();
  });

  it("handles blur events", async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} data-testid="input" />);
    const input = screen.getByTestId("input");

    await user.click(input);
    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it("renders with different input types", () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "text");

    rerender(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "password");

    rerender(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "number");
  });

  it("renders with required attribute", () => {
    render(<Input required data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toBeRequired();
  });

  it("renders with readonly attribute", () => {
    render(<Input readOnly data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("readonly");
  });

  it("renders with maxLength attribute", () => {
    render(<Input maxLength={10} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("renders with min and max for number inputs", () => {
    render(<Input type="number" min={0} max={100} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });
});
