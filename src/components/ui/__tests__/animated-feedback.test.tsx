import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  CountUp,
  ErrorCross,
  ErrorShake,
  SuccessCheckmark,
  WarningPulse,
} from "@/components/ui/animated-feedback";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

// Mock useReducedMotion
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Check: () => <svg data-testid="check-icon" />,
  X: () => <svg data-testid="x-icon" />,
  AlertCircle: () => <svg data-testid="alert-circle-icon" />,
}));

describe("SuccessCheckmark", () => {
  it("renders with default medium size", () => {
    const { container } = render(<SuccessCheckmark />);
    expect(container.querySelector(".h-8")).toBeInTheDocument();
  });

  it("renders with small size", () => {
    const { container } = render(<SuccessCheckmark size="sm" />);
    expect(container.querySelector(".h-4")).toBeInTheDocument();
  });

  it("renders with large size", () => {
    const { container } = render(<SuccessCheckmark size="lg" />);
    expect(container.querySelector(".h-12")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<SuccessCheckmark className="custom-check" />);
    expect(container.firstChild).toHaveClass("custom-check");
  });

  it("renders Check icon", () => {
    render(<SuccessCheckmark />);
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("has green background", () => {
    const { container } = render(<SuccessCheckmark />);
    expect(container.querySelector(".bg-green-500")).toBeInTheDocument();
  });

  it("is rounded", () => {
    const { container } = render(<SuccessCheckmark />);
    expect(container.querySelector(".rounded-full")).toBeInTheDocument();
  });
});

describe("ErrorShake", () => {
  it("renders children", () => {
    render(
      <ErrorShake>
        <div>Error Content</div>
      </ErrorShake>
    );
    expect(screen.getByText("Error Content")).toBeInTheDocument();
  });

  it("renders with trigger false by default", () => {
    render(
      <ErrorShake>
        <div>Content</div>
      </ErrorShake>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders with trigger true", () => {
    render(
      <ErrorShake trigger={true}>
        <div>Shaking Content</div>
      </ErrorShake>
    );
    expect(screen.getByText("Shaking Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ErrorShake className="shake-custom">
        <div>Content</div>
      </ErrorShake>
    );
    expect(container.firstChild).toHaveClass("shake-custom");
  });

  it("wraps children in motion div", () => {
    const { container } = render(
      <ErrorShake>
        <span>Test</span>
      </ErrorShake>
    );
    expect(container.querySelector("div")).toBeInTheDocument();
  });
});

describe("ErrorCross", () => {
  it("renders with default medium size", () => {
    const { container } = render(<ErrorCross />);
    expect(container.querySelector(".h-8")).toBeInTheDocument();
  });

  it("renders with small size", () => {
    const { container } = render(<ErrorCross size="sm" />);
    expect(container.querySelector(".h-4")).toBeInTheDocument();
  });

  it("renders with large size", () => {
    const { container } = render(<ErrorCross size="lg" />);
    expect(container.querySelector(".h-12")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ErrorCross className="custom-cross" />);
    expect(container.firstChild).toHaveClass("custom-cross");
  });

  it("renders X icon", () => {
    render(<ErrorCross />);
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  it("has destructive background", () => {
    const { container } = render(<ErrorCross />);
    expect(container.querySelector(".bg-destructive")).toBeInTheDocument();
  });

  it("is rounded", () => {
    const { container } = render(<ErrorCross />);
    expect(container.querySelector(".rounded-full")).toBeInTheDocument();
  });
});

describe("WarningPulse", () => {
  it("renders with default medium size", () => {
    const { container } = render(<WarningPulse />);
    expect(container.querySelector(".h-8")).toBeInTheDocument();
  });

  it("renders with small size", () => {
    const { container } = render(<WarningPulse size="sm" />);
    expect(container.querySelector(".h-4")).toBeInTheDocument();
  });

  it("renders with large size", () => {
    const { container } = render(<WarningPulse size="lg" />);
    expect(container.querySelector(".h-12")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<WarningPulse className="custom-warning" />);
    expect(container.firstChild).toHaveClass("custom-warning");
  });

  it("renders AlertCircle icon", () => {
    render(<WarningPulse />);
    expect(screen.getByTestId("alert-circle-icon")).toBeInTheDocument();
  });

  it("has yellow background", () => {
    const { container } = render(<WarningPulse />);
    expect(container.querySelector(".bg-yellow-500")).toBeInTheDocument();
  });

  it("is rounded", () => {
    const { container } = render(<WarningPulse />);
    expect(container.querySelector(".rounded-full")).toBeInTheDocument();
  });
});

describe("CountUp", () => {
  it("renders value", () => {
    render(<CountUp value={100} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders with default duration", () => {
    render(<CountUp value={50} />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders with custom duration", () => {
    render(<CountUp value={75} duration={2} />);
    expect(screen.getByText("75")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CountUp value={25} className="count-custom" />);
    expect(container.querySelector(".count-custom")).toBeInTheDocument();
  });

  it("renders zero value", () => {
    render(<CountUp value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders large numbers", () => {
    render(<CountUp value={999999} />);
    expect(screen.getByText("999999")).toBeInTheDocument();
  });

  it("renders negative numbers", () => {
    render(<CountUp value={-50} />);
    expect(screen.getByText("-50")).toBeInTheDocument();
  });
});
