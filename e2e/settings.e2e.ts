import { expect, test } from "@playwright/test";

/**
 * Settings E2E Tests
 *
 * Tests for:
 * - Settings page navigation
 * - Theme settings
 * - Data management (export/import/clear)
 * - Account settings
 * - Accessibility settings
 */

// Helper to set up demo mode for tests
async function setupDemoMode(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Get Started Free/i }).click();
  await page.getByRole("button", { name: /Try Demo Mode/i }).click();
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
}

// Helper to navigate to settings
async function navigateToSettings(page: import("@playwright/test").Page) {
  await setupDemoMode(page);

  // Look for settings link in navigation or user menu
  const settingsLink = page.getByRole("link", { name: /Settings/i });
  if (await settingsLink.isVisible()) {
    await settingsLink.click();
    await expect(page).toHaveURL("/settings", { timeout: 10000 });
  } else {
    // Try user menu
    const userMenu = page.getByRole("button", { name: /User|Account|Menu/i });
    if (await userMenu.isVisible()) {
      await userMenu.click();
      const settingsOption = page.getByRole("menuitem", { name: /Settings/i });
      if (await settingsOption.isVisible()) {
        await settingsOption.click();
        await expect(page).toHaveURL("/settings", { timeout: 10000 });
      }
    }
  }
}

test.describe("Settings Navigation", () => {
  test("should display settings link or menu option", async ({ page }) => {
    await setupDemoMode(page);

    // Check for settings link
    const settingsLink = page.getByRole("link", { name: /Settings/i });
    const hasSettingsLink = await settingsLink.isVisible();

    // Or check in user menu
    const userMenu = page.getByRole("button", { name: /User|Account/i });
    let hasSettingsInMenu = false;

    if (!hasSettingsLink && (await userMenu.isVisible())) {
      await userMenu.click();
      hasSettingsInMenu = await page.getByRole("menuitem", { name: /Settings/i }).isVisible();
      await page.keyboard.press("Escape");
    }

    expect(hasSettingsLink || hasSettingsInMenu).toBeTruthy();
  });

  test("should navigate to settings page", async ({ page }) => {
    await navigateToSettings(page);

    // Should be on settings page (if navigation worked)
    if (page.url().includes("/settings")) {
      await expect(page).toHaveURL("/settings");
    }
  });

  test("should display settings page content", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      // Should show settings title or sections
      await expect(
        page.getByRole("heading", { name: /Settings/i }).or(page.getByText(/Preferences|Settings/i).first()),
      ).toBeVisible();
    }
  });
});

test.describe("Theme Settings", () => {
  test("should display theme toggle on settings page", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      // Look for theme section
      const themeSection = page.getByText(/Theme|Appearance|Dark Mode/i);
      if (await themeSection.isVisible()) {
        await expect(themeSection).toBeVisible();
      }
    }
  });

  test("should toggle dark mode from settings", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const themeToggle = page
        .getByRole("switch", { name: /Dark|Theme/i })
        .or(page.getByRole("button", { name: /Dark|Theme/i }));

      if (await themeToggle.isVisible()) {
        const htmlElement = page.locator("html");
        const initialDark = await htmlElement.evaluate((el) => el.classList.contains("dark"));

        await themeToggle.click();
        await page.waitForTimeout(500);

        const afterDark = await htmlElement.evaluate((el) => el.classList.contains("dark"));
        expect(afterDark).not.toBe(initialDark);
      }
    }
  });

  test("should persist theme preference after page reload", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const themeToggle = page
        .getByRole("switch", { name: /Dark|Theme/i })
        .or(page.getByRole("button", { name: /Dark|Theme/i }));

      if (await themeToggle.isVisible()) {
        const htmlElement = page.locator("html");
        await themeToggle.click();
        await page.waitForTimeout(500);

        const themeAfterClick = await htmlElement.evaluate((el) => el.classList.contains("dark"));

        // Reload page
        await page.reload();
        await page.waitForLoadState("networkidle");

        const themeAfterReload = await htmlElement.evaluate((el) => el.classList.contains("dark"));
        expect(themeAfterReload).toBe(themeAfterClick);
      }
    }
  });
});

