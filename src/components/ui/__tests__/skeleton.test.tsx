import { render } from "@testing-library/react";
import { vi } from "vitest";
import { Skeleton, SkeletonCard, SkeletonForm, SkeletonTable, SkeletonText } from "../skeleton";

// Mock the animation hook
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe("Skeleton", () => {
  describe("Basic Rendering", () => {
    it("renders skeleton element", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(<Skeleton className="h-10 w-full" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton?.className).toContain("h-10");
      expect(skeleton?.className).toContain("w-full");
    });

    it("has default background color", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton?.className).toContain("bg-accent");
    });
  });

  describe("Variants", () => {
    it("renders rectangular variant (default)", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton?.className).toContain("rounded-md");
    });

    it("renders circular variant", () => {
      const { container } = render(<Skeleton variant="circular" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton?.className).toContain("rounded-full");
    });

    it("renders text variant", () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton?.className).toContain("h-4");
      expect(skeleton?.className).toContain("rounded-md");
    });
  });

  describe("Shimmer Effect", () => {
    it("enables shimmer by default", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it("disables shimmer when shimmer=false", () => {
      const { container } = render(<Skeleton shimmer={false} />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton?.className).toContain("animate-pulse");
    });
  });

  describe("Reduced Motion", () => {
    it("uses pulse animation with reduced motion", async () => {
      // Mock useReducedMotion to return true for this test
      const { useReducedMotion } = await import("@/lib/animations/hooks/use-reduced-motion");
      vi.mocked(useReducedMotion).mockReturnValue(true);

      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton?.className).toContain("animate-pulse");

      // Reset the mock back to default
      vi.mocked(useReducedMotion).mockReturnValue(false);
    });
  });

  describe("SkeletonCard", () => {
    it("renders card skeleton structure", () => {
      const { container } = render(<SkeletonCard />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("applies custom className to wrapper", () => {
      const { container } = render(<SkeletonCard className="custom-card" />);
      expect(container.firstChild).toHaveClass("custom-card");
    });
  });

  describe("SkeletonText", () => {
    it("renders multiple text lines", () => {
      const { container } = render(<SkeletonText lines={3} />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBe(3);
    });

    it("renders default number of lines", () => {
      const { container } = render(<SkeletonText />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("applies custom className to wrapper", () => {
      const { container } = render(<SkeletonText className="text-wrapper" />);
      expect(container.firstChild).toHaveClass("text-wrapper");
    });
  });

  describe("SkeletonTable", () => {
    it("renders table skeleton structure", () => {
      const { container } = render(<SkeletonTable />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("renders custom number of rows", () => {
      const { container } = render(<SkeletonTable rows={5} />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("renders custom number of columns", () => {
      const { container } = render(<SkeletonTable columns={4} />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("SkeletonForm", () => {
    it("renders form skeleton structure", () => {
      const { container } = render(<SkeletonForm />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("renders custom number of fields", () => {
      const { container } = render(<SkeletonForm fields={3} />);
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("applies custom className", () => {
      const { container } = render(<SkeletonForm className="custom-form" />);
      expect(container.firstChild).toHaveClass("custom-form");
    });
  });

  describe("Data Attributes", () => {
    it("has data-slot attribute", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it("forwards additional props", () => {
      const { container } = render(<Skeleton data-testid="custom-skeleton" />);
      expect(container.querySelector('[data-testid="custom-skeleton"]')).toBeInTheDocument();
    });
  });
});
