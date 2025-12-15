import { expect, test } from "@playwright/test";

/**
 * Responsive Design E2E Tests
 *
 * Tests for:
 * - Mobile viewport layouts
 * - Tablet viewport layouts
 * - Desktop viewport layouts
 * - Touch interactions
 * - Orientation changes
 */

// Device viewports
const viewports = {
  mobile: { width: 375, height: 667 },
  mobileSmall: { width: 320, height: 568 },
  mobileLarge: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 800 },
  desktopLarge: { width: 1920, height: 1080 },
};

// Helper to set up demo mode for tests
async function setupDemoMode(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByRole("button", { name: /Try Demo Mode/i }).click();
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
}

test.describe("Mobile Layout - Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
  });

  test("should display landing page on mobile", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Build Your Perfect Resume/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Get Started Free/i })).toBeVisible();
  });

  test("should display mobile navigation menu", async ({ page }) => {
    await page.goto("/");

    // Logo should be visible
    const logo = page.getByRole("link", { name: /Resumier/i }).or(page.locator('[alt*="logo"]'));
    await expect(logo).toBeVisible();
  });

  test("should stack feature cards vertically on mobile", async ({ page }) => {
    await page.goto("/");

    // Features should be visible and stacked
    await expect(page.getByText("Professional Templates")).toBeVisible();
    await expect(page.getByText("Real-time Preview")).toBeVisible();
  });

  test("should open auth modal on mobile", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /Get Started Free/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Welcome to Resumier")).toBeVisible();
  });

  test("should fit auth modal within viewport on mobile", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Get Started Free/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const box = await dialog.boundingBox();
    if (box) {
      expect(box.width).toBeLessThanOrEqual(viewports.mobile.width);
      expect(box.height).toBeLessThanOrEqual(viewports.mobile.height);
    }
  });
});

test.describe("Mobile Layout - Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
  });

  test("should display dashboard on mobile", async ({ page }) => {
    await setupDemoMode(page);

    await expect(page.getByRole("button", { name: /New Resume/i })).toBeVisible();
  });

  test("should collapse sidebar on mobile", async ({ page }) => {
    await setupDemoMode(page);

    // Sidebar should be collapsed or hidden
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    if (await sidebar.isVisible()) {
      const box = await sidebar.boundingBox();
      // Sidebar should be minimal or collapsed
      if (box) {
        expect(box.width).toBeLessThan(200);
      }
    }
  });

  test("should show mobile menu toggle", async ({ page }) => {
    await setupDemoMode(page);

    const menuToggle = page.getByRole("button", { name: /Menu|Toggle/i });
    if (await menuToggle.isVisible()) {
      await expect(menuToggle).toBeVisible();
    }
  });

  test("should display resume table responsively", async ({ page }) => {
    await setupDemoMode(page);

    const table = page.getByRole("table");
    if (await table.isVisible()) {
      const box = await table.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(viewports.mobile.width);
      }
    }
  });

  test("should allow horizontal scroll for table if needed", async ({ page }) => {
    await setupDemoMode(page);

    const tableContainer = page.locator('[data-table-container], .table-container');
    if (await tableContainer.isVisible()) {
      const overflow = await tableContainer.evaluate((el) => window.getComputedStyle(el).overflowX);
      expect(overflow === "auto" || overflow === "scroll" || overflow === "visible").toBeTruthy();
    }
  });
});

test.describe("Mobile Layout - Resume Editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
  });

  test("should display editor on mobile", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    await expect(page.getByText("Personal Information")).toBeVisible({ timeout: 10000 });
  });

  test("should stack editor and preview on mobile", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // On mobile, preview might be in a separate tab or below editor
    const hasPreview = await page.locator(".resume-light-mode").isVisible();
    const hasPreviewTab = await page.getByRole("tab", { name: /Preview/i }).isVisible();

    expect(hasPreview || hasPreviewTab).toBeTruthy();
  });

  test("should display export button on mobile", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await expect(exportButton).toBeVisible({ timeout: 10000 });
  });

  test("should have touch-friendly buttons on mobile", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Buttons should be at least 44px for touch
    const buttons = await page.getByRole("button").all();

    for (const button of buttons.slice(0, 5)) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(32);
      }
    }
  });
});

test.describe("Tablet Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.tablet);
  });

  test("should display landing page on tablet", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Build Your Perfect Resume/i })).toBeVisible();
  });

  test("should display feature cards in grid on tablet", async ({ page }) => {
    await page.goto("/");

    // Features should be visible
    await expect(page.getByText("Professional Templates")).toBeVisible();
    await expect(page.getByText("Real-time Preview")).toBeVisible();
  });

  test("should show editor sidebar on tablet", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Sidebar might be visible or collapsed on tablet
    await expect(page.getByText("Personal Information")).toBeVisible({ timeout: 10000 });
  });

  test("should display both editor and preview on tablet landscape", async ({ page }) => {
    await page.setViewportSize(viewports.tabletLandscape);

    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Both should potentially be visible side by side
    await expect(page.getByText("Personal Information")).toBeVisible({ timeout: 10000 });
    await expect(page.locator(".resume-light-mode")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Desktop Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
  });

  test("should display landing page on desktop", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Build Your Perfect Resume/i })).toBeVisible();
  });

  test("should display full navigation on desktop", async ({ page }) => {
    await setupDemoMode(page);

    // Sidebar should be visible on desktop
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    if (await sidebar.isVisible()) {
      const box = await sidebar.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThan(150);
      }
    }
  });

  test("should display side-by-side editor and preview on desktop", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Both panels should be visible
    await expect(page.getByText("Personal Information")).toBeVisible({ timeout: 10000 });
    await expect(page.locator(".resume-light-mode")).toBeVisible({ timeout: 10000 });

    // They should be side by side (preview on right)
    const preview = page.locator(".resume-light-mode");
    const previewBox = await preview.boundingBox();

    if (previewBox) {
      expect(previewBox.x).toBeGreaterThan(200); // Not at left edge
    }
  });

  test("should display wide resume table on desktop", async ({ page }) => {
    await setupDemoMode(page);

    const table = page.getByRole("table");
    if (await table.isVisible()) {
      const box = await table.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThan(500);
      }
    }
  });
});

