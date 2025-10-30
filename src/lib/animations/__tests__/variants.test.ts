import { describe, expect, it } from "vitest";
import {
  collapseVariants,
  drawerVariants,
  dropdownVariants,
  fadeDownVariants,
  fadeLeftVariants,
  fadeRightVariants,
  fadeUpVariants,
  fadeVariants,
  modalBackdropVariants,
  modalContentVariants,
  pulseVariants,
  scaleBounceVariants,
  scaleVariants,
  shimmerVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  slideUpVariants,
  spinVariants,
  staggerContainerVariants,
  staggerItemVariants,
  toastVariants,
} from "../variants";

describe("Fade Variants", () => {
  describe("fadeVariants", () => {
    it("should have hidden state with opacity 0", () => {
      expect(fadeVariants.hidden).toEqual({ opacity: 0 });
    });

    it("should have visible state with opacity 1", () => {
      expect(fadeVariants.visible).toEqual({ opacity: 1 });
    });

    it("should have exit state with opacity 0", () => {
      expect(fadeVariants.exit).toEqual({ opacity: 0 });
    });
  });

  describe("fadeUpVariants", () => {
    it("should start below and transparent", () => {
      expect(fadeUpVariants.hidden).toEqual({ opacity: 0, y: 20 });
    });

    it("should end at position with full opacity", () => {
      expect(fadeUpVariants.visible).toEqual({ opacity: 1, y: 0 });
    });

    it("should exit upward", () => {
      expect(fadeUpVariants.exit).toEqual({ opacity: 0, y: -20 });
    });
  });

  describe("fadeDownVariants", () => {
    it("should start above and transparent", () => {
      expect(fadeDownVariants.hidden).toEqual({ opacity: 0, y: -20 });
    });

    it("should end at position with full opacity", () => {
      expect(fadeDownVariants.visible).toEqual({ opacity: 1, y: 0 });
    });

    it("should exit downward", () => {
      expect(fadeDownVariants.exit).toEqual({ opacity: 0, y: 20 });
    });
  });

  describe("fadeLeftVariants", () => {
    it("should start from right and transparent", () => {
      expect(fadeLeftVariants.hidden).toEqual({ opacity: 0, x: 20 });
    });

    it("should end at position with full opacity", () => {
      expect(fadeLeftVariants.visible).toEqual({ opacity: 1, x: 0 });
    });

    it("should exit to left", () => {
      expect(fadeLeftVariants.exit).toEqual({ opacity: 0, x: -20 });
    });
  });

  describe("fadeRightVariants", () => {
    it("should start from left and transparent", () => {
      expect(fadeRightVariants.hidden).toEqual({ opacity: 0, x: -20 });
    });

    it("should end at position with full opacity", () => {
      expect(fadeRightVariants.visible).toEqual({ opacity: 1, x: 0 });
    });

    it("should exit to right", () => {
      expect(fadeRightVariants.exit).toEqual({ opacity: 0, x: 20 });
    });
  });
});

describe("Scale Variants", () => {
  describe("scaleVariants", () => {
    it("should start scaled down and transparent", () => {
      expect(scaleVariants.hidden).toEqual({ opacity: 0, scale: 0.8 });
    });

    it("should end at full scale and opacity", () => {
      expect(scaleVariants.visible).toEqual({ opacity: 1, scale: 1 });
    });

    it("should exit scaled down", () => {
      expect(scaleVariants.exit).toEqual({ opacity: 0, scale: 0.8 });
    });
  });

  describe("scaleBounceVariants", () => {
    it("should start very small and transparent", () => {
      expect(scaleBounceVariants.hidden).toEqual({ opacity: 0, scale: 0.3 });
    });

    it("should have spring transition on visible", () => {
      const visible = scaleBounceVariants.visible as any;
      expect(visible.opacity).toBe(1);
      expect(visible.scale).toBe(1);
      expect(visible.transition.type).toBe("spring");
      expect(visible.transition.stiffness).toBeDefined();
      expect(visible.transition.damping).toBeDefined();
    });

    it("should exit scaled down", () => {
      expect(scaleBounceVariants.exit).toEqual({ opacity: 0, scale: 0.3 });
    });
  });
});

