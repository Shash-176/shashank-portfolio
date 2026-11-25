import { test, expect } from "@playwright/test";
import { PAGES } from "./pages";

test("every page loads without console errors and has one h1", async ({ page }) => {
  for (const path of PAGES) {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    expect(errors, path).toEqual([]);
    page.removeAllListeners();
  }
});

test("unknown addresses get the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("could not be found");
});

test("navigation marks the current page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).first().getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator('nav a[aria-current="page"]').first()).toHaveText("Work");
});

test("theme cycles and persists", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle]").first();
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test.describe("evidence lens", () => {
  test("E toggles it, the button reports its state, and notes appear without moving text", async ({ page }) => {
    await page.goto("/work/planproof");
    const para = page.locator("#problem p").first();
    const before = await para.boundingBox();
    const btn = page.locator("header [data-lens-toggle]");
    await expect(btn).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#note-1")).toBeHidden();
    await page.keyboard.press("e");
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#note-1")).toBeVisible();
    expect(await para.boundingBox()).toEqual(before);
    await page.keyboard.press("e");
    await expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  test("a numeral pins its note; Esc closes and returns focus", async ({ page }) => {
    await page.goto("/work/planproof");
    const num = page.locator('#brief a[data-note="1"]');
    await num.click();
    const note = page.locator("#note-1");
    await expect(note).toHaveAttribute("data-pinned", "");
    await expect(note).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(note).not.toHaveAttribute("data-pinned", "");
    await expect(num).toBeFocused();
  });

  test("on phones it shows the bar and the all-notes sheet", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/work/planproof");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#site-menu [data-lens-toggle]").click();
    const bar = page.getByRole("region", { name: "Evidence lens" });
    await expect(bar).toBeVisible();
    await bar.getByRole("button", { name: "All notes" }).click();
    await expect(page.locator("#notes-sheet")).toBeVisible();
    await expect(page.locator("#notes-sheet li").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#notes-sheet")).toBeHidden();
  });
});

test("mobile menu traps focus and returns it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open menu" });
  await open.click();
  await expect(page.locator("#site-menu")).toBeVisible();
  await expect(page.locator("#site-menu a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(open).toBeFocused();
});

test("NULL trap steps with buttons and arrow keys, and ends on the real verdict", async ({ page }) => {
  await page.goto("/work/planproof");
  const ex = page.locator("#null-trap");
  await expect(ex.locator(".step:not([hidden])")).toHaveCount(1);
  await expect(ex.locator(".step:not([hidden]) h3")).toContainText("1 / 6");
  await ex.getByRole("button", { name: "Next →" }).click();
  await expect(ex.locator(".step:not([hidden]) h3")).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(ex.locator(".step:not([hidden]) h3")).toContainText("4 / 6");
  await ex.getByRole("button", { name: "Add the order →" }).click();
  await expect(ex.locator(".step:not([hidden])")).toContainText("9,414");
  await ex.getByRole("button", { name: "See the verdict →" }).click();
  await expect(ex.locator(".step:not([hidden])")).toContainText("UNSAFE");
  await expect(ex.locator(".step:not([hidden])")).toContainText("52");
  await ex.getByRole("button", { name: "Replay" }).click();
  await expect(ex.locator(".step:not([hidden]) h3")).toContainText("1 / 6");
});

test("presence timeline buttons recompute the readout", async ({ page }) => {
  await page.goto("/work/smart-attendance");
  const ex = page.locator("#presence");
  await expect(ex.locator('[data-p="e-unknown"]')).toHaveText("12 min");
  await ex.getByRole("button", { name: "Longer" }).click();
  await ex.getByRole("button", { name: "Longer" }).click();
  await expect(ex.locator('[data-p="e-unknown"]')).toHaveText("16 min");
  await expect(ex.locator('[data-p="e-status"]')).toContainText("inconclusive");
  await expect(ex.locator('[data-p="n-status"]')).toContainText("below requirement");
});

test("diagram controls select layers and assemble", async ({ page }) => {
  await page.goto("/work/planproof");
  const fig = page.locator("[data-diagram]").first();
  await expect(fig.locator("li.selected")).toContainText("Worker");
  await fig.getByRole("button", { name: "Next layer →" }).click();
  await expect(fig.locator("li.selected")).toContainText("Verdict");
  await fig.getByRole("button", { name: /Page/ }).click();
  await expect(fig.locator("li.selected")).toContainText("Page");
  await fig.getByRole("button", { name: "Assemble" }).click();
  await expect(fig).toHaveAttribute("data-mode", "assembled");
});

test("case studies link to the previous and next project in order", async ({ page }) => {
  await page.goto("/work/planproof");
  const pager = page.getByRole("navigation", { name: "More case studies" });
  await expect(pager.getByRole("link", { name: /Next.*Smart Attendance/ })).toBeVisible();
  await page.goto("/work/research-data-platform");
  await expect(
    page
      .getByRole("navigation", { name: "More case studies" })
      .getByRole("link", { name: /Research/ })
      .last(),
  ).toBeVisible();
});

test("on phones, capabilities are a list of linked projects, not a scrolling table", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  await expect(page.locator("table.caps")).toBeHidden();
  await expect(page.getByRole("list", { name: "Capabilities by project" }).getByRole("link").first()).toBeVisible();
});

test("page headers are left-aligned (no global note styles leaking)", async ({ page }) => {
  for (const path of ["/research", "/work"]) {
    await page.goto(path);
    const h1 = await page.locator("h1").boundingBox();
    const main = await page.locator("main .page").first().boundingBox();
    expect(Math.abs(h1!.x - (main!.x + 40)), path).toBeLessThan(48);
  }
});