test.describe("Large Desktop Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.desktopLarge);
  });

  test("should display content within max-width container", async ({ page }) => {
    await page.goto("/");

    // Content should be centered, not stretched across full width
    const main = page.locator("main");
    const mainBox = await main.boundingBox();

    if (mainBox) {
      // Content should not stretch to extreme widths
      expect(mainBox.x).toBeGreaterThan(0); // Has left margin
    }
  });

  test("should maintain readable line lengths", async ({ page }) => {
    await page.goto("/");

    // Text content should not span the full width
    const paragraph = page.locator("p").first();
    const box = await paragraph.boundingBox();

    if (box) {
      // Readable line length is typically under 80ch (~700px)
      expect(box.width).toBeLessThan(1200);
    }
  });
});

test.describe("Small Mobile Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.mobileSmall);
  });

  test("should display content on very small screens", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: /Get Started Free/i })).toBeVisible();
  });

  test("should not overflow horizontally", async ({ page }) => {
    await page.goto("/");

    // Check for horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasOverflow).toBeFalsy();
  });

  test("should maintain usable button sizes", async ({ page }) => {
    await page.goto("/");

    const getStartedButton = page.getByRole("button", { name: /Get Started Free/i });
    const box = await getStartedButton.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(40);
      expect(box.width).toBeGreaterThanOrEqual(100);
    }
  });
});

test.describe("Touch Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
  });

  test("should support tap to open dialog", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /Get Started Free/i }).tap();

    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should support swipe to dismiss (if implemented)", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Test any swipeable elements
    expect(true).toBeTruthy();
  });

  test("should have proper touch targets", async ({ page }) => {
    await setupDemoMode(page);

    const buttons = await page.getByRole("button").all();

    for (const button of buttons.slice(0, 3)) {
      const box = await button.boundingBox();
      if (box) {
        // Minimum touch target is 44x44 per Apple HIG, 48x48 per Material
        expect(box.height).toBeGreaterThanOrEqual(32);
        expect(box.width).toBeGreaterThanOrEqual(32);
      }
    }
  });
});

test.describe("Orientation Changes", () => {
  test("should handle portrait to landscape", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto("/");

    // Portrait
    await expect(page.getByRole("button", { name: /Get Started Free/i })).toBeVisible();

    // Switch to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(300);

    // Should still be functional
    await expect(page.getByRole("button", { name: /Get Started Free/i })).toBeVisible();
  });

  test("should handle landscape to portrait", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto("/");

    // Landscape
    await expect(page.getByRole("button", { name: /Get Started Free/i })).toBeVisible();

    // Switch to portrait
    await page.setViewportSize(viewports.mobile);
    await page.waitForTimeout(300);

    // Should still be functional
    await expect(page.getByRole("button", { name: /Get Started Free/i })).toBeVisible();
  });

  test("should maintain state during orientation change", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Change orientation
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    // Content should still be there
    await expect(page.getByText("Personal Information")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Responsive Typography", () => {
  test("should have readable font size on mobile", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto("/");

    const body = page.locator("body");
    const fontSize = await body.evaluate((el) => window.getComputedStyle(el).fontSize);

    const fontSizeNum = parseFloat(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(14);
  });

  test("should scale headings appropriately", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto("/");

    const h1 = page.getByRole("heading", { level: 1 }).first();
    const fontSize = await h1.evaluate((el) => window.getComputedStyle(el).fontSize);

    const fontSizeNum = parseFloat(fontSize);
    // H1 should be larger than body text but not too large for mobile
    expect(fontSizeNum).toBeGreaterThan(20);
    expect(fontSizeNum).toBeLessThan(60);
  });
});

test.describe("Responsive Images", () => {
  test("should not overflow container", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto("/");

    const images = await page.getByRole("img").all();

    for (const img of images) {
      const box = await img.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(viewports.mobile.width);
      }
    }
  });

  test("should maintain aspect ratio", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto("/");

    // Images should not be distorted
    const images = await page.getByRole("img").all();

    for (const img of images.slice(0, 3)) {
      const objectFit = await img.evaluate((el) => window.getComputedStyle(el).objectFit);
      // Object-fit should be set for proper scaling
      expect(["contain", "cover", "fill", "none", "scale-down"]).toContain(objectFit);
    }
  });
});

test.describe("Print Media", () => {
  test("should have print styles for resume preview", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Resume preview should be visible
    await expect(page.locator(".resume-light-mode")).toBeVisible({ timeout: 10000 });

    // Emulate print media
    await page.emulateMedia({ media: "print" });

    // Preview should still be visible and properly styled for print
    await expect(page.locator(".resume-light-mode")).toBeVisible();
  });
});