describe("Slide Variants", () => {
  describe("slideUpVariants", () => {
    it("should start below viewport", () => {
      expect(slideUpVariants.hidden).toEqual({ y: "100%" });
    });

    it("should end at position", () => {
      expect(slideUpVariants.visible).toEqual({ y: 0 });
    });

    it("should exit below viewport", () => {
      expect(slideUpVariants.exit).toEqual({ y: "100%" });
    });
  });

  describe("slideDownVariants", () => {
    it("should start above viewport", () => {
      expect(slideDownVariants.hidden).toEqual({ y: "-100%" });
    });

    it("should end at position", () => {
      expect(slideDownVariants.visible).toEqual({ y: 0 });
    });

    it("should exit above viewport", () => {
      expect(slideDownVariants.exit).toEqual({ y: "-100%" });
    });
  });

  describe("slideLeftVariants", () => {
    it("should start from right of viewport", () => {
      expect(slideLeftVariants.hidden).toEqual({ x: "100%" });
    });

    it("should end at position", () => {
      expect(slideLeftVariants.visible).toEqual({ x: 0 });
    });

    it("should exit to left of viewport", () => {
      expect(slideLeftVariants.exit).toEqual({ x: "100%" });
    });
  });

  describe("slideRightVariants", () => {
    it("should start from left of viewport", () => {
      expect(slideRightVariants.hidden).toEqual({ x: "-100%" });
    });

    it("should end at position", () => {
      expect(slideRightVariants.visible).toEqual({ x: 0 });
    });

    it("should exit to right of viewport", () => {
      expect(slideRightVariants.exit).toEqual({ x: "-100%" });
    });
  });
});

describe("Stagger Variants", () => {
  describe("staggerContainerVariants", () => {
    it("should have hidden and visible states", () => {
      expect(staggerContainerVariants.hidden).toBeDefined();
      expect(staggerContainerVariants.visible).toBeDefined();
    });

    it("should define stagger children timing", () => {
      const visible = staggerContainerVariants.visible as any;
      expect(visible.transition).toBeDefined();
      expect(visible.transition.staggerChildren).toBeDefined();
    });

    it("should have delay for children", () => {
      const visible = staggerContainerVariants.visible as any;
      expect(visible.transition.delayChildren).toBeDefined();
    });
  });

  describe("staggerItemVariants", () => {
    it("should have hidden state", () => {
      expect(staggerItemVariants.hidden).toBeDefined();
    });

    it("should have visible state", () => {
      expect(staggerItemVariants.visible).toBeDefined();
    });

    it("should work with stagger container", () => {
      // Items should transition from hidden to visible
      expect(staggerItemVariants.hidden).not.toEqual(staggerItemVariants.visible);
    });
  });
});

describe("Collapse Variants", () => {
  describe("collapseVariants", () => {
    it("should start with zero height", () => {
      const collapsed = collapseVariants.collapsed as any;
      expect(collapsed.height).toBe(0);
      expect(collapsed.opacity).toBe(0);
    });

    it("should expand to auto height", () => {
      const expanded = collapseVariants.expanded as any;
      expect(expanded.height).toBe("auto");
      expect(expanded.opacity).toBe(1);
    });

    it("should handle overflow", () => {
      const collapsed = collapseVariants.collapsed as any;
      const expanded = collapseVariants.expanded as any;
      expect(collapsed.overflow).toBe("hidden");
      expect(expanded.overflow).toBe("visible");
    });
  });
});

describe("Drawer Variants", () => {
  describe("drawerVariants", () => {
    it("should have variants for all directions", () => {
      expect(drawerVariants.left).toBeDefined();
      expect(drawerVariants.right).toBeDefined();
      expect(drawerVariants.top).toBeDefined();
      expect(drawerVariants.bottom).toBeDefined();
    });

    it("should slide from left", () => {
      const leftHidden = drawerVariants.left.hidden as any;
      const leftVisible = drawerVariants.left.visible as any;
      expect(leftHidden.x).toBe("-100%");
      expect(leftVisible.x).toBe(0);
    });

    it("should slide from right", () => {
      const rightHidden = drawerVariants.right.hidden as any;
      const rightVisible = drawerVariants.right.visible as any;
      expect(rightHidden.x).toBe("100%");
      expect(rightVisible.x).toBe(0);
    });

    it("should slide from top", () => {
      const topHidden = drawerVariants.top.hidden as any;
      const topVisible = drawerVariants.top.visible as any;
      expect(topHidden.y).toBe("-100%");
      expect(topVisible.y).toBe(0);
    });

    it("should slide from bottom", () => {
      const bottomHidden = drawerVariants.bottom.hidden as any;
      const bottomVisible = drawerVariants.bottom.visible as any;
      expect(bottomHidden.y).toBe("100%");
      expect(bottomVisible.y).toBe(0);
    });
  });
});

