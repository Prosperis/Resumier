import { expect, test } from "@playwright/test";

/**
 * Authentication Flow E2E Tests
 *
 * Tests for:
 * - Landing page and auth modal
 * - Guest mode access
 * - Demo mode functionality
 * - Protected route redirects
 */

test.describe("Authentication Flow", () => {
  test.describe("Landing Page", () => {
    test("should display the landing page with Get Started button", async ({ page }) => {
      await page.goto("/");

      // Check page title
      await expect(page).toHaveTitle(/Resumier/);

      // Check hero section content
      await expect(page.getByRole("heading", { name: /Build Your Perfect Resume/i })).toBeVisible();
      await expect(page.getByText(/Professional resume builder/i)).toBeVisible();

      // Check Get Started button
      await expect(page.getByRole("button", { name: /Get Started Free/i })).toBeVisible();
    });

    test("should display feature cards", async ({ page }) => {
      await page.goto("/");

      // Check feature cards are present
      await expect(page.getByText("Professional Templates")).toBeVisible();
      await expect(page.getByText("Real-time Preview")).toBeVisible();
      await expect(page.getByText("Easy Export")).toBeVisible();
      await expect(page.getByText("Cloud Sync")).toBeVisible();
    });

    test("should display stats section", async ({ page }) => {
      await page.goto("/");

      // Check stats are visible
      await expect(page.getByText("10K+")).toBeVisible();
      await expect(page.getByText("Resumes Created")).toBeVisible();
      await expect(page.getByText("50+")).toBeVisible();
      await expect(page.getByText("Templates")).toBeVisible();
    });
  });

  test.describe("Auth Modal", () => {
    test("should open auth modal when clicking Get Started", async ({ page }) => {
      await page.goto("/");

      // Click Get Started button
      await page.getByRole("button", { name: /Get Started Free/i }).click();

      // Modal should be visible
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.getByText("Welcome to Resumier")).toBeVisible();
    });

    test("should display cloud storage provider buttons", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /Get Started Free/i }).click();

      // Check cloud storage providers are present
      await expect(page.getByRole("button", { name: /gDrive/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /Dropbox/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /OneDrive/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /Box/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /pCloud/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /MEGA/i })).toBeVisible();
    });

    test("should display Try Demo Mode button", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /Get Started Free/i }).click();

      await expect(page.getByRole("button", { name: /Try Demo Mode/i })).toBeVisible();
    });

    test("should display Continue as Guest option", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /Get Started Free/i }).click();

      await expect(page.getByText(/Continue with local storage only/i)).toBeVisible();
    });

    test("should close modal when clicking outside", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /Get Started Free/i }).click();

      // Wait for modal to be visible
      await expect(page.getByRole("dialog")).toBeVisible();

      // Press Escape to close
      await page.keyboard.press("Escape");

      // Modal should be closed
      await expect(page.getByRole("dialog")).not.toBeVisible();
    });
  });

  test.describe("Guest Mode", () => {
    test("should navigate to new resume page when guest has no data", async ({ page }) => {
      // Clear any existing data
      await page.goto("/");
      await page.evaluate(() => {
        indexedDB.deleteDatabase("resumier-resumes");
        indexedDB.deleteDatabase("resumier-resume-store");
      });

      await page.getByRole("button", { name: /Get Started Free/i }).click();
      await page.getByText(/Continue with local storage only/i).click();

      // Should navigate to new resume page
      await expect(page).toHaveURL(/\/resume\/new/);
    });

    test("should access dashboard after enabling guest mode with existing data", async ({
      page,
    }) => {
      await page.goto("/");

      // First, create some guest data by going through the flow
      await page.getByRole("button", { name: /Get Started Free/i }).click();
      await page.getByText(/Continue with local storage only/i).click();

      // If redirected to new resume, go back to home
      await page.goto("/");

      // Now try guest mode again - should have data
      await page.getByRole("button", { name: /Get Started Free/i }).click();
      await page.getByText(/Continue with local storage only/i).click();

      // Should navigate to dashboard or new resume
      await expect(page).toHaveURL(/\/(dashboard|resume\/new)/);
    });
  });

  test.describe("Demo Mode", () => {
    test("should load demo mode with sample data", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /Get Started Free/i }).click();

      // Click Try Demo Mode
      await page.getByRole("button", { name: /Try Demo Mode/i }).click();

      // Wait for navigation to dashboard
      await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
    });

    test("should display demo resumes on dashboard", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /Get Started Free/i }).click();
      await page.getByRole("button", { name: /Try Demo Mode/i }).click();

      // Wait for dashboard to load
      await expect(page).toHaveURL("/dashboard", { timeout: 10000 });

      // Should see resume content (demo data includes John Doe's resume)
      await expect(page.getByText(/Resume/i).first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect to home when accessing dashboard without auth", async ({ page }) => {
      // Clear any existing auth state
      await page.goto("/");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
        indexedDB.deleteDatabase("resumier-resumes");
        indexedDB.deleteDatabase("resumier-resume-store");
        indexedDB.deleteDatabase("resumier-auth-store");
      });

      // Try to access dashboard directly
      await page.goto("/dashboard");

      // Should redirect to home
      await expect(page).toHaveURL("/");
    });

    test("should redirect to home when accessing resume editor without auth", async ({ page }) => {
      // Clear any existing auth state
      await page.goto("/");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Try to access resume editor directly
      await page.goto("/resume/some-id");

      // Should redirect to home
      await expect(page).toHaveURL("/");
    });

    test("should redirect to home when accessing new resume without auth", async ({ page }) => {
      // Clear any existing auth state
      await page.goto("/");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Try to access new resume page directly
      await page.goto("/resume/new");

      // Should redirect to home
      await expect(page).toHaveURL("/");
    });
  });
});






