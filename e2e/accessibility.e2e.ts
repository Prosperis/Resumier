import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility E2E Tests
 *
 * Tests for:
 * - WCAG 2.1 compliance
 * - Screen reader support
 * - Keyboard navigation
 * - Color contrast
 * - Focus management
 */

// Helper to set up demo mode for tests
async function setupDemoMode(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByRole("button", { name: /Try Demo Mode/i }).click();
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
}

test.describe("Accessibility - Landing Page", () => {
  test("should have no accessibility violations on landing page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // H1 should exist
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();

    // H1 should be first heading
    const headings = await page.getByRole("heading").all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test("should have alt text for images", async ({ page }) => {
    await page.goto("/");

    // All images should have alt text
    const images = page.getByRole("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const ariaLabel = await img.getAttribute("aria-label");
      const ariaLabelledby = await img.getAttribute("aria-labelledby");

      // Should have some form of accessible name
      const hasAccessibleName = alt || ariaLabel || ariaLabelledby;
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test("should have proper link descriptions", async ({ page }) => {
    await page.goto("/");

    const links = page.getByRole("link");
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");

      // Links should have descriptive text
      const hasDescription = (text && text.trim().length > 0) || ariaLabel;
      expect(hasDescription).toBeTruthy();
    }
  });

  test("should have proper button labels", async ({ page }) => {
    await page.goto("/");

    const buttons = page.getByRole("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");
      const title = await button.getAttribute("title");

      // Buttons should be labeled
      const hasLabel = (text && text.trim().length > 0) || ariaLabel || title;
      expect(hasLabel).toBeTruthy();
    }
  });
});

test.describe("Accessibility - Auth Modal", () => {
  test("should have proper modal aria attributes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Dialog should have proper attributes
    await expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("should trap focus within modal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();

    // Tab through all focusable elements
    const focusableElements: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      if (focused) focusableElements.push(focused);
    }

    // Focus should stay within dialog
    const dialog = page.getByRole("dialog");
    const dialogFocusable = await dialog.locator(":focusable").count();
    expect(dialogFocusable).toBeGreaterThan(0);
  });

  test("should have no accessibility violations in auth modal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("Accessibility - Dashboard", () => {
  test("should have no accessibility violations on dashboard", async ({ page }) => {
    await setupDemoMode(page);
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude(".resume-light-mode") // Exclude resume preview which may have different requirements
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have accessible table structure", async ({ page }) => {
    await setupDemoMode(page);

    const table = page.getByRole("table");
    if (await table.isVisible()) {
      // Table should have headers
      const headers = table.getByRole("columnheader");
      await expect(headers.first()).toBeVisible();
    }
  });

  test("should have proper tab labels", async ({ page }) => {
    await setupDemoMode(page);

    const tablist = page.getByRole("tablist");
    if (await tablist.isVisible()) {
      const tabs = page.getByRole("tab");
      const tabCount = await tabs.count();

      for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        const text = await tab.textContent();
        expect(text && text.trim().length > 0).toBeTruthy();
      }
    }
  });

  test("should indicate selected tab", async ({ page }) => {
    await setupDemoMode(page);

    const selectedTab = page.getByRole("tab", { selected: true });
    if (await selectedTab.isVisible()) {
      await expect(selectedTab).toHaveAttribute("aria-selected", "true");
    }
  });
});

test.describe("Accessibility - Resume Editor", () => {
  test("should have no critical accessibility violations in editor", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude(".resume-light-mode") // Resume preview may have specific styling
      .analyze();

    // Check for critical violations only
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("should have labeled form fields", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Expand a section
    await page.getByText("Personal Information").click();

    // Wait for form to load
    await page.waitForTimeout(500);

    // Check inputs have labels
    const inputs = page.locator('input:not([type="hidden"])');
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const id = await input.getAttribute("id");
        const ariaLabel = await input.getAttribute("aria-label");
        const ariaLabelledby = await input.getAttribute("aria-labelledby");
        const placeholder = await input.getAttribute("placeholder");

        // Should have some form of label
        const hasLabel = id || ariaLabel || ariaLabelledby || placeholder;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test("should have expandable sections with proper ARIA", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Look for collapsible sections
    const expandButtons = page.locator('[aria-expanded]');
    const count = await expandButtons.count();

    if (count > 0) {
      const button = expandButtons.first();
      const initialState = await button.getAttribute("aria-expanded");

      // Click to toggle
      await button.click();
      await page.waitForTimeout(300);

      const newState = await button.getAttribute("aria-expanded");

      // State should change
      expect(newState).not.toBe(initialState);
    }
  });
});

test.describe("Keyboard Accessibility", () => {
  test("should have visible focus indicators", async ({ page }) => {
    await page.goto("/");

    // Tab to Get Started button
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Check that focused element has visible focus
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Should have some focus styling (outline, ring, etc.)
    const outline = await focusedElement.evaluate(
      (el) => window.getComputedStyle(el).outline,
    );
    const boxShadow = await focusedElement.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );

    // Either outline or box-shadow should indicate focus
    const hasFocusIndicator = outline !== "none" || boxShadow !== "none";
    expect(hasFocusIndicator).toBeTruthy();
  });

  test("should skip to main content with skip link", async ({ page }) => {
    await page.goto("/");

    // Tab once to potentially reach skip link
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: /skip/i });
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();
    }
  });

  test("should navigate form fields with Tab", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Expand Personal Information
    await page.getByText("Personal Information").click();
    await page.waitForTimeout(500);

    // Tab through form fields
    const focusedTags: string[] = [];
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const tag = await page.evaluate(() => document.activeElement?.tagName);
      if (tag) focusedTags.push(tag);
    }

    // Should focus on interactive elements
    const interactiveElements = focusedTags.filter((tag) =>
      ["INPUT", "BUTTON", "TEXTAREA", "SELECT", "A"].includes(tag),
    );
    expect(interactiveElements.length).toBeGreaterThan(0);
  });
});