describe("Modal Variants", () => {
  describe("modalBackdropVariants", () => {
    it("should fade in backdrop", () => {
      expect(modalBackdropVariants.hidden).toEqual({ opacity: 0 });
      expect(modalBackdropVariants.visible).toEqual({ opacity: 1 });
    });
  });

  describe("modalContentVariants", () => {
    it("should have hidden state", () => {
      const hidden = modalContentVariants.hidden as any;
      expect(hidden.opacity).toBe(0);
    });

    it("should have visible state", () => {
      const visible = modalContentVariants.visible as any;
      expect(visible.opacity).toBe(1);
    });

    it("should include scale and y transformation", () => {
      const hidden = modalContentVariants.hidden as any;
      expect(hidden.scale).toBeDefined();
      expect(hidden.y).toBeDefined();
    });

    it("should have exit state", () => {
      const exit = modalContentVariants.exit as any;
      expect(exit.opacity).toBe(0);
    });
  });
});

describe("Dropdown Variants", () => {
  describe("dropdownVariants", () => {
    it("should start scaled and transparent", () => {
      const hidden = dropdownVariants.hidden as any;
      expect(hidden.opacity).toBe(0);
      expect(hidden.scale).toBeLessThan(1);
    });

    it("should end at full scale", () => {
      const visible = dropdownVariants.visible as any;
      expect(visible.opacity).toBe(1);
      expect(visible.scale).toBe(1);
    });

    it("should have y offset for dropdown direction", () => {
      const hidden = dropdownVariants.hidden as any;
      expect(hidden.y).toBe(-10);
    });

    it("should exit scaled down", () => {
      const exit = dropdownVariants.exit as any;
      expect(exit.opacity).toBe(0);
      expect(exit.scale).toBeLessThan(1);
    });
  });
});

describe("Toast Variants", () => {
  describe("toastVariants", () => {
    it("should have variants for all positions", () => {
      expect(toastVariants.topRight).toBeDefined();
      expect(toastVariants.topLeft).toBeDefined();
      expect(toastVariants.bottomRight).toBeDefined();
      expect(toastVariants.bottomLeft).toBeDefined();
    });

    it("should slide from right for right positions", () => {
      const topRight = toastVariants.topRight;
      const hidden = topRight.hidden;
      expect(hidden.x).toBeGreaterThan(0);
      expect(hidden.y).toBe(0);
    });

    it("should slide from left for left positions", () => {
      const topLeft = toastVariants.topLeft;
      const hidden = topLeft.hidden;
      expect(hidden.x).toBeLessThan(0);
      expect(hidden.y).toBe(0);
    });

    it("should fade in all positions", () => {
      Object.values(toastVariants).forEach((variant) => {
        const hidden = variant.hidden;
        const visible = variant.visible;
        expect(hidden.opacity).toBe(0);
        expect(visible.opacity).toBe(1);
      });
    });

    it("should end at neutral position", () => {
      Object.values(toastVariants).forEach((variant) => {
        const visible = variant.visible;
        expect(visible.y).toBe(0);
        expect(visible.x).toBe(0);
      });
    });
  });
});

