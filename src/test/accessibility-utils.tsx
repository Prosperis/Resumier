/**
 * Accessibility Testing Utilities
 * Helper functions and utilities for automated accessibility testing
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RenderResult } from "@testing-library/react";
import { render as rtlRender } from "@testing-library/react";
import type { ReactElement } from "react";
import { expect, vi } from "vitest";
import { configureAxe } from "vitest-axe";

/**
 * Create a test wrapper with QueryClient for components that use react-query
 */
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function QueryWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

/**
 * Create a test wrapper with Router for components that use TanStack Router
 * Note: Most components should be tested in isolation without the full router
 */
export function createRouterMocks() {
  // Mock router hooks for components that use them
  return {
    useNavigate: () => vi.fn(),
    useRouter: () => ({ state: { location: { pathname: "/" } } }),
    useRouterState: () => ({ location: { pathname: "/" } }),
    useSearch: () => ({}),
    useMatches: () => [],
  };
}

/**
 * Render with QueryClient wrapper
 */
export function renderWithQuery(ui: ReactElement) {
  const Wrapper = createQueryWrapper();
  return rtlRender(ui, { wrapper: Wrapper });
}

/**
 * Configure axe for testing
 * Customizes axe-core rules and options for our project
 */
export const axe = configureAxe({
  rules: {
    // Ensure these rules are always enabled
    "aria-allowed-attr": { enabled: true },
    "aria-required-attr": { enabled: true },
    "aria-valid-attr": { enabled: true },
    "aria-valid-attr-value": { enabled: true },
    "button-name": { enabled: true },
    "color-contrast": { enabled: true },
    "duplicate-id": { enabled: true },
    "form-field-multiple-labels": { enabled: true },
    "html-has-lang": { enabled: true },
    "image-alt": { enabled: true },
    "input-button-name": { enabled: true },
    label: { enabled: true },
    "link-name": { enabled: true },
    list: { enabled: true },
    listitem: { enabled: true },
    "meta-viewport": { enabled: true },
    "nested-interactive": { enabled: true },
    "valid-lang": { enabled: true },

    // Disable region rule as we use custom landmarks
    region: { enabled: false },
  },
});

/**
 * Run accessibility tests on a rendered component
 *
 * @example
 * ```tsx
 * const { container } = render(<MyComponent />)
 * await expectNoAccessibilityViolations(container)
 * ```
 */
export async function expectNoAccessibilityViolations(
  container: RenderResult["container"] | HTMLElement,
) {
  const results = await axe(container);

  // Check for violations
  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((violation) => {
      const nodes = violation.nodes.map((node) => node.html).join("\n");
      return `${violation.id}: ${violation.description}\n${violation.help}\n${nodes}`;
    });
    throw new Error(`Accessibility violations found:\n\n${violationMessages.join("\n\n")}`);
  }

  expect(results.violations).toHaveLength(0);
}

/**
 * Run accessibility tests with custom axe options
 *
 * @example
 * ```tsx
 * const { container } = render(<MyComponent />)
 * await checkAccessibility(container, {
 *   rules: { 'color-contrast': { enabled: false } }
 * })
 * ```
 */
export async function checkAccessibility(
  container: RenderResult["container"] | HTMLElement,
  options?: Parameters<typeof axe>[1],
) {
  const results = await axe(container, options);

  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((violation) => {
      const nodes = violation.nodes.map((node) => node.html).join("\n");
      return `${violation.id}: ${violation.description}\n${violation.help}\n${nodes}`;
    });
    throw new Error(`Accessibility violations found:\n\n${violationMessages.join("\n\n")}`);
  }

  expect(results.violations).toHaveLength(0);
}

/**
 * Test focus management in a component
 * Verifies that elements receive and lose focus correctly
 */
export function testFocusManagement() {
  return {
    expectElementToHaveFocus(element: HTMLElement | null) {
      expect(element).toHaveFocus();
    },
    expectElementNotToHaveFocus(element: HTMLElement | null) {
      expect(element).not.toHaveFocus();
    },
    expectFocusToBeInside(container: HTMLElement) {
      const activeElement = document.activeElement;
      expect(container.contains(activeElement)).toBe(true);
    },
  };
}

