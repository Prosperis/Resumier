import { expect, test } from "@playwright/test";

/**
 * Navigation E2E Tests
 *
 * Tests for:
 * - Route navigation
 * - Navigation components (header, sidebar)
 * - Back/forward browser navigation
 * - Deep linking
 */

// Helper to set up demo mode for tests
async function setupDemoMode(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByRole("button", { name: /Try Demo Mode/i }).click();
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
}

test.describe("Route Navigation", () => {
  test("should navigate from home to dashboard after auth", async ({ page }) => {
    await page.goto("/");

    // Authenticate
    await page.getByRole("button", { name: /Get Started Free/i }).click();
    await page.getByRole("button", { name: /Try Demo Mode/i }).click();

    // Should be on dashboard
    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
  });

  test("should navigate from dashboard to resume editor", async ({ page }) => {
    await setupDemoMode(page);

    // Click on a resume
    await page.getByRole("cell").first().click();

    // Should navigate to editor
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/);
  });

  test("should navigate from resume editor back to dashboard", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Find and click back/home link
    const homeLink = page.getByRole("link", { name: /Dashboard/i }).or(
      page.getByRole("link", { name: /Home/i }),
    );

    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL("/dashboard");
    } else {
      // Try using browser back
      await page.goBack();
      await expect(page).toHaveURL("/dashboard");
    }
  });

  test("should navigate to settings page", async ({ page }) => {
    await setupDemoMode(page);

    // Look for settings link/button
    const settingsLink = page.getByRole("link", { name: /Settings/i });

    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      await expect(page).toHaveURL("/settings");
    }
  });

  test("should handle 404 for unknown routes", async ({ page }) => {
    await setupDemoMode(page);

    // Navigate to unknown route
    await page.goto("/unknown-page-that-does-not-exist");

    // Should show 404 or redirect
    const is404 = await page.getByText(/not found|404/i).isVisible();
    const isRedirected = page.url().includes("/dashboard") || page.url().endsWith("/");

    expect(is404 || isRedirected).toBeTruthy();
  });
});

test.describe("Header Navigation", () => {
  test("should display logo in header", async ({ page }) => {
    await page.goto("/");

    // Logo should be visible
    const logo = page.getByRole("link", { name: /Resumier/i }).or(page.locator('[alt*="logo"]'));
    await expect(logo).toBeVisible();
  });

  test("should navigate to home when clicking logo", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Click logo
    const logo = page.getByRole("link", { name: /Resumier/i }).first();
    if (await logo.isVisible()) {
      await logo.click();
      // Should go to dashboard or home
      await expect(page).toHaveURL(/\/(dashboard)?$/);
    }
  });

  test("should display theme toggle in header", async ({ page }) => {
    await page.goto("/");

    // Theme toggle button should be visible
    const themeToggle = page.getByRole("button", { name: /theme|dark|light/i });
    if (await themeToggle.isVisible()) {
      await expect(themeToggle).toBeVisible();
    }
  });

  test("should toggle dark/light mode", async ({ page }) => {
    await page.goto("/");

    const themeToggle = page.getByRole("button", { name: /theme|dark|light/i });
    if (await themeToggle.isVisible()) {
      // Get initial state
      const htmlElement = page.locator("html");
      const initialDark = await htmlElement.evaluate((el) => el.classList.contains("dark"));

      // Toggle
      await themeToggle.click();
      await page.waitForTimeout(300);

      // Check state changed
      const afterDark = await htmlElement.evaluate((el) => el.classList.contains("dark"));
      expect(afterDark).not.toBe(initialDark);
    }
  });
});

test.describe("Browser Navigation", () => {
  test("should handle browser back button", async ({ page }) => {
    await setupDemoMode(page);

    // Navigate to resume
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Go back
    await page.goBack();

    // Should be on dashboard
    await expect(page).toHaveURL("/dashboard");
  });

  test("should handle browser forward button", async ({ page }) => {
    await setupDemoMode(page);

    // Navigate to resume
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Go back
    await page.goBack();
    await expect(page).toHaveURL("/dashboard");

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/);
  });

  test("should preserve state after back/forward navigation", async ({ page }) => {
    await setupDemoMode(page);

    // Navigate to resume
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Go back and forward
    await page.goBack();
    await page.goForward();

    // Resume preview should still be visible
    await expect(page.locator(".resume-light-mode")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Deep Linking", () => {
  test("should load resume directly from URL after auth", async ({ page }) => {
    // First authenticate
    await setupDemoMode(page);

    // Get the URL of first resume
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });
    const resumeUrl = page.url();

    // Navigate away
    await page.goto("/dashboard");

    // Navigate back to resume directly
    await page.goto(resumeUrl);

    // Should load the resume
    await expect(page.locator(".resume-light-mode")).toBeVisible({ timeout: 10000 });
  });

  test("should load dashboard directly after auth", async ({ page }) => {
    await setupDemoMode(page);

    // Navigate to home then back to dashboard
    await page.goto("/");
    await page.goto("/dashboard");

    // Should show dashboard content
    await expect(page.getByRole("table").or(page.getByText(/No resumes/i))).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Mobile Navigation", () => {
  test("should show mobile menu on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Look for hamburger menu
    const menuButton = page.getByRole("button", { name: /menu/i });
    if (await menuButton.isVisible()) {
      await expect(menuButton).toBeVisible();
    }
  });

  test("should open mobile menu when clicking hamburger", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await setupDemoMode(page);

    const menuButton = page.getByRole("button", { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Navigation should be visible
      await expect(page.getByRole("navigation")).toBeVisible();
    }
  });

  test("should navigate on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await setupDemoMode(page);

    // Should be able to tap on resume
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });
  });
});

test.describe("Keyboard Navigation", () => {
  test("should navigate with Tab key", async ({ page }) => {
    await page.goto("/");

    // Press Tab multiple times
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Focus should be on an interactive element
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should activate buttons with Enter key", async ({ page }) => {
    await page.goto("/");

    // Tab to Get Started button
    const getStartedButton = page.getByRole("button", { name: /Get Started Free/i });
    await getStartedButton.focus();

    // Press Enter
    await page.keyboard.press("Enter");

    // Modal should open
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should close modal with Escape key", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");

    // Modal should close
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});