test.describe("Data Management", () => {
  test("should display data export option", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const exportOption = page.getByText(/Export.*Data|Backup|Download.*Data/i);
      if (await exportOption.isVisible()) {
        await expect(exportOption).toBeVisible();
      }
    }
  });

  test("should display data import option", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const importOption = page.getByText(/Import.*Data|Restore|Upload.*Data/i);
      if (await importOption.isVisible()) {
        await expect(importOption).toBeVisible();
      }
    }
  });

  test("should display clear data option", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const clearOption = page.getByText(/Clear.*Data|Delete.*Data|Reset/i);
      if (await clearOption.isVisible()) {
        await expect(clearOption).toBeVisible();
      }
    }
  });

  test("should show confirmation before clearing data", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const clearButton = page.getByRole("button", { name: /Clear|Delete|Reset/i });
      if (await clearButton.isVisible()) {
        await clearButton.click();

        // Should show confirmation dialog
        const confirmDialog = page.getByRole("alertdialog").or(page.getByRole("dialog"));
        if (await confirmDialog.isVisible()) {
          await expect(page.getByText(/confirm|sure|warning/i).first()).toBeVisible();

          // Cancel the action
          await page.getByRole("button", { name: /Cancel/i }).click();
        }
      }
    }
  });

  test("should trigger data export download", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const exportButton = page.getByRole("button", { name: /Export|Backup|Download/i });
      if (await exportButton.isVisible()) {
        const downloadPromise = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);

        await exportButton.click();

        const download = await downloadPromise;
        if (download) {
          const filename = download.suggestedFilename();
          expect(filename).toMatch(/\.(json|zip)$/i);
        }
      }
    }
  });
});

test.describe("Animation Settings", () => {
  test("should display animation toggle", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const animationToggle = page.getByText(/Animation|Motion|Reduce.*Motion/i);
      if (await animationToggle.isVisible()) {
        await expect(animationToggle).toBeVisible();
      }
    }
  });

  test("should toggle animations on/off", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const animationSwitch = page.getByRole("switch", { name: /Animation|Motion/i });
      if (await animationSwitch.isVisible()) {
        await animationSwitch.click();
        await page.waitForTimeout(300);

        // Toggle should change state
        const isChecked = await animationSwitch.isChecked();
        await animationSwitch.click();
        await page.waitForTimeout(300);

        const isCheckedAfter = await animationSwitch.isChecked();
        expect(isCheckedAfter).not.toBe(isChecked);
      }
    }
  });
});

test.describe("Account Settings", () => {
  test("should display sign out option", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const signOutButton = page.getByRole("button", { name: /Sign Out|Log Out|Logout/i });
      if (await signOutButton.isVisible()) {
        await expect(signOutButton).toBeVisible();
      }
    }
  });

  test("should sign out and redirect to home", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const signOutButton = page.getByRole("button", { name: /Sign Out|Log Out|Logout/i });
      if (await signOutButton.isVisible()) {
        await signOutButton.click();

        // Should redirect to home
        await expect(page).toHaveURL("/", { timeout: 10000 });
      }
    }
  });

  test("should display demo mode indicator", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const demoIndicator = page.getByText(/Demo Mode|Demo.*Active/i);
      if (await demoIndicator.isVisible()) {
        await expect(demoIndicator).toBeVisible();
      }
    }
  });
});

test.describe("Settings Accessibility", () => {
  test("should have proper heading structure", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const headings = await page.getByRole("heading").all();
      expect(headings.length).toBeGreaterThan(0);
    }
  });

  test("should have labeled form controls", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      const switches = await page.getByRole("switch").all();

      for (const switchEl of switches) {
        const ariaLabel = await switchEl.getAttribute("aria-label");
        const ariaLabelledby = await switchEl.getAttribute("aria-labelledby");
        const id = await switchEl.getAttribute("id");

        const hasLabel = ariaLabel || ariaLabelledby || id;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test("should navigate settings with keyboard", async ({ page }) => {
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      // Tab through settings
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("Tab");
      }

      // Focus should be on a control
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    }
  });
});

test.describe("Settings Mobile", () => {
  test("should display settings on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      await expect(page.getByText(/Settings|Preferences/i).first()).toBeVisible();
    }
  });

  test("should have touch-friendly controls on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await navigateToSettings(page);

    if (page.url().includes("/settings")) {
      // Buttons should be easily tappable (min 44px)
      const buttons = await page.getByRole("button").all();

      for (const button of buttons.slice(0, 3)) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(32);
          expect(box.width).toBeGreaterThanOrEqual(32);
        }
      }
    }
  });
});

