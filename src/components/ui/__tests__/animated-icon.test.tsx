import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  BounceOnHover,
  PulseOnHover,
  RotateOnHover,
  ScaleOnHover,
  ShakeOnHover,
  SpinOnClick,
} from "@/components/ui/animated-icon";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock useReducedMotion
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

describe("RotateOnHover", () => {
  it("renders children", () => {
    render(
      <RotateOnHover>
        <span>Icon</span>
      </RotateOnHover>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("applies inline-flex class", () => {
    const { container } = render(
      <RotateOnHover>
        <span>Icon</span>
      </RotateOnHover>,
    );
    expect(container.firstChild).toHaveClass("inline-flex");
  });

  it("applies custom className", () => {
    const { container } = render(
      <RotateOnHover className="custom-rotate">
        <span>Icon</span>
      </RotateOnHover>,
    );
    expect(container.firstChild).toHaveClass("custom-rotate");
  });

  it("passes through additional props", () => {
    const { container } = render(
      <RotateOnHover data-testid="rotate-icon">
        <span>Icon</span>
      </RotateOnHover>,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "rotate-icon");
  });
});

describe("ScaleOnHover", () => {
  it("renders children", () => {
    render(
      <ScaleOnHover>
        <span>Icon</span>
      </ScaleOnHover>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("applies inline-flex class", () => {
    const { container } = render(
      <ScaleOnHover>
        <span>Icon</span>
      </ScaleOnHover>,
    );
    expect(container.firstChild).toHaveClass("inline-flex");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ScaleOnHover className="custom-scale">
        <span>Icon</span>
      </ScaleOnHover>,
    );
    expect(container.firstChild).toHaveClass("custom-scale");
  });

  it("accepts custom scale prop", () => {
    render(
      <ScaleOnHover scale={1.5}>
        <span>Icon</span>
      </ScaleOnHover>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("uses default scale of 1.1", () => {
    render(
      <ScaleOnHover>
        <span>Icon</span>
      </ScaleOnHover>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    const { container } = render(
      <ScaleOnHover data-testid="scale-icon">
        <span>Icon</span>
      </ScaleOnHover>,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "scale-icon");
  });
});

describe("BounceOnHover", () => {
  it("renders children", () => {
    render(
      <BounceOnHover>
        <span>Icon</span>
      </BounceOnHover>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("applies inline-flex class", () => {
    const { container } = render(
      <BounceOnHover>
        <span>Icon</span>
      </BounceOnHover>,
    );
    expect(container.firstChild).toHaveClass("inline-flex");
  });

  it("applies custom className", () => {
    const { container } = render(
      <BounceOnHover className="custom-bounce">
        <span>Icon</span>
      </BounceOnHover>,
    );
    expect(container.firstChild).toHaveClass("custom-bounce");
  });

  it("passes through additional props", () => {
    const { container } = render(
      <BounceOnHover data-testid="bounce-icon">
        <span>Icon</span>
      </BounceOnHover>,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "bounce-icon");
  });
});

describe("ShakeOnHover", () => {
  it("renders children", () => {
    render(
      <ShakeOnHover>
        <span>Icon</span>
      </ShakeOnHover>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("applies inline-flex class", () => {
    const { container } = render(
      <ShakeOnHover>
        <span>Icon</span>
      </ShakeOnHover>,
    );
    expect(container.firstChild).toHaveClass("inline-flex");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ShakeOnHover className="custom-shake">
        <span>Icon</span>
      </ShakeOnHover>,
    );
    expect(container.firstChild).toHaveClass("custom-shake");
  });

  it("passes through additional props", () => {
    const { container } = render(
      <ShakeOnHover data-testid="shake-icon">
        <span>Icon</span>
      </ShakeOnHover>,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "shake-icon");
  });
});

describe("PulseOnHover", () => {
  it("renders children", () => {
    render(
      <PulseOnHover>
        <span>Icon</span>
      </PulseOnHover>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("applies inline-flex class", () => {
    const { container } = render(
      <PulseOnHover>
        <span>Icon</span>
      </PulseOnHover>,
    );
    expect(container.firstChild).toHaveClass("inline-flex");
  });

  it("applies custom className", () => {
    const { container } = render(
      <PulseOnHover className="custom-pulse">
        <span>Icon</span>
      </PulseOnHover>,
    );
    expect(container.firstChild).toHaveClass("custom-pulse");
  });

  it("passes through additional props", () => {
    const { container } = render(
      <PulseOnHover data-testid="pulse-icon">
        <span>Icon</span>
      </PulseOnHover>,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "pulse-icon");
  });
});

describe("SpinOnClick", () => {
  it("renders children", () => {
    render(
      <SpinOnClick>
        <span>Icon</span>
      </SpinOnClick>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("applies inline-flex class", () => {
    const { container } = render(
      <SpinOnClick>
        <span>Icon</span>
      </SpinOnClick>,
    );
    expect(container.firstChild).toHaveClass("inline-flex");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SpinOnClick className="custom-spin">
        <span>Icon</span>
      </SpinOnClick>,
    );
    expect(container.firstChild).toHaveClass("custom-spin");
  });

  it("passes through additional props", () => {
    const { container } = render(
      <SpinOnClick data-testid="spin-icon">
        <span>Icon</span>
      </SpinOnClick>,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "spin-icon");
  });
});
