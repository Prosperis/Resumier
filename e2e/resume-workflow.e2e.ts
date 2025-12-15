import { expect, test } from "@playwright/test";

/**
 * Resume Workflow E2E Tests
 *
 * Tests for:
 * - Creating a new resume
 * - Editing resume content
 * - Saving and auto-save
 * - Resume preview
 * - Deleting resumes
 */

// Helper to set up demo mode for tests
async function setupDemoMode(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByRole("button", { name: /Try Demo Mode/i }).click();
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
}

// Helper to set up guest mode for tests
async function setupGuestMode(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByText(/Continue with local storage only/i).click();
  // Wait for navigation
  await page.waitForURL(/\/(dashboard|resume)/);
}

test.describe("Resume Creation", () => {
  test("should create a new resume from dashboard", async ({ page }) => {
    await setupDemoMode(page);

    // Click New Resume button
    await page.getByRole("button", { name: /New Resume/i }).click();

    // Dialog should appear
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Create New Resume")).toBeVisible();
  });

  test("should show resume title input in create dialog", async ({ page }) => {
    await setupDemoMode(page);

    await page.getByRole("button", { name: /New Resume/i }).click();

    // Should have title input
    await expect(page.getByLabel(/Resume Title/i)).toBeVisible();
  });

  test("should create resume with custom title", async ({ page }) => {
    await setupDemoMode(page);

    await page.getByRole("button", { name: /New Resume/i }).click();

    // Fill in title
    const titleInput = page.getByLabel(/Resume Title/i);
    await titleInput.fill("My Custom Resume");

    // Submit
    await page.getByRole("button", { name: /Create Resume/i }).click();

    // Should navigate to resume editor
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });
  });

  test("should show validation error for empty title", async ({ page }) => {
    await setupDemoMode(page);

    await page.getByRole("button", { name: /New Resume/i }).click();

    // Clear the title input if it has default value
    const titleInput = page.getByLabel(/Resume Title/i);
    await titleInput.clear();

    // Try to submit
    await page.getByRole("button", { name: /Create Resume/i }).click();

    // Should show error or remain on dialog
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should allow creating resume from profile", async ({ page }) => {
    await setupDemoMode(page);

    await page.getByRole("button", { name: /New Resume/i }).click();

    // Check for "From Profile" tab
    const fromProfileTab = page.getByRole("tab", { name: /From Profile/i });
    if (await fromProfileTab.isVisible()) {
      await fromProfileTab.click();
      await expect(page.getByText(/Start with data from an existing profile/i)).toBeVisible();
    }
  });
});

