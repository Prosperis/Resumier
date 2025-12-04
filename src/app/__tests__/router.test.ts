import { Router } from "@tanstack/react-router";
import { router } from "../router";

describe("router", () => {
  describe("Instance", () => {
    it("should be a Router instance", () => {
      expect(router).toBeInstanceOf(Router);
    });

    it("should be a singleton instance", async () => {
      // Import again to verify it's the same instance
      const module = await import("../router");
      expect(router).toBe(module.router);
    });
  });

  describe("Configuration", () => {
    it("should have defaultPreload set to 'intent'", () => {
      expect(router.options.defaultPreload).toBe("intent");
    });

    it("should have defaultPreloadStaleTime set to 0", () => {
      expect(router.options.defaultPreloadStaleTime).toBe(0);
    });

    it("should have routeTree configured", () => {
      expect(router.options.routeTree).toBeDefined();
      expect(router.routeTree).toBeDefined();
    });
  });

  describe("Router State", () => {
    it("should have initial state", () => {
      expect(router.state).toBeDefined();
      expect(router.state).toHaveProperty("location");
      expect(router.state).toHaveProperty("matches");
    });

    it("should have location property in state", () => {
      expect(router.state.location).toBeDefined();
      expect(router.state.location).toHaveProperty("href");
      expect(router.state.location).toHaveProperty("pathname");
    });

    it("should have matches array in state", () => {
      expect(router.state.matches).toBeDefined();
      expect(Array.isArray(router.state.matches)).toBe(true);
    });
  });

  describe("Router Methods", () => {
    it("should have navigate method", () => {
      expect(router.navigate).toBeTypeOf("function");
    });

    it("should have matchRoute method", () => {
      expect(router.matchRoute).toBeTypeOf("function");
    });

    it("should have invalidate method", () => {
      expect(router.invalidate).toBeTypeOf("function");
    });

    it("should have load method", () => {
      expect(router.load).toBeTypeOf("function");
    });

    it("should have preloadRoute method", () => {
      expect(router.preloadRoute).toBeTypeOf("function");
    });
  });

  describe("Route Tree", () => {
    it("should have a route tree with routes", () => {
      expect(router.routeTree).toBeDefined();
      expect(router.routeTree).toHaveProperty("children");
    });

    it("should have route tree path", () => {
      expect(router.routeTree).toHaveProperty("path");
    });

    it("should have route tree id", () => {
      expect(router.routeTree).toHaveProperty("id");
    });
  });

  describe("History", () => {
    it("should have history object", () => {
      expect(router.history).toBeDefined();
    });

    it("should have history push method", () => {
      expect(router.history.push).toBeTypeOf("function");
    });

    it("should have history replace method", () => {
      expect(router.history.replace).toBeTypeOf("function");
    });

    it("should have history go method", () => {
      expect(router.history.go).toBeTypeOf("function");
    });

    it("should have history back method", () => {
      expect(router.history.back).toBeTypeOf("function");
    });

    it("should have history forward method", () => {
      expect(router.history.forward).toBeTypeOf("function");
    });
  });

  describe("Type Registration", () => {
    // This test verifies that the module augmentation is in place
    it("should have type-safe router registration", () => {
      // If this compiles without errors, the type registration is working
      const testRouter: typeof router = router;
      expect(testRouter).toBe(router);
    });
  });
});
