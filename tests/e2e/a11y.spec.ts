import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PAGES } from "./pages";

for (const scheme of ["light", "dark"] as const) {
  for (const path of PAGES) {
    test(`${path} has no WCAG A/AA violations (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
    });
  }
}

test("keyboard: skip link first, then brand", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("lens on: still no violations", async ({ page }) => {
  await page.goto("/work/smart-attendance");
  await page.keyboard.press("e");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("320 px wide: no horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const path of PAGES) {
    await page.goto(path);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sw, path).toBeLessThanOrEqual(320);
  }
});