/**
 * Test ARIA attributes on an element
 * Provides helpers for common ARIA testing scenarios
 */
export function testAriaAttributes(element: HTMLElement | null) {
  if (!element) {
    throw new Error("Element not found");
  }

  return {
    expectToHaveAriaLabel(label: string) {
      expect(element).toHaveAttribute("aria-label", label);
    },
    expectToHaveAriaDescribedBy(id: string) {
      expect(element).toHaveAttribute("aria-describedby", id);
    },
    expectToBeAriaInvalid(invalid = true) {
      expect(element).toHaveAttribute("aria-invalid", String(invalid));
    },
    expectToHaveRole(role: string) {
      expect(element).toHaveAttribute("role", role);
    },
    expectToBeAriaHidden(hidden = true) {
      expect(element).toHaveAttribute("aria-hidden", String(hidden));
    },
    expectToHaveAriaLive(live: "off" | "polite" | "assertive") {
      expect(element).toHaveAttribute("aria-live", live);
    },
  };
}

/**
 * Common accessibility test patterns
 */
export const accessibilityTests = {
  /**
   * Test that all buttons have accessible names
   */
  async testButtonAccessibility(container: HTMLElement) {
    const buttons = container.querySelectorAll("button");
    buttons.forEach((button) => {
      const hasAriaLabel = button.hasAttribute("aria-label");
      const hasAriaLabelledBy = button.hasAttribute("aria-labelledby");
      const hasTextContent = button.textContent?.trim();
      const hasTitle = button.hasAttribute("title");

      expect(
        hasAriaLabel || hasAriaLabelledBy || hasTextContent || hasTitle,
        `Button must have accessible name: ${button.outerHTML}`,
      ).toBe(true);
    });
  },

  /**
   * Test that all images have alt text
   */
  testImageAccessibility(container: HTMLElement) {
    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      const hasAlt = img.hasAttribute("alt");
      const isAriaHidden = img.getAttribute("aria-hidden") === "true";

      expect(
        hasAlt || isAriaHidden,
        `Image must have alt attribute or be aria-hidden: ${img.outerHTML}`,
      ).toBe(true);
    });
  },

  /**
   * Test that all form inputs have labels
   */
  testFormAccessibility(container: HTMLElement) {
    const inputs = container.querySelectorAll('input:not([type="hidden"])');
    inputs.forEach((input) => {
      const id = input.id;
      const hasAriaLabel = input.hasAttribute("aria-label");
      const hasAriaLabelledBy = input.hasAttribute("aria-labelledby");
      const hasLabel = id && container.querySelector(`label[for="${id}"]`);

      expect(
        hasAriaLabel || hasAriaLabelledBy || hasLabel,
        `Input must have associated label: ${input.outerHTML}`,
      ).toBe(true);
    });
  },

  /**
   * Test that interactive elements are keyboard accessible
   */
  testKeyboardAccessibility(container: HTMLElement) {
    const interactiveElements = container.querySelectorAll(
      'a, button, input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])',
    );

    interactiveElements.forEach((element) => {
      const tabIndex = element.getAttribute("tabindex");

      // Elements should not have tabindex > 0
      if (tabIndex !== null) {
        const tabIndexNum = Number.parseInt(tabIndex, 10);
        expect(tabIndexNum <= 0, `Element should not have tabindex > 0: ${element.outerHTML}`).toBe(
          true,
        );
      }
    });
  },

  /**
   * Test heading hierarchy
   */
  testHeadingHierarchy(container: HTMLElement) {
    const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    const levels = headings.map((h) => Number.parseInt(h.tagName.charAt(1), 10));

    // Check for skipped heading levels
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      expect(
        diff <= 1,
        `Heading hierarchy should not skip levels. Found h${levels[i - 1]} followed by h${levels[i]}`,
      ).toBe(true);
    }
  },
};

/**
 * Matchers for common accessibility assertions
 */
export const accessibilityMatchers = {
  toBeAccessible: async (container: HTMLElement) => {
    try {
      await expectNoAccessibilityViolations(container);
      return {
        pass: true,
        message: () => "Element is accessible",
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `Element has accessibility violations: ${error}`,
      };
    }
  },
};

// Don't re-export expect - it's already imported above
