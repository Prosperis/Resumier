import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("renders correctly", () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveClass("custom-class");
  });

  it("handles multiline text input", async () => {
    const user = userEvent.setup();
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    await user.type(textarea, "Line 1{Enter}Line 2{Enter}Line 3");
    expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
  });

  it("calls onChange when value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    await user.type(textarea, "a");
    expect(handleChange).toHaveBeenCalled();
  });

  it("respects disabled state", async () => {
    const user = userEvent.setup();
    render(<Textarea disabled data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    expect(textarea).toBeDisabled();
    await user.type(textarea, "test");
    expect(textarea).toHaveValue("");
  });

  it("renders with value prop", () => {
    render(
      <Textarea
        value="Initial Value"
        onChange={() => {}}
        data-testid="textarea"
      />,
    );
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveValue("Initial Value");
  });

  it("applies aria-invalid attribute when invalid", () => {
    render(<Textarea aria-invalid={true} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("renders with data-slot attribute", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("data-slot", "textarea");
  });

  it("handles focus events", async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    render(<Textarea onFocus={handleFocus} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    await user.click(textarea);
    expect(handleFocus).toHaveBeenCalled();
  });

  it("handles blur events", async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();
    render(<Textarea onBlur={handleBlur} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    await user.click(textarea);
    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it("renders with required attribute", () => {
    render(<Textarea required data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toBeRequired();
  });

  it("renders with readonly attribute", () => {
    render(<Textarea readOnly data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("readonly");
  });

  it("renders with maxLength attribute", () => {
    render(<Textarea maxLength={100} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("maxLength", "100");
  });

  it("renders with rows attribute", () => {
    render(<Textarea rows={5} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("handles paste events", async () => {
    const user = userEvent.setup();
    const handlePaste = vi.fn();
    render(<Textarea onPaste={handlePaste} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    await user.click(textarea);
    await user.paste("Pasted text");
    expect(handlePaste).toHaveBeenCalled();
  });

  it("applies min-height styling", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveClass("min-h-[80px]");
  });

  it("supports controlled component pattern", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState("");
      return (
        <Textarea
          data-testid="textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    };

    const { default: React } = await import("react");
    render(<TestComponent />);
    const textarea = screen.getByTestId("textarea");

    await user.type(textarea, "test");
    expect(textarea).toHaveValue("test");
  });
});