describe("Loading Variants", () => {
  describe("shimmerVariants", () => {
    it("should have initial state", () => {
      expect(shimmerVariants.initial).toBeDefined();
    });

    it("should have animate state with backgroundPosition", () => {
      const animate = shimmerVariants.animate as any;
      expect(animate.backgroundPosition).toBeDefined();
    });

    it("should repeat infinitely", () => {
      const animate = shimmerVariants.animate as any;
      expect(animate.transition.repeat).toBe(Number.POSITIVE_INFINITY);
    });

    it("should use linear easing", () => {
      const animate = shimmerVariants.animate as any;
      expect(animate.transition.ease).toBe("linear");
    });
  });

  describe("pulseVariants", () => {
    it("should have initial scale of 1", () => {
      expect(pulseVariants.initial).toEqual({ scale: 1 });
    });

    it("should pulse between scales", () => {
      const animate = pulseVariants.animate as any;
      expect(Array.isArray(animate.scale)).toBe(true);
      expect(animate.scale).toContain(1);
    });

    it("should repeat infinitely", () => {
      const animate = pulseVariants.animate as any;
      expect(animate.transition.repeat).toBe(Number.POSITIVE_INFINITY);
    });

    it("should have smooth easing", () => {
      const animate = pulseVariants.animate as any;
      expect(animate.transition.ease).toBe("easeInOut");
    });
  });

  describe("spinVariants", () => {
    it("should rotate 360 degrees", () => {
      const animate = spinVariants.animate as any;
      expect(animate.rotate).toBe(360);
    });

    it("should repeat infinitely", () => {
      const animate = spinVariants.animate as any;
      expect(animate.transition.repeat).toBe(Number.POSITIVE_INFINITY);
    });

    it("should use linear easing", () => {
      const animate = spinVariants.animate as any;
      expect(animate.transition.ease).toBe("linear");
    });

    it("should have reasonable duration", () => {
      const animate = spinVariants.animate as any;
      expect(animate.transition.duration).toBeGreaterThan(0);
      expect(animate.transition.duration).toBeLessThan(5);
    });
  });
});

describe("Variant State Consistency", () => {
  it("should have consistent hidden/visible/exit pattern for fade variants", () => {
    const fadeVariantsList = [
      fadeVariants,
      fadeUpVariants,
      fadeDownVariants,
      fadeLeftVariants,
      fadeRightVariants,
    ];

    fadeVariantsList.forEach((variant) => {
      expect(variant.hidden).toBeDefined();
      expect(variant.visible).toBeDefined();
      expect(variant.exit).toBeDefined();
    });
  });

  it("should have consistent hidden/visible/exit pattern for scale variants", () => {
    const scaleVariantsList = [scaleVariants, scaleBounceVariants];

    scaleVariantsList.forEach((variant) => {
      expect(variant.hidden).toBeDefined();
      expect(variant.visible).toBeDefined();
      expect(variant.exit).toBeDefined();
    });
  });

  it("should have consistent hidden/visible/exit pattern for slide variants", () => {
    const slideVariantsList = [
      slideUpVariants,
      slideDownVariants,
      slideLeftVariants,
      slideRightVariants,
    ];

    slideVariantsList.forEach((variant) => {
      expect(variant.hidden).toBeDefined();
      expect(variant.visible).toBeDefined();
      expect(variant.exit).toBeDefined();
    });
  });
});

describe("Animation Variant Types", () => {
  it("should export Variants type compatible objects", () => {
    // All variants should have at least one state
    const allVariants = [
      fadeVariants,
      fadeUpVariants,
      scaleVariants,
      slideUpVariants,
      staggerContainerVariants,
      collapseVariants,
      modalBackdropVariants,
      dropdownVariants,
      shimmerVariants,
      pulseVariants,
      spinVariants,
    ];

    allVariants.forEach((variant) => {
      expect(typeof variant).toBe("object");
      expect(Object.keys(variant).length).toBeGreaterThan(0);
    });
  });

  it("should have proper opacity values", () => {
    const variantsWithOpacity = [
      fadeVariants,
      fadeUpVariants,
      scaleVariants,
      modalBackdropVariants,
    ];

    variantsWithOpacity.forEach((variant) => {
      const hidden = variant.hidden as any;
      const visible = variant.visible as any;

      if (hidden.opacity !== undefined) {
        expect(hidden.opacity).toBeGreaterThanOrEqual(0);
        expect(hidden.opacity).toBeLessThanOrEqual(1);
      }

      if (visible.opacity !== undefined) {
        expect(visible.opacity).toBeGreaterThanOrEqual(0);
        expect(visible.opacity).toBeLessThanOrEqual(1);
      }
    });
  });
});
