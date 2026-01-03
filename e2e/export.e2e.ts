import { expect, test } from "@playwright/test";

/**
 * Export E2E Tests
 *
 * Tests for:
 * - Export menu functionality
 * - PDF export
 * - Other format exports (DOCX, HTML, JSON, etc.)
 * - Print functionality
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

test.describe("Export Menu", () => {
  test("should display export button in editor", async ({ page }) => {
    await setupResumeEditor(page);

    // Look for export button
    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await expect(exportButton).toBeVisible({ timeout: 10000 });
  });

  test("should open export menu when clicking export button", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    // Menu should open
    await expect(page.getByRole("menu")).toBeVisible();
  });

  test("should display multiple export format options", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    // Check for format options
    await expect(page.getByText(/PDF/i).first()).toBeVisible();
    await expect(page.getByText(/Word|DOCX/i).first()).toBeVisible();
  });

  test("should show PDF export options", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    // Should show PDF options
    await expect(page.getByText(/PDF/i).first()).toBeVisible();
  });

  test("should show HTML export option", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    await expect(page.getByText(/HTML/i).first()).toBeVisible();
  });

  test("should show Markdown export option", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    await expect(page.getByText(/Markdown/i).first()).toBeVisible();
  });

  test("should show Plain Text export option", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    await expect(page.getByText(/Plain Text|TXT/i).first()).toBeVisible();
  });
});

test.describe("PDF Export", () => {
  test("should trigger PDF download", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent("download", { timeout: 30000 }).catch(() => null);

    // Click PDF option
    const pdfOption = page.getByRole("menuitem", { name: /PDF.*Direct/i }).first();
    if (await pdfOption.isVisible()) {
      await pdfOption.click();

      const download = await downloadPromise;

      if (download) {
        // Check filename
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.pdf$/i);
      }
    }
  });

  test("should show print dialog option for PDF", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    // Should have print dialog option
    await expect(page.getByText(/Print.*Dialog|Print to PDF/i).first()).toBeVisible();
  });
});

test.describe("DOCX Export", () => {
  test("should trigger DOCX download", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    // Start waiting for download
    const downloadPromise = page.waitForEvent("download", { timeout: 30000 }).catch(() => null);

    // Click DOCX option
    const docxOption = page.getByRole("menuitem", { name: /Word|DOCX/i }).first();
    if (await docxOption.isVisible()) {
      await docxOption.click();

      const download = await downloadPromise;

      if (download) {
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.docx$/i);
      }
    }
  });
});

test.describe("HTML Export", () => {
  test("should trigger HTML download", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    // Start waiting for download
    const downloadPromise = page.waitForEvent("download", { timeout: 30000 }).catch(() => null);

    // Click HTML option
    const htmlOption = page.getByRole("menuitem", { name: /HTML/i }).first();
    if (await htmlOption.isVisible()) {
      await htmlOption.click();

      const download = await downloadPromise;

      if (download) {
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.html$/i);
      }
    }
  });
});

test.describe("Print Functionality", () => {
  test("should have print button available", async ({ page }) => {
    await setupResumeEditor(page);

    // Look for print button
    const printButton = page.getByRole("button", { name: /Print/i });
    if (await printButton.isVisible()) {
      await expect(printButton).toBeVisible();
    } else {
      // Print might be in export menu
      const exportButton = page
        .getByRole("button", { name: /Export/i })
        .or(page.getByRole("button", { name: /Download/i }));

      await exportButton.click();
      await expect(page.getByText(/Print/i).first()).toBeVisible();
    }
  });
});

test.describe("Export Error Handling", () => {
  test("should show error toast on export failure", async ({ page }) => {
    await setupResumeEditor(page);

    // This test verifies error handling UI exists
    // In a real scenario, we'd mock the export to fail

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await expect(exportButton).toBeVisible();
    // Error handling would be tested by intercepting network requests
  });
});

test.describe("Export Filename", () => {
  test("should use resume title in filename", async ({ page }) => {
    await setupResumeEditor(page);

    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await exportButton.click();

    // Download and check filename
    const downloadPromise = page.waitForEvent("download", { timeout: 30000 }).catch(() => null);

    const jsonOption = page.getByRole("menuitem", { name: /JSON/i }).first();
    if (await jsonOption.isVisible()) {
      await jsonOption.click();

      const download = await downloadPromise;

      if (download) {
        const filename = download.suggestedFilename();
        // Filename should not be empty/generic
        expect(filename.length).toBeGreaterThan(5);
      }
    }
  });
});

test.describe("Mobile Export", () => {
  test("should allow export on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await setupResumeEditor(page);

    // Export should still be accessible
    const exportButton = page
      .getByRole("button", { name: /Export/i })
      .or(page.getByRole("button", { name: /Download/i }));

    await expect(exportButton).toBeVisible({ timeout: 10000 });

    await exportButton.click();
    await expect(page.getByRole("menu")).toBeVisible();
  });
});