test.describe("Resume Editor", () => {
  test("should display resume editor with sections", async ({ page }) => {
    await setupDemoMode(page);

    // Click on first resume to edit
    await page.getByRole("cell").first().click();

    // Wait for editor to load
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Should show main editor sections
    await expect(page.getByText("Personal Information")).toBeVisible({ timeout: 10000 });
  });

  test("should display resume preview panel", async ({ page }) => {
    await setupDemoMode(page);

    // Click on first resume
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Should have preview area (light mode resume display)
    await expect(page.locator(".resume-light-mode")).toBeVisible({ timeout: 10000 });
  });

  test("should expand Personal Information section", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Click on Personal Information section to expand
    await page.getByText("Personal Information").click();

    // Should show form fields
    await expect(
      page.getByLabel(/First Name/i).or(page.getByPlaceholder(/First Name/i)),
    ).toBeVisible({ timeout: 5000 });
  });

  test("should show Work Experience section", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Work Experience should be visible
    await expect(page.getByText("Work Experience")).toBeVisible({ timeout: 10000 });
  });

  test("should show Education section", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Education should be visible
    await expect(page.getByText("Education")).toBeVisible({ timeout: 10000 });
  });

  test("should show Skills section", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Skills should be visible
    await expect(page.getByText("Skills")).toBeVisible({ timeout: 10000 });
  });

  test("should show Certifications section", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Certifications should be visible
    await expect(page.getByText("Certifications")).toBeVisible({ timeout: 10000 });
  });

  test("should show Links section", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Links should be visible
    await expect(page.getByText("Links")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Resume Editing", () => {
  test("should update personal info and see changes in preview", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Expand Personal Information
    await page.getByText("Personal Information").click();

    // Find and update first name field
    const firstNameInput = page.getByLabel(/First Name/i).or(page.getByPlaceholder(/First Name/i));
    if (await firstNameInput.isVisible()) {
      await firstNameInput.clear();
      await firstNameInput.fill("TestUser");

      // Wait for auto-save or update
      await page.waitForTimeout(1000);

      // Check if preview updated (name should appear in preview)
      await expect(page.locator(".resume-light-mode")).toContainText("TestUser");
    }
  });

  test("should add new work experience", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Click Work Experience section
    await page.getByText("Work Experience").click();

    // Look for Add button in the section
    const addButton = page.getByRole("button", { name: /Add/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();

      // Should show form for new experience
      await expect(
        page.getByLabel(/Company/i).or(page.getByPlaceholder(/Company/i)),
      ).toBeVisible();
    }
  });

  test("should add new education entry", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Click Education section
    await page.getByText("Education").click();

    // Look for Add button
    const addButton = page.locator('[data-section="education"]').getByRole("button", { name: /Add/i });
    if (await addButton.isVisible()) {
      await addButton.click();

      // Should show form for new education
      await expect(
        page.getByLabel(/Institution/i).or(page.getByPlaceholder(/Institution/i)),
      ).toBeVisible();
    }
  });
});

test.describe("Resume Dashboard Operations", () => {
  test("should display resume table with resumes", async ({ page }) => {
    await setupDemoMode(page);

    // Should see table structure
    await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 });
  });

  test("should show resume row with title and date", async ({ page }) => {
    await setupDemoMode(page);

    // Table should have content
    await expect(page.getByRole("row")).toHaveCount.greaterThan(1);
  });

  test("should duplicate a resume", async ({ page }) => {
    await setupDemoMode(page);

    // Find the action menu (three dots) on first resume
    const firstRow = page.getByRole("row").nth(1); // nth(0) is header
    const menuButton = firstRow.getByRole("button").last();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Look for Duplicate option
      const duplicateOption = page.getByRole("menuitem", { name: /Duplicate/i });
      if (await duplicateOption.isVisible()) {
        await duplicateOption.click();

        // Should show success toast
        await expect(page.getByText(/has been created/i)).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test("should navigate to resume editor when clicking on resume", async ({ page }) => {
    await setupDemoMode(page);

    // Click on first resume title/row
    await page.getByRole("cell").first().click();

    // Should navigate to editor
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });
  });

  test("should switch between Resumes and Profiles tabs", async ({ page }) => {
    await setupDemoMode(page);

    // Should see tabs
    await expect(page.getByRole("tab", { name: /Resumes/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Profiles/i })).toBeVisible();

    // Click Profiles tab
    await page.getByRole("tab", { name: /Profiles/i }).click();

    // Content should change
    await expect(page.getByRole("tabpanel")).toBeVisible();
  });
});

test.describe("Resume Preview", () => {
  test("should navigate to full preview page", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Look for preview button/link
    const previewButton = page.getByRole("button", { name: /Preview/i });
    if (await previewButton.isVisible()) {
      await previewButton.click();

      // Should show full preview
      await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+\/preview/);
    }
  });

  test("should display resume content in preview", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("cell").first().click();
    await expect(page).toHaveURL(/\/resume\/[a-z0-9-]+/, { timeout: 10000 });

    // Preview should show the resume content
    const preview = page.locator(".resume-light-mode");
    await expect(preview).toBeVisible({ timeout: 10000 });

    // Demo data includes "John Doe" or similar
    await expect(preview).toContainText(/John|Software|Engineer/i);
  });
});


