import { test, expect } from "@playwright/test";
test.use({ javaScriptEnabled: false });

test("without JavaScript every exhibit step, every note and every diagram layer is readable", async ({ page }) => {
  await page.goto("/work/planproof");
  await expect(page.locator("#null-trap .step")).toHaveCount(6);
  for (const s of await page.locator("#null-trap .step").all()) await expect(s).toBeVisible();
  const numerals = await page.locator("a.ev-num").count();
  expect(numerals).toBeGreaterThan(5);
  const target = await page.locator("a.ev-num").first().getAttribute("href");
  await expect(page.locator(target!)).toBeVisible();
  await expect(page.locator("[data-diagram] .layers li")).toHaveCount(4);
});

test("without JavaScript the presence timeline shows its default hour", async ({ page }) => {
  await page.goto("/work/smart-attendance");
  await expect(page.locator('#presence [data-p="e-unknown"]')).toHaveText("12 min");
});
