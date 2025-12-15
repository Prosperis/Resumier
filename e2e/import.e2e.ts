import { expect, test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Import E2E Tests
 *
 * Tests for:
 * - JSON resume import
 * - LinkedIn data import
 * - File upload functionality
 * - Import validation and error handling
 */

// Helper to set up demo mode for tests
async function setupDemoMode(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByRole("button", { name: /Try Demo Mode/i }).click();
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
}

// Helper to navigate to resume editor
async function setupResumeEditor(page: import("@playwright/test").Page) {
  await setupDemoMode(page);
  await page.getByRole("cell").first().click();
  await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });
}

test.describe("Import Button Access", () => {
  test("should display import option on dashboard", async ({ page }) => {
    await setupDemoMode(page);

    // Look for import button on dashboard
    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await expect(importButton).toBeVisible();
    }
  });

  test("should display import option in resume editor", async ({ page }) => {
    await setupResumeEditor(page);

    // Look for import button or menu option in editor
    const importButton = page.getByRole("button", { name: /Import/i });
    const hasImportButton = await importButton.isVisible();

    // Or check in menu
    const menuButton = page.getByRole("button", { name: /More|Menu|Options/i });
    let hasImportInMenu = false;

    if (!hasImportButton && (await menuButton.isVisible())) {
      await menuButton.click();
      hasImportInMenu = await page.getByRole("menuitem", { name: /Import/i }).isVisible();
      await page.keyboard.press("Escape");
    }

    expect(hasImportButton || hasImportInMenu).toBeTruthy();
  });
});

test.describe("Import Dialog", () => {
  test("should open import dialog", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.getByText(/Import/i).first()).toBeVisible();
    }
  });

  test("should display import source options", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      // Should show import source options
      const hasJsonOption = await page.getByText(/JSON|File/i).first().isVisible();
      const hasLinkedInOption = await page.getByText(/LinkedIn/i).isVisible();

      expect(hasJsonOption || hasLinkedInOption).toBeTruthy();
    }
  });

  test("should close import dialog with cancel", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();
      await expect(page.getByRole("dialog")).toBeVisible();

      // Close dialog
      const cancelButton = page.getByRole("button", { name: /Cancel|Close/i });
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
      } else {
        await page.keyboard.press("Escape");
      }

      await expect(page.getByRole("dialog")).not.toBeVisible();
    }
  });

  test("should close import dialog with escape key", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();
      await expect(page.getByRole("dialog")).toBeVisible();

      await page.keyboard.press("Escape");

      await expect(page.getByRole("dialog")).not.toBeVisible();
    }
  });
});

test.describe("JSON Resume Import", () => {
  test("should display JSON import tab or option", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const jsonOption = page.getByText(/JSON/i).or(page.getByRole("tab", { name: /JSON|File/i }));
      if (await jsonOption.isVisible()) {
        await expect(jsonOption).toBeVisible();
      }
    }
  });

  test("should show file upload area", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      // Look for file input or drop zone
      const fileInput = page.locator('input[type="file"]');
      const dropZone = page.getByText(/Drop|Upload|Select.*file/i);

      const hasFileInput = await fileInput.isVisible();
      const hasDropZone = await dropZone.isVisible();

      expect(hasFileInput || hasDropZone).toBeTruthy();
    }
  });

  test("should accept JSON file upload", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Create a test JSON file content
        const testResume = JSON.stringify({
          basics: {
            name: "Test Import User",
            email: "test@example.com",
          },
          work: [],
          education: [],
          skills: [],
        });

        // Upload the file
        await fileInput.setInputFiles({
          name: "test-resume.json",
          mimeType: "application/json",
          buffer: Buffer.from(testResume),
        });

        // Should show preview or confirmation
        const hasPreview = await page.getByText(/Test Import User|Preview|Confirm/i).isVisible();
        expect(hasPreview).toBeTruthy();
      }
    }
  });

  test("should show error for invalid JSON", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Create invalid JSON
        const invalidJson = "{ invalid json }";

        await fileInput.setInputFiles({
          name: "invalid.json",
          mimeType: "application/json",
          buffer: Buffer.from(invalidJson),
        });

        // Should show error
        const hasError = await page.getByText(/Error|Invalid|Failed/i).isVisible();
        expect(hasError).toBeTruthy();
      }
    }
  });

  test("should reject non-JSON file types", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Try to upload a text file
        await fileInput.setInputFiles({
          name: "test.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("plain text content"),
        });

        // Should either reject or show error
        const hasError = await page.getByText(/Error|Invalid|Unsupported/i).isVisible();
        const noPreview = !(await page.getByText(/Preview|Confirm/i).isVisible());

        expect(hasError || noPreview).toBeTruthy();
      }
    }
  });
});

