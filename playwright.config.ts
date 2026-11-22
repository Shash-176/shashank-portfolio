import { defineConfig, devices } from "@playwright/test";

// Locally, Chromium runs on the system Chrome (CHROME_PATH). CI installs Playwright's own browsers.
const chrome = process.env.CHROME_PATH ? { launchOptions: { executablePath: process.env.CHROME_PATH } } : {};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:4321", trace: "retain-on-failure" },
  snapshotPathTemplate: "tests/e2e/__screenshots__/{arg}-{projectName}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" } },
  webServer: { command: "npm run preview", url: "http://localhost:4321", reuseExistingServer: !process.env.CI },
  projects: [
    { name: "chromium", testMatch: /behaviour|nojs|print/, use: { ...devices["Desktop Chrome"], ...chrome } },
    { name: "a11y", testMatch: /a11y/, use: { ...devices["Desktop Chrome"], ...chrome } },
    { name: "visual", testMatch: /visual/, use: { ...devices["Desktop Chrome"], ...chrome } },
    { name: "firefox", testMatch: /behaviour|nojs/, use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", testMatch: /behaviour|nojs/, use: { ...devices["Desktop Safari"] } },
  ],
});
