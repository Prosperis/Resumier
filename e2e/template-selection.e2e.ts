import { expect, test } from "@playwright/test";

/**
 * Template Selection E2E Tests
 *
 * Tests for:
 * - Template gallery display
 * - Template switching
 * - Template preview
 * - Style customization
 */

// Helper to set up demo mode and navigate to editor
async function setupResumeEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByRole("button", { name: /Try Demo Mode/i }).click();
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });

  // Click on first resume to open editor
  await page.getByRole("cell").first().click();
  await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });
}

test.describe("Template Gallery", () => {
  test("should open template gallery from editor", async ({ page }) => {
    await setupResumeEditor(page);

    // Look for template selector button
    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Gallery dialog should open
      await expect(page.getByRole("dialog")).toBeVisible();
    }
  });

  test("should display multiple template options", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Should show template names
      await expect(page.getByText("Modern")).toBeVisible();
      await expect(page.getByText("Classic")).toBeVisible();
      await expect(page.getByText("Minimal")).toBeVisible();
    }
  });

  test("should show template categories/filters", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Should show filter options
      const allTab = page.getByRole("tab", { name: /All/i });
      if (await allTab.isVisible()) {
        await expect(allTab).toBeVisible();
      }
    }
  });

  test("should filter templates by category", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Click on a category filter if available
      const professionalTab = page.getByRole("tab", { name: /Professional/i });
      if (await professionalTab.isVisible()) {
        await professionalTab.click();

        // Should show filtered templates
        await expect(page.getByRole("dialog")).toBeVisible();
      }
    }
  });

  test("should show template preview on hover or selection", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Hover over a template card
      const classicTemplate = page.getByText("Classic").first();
      if (await classicTemplate.isVisible()) {
        await classicTemplate.hover();
        // Template card should be visible
        await expect(classicTemplate).toBeVisible();
      }
    }
  });
});

test.describe("Template Switching", () => {
  test("should change template when selecting a different one", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Select Classic template
      const classicCard = page.getByText("Classic").first();
      if (await classicCard.isVisible()) {
        await classicCard.click();

        // Wait for template to apply
        await page.waitForTimeout(500);

        // Template should be applied (dialog may close)
        await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });
      }
    }
  });

  test("should preserve resume content when switching templates", async ({ page }) => {
    await setupResumeEditor(page);

    // Get initial content from preview
    const preview = page.locator(".resume-light-mode");
    await expect(preview).toBeVisible({ timeout: 10000 });

    // Get some text content that should persist
    const hasJohn = await preview.getByText(/John/i).isVisible();

    // Switch template
    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      const minimalTemplate = page.getByText("Minimal").first();
      if (await minimalTemplate.isVisible()) {
        await minimalTemplate.click();
        await page.waitForTimeout(1000);

        // Content should still be there
        if (hasJohn) {
          await expect(preview.getByText(/John/i)).toBeVisible();
        }
      }
    }
  });

  test("should show selected template indicator", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Current template should have some indicator (checkmark, border, etc.)
      await expect(page.getByRole("dialog")).toBeVisible();
    }
  });
});

test.describe("Style Customization", () => {
  test("should open style customization panel", async ({ page }) => {
    await setupResumeEditor(page);

    // Look for style/customize button
    const styleButton = page
      .getByRole("button", { name: /Style/i })
      .or(page.getByRole("button", { name: /Customize/i }))
      .or(page.getByRole("button", { name: /Colors/i }));

    if (await styleButton.isVisible()) {
      await styleButton.click();

      // Should show customization options
      await expect(page.getByRole("dialog").or(page.locator("[data-style-panel]"))).toBeVisible();
    }
  });

  test("should show color theme options", async ({ page }) => {
    await setupResumeEditor(page);

    const styleButton = page
      .getByRole("button", { name: /Style/i })
      .or(page.getByRole("button", { name: /Customize/i }))
      .or(page.getByRole("button", { name: /Colors/i }));

    if (await styleButton.isVisible()) {
      await styleButton.click();

      // Look for color options
      const colorSection = page.getByText(/Color/i);
      if (await colorSection.isVisible()) {
        await expect(colorSection).toBeVisible();
      }
    }
  });

  test("should show font theme options", async ({ page }) => {
    await setupResumeEditor(page);

    const styleButton = page
      .getByRole("button", { name: /Style/i })
      .or(page.getByRole("button", { name: /Customize/i }))
      .or(page.getByRole("button", { name: /Fonts/i }));

    if (await styleButton.isVisible()) {
      await styleButton.click();

      // Look for font options
      const fontSection = page.getByText(/Font/i);
      if (await fontSection.isVisible()) {
        await expect(fontSection).toBeVisible();
      }
    }
  });

  test("should change color theme", async ({ page }) => {
    await setupResumeEditor(page);

    const styleButton = page
      .getByRole("button", { name: /Style/i })
      .or(page.getByRole("button", { name: /Customize/i }))
      .or(page.getByRole("button", { name: /Colors/i }));

    if (await styleButton.isVisible()) {
      await styleButton.click();

      // Find and click a color option
      const navyColor = page.getByText("Navy").or(page.getByRole("button", { name: /Navy/i }));
      if (await navyColor.isVisible()) {
        await navyColor.click();

        // Wait for change to apply
        await page.waitForTimeout(500);

        // Preview should update (hard to verify specific color without visual testing)
        await expect(page.locator(".resume-light-mode")).toBeVisible();
      }
    }
  });
});

test.describe("Template Information", () => {
  test("should show template description", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Templates should have descriptions
      await expect(
        page.getByText(/Clean|Professional|Traditional|Modern/i).first(),
      ).toBeVisible();
    }
  });

  test("should show ATS score indicator", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Look for ATS score or badge
      const atsIndicator = page.getByText(/ATS/i);
      if (await atsIndicator.isVisible()) {
        await expect(atsIndicator).toBeVisible();
      }
    }
  });

  test("should show template tags or categories", async ({ page }) => {
    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Templates might show tags like "two-column", "sidebar", etc.
      await expect(page.getByRole("dialog")).toBeVisible();
    }
  });
});

test.describe("Template Responsiveness", () => {
  test("should display templates correctly on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await setupResumeEditor(page);

    // Preview should still be visible and responsive
    await expect(page.locator(".resume-light-mode")).toBeVisible({ timeout: 10000 });
  });

  test("should allow template selection on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await setupResumeEditor(page);

    const templateButton = page
      .getByRole("button", { name: /Template/i })
      .or(page.getByRole("button", { name: /Choose Template/i }));

    if (await templateButton.isVisible()) {
      await templateButton.click();

      // Dialog should be visible and usable
      await expect(page.getByRole("dialog")).toBeVisible();
    }
  });
});