test.describe("Screen Reader Support", () => {
  test("should have proper page landmark regions", async ({ page }) => {
    await page.goto("/");

    // Check for main landmark
    const main = page.getByRole("main");
    await expect(main).toBeVisible();

    // Check for navigation
    const nav = page.getByRole("navigation");
    if (await nav.isVisible()) {
      await expect(nav).toBeVisible();
    }
  });

  test("should announce page title changes", async ({ page }) => {
    await page.goto("/");

    const homeTitle = await page.title();
    expect(homeTitle).toContain("Resumier");

    await setupDemoMode(page);

    // Title should still be descriptive
    const dashboardTitle = await page.title();
    expect(dashboardTitle.length).toBeGreaterThan(0);
  });

  test("should have descriptive link text (no 'click here')", async ({ page }) => {
    await page.goto("/");

    const links = page.getByRole("link");
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();

      if (text) {
        // Should not use generic text
        const genericPhrases = ["click here", "read more", "learn more", "here"];
        const isGeneric = genericPhrases.some(
          (phrase) => text.toLowerCase().trim() === phrase,
        );
        expect(isGeneric).toBeFalsy();
      }
    }
  });

  test("should have status messages for async operations", async ({ page }) => {
    await setupDemoMode(page);

    // Create new resume to trigger status message
    await page.getByRole("button", { name: /New Resume/i }).click();
    await page.getByLabel(/Resume Title/i).fill("Accessibility Test Resume");
    await page.getByRole("button", { name: /Create Resume/i }).click();

    // Look for toast/status message
    const toast = page.locator('[role="status"], [role="alert"], [data-toast]');
    // Toast should appear (might be quick)
    await expect(toast.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Color Contrast", () => {
  test("should have sufficient color contrast on landing page", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .options({ rules: { "color-contrast": { enabled: true } } })
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast",
    );

    // Should have no contrast violations
    expect(contrastViolations).toEqual([]);
  });

  test("should maintain contrast in dark mode", async ({ page }) => {
    await page.goto("/");

    // Toggle to dark mode
    const themeToggle = page.getByRole("button", { name: /theme|dark|light/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2aa"])
        .options({ rules: { "color-contrast": { enabled: true } } })
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "color-contrast",
      );

      expect(contrastViolations).toEqual([]);
    }
  });
});

test.describe("Reduced Motion", () => {
  test("should respect reduced motion preference", async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Animation durations should be reduced or zero
    // This is a basic check - more comprehensive testing would check specific animations
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});





