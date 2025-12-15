import { expect, test } from "@playwright/test";

/**
 * Dashboard E2E Tests
 *
 * Basic tests for dashboard functionality.
 * For more comprehensive tests, see:
 * - authentication.e2e.ts
 * - resume-workflow.e2e.ts
 * - template-selection.e2e.ts
 * - navigation.e2e.ts
 * - accessibility.e2e.ts
 * - export.e2e.ts
 */

test.describe("Resume Dashboard", () => {
  test("should load the landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Resumier/);
  });

  test("should display Get Started button on landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Get Started Free/i })).toBeVisible();
  });

  test("should display hero section with main headline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Build Your Perfect Resume/i })).toBeVisible();
  });

  test("should open auth modal when clicking Get Started", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Welcome to Resumier")).toBeVisible();
  });

  test("should access dashboard after demo mode", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();
    await page.getByRole("button", { name: /Try Demo Mode/i }).click();
    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
  });

  test("should display New Resume button on dashboard", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();
    await page.getByRole("button", { name: /Try Demo Mode/i }).click();
    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
    await expect(page.getByRole("button", { name: /New Resume/i })).toBeVisible();
  });

  test("should display resume table or empty state", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();
    await page.getByRole("button", { name: /Try Demo Mode/i }).click();
    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });

    // Should show either table with resumes or empty state message
    const hasTable = await page.getByRole("table").isVisible();
    const hasEmptyState = await page.getByText(/No resumes yet/i).isVisible();

    expect(hasTable || hasEmptyState).toBeTruthy();
  });
});
