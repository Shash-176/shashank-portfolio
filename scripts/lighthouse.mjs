// Lighthouse (mobile, simulated slow 4G) against the local preview; checks LCP, CLS and TBT budgets.
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const base = process.env.BASE_URL ?? "http://localhost:4321";
const paths = (process.env.PATHS ?? "/,/work/planproof,/work/smart-attendance").split(",");
const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ["--headless=new", "--no-sandbox"],
});
let failed = false;
for (const p of paths) {
  const r = await lighthouse(base + p, {
    port: chrome.port,
    output: "json",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  const a = r.lhr.audits;
  const lcp = a["largest-contentful-paint"].numericValue,
    cls = a["cumulative-layout-shift"].numericValue,
    tbt = a["total-blocking-time"].numericValue;
  const scores = Object.fromEntries(Object.entries(r.lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const ok = lcp <= 2500 && cls <= 0.1 && tbt <= 200;
  if (!ok) failed = true;
  console.log(
    `${p.padEnd(26)} LCP ${(lcp / 1000).toFixed(2)} s · CLS ${cls.toFixed(3)} · TBT ${Math.round(tbt)} ms · ${JSON.stringify(scores)} ${ok ? "ok" : "FAIL"}`,
  );
}
await chrome.kill();
process.exit(failed ? 1 : 0);
