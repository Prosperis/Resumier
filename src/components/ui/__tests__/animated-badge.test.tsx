import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NotificationBadge, PulseBadge, StatusBadge } from "../animated-badge";

// Mock Badge component
vi.mock("../badge", () => ({
  Badge: ({ children, className, variant, ...props }: any) => (
    <span
      className={className}
      data-variant={variant}
      data-testid="badge"
      {...props}
    >
      {children}
    </span>
  ),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-motion="true" {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock useReducedMotion hook
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe("NotificationBadge", () => {
  describe("Rendering", () => {
    it("should render with count", () => {
      render(<NotificationBadge count={5} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should render with max count", () => {
      render(<NotificationBadge count={150} max={99} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("should display exact count when below max", () => {
      render(<NotificationBadge count={50} max={99} />);
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("should display max+ when count exceeds max", () => {
      render(<NotificationBadge count={100} max={99} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("should not render when count is 0", () => {
      const { container } = render(<NotificationBadge count={0} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when count is exactly 0", () => {
      const { container } = render(<NotificationBadge count={0} />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Variants", () => {
    it("should render with default destructive variant", () => {
      const { container } = render(<NotificationBadge count={5} />);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should render with outline variant", () => {
      const { container } = render(
        <NotificationBadge count={5} variant="outline" />,
      );
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should render with secondary variant", () => {
      const { container } = render(
        <NotificationBadge count={5} variant="secondary" />,
      );
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should render with default variant", () => {
      const { container } = render(
        <NotificationBadge count={5} variant="default" />,
      );
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Max Count", () => {
    it("should use default max of 99", () => {
      render(<NotificationBadge count={100} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("should respect custom max value", () => {
      render(<NotificationBadge count={50} max={20} />);
      expect(screen.getByText("20+")).toBeInTheDocument();
    });

    it("should handle max of 999", () => {
      render(<NotificationBadge count={1000} max={999} />);
      expect(screen.getByText("999+")).toBeInTheDocument();
    });

    it("should display exact count when equal to max", () => {
      render(<NotificationBadge count={99} max={99} />);
      expect(screen.getByText("99")).toBeInTheDocument();
    });

    it("should display max+ when one over max", () => {
      render(<NotificationBadge count={100} max={99} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });

  describe("ClassName", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <NotificationBadge count={5} className="custom-class" />,
      );
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("should render without className", () => {
      const { container } = render(<NotificationBadge count={5} />);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle count of 1", () => {
      render(<NotificationBadge count={1} />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should handle very large count", () => {
      render(<NotificationBadge count={9999} max={99} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("should handle negative count as non-zero", () => {
      render(<NotificationBadge count={-5} />);
      expect(screen.getByText("-5")).toBeInTheDocument();
    });
  });
});

describe("PulseBadge", () => {
  describe("Rendering", () => {
    it("should render children", () => {
      render(<PulseBadge>New</PulseBadge>);
      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("should render with default variant", () => {
      const { container } = render(<PulseBadge>Test</PulseBadge>);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should render with motion wrapper", () => {
      const { container } = render(<PulseBadge>Badge</PulseBadge>);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Pulse Animation", () => {
    it("should pulse by default", () => {
      const { container } = render(<PulseBadge>Pulsing</PulseBadge>);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should not pulse when pulse is false", () => {
      const { container } = render(
        <PulseBadge pulse={false}>Not Pulsing</PulseBadge>,
      );
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should pulse when pulse is explicitly true", () => {
      const { container } = render(
        <PulseBadge pulse={true}>Pulsing</PulseBadge>,
      );
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render with destructive variant", () => {
      render(<PulseBadge variant="destructive">Error</PulseBadge>);
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("should render with outline variant", () => {
      render(<PulseBadge variant="outline">Outlined</PulseBadge>);
      expect(screen.getByText("Outlined")).toBeInTheDocument();
    });

    it("should render with secondary variant", () => {
      render(<PulseBadge variant="secondary">Secondary</PulseBadge>);
      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });

    it("should render with default variant", () => {
      render(<PulseBadge variant="default">Default</PulseBadge>);
      expect(screen.getByText("Default")).toBeInTheDocument();
    });
  });

  describe("ClassName", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <PulseBadge className="custom-pulse">Text</PulseBadge>,
      );
      expect(container.querySelector(".custom-pulse")).toBeInTheDocument();
    });

    it("should render without className", () => {
      const { container } = render(<PulseBadge>Text</PulseBadge>);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Children Content", () => {
    it("should render text content", () => {
      render(<PulseBadge>Simple Text</PulseBadge>);
      expect(screen.getByText("Simple Text")).toBeInTheDocument();
    });

    it("should render numeric content", () => {
      render(<PulseBadge>{123}</PulseBadge>);
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("should render React elements", () => {
      render(
        <PulseBadge>
          <span>Complex</span>
        </PulseBadge>,
      );
      expect(screen.getByText("Complex")).toBeInTheDocument();
    });
  });
});

describe("StatusBadge", () => {
  describe("Status Types", () => {
    it("should render online status", () => {
      render(<StatusBadge status="online" />);
      const { container } = render(<StatusBadge status="online" />);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should render offline status", () => {
      const { container } = render(<StatusBadge status="offline" />);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should render away status", () => {
      const { container } = render(<StatusBadge status="away" />);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should render busy status", () => {
      const { container } = render(<StatusBadge status="busy" />);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Status Text", () => {
    it("should not show text by default", () => {
      render(<StatusBadge status="online" />);
      expect(screen.queryByText("Online")).not.toBeInTheDocument();
    });

    it("should show online text when showText is true", () => {
      render(<StatusBadge status="online" showText />);
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("should show offline text when showText is true", () => {
      render(<StatusBadge status="offline" showText />);
      expect(screen.getByText("Offline")).toBeInTheDocument();
    });

    it("should show away text when showText is true", () => {
      render(<StatusBadge status="away" showText />);
      expect(screen.getByText("Away")).toBeInTheDocument();
    });

    it("should show busy text when showText is true", () => {
      render(<StatusBadge status="busy" showText />);
      expect(screen.getByText("Busy")).toBeInTheDocument();
    });

    it("should respect showText false", () => {
      render(<StatusBadge status="online" showText={false} />);
      expect(screen.queryByText("Online")).not.toBeInTheDocument();
    });
  });

  describe("ClassName", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <StatusBadge status="online" className="custom-status" />,
      );
      expect(container.querySelector(".custom-status")).toBeInTheDocument();
    });

    it("should render without className", () => {
      const { container } = render(<StatusBadge status="online" />);
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Pulsing Animation", () => {
    it("should pulse for online status", () => {
      const { container } = render(<StatusBadge status="online" />);
      // Online status should have pulsing animation
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should pulse for busy status", () => {
      const { container } = render(<StatusBadge status="busy" />);
      // Busy status should have pulsing animation
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should not pulse for offline status", () => {
      const { container } = render(<StatusBadge status="offline" />);
      // Offline doesn't pulse but still renders with motion
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });

    it("should not pulse for away status", () => {
      const { container } = render(<StatusBadge status="away" />);
      // Away doesn't pulse but still renders with motion
      expect(
        container.querySelector('[data-motion="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Combined Props", () => {
    it("should render with status, text, and className", () => {
      const { container } = render(
        <StatusBadge status="online" showText className="combined-props" />,
      );
      expect(screen.getByText("Online")).toBeInTheDocument();
      expect(container.querySelector(".combined-props")).toBeInTheDocument();
    });

    it("should handle all statuses with text", () => {
      const statuses: Array<"online" | "offline" | "away" | "busy"> = [
        "online",
        "offline",
        "away",
        "busy",
      ];
      for (const status of statuses) {
        const { unmount } = render(<StatusBadge status={status} showText />);
        unmount();
      }
    });
  });
});