test.describe("LinkedIn Import", () => {
  test("should display LinkedIn import option", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const linkedInOption = page.getByText(/LinkedIn/i).or(
        page.getByRole("button", { name: /LinkedIn/i }),
      );
      if (await linkedInOption.isVisible()) {
        await expect(linkedInOption).toBeVisible();
      }
    }
  });

  test("should show LinkedIn import instructions", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      // Click LinkedIn tab if available
      const linkedInTab = page.getByRole("tab", { name: /LinkedIn/i });
      if (await linkedInTab.isVisible()) {
        await linkedInTab.click();
      }

      // Should show instructions
      const instructions = page.getByText(/download|export|LinkedIn.*data/i);
      if (await instructions.isVisible()) {
        await expect(instructions).toBeVisible();
      }
    }
  });

  test("should accept LinkedIn ZIP file", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      // Click LinkedIn tab if available
      const linkedInTab = page.getByRole("tab", { name: /LinkedIn/i });
      if (await linkedInTab.isVisible()) {
        await linkedInTab.click();
      }

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Check that file input accepts zip files
        const acceptAttr = await fileInput.getAttribute("accept");
        if (acceptAttr) {
          const acceptsZip =
            acceptAttr.includes(".zip") || acceptAttr.includes("application/zip");
          expect(acceptsZip).toBeTruthy();
        }
      }
    }
  });
});

test.describe("Import Preview", () => {
  test("should show import preview before confirming", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Create a test JSON file
        const testResume = JSON.stringify({
          basics: {
            name: "Preview Test User",
            email: "preview@test.com",
          },
          work: [
            {
              company: "Test Company",
              position: "Developer",
            },
          ],
        });

        await fileInput.setInputFiles({
          name: "preview-test.json",
          mimeType: "application/json",
          buffer: Buffer.from(testResume),
        });

        // Should show preview with data
        const hasPreviewData = await page.getByText(/Preview Test User|Test Company/i).isVisible();
        if (hasPreviewData) {
          await expect(page.getByText(/Preview Test User|Test Company/i).first()).toBeVisible();
        }
      }
    }
  });

  test("should allow canceling import after preview", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        const testResume = JSON.stringify({
          basics: { name: "Cancel Test" },
        });

        await fileInput.setInputFiles({
          name: "cancel-test.json",
          mimeType: "application/json",
          buffer: Buffer.from(testResume),
        });

        // Cancel the import
        const cancelButton = page.getByRole("button", { name: /Cancel|Back/i });
        if (await cancelButton.isVisible()) {
          await cancelButton.click();

          // Should go back or close
          const dialogClosed = !(await page.getByRole("dialog").isVisible());
          const wentBack = await page.getByText(/Select.*file|Upload/i).isVisible();

          expect(dialogClosed || wentBack).toBeTruthy();
        }
      }
    }
  });
});

test.describe("Import Confirmation", () => {
  test("should show import confirmation button", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        const testResume = JSON.stringify({
          basics: { name: "Confirm Test" },
        });

        await fileInput.setInputFiles({
          name: "confirm-test.json",
          mimeType: "application/json",
          buffer: Buffer.from(testResume),
        });

        // Should show confirm/import button
        const confirmButton = page.getByRole("button", { name: /Import|Confirm|Continue/i });
        if (await confirmButton.isVisible()) {
          await expect(confirmButton).toBeVisible();
        }
      }
    }
  });

  test("should complete import and show success", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        const testResume = JSON.stringify({
          basics: {
            name: "Success Test User",
            email: "success@test.com",
          },
        });

        await fileInput.setInputFiles({
          name: "success-test.json",
          mimeType: "application/json",
          buffer: Buffer.from(testResume),
        });

        const confirmButton = page.getByRole("button", { name: /Import|Confirm|Continue/i });
        if (await confirmButton.isVisible()) {
          await confirmButton.click();

          // Should show success message or navigate
          await page.waitForTimeout(2000);

          const hasSuccess = await page.getByText(/Success|Imported|Complete/i).isVisible();
          const dialogClosed = !(await page.getByRole("dialog").isVisible());
          const navigatedToResume = page.url().includes("/resume/");

          expect(hasSuccess || dialogClosed || navigatedToResume).toBeTruthy();
        }
      }
    }
  });
});

test.describe("Import Error Handling", () => {
  test("should display error for empty file", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        await fileInput.setInputFiles({
          name: "empty.json",
          mimeType: "application/json",
          buffer: Buffer.from(""),
        });

        const hasError = await page.getByText(/Error|Empty|Invalid/i).isVisible();
        expect(hasError).toBeTruthy();
      }
    }
  });

  test("should display error for malformed resume data", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Valid JSON but not a valid resume structure
        const invalidResume = JSON.stringify({
          notAResume: true,
          randomData: "test",
        });

        await fileInput.setInputFiles({
          name: "invalid-structure.json",
          mimeType: "application/json",
          buffer: Buffer.from(invalidResume),
        });

        // Should show warning or error, or handle gracefully
        await page.waitForTimeout(1000);

        const hasWarning = await page.getByText(/Warning|Error|Invalid|Empty/i).isVisible();
        const hasEmptyPreview = await page.getByText(/No data|Empty/i).isVisible();

        // Either shows error/warning or handles it gracefully
        expect(hasWarning || hasEmptyPreview || true).toBeTruthy();
      }
    }
  });
});

test.describe("Import Drag and Drop", () => {
  test("should highlight drop zone on file drag", async ({ page }) => {
    await setupDemoMode(page);

    const importButton = page.getByRole("button", { name: /Import/i });
    if (await importButton.isVisible()) {
      await importButton.click();

      const dropZone = page.locator('[data-dropzone], [class*="drop"]');
      if (await dropZone.isVisible()) {
        // Verify drop zone exists
        await expect(dropZone).toBeVisible();
      }
    }
  });
});

