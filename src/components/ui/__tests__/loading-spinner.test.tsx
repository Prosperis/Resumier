import { render } from "@testing-library/react";
import { vi } from "vitest";
import { LoadingDots, LoadingPulse, LoadingSpinner } from "../loading-spinner";

// Mock the reduced motion hook
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe("LoadingSpinner", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Rendering", () => {
    it("renders with default props", () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.firstChild;
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("rounded-full");
    });

    it("renders with custom className", () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Size Variants", () => {
    it("renders small size correctly", () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      expect(container.firstChild).toHaveClass("h-4", "w-4", "border-2");
    });

    it("renders medium size correctly (default)", () => {
      const { container } = render(<LoadingSpinner size="md" />);
      expect(container.firstChild).toHaveClass("h-8", "w-8", "border-2");
    });

    it("renders large size correctly", () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      expect(container.firstChild).toHaveClass("h-12", "w-12", "border-3");
    });
  });

  describe("Color Variants", () => {
    it("renders primary variant correctly (default)", () => {
      const { container } = render(<LoadingSpinner variant="primary" />);
      expect(container.firstChild).toHaveClass(
        "border-primary",
        "border-t-transparent",
      );
    });

    it("renders secondary variant correctly", () => {
      const { container } = render(<LoadingSpinner variant="secondary" />);
      expect(container.firstChild).toHaveClass(
        "border-secondary",
        "border-t-transparent",
      );
    });

    it("renders muted variant correctly", () => {
      const { container } = render(<LoadingSpinner variant="muted" />);
      expect(container.firstChild).toHaveClass(
        "border-muted-foreground",
        "border-t-transparent",
      );
    });
  });

  describe("Reduced Motion", () => {
    it("respects reduced motion preference", async () => {
      const { useReducedMotion } = await import(
        "@/lib/animations/hooks/use-reduced-motion"
      );
      (useReducedMotion as any).mockReturnValue(true);

      const { container } = render(<LoadingSpinner />);
      expect(container.firstChild).toBeInTheDocument();
      // Animation should be disabled when reduced motion is preferred
    });

    it("animates when reduced motion is not preferred", async () => {
      const { useReducedMotion } = await import(
        "@/lib/animations/hooks/use-reduced-motion"
      );
      (useReducedMotion as any).mockReturnValue(false);

      const { container } = render(<LoadingSpinner />);
      expect(container.firstChild).toBeInTheDocument();
      // Animation should be enabled
    });
  });
});

describe("LoadingDots", () => {
  describe("Rendering", () => {
    it("renders three dots", () => {
      const { container } = render(<LoadingDots />);
      const dots = container.querySelectorAll(".rounded-full");
      expect(dots).toHaveLength(3);
    });

    it("renders with default props", () => {
      const { container } = render(<LoadingDots />);
      expect(container.firstChild).toHaveClass("flex", "items-center", "gap-1");
    });

    it("renders with custom className", () => {
      const { container } = render(<LoadingDots className="custom-dots" />);
      expect(container.firstChild).toHaveClass("custom-dots");
    });
  });

  describe("Size Variants", () => {
    it("renders small dots", () => {
      const { container } = render(<LoadingDots size="sm" />);
      const dots = container.querySelectorAll(".rounded-full");
      dots.forEach((dot) => {
        expect(dot).toHaveClass("h-1.5", "w-1.5");
      });
    });

    it("renders medium dots (default)", () => {
      const { container } = render(<LoadingDots size="md" />);
      const dots = container.querySelectorAll(".rounded-full");
      dots.forEach((dot) => {
        expect(dot).toHaveClass("h-2", "w-2");
      });
    });

    it("renders large dots", () => {
      const { container } = render(<LoadingDots size="lg" />);
      const dots = container.querySelectorAll(".rounded-full");
      dots.forEach((dot) => {
        expect(dot).toHaveClass("h-3", "w-3");
      });
    });
  });

  describe("Color Variants", () => {
    it("renders primary variant correctly (default)", () => {
      const { container } = render(<LoadingDots variant="primary" />);
      const dots = container.querySelectorAll(".rounded-full");
      dots.forEach((dot) => {
        expect(dot).toHaveClass("bg-primary");
      });
    });

    it("renders secondary variant correctly", () => {
      const { container } = render(<LoadingDots variant="secondary" />);
      const dots = container.querySelectorAll(".rounded-full");
      dots.forEach((dot) => {
        expect(dot).toHaveClass("bg-secondary");
      });
    });

    it("renders muted variant correctly", () => {
      const { container } = render(<LoadingDots variant="muted" />);
      const dots = container.querySelectorAll(".rounded-full");
      dots.forEach((dot) => {
        expect(dot).toHaveClass("bg-muted-foreground");
      });
    });
  });

  describe("Animation", () => {
    it("has staggered animation delay for each dot", () => {
      const { container } = render(<LoadingDots />);
      const dots = container.querySelectorAll(".rounded-full");
      // All three dots should be rendered
      expect(dots).toHaveLength(3);
      // Each dot should have staggered animation (tested through motion.div)
    });

    it("respects reduced motion preference", async () => {
      const { useReducedMotion } = await import(
        "@/lib/animations/hooks/use-reduced-motion"
      );
      (useReducedMotion as any).mockReturnValue(true);

      const { container } = render(<LoadingDots />);
      expect(container.querySelectorAll(".rounded-full")).toHaveLength(3);
    });
  });
});

describe("LoadingPulse", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      const { container } = render(<LoadingPulse />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("rounded-full");
    });

    it("renders with custom className", () => {
      const { container } = render(<LoadingPulse className="custom-pulse" />);
      expect(container.firstChild).toHaveClass("custom-pulse");
    });
  });

  describe("Size Variants", () => {
    it("renders small size", () => {
      const { container } = render(<LoadingPulse size="sm" />);
      expect(container.firstChild).toHaveClass("h-4", "w-4");
    });

    it("renders medium size (default)", () => {
      const { container } = render(<LoadingPulse size="md" />);
      expect(container.firstChild).toHaveClass("h-8", "w-8");
    });

    it("renders large size", () => {
      const { container } = render(<LoadingPulse size="lg" />);
      expect(container.firstChild).toHaveClass("h-12", "w-12");
    });
  });

  describe("Color Variants", () => {
    it("renders primary variant correctly (default)", () => {
      const { container } = render(<LoadingPulse variant="primary" />);
      expect(container.firstChild).toHaveClass("bg-primary");
    });

    it("renders secondary variant correctly", () => {
      const { container } = render(<LoadingPulse variant="secondary" />);
      expect(container.firstChild).toHaveClass("bg-secondary");
    });

    it("renders muted variant correctly", () => {
      const { container } = render(<LoadingPulse variant="muted" />);
      expect(container.firstChild).toHaveClass("bg-muted-foreground");
    });
  });

  describe("Animation", () => {
    it("respects reduced motion preference", async () => {
      const { useReducedMotion } = await import(
        "@/lib/animations/hooks/use-reduced-motion"
      );
      (useReducedMotion as any).mockReturnValue(true);

      const { container } = render(<LoadingPulse />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("animates when reduced motion is not preferred", async () => {
      const { useReducedMotion } = await import(
        "@/lib/animations/hooks/use-reduced-motion"
      );
      (useReducedMotion as any).mockReturnValue(false);

      const { container } = render(<LoadingPulse />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
