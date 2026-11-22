import { test, expect } from "@playwright/test";
const SHOTS = ["/", "/work/planproof"];
for (const width of [360, 768, 1280]) {
  for (const scheme of ["light", "dark"] as const) {
    for (const path of SHOTS) {
      test(`${path} at ${width} (${scheme})`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const name = `${path === "/" ? "home" : path.slice(1).replace(/\//g, "-")}-${width}-${scheme}.png`;
        await expect(page).toHaveScreenshot(name, { fullPage: true });
      });
    }
  }
}
