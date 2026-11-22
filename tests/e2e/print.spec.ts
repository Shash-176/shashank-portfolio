import { test, expect } from "@playwright/test";

test("printed case studies keep their evidence with full addresses", async ({ page }) => {
  await page.goto("/work/planproof");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".evidence-list")).toBeVisible();
  await expect(page.locator(".site-header")).toBeHidden();
  const after = await page
    .locator('.evidence-list a[href^="http"]')
    .first()
    .evaluate((a) => getComputedStyle(a, "::after").content);
  expect(after).toContain("http");
});
