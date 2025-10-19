import { expect, test } from "@playwright/test"

test.describe("Resume Dashboard", () => {
  test("should load the dashboard page", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Resumier/)
  })

  test("should display create resume button", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("New Resume")).toBeVisible()
  })
})
