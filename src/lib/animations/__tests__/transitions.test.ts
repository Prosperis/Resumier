import { describe, expect, it } from "vitest";
import {
  bouncySpringTransition,
  collapseTransition,
  createSpringTransition,
  createTransition,
  defaultTransition,
  dropdownTransition,
  durations,
  easings,
  fastTransition,
  instantTransition,
  layoutTransition,
  modalTransition,
  pageTransition,
  slowTransition,
  smoothSpringTransition,
  springTransition,
  staggerTransition,
  stiffSpringTransition,
} from "../transitions";

describe("durations", () => {
  it("should export duration constants", () => {
    expect(durations.instant).toBe(0);
    expect(durations.fast).toBe(0.15);
    expect(durations.normal).toBe(0.3);
    expect(durations.slow).toBe(0.5);
    expect(durations.slower).toBe(0.75);
  });

  it("should have positive or zero duration values", () => {
    Object.values(durations).forEach((duration) => {
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("easings", () => {
  it("should export easing arrays", () => {
    expect(easings.easeInOut).toEqual([0.4, 0.0, 0.2, 1]);
    expect(easings.easeOut).toEqual([0.0, 0.0, 0.2, 1]);
    expect(easings.easeIn).toEqual([0.4, 0.0, 1, 1]);
    expect(easings.sharp).toEqual([0.4, 0.0, 0.6, 1]);
    expect(easings.bounce).toEqual([0.68, -0.55, 0.265, 1.55]);
    expect(easings.smooth).toEqual([0.645, 0.045, 0.355, 1]);
  });

  it("should have cubic-bezier format (4 numbers)", () => {
    Object.values(easings).forEach((easing) => {
      expect(easing).toHaveLength(4);
      easing.forEach((value) => {
        expect(typeof value).toBe("number");
      });
    });
  });
});

describe("Preset Transitions", () => {
  describe("defaultTransition", () => {
    it("should use normal duration", () => {
      expect(defaultTransition.duration).toBe(durations.normal);
    });

    it("should use easeInOut easing", () => {
      expect(defaultTransition.ease).toEqual(easings.easeInOut);
    });
  });

  describe("fastTransition", () => {
    it("should use fast duration", () => {
      expect(fastTransition.duration).toBe(durations.fast);
    });

    it("should use easeOut easing", () => {
      expect(fastTransition.ease).toEqual(easings.easeOut);
    });
  });

  describe("slowTransition", () => {
    it("should use slow duration", () => {
      expect(slowTransition.duration).toBe(durations.slow);
    });

    it("should use smooth easing", () => {
      expect(slowTransition.ease).toEqual(easings.smooth);
    });
  });

  describe("springTransition", () => {
    it("should have spring type", () => {
      expect(springTransition.type).toBe("spring");
    });

    it("should have stiffness and damping", () => {
      expect(springTransition.stiffness).toBeDefined();
      expect(springTransition.damping).toBeDefined();
    });
  });

  describe("bouncySpringTransition", () => {
    it("should have spring type", () => {
      expect(bouncySpringTransition.type).toBe("spring");
    });

    it("should have low damping for bounce effect", () => {
      expect(bouncySpringTransition.damping).toBeLessThan(20);
    });
  });

  describe("smoothSpringTransition", () => {
    it("should have spring type", () => {
      expect(smoothSpringTransition.type).toBe("spring");
    });

    it("should have balanced stiffness and damping", () => {
      expect(smoothSpringTransition.stiffness).toBeDefined();
      expect(smoothSpringTransition.damping).toBeDefined();
    });
  });

  describe("stiffSpringTransition", () => {
    it("should have spring type", () => {
      expect(stiffSpringTransition.type).toBe("spring");
    });

    it("should have high stiffness", () => {
      expect(stiffSpringTransition.stiffness).toBeGreaterThan(200);
    });
  });

  describe("pageTransition", () => {
    it("should use normal duration", () => {
      expect(pageTransition.duration).toBe(durations.normal);
    });

    it("should use easeInOut easing", () => {
      expect(pageTransition.ease).toEqual(easings.easeInOut);
    });
  });

  describe("modalTransition", () => {
    it("should be spring type", () => {
      expect(modalTransition.type).toBe("spring");
    });

    it("should have stiffness and damping", () => {
      expect(modalTransition.stiffness).toBeDefined();
      expect(modalTransition.damping).toBeDefined();
    });
  });

  describe("dropdownTransition", () => {
    it("should be spring type", () => {
      expect(dropdownTransition.type).toBe("spring");
    });

    it("should have high stiffness for snappy feel", () => {
      expect(dropdownTransition.stiffness).toBeGreaterThan(300);
    });
  });

  describe("staggerTransition", () => {
    it("should have stagger children delay", () => {
      expect(staggerTransition.staggerChildren).toBeDefined();
    });

    it("should have delay children property", () => {
      expect(staggerTransition.delayChildren).toBeDefined();
    });
  });

  describe("layoutTransition", () => {
    it("should be spring type for smooth layout changes", () => {
      expect(layoutTransition.type).toBe("spring");
    });

    it("should have appropriate stiffness and damping", () => {
      expect(layoutTransition.stiffness).toBeDefined();
      expect(layoutTransition.damping).toBeDefined();
    });
  });

  describe("collapseTransition", () => {
    it("should use normal duration", () => {
      expect(collapseTransition.duration).toBe(durations.normal);
    });

    it("should use easeInOut easing", () => {
      expect(collapseTransition.ease).toEqual(easings.easeInOut);
    });
  });

  describe("instantTransition", () => {
    it("should have zero duration", () => {
      expect(instantTransition.duration).toBe(durations.instant);
    });
  });
});

describe("Spring Preset Transitions", () => {
  describe("stiffSpringTransition", () => {
    it("should have high stiffness", () => {
      expect(stiffSpringTransition.stiffness).toBeGreaterThan(200);
    });

    it("should be spring type", () => {
      expect(stiffSpringTransition.type).toBe("spring");
    });
  });

  describe("smoothSpringTransition", () => {
    it("should have moderate stiffness", () => {
      expect(smoothSpringTransition.stiffness).toBeDefined();
      expect(Number(smoothSpringTransition.stiffness)).toBeLessThan(
        Number(stiffSpringTransition.stiffness),
      );
    });

    it("should be spring type", () => {
      expect(smoothSpringTransition.type).toBe("spring");
    });
  });

  describe("bouncySpringTransition", () => {
    it("should have low damping", () => {
      expect(bouncySpringTransition.damping).toBeDefined();
      expect(Number(bouncySpringTransition.damping)).toBeLessThan(
        Number(smoothSpringTransition.damping),
      );
    });

    it("should be spring type", () => {
      expect(bouncySpringTransition.type).toBe("spring");
    });
  });
});

describe("createTransition", () => {
  it("should create transition with custom duration", () => {
    const transition = createTransition({ duration: 1.5 });
    expect(transition.duration).toBe(1.5);
  });

  it("should create transition with custom easing", () => {
    const customEasing = [0.1, 0.2, 0.3, 0.4] as const;
    const transition = createTransition({ ease: customEasing });
    expect(transition.ease).toEqual(customEasing);
  });

  it("should merge with default transition", () => {
    const transition = createTransition({});
    expect(transition.duration).toBeDefined();
    expect(transition.ease).toBeDefined();
  });

  it("should override defaults when specified", () => {
    const transition = createTransition({
      duration: durations.fast,
      ease: easings.sharp,
    });
    expect(transition.duration).toBe(durations.fast);
    expect(transition.ease).toEqual(easings.sharp);
  });

  it("should accept delay parameter", () => {
    const transition = createTransition({ delay: 0.5 });
    expect(transition.delay).toBe(0.5);
  });
});

describe("createSpringTransition", () => {
  it("should create spring with custom stiffness", () => {
    const spring = createSpringTransition({ stiffness: 500 });
    expect(spring.stiffness).toBe(500);
    expect(spring.type).toBe("spring");
  });

  it("should create spring with custom damping", () => {
    const spring = createSpringTransition({ damping: 50 });
    expect(spring.damping).toBe(50);
    expect(spring.type).toBe("spring");
  });

  it("should merge with default spring settings", () => {
    const spring = createSpringTransition({});
    expect(spring.type).toBe("spring");
    expect(spring.stiffness).toBeDefined();
    expect(spring.damping).toBeDefined();
  });

  it("should override defaults when specified", () => {
    const spring = createSpringTransition({
      stiffness: 100,
      damping: 20,
      mass: 2,
    });
    expect(spring.stiffness).toBe(100);
    expect(spring.damping).toBe(20);
    expect(spring.mass).toBe(2);
  });

  it("should accept all spring properties", () => {
    const spring = createSpringTransition({
      stiffness: 300,
      damping: 30,
      mass: 1.5,
      velocity: 10,
      restDelta: 0.01,
      restSpeed: 0.01,
    });
    expect(spring.stiffness).toBe(300);
    expect(spring.damping).toBe(30);
    expect(spring.mass).toBe(1.5);
    expect(spring.velocity).toBe(10);
    expect(spring.restDelta).toBe(0.01);
    expect(spring.restSpeed).toBe(0.01);
  });
});

describe("Transition Type Guards", () => {
  it("should differentiate spring from tween transitions", () => {
    expect(springTransition.type).toBe("spring");
    expect(defaultTransition.type).not.toBe("spring");
  });

  it("should have mutually exclusive properties", () => {
    // Spring transitions have stiffness/damping
    expect(springTransition).toHaveProperty("stiffness");
    expect(springTransition).toHaveProperty("damping");

    // Tween transitions have duration/ease
    expect(defaultTransition).toHaveProperty("duration");
    expect(defaultTransition).toHaveProperty("ease");
  });
});
