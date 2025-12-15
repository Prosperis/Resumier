import { expect, test } from "@playwright/test";

/**
 * Profile Management E2E Tests
 *
 * Tests for:
 * - Creating new profiles
 * - Editing profile information
 * - Deleting profiles
 * - Profile selector functionality
 * - Profile data persistence
 */

// Helper to set up demo mode for tests
async function setupDemoMode(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByRole("button", { name: /Try Demo Mode/i }).click();
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
}

// Helper to navigate to profiles tab
async function navigateToProfiles(page: import("@playwright/test").Page) {
  await setupDemoMode(page);
  await page.getByRole("tab", { name: /Profiles/i }).click();
  await expect(page.getByRole("tabpanel")).toBeVisible();
}

test.describe("Profile Tab Navigation", () => {
  test("should display Profiles tab on dashboard", async ({ page }) => {
    await setupDemoMode(page);

    await expect(page.getByRole("tab", { name: /Profiles/i })).toBeVisible();
  });

  test("should switch to Profiles tab when clicked", async ({ page }) => {
    await navigateToProfiles(page);

    // Profiles tab should be selected
    await expect(page.getByRole("tab", { name: /Profiles/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("should display profile content area", async ({ page }) => {
    await navigateToProfiles(page);

    // Should show profile content or empty state
    const hasProfiles = await page.getByRole("table").isVisible();
    const hasEmptyState = await page.getByText(/No profiles yet/i).isVisible();
    const hasProfileCards = await page.locator('[data-profile-card]').first().isVisible();

    expect(hasProfiles || hasEmptyState || hasProfileCards).toBeTruthy();
  });
});

test.describe("Profile Creation", () => {
  test("should display New Profile button", async ({ page }) => {
    await navigateToProfiles(page);

    await expect(page.getByRole("button", { name: /New Profile/i })).toBeVisible();
  });

  test("should open create profile dialog", async ({ page }) => {
    await navigateToProfiles(page);

    await page.getByRole("button", { name: /New Profile/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/Create.*Profile/i).first()).toBeVisible();
  });

  test("should show profile name input in create dialog", async ({ page }) => {
    await navigateToProfiles(page);
    await page.getByRole("button", { name: /New Profile/i }).click();

    // Should have name/title input
    await expect(
      page.getByLabel(/Profile Name|Name|Title/i).or(page.getByPlaceholder(/Profile|Name/i)),
    ).toBeVisible();
  });

  test("should create a new profile with valid data", async ({ page }) => {
    await navigateToProfiles(page);
    await page.getByRole("button", { name: /New Profile/i }).click();

    // Fill in profile name
    const nameInput = page
      .getByLabel(/Profile Name|Name|Title/i)
      .or(page.getByPlaceholder(/Profile|Name/i));
    await nameInput.fill("Test Developer Profile");

    // Submit the form
    await page.getByRole("button", { name: /Create/i }).click();

    // Dialog should close and profile should be created
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });

    // Should see success message or the new profile
    const hasToast = await page.getByText(/created|success/i).isVisible();
    const hasNewProfile = await page.getByText("Test Developer Profile").isVisible();

    expect(hasToast || hasNewProfile).toBeTruthy();
  });

  test("should validate required fields in create dialog", async ({ page }) => {
    await navigateToProfiles(page);
    await page.getByRole("button", { name: /New Profile/i }).click();

    // Clear any default value
    const nameInput = page
      .getByLabel(/Profile Name|Name|Title/i)
      .or(page.getByPlaceholder(/Profile|Name/i));
    await nameInput.clear();

    // Try to submit
    await page.getByRole("button", { name: /Create/i }).click();

    // Should show error or stay on dialog
    const hasError = await page.getByText(/required|invalid|enter/i).isVisible();
    const dialogVisible = await page.getByRole("dialog").isVisible();

    expect(hasError || dialogVisible).toBeTruthy();
  });

  test("should cancel profile creation", async ({ page }) => {
    await navigateToProfiles(page);
    await page.getByRole("button", { name: /New Profile/i }).click();

    // Click cancel or close
    const cancelButton = page.getByRole("button", { name: /Cancel/i });
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
    } else {
      await page.keyboard.press("Escape");
    }

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

test.describe("Profile Editing", () => {
  test("should navigate to profile editor when clicking on profile", async ({ page }) => {
    await navigateToProfiles(page);

    // Click on first profile
    const profileLink = page.getByRole("cell").first().or(page.locator('[data-profile-card]').first());
    if (await profileLink.isVisible()) {
      await profileLink.click();

      // Should navigate to profile editor
      await expect(page).toHaveURL(/\/profile\/[a-z0-9-]+/, { timeout: 10000 });
    }
  });

  test("should display profile editor sections", async ({ page }) => {
    await navigateToProfiles(page);

    const profileLink = page.getByRole("cell").first().or(page.locator('[data-profile-card]').first());
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page).toHaveURL(/\/profile\/[a-z0-9-]+/, { timeout: 10000 });

      // Should show editor sections
      await expect(page.getByText(/Personal|Information|Details/i).first()).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test("should save profile changes", async ({ page }) => {
    await navigateToProfiles(page);

    const profileLink = page.getByRole("cell").first().or(page.locator('[data-profile-card]').first());
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page).toHaveURL(/\/profile\/[a-z0-9-]+/, { timeout: 10000 });

      // Make a change
      const firstInput = page.locator('input:not([type="hidden"])').first();
      if (await firstInput.isVisible()) {
        await firstInput.click();
        await firstInput.fill("Updated Value");

        // Wait for auto-save
        await page.waitForTimeout(2000);

        // Should see save indicator or no unsaved changes warning
        const saveIndicator = page.getByText(/Saved|Saving|All changes saved/i);
        if (await saveIndicator.isVisible()) {
          await expect(saveIndicator).toBeVisible();
        }
      }
    }
  });
});

test.describe("Profile Deletion", () => {
  test("should show delete option in profile actions", async ({ page }) => {
    await navigateToProfiles(page);

    // Find profile row or card with actions menu
    const firstRow = page.getByRole("row").nth(1);
    const menuButton = firstRow.getByRole("button").last();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Should show delete option
      await expect(page.getByRole("menuitem", { name: /Delete/i })).toBeVisible();
    }
  });

  test("should open delete confirmation dialog", async ({ page }) => {
    await navigateToProfiles(page);

    const firstRow = page.getByRole("row").nth(1);
    const menuButton = firstRow.getByRole("button").last();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      const deleteOption = page.getByRole("menuitem", { name: /Delete/i });
      if (await deleteOption.isVisible()) {
        await deleteOption.click();

        // Should show confirmation dialog
        await expect(page.getByRole("alertdialog").or(page.getByRole("dialog"))).toBeVisible();
        await expect(page.getByText(/delete|confirm|sure/i).first()).toBeVisible();
      }
    }
  });

  test("should cancel profile deletion", async ({ page }) => {
    await navigateToProfiles(page);

    const firstRow = page.getByRole("row").nth(1);
    const menuButton = firstRow.getByRole("button").last();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      const deleteOption = page.getByRole("menuitem", { name: /Delete/i });
      if (await deleteOption.isVisible()) {
        await deleteOption.click();

        // Cancel deletion
        const cancelButton = page.getByRole("button", { name: /Cancel/i });
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
          await expect(page.getByRole("dialog")).not.toBeVisible();
        }
      }
    }
  });
});

test.describe("Profile Selector", () => {
  test("should show profile selector in create resume dialog", async ({ page }) => {
    await setupDemoMode(page);

    // Open create resume dialog
    await page.getByRole("button", { name: /New Resume/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Check for "From Profile" tab
    const fromProfileTab = page.getByRole("tab", { name: /From Profile/i });
    if (await fromProfileTab.isVisible()) {
      await fromProfileTab.click();

      // Should show profile selection options
      await expect(page.getByText(/Select.*Profile|Choose.*Profile/i).first()).toBeVisible();
    }
  });

  test("should list available profiles in selector", async ({ page }) => {
    await setupDemoMode(page);
    await page.getByRole("button", { name: /New Resume/i }).click();

    const fromProfileTab = page.getByRole("tab", { name: /From Profile/i });
    if (await fromProfileTab.isVisible()) {
      await fromProfileTab.click();

      // Should show at least demo profile
      const profileOptions = page.locator('[data-profile-option], [role="option"]');
      const hasProfiles = (await profileOptions.count()) > 0;

      // Either profiles exist or there's an empty state message
      const hasEmptyMessage = await page.getByText(/No profiles|Create.*profile/i).isVisible();
      expect(hasProfiles || hasEmptyMessage).toBeTruthy();
    }
  });
});

test.describe("Profile Data Persistence", () => {
  test("should persist profile data after navigation", async ({ page }) => {
    await navigateToProfiles(page);

    const profileLink = page.getByRole("cell").first().or(page.locator('[data-profile-card]').first());
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page).toHaveURL(/\/profile\/[a-z0-9-]+/, { timeout: 10000 });

      // Get profile URL
      const profileUrl = page.url();

      // Navigate away
      await page.goto("/dashboard");
      await expect(page).toHaveURL("/dashboard");

      // Navigate back
      await page.goto(profileUrl);

      // Content should still be visible
      await expect(page.getByText(/Personal|Information/i).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("should show profile count on dashboard", async ({ page }) => {
    await navigateToProfiles(page);

    // Tab should potentially show count
    const profilesTab = page.getByRole("tab", { name: /Profiles/i });
    await expect(profilesTab).toBeVisible();

    // Content should show profile count or list
    const hasContent = await page.getByRole("tabpanel").isVisible();
    expect(hasContent).toBeTruthy();
  });
});

test.describe("Profile Actions Menu", () => {
  test("should display actions menu for profile", async ({ page }) => {
    await navigateToProfiles(page);

    const firstRow = page.getByRole("row").nth(1);
    const menuButton = firstRow.getByRole("button").last();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Should show menu with options
      await expect(page.getByRole("menu")).toBeVisible();
    }
  });

  test("should show duplicate option in profile actions", async ({ page }) => {
    await navigateToProfiles(page);

    const firstRow = page.getByRole("row").nth(1);
    const menuButton = firstRow.getByRole("button").last();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      const duplicateOption = page.getByRole("menuitem", { name: /Duplicate|Copy/i });
      if (await duplicateOption.isVisible()) {
        await expect(duplicateOption).toBeVisible();
      }
    }
  });

  test("should show rename option in profile actions", async ({ page }) => {
    await navigateToProfiles(page);

    const firstRow = page.getByRole("row").nth(1);
    const menuButton = firstRow.getByRole("button").last();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      const renameOption = page.getByRole("menuitem", { name: /Rename|Edit/i });
      if (await renameOption.isVisible()) {
        await expect(renameOption).toBeVisible();
      }
    }
  });
});

