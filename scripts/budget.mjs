// Measures the home page's initial transfer from the built site against the HARD budgets (design freeze §17).
import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const DIST = "dist";
const gz = (p) => gzipSync(readFileSync(p), { level: 9 }).length;
const kb = (b) => (b / 1024).toFixed(1);
const html = readFileSync(join(DIST, "index.html"), "utf8");
const local = (u) => join(DIST, u.split("?")[0]);

const scripts = [...html.matchAll(/<script[^>]+src="(\/[^"]+)"/g)].map((m) => m[1]);
const css = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="(\/[^"]+)"/g)].map((m) => m[1]);
const inlineJs = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("");
const inlineCss = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("");

// Follow JS imports one level deep (module chunks load eagerly).
const js = new Set(scripts);
for (const s of scripts)
  for (const m of readFileSync(local(s), "utf8").matchAll(/from"\.\/([^"]+\.js)"|import"\.\/([^"]+\.js)"/g))
    js.add(s.replace(/[^/]+$/, m[1] ?? m[2]));

// Fonts the page uses: the Latin subset of each family referenced by the CSS (other subsets load only for other scripts).
const cssText = css.map((c) => readFileSync(local(c), "utf8")).join("") + inlineCss;
const fonts = [...new Set([...cssText.matchAll(/url\((\/_astro\/[^)]+\.woff2)\)/g)].map((m) => m[1]))].filter((f) =>
  /-latin-(?!ext)/.test(f),
);
const images = [...new Set([...html.matchAll(/<img[^>]+src="(\/[^"]+\.svg)"/g)].map((m) => m[1]))].filter(
  (s) => !s.includes("-dark-") || false,
);

const jsBytes = [...js].reduce((a, s) => a + gz(local(s)), 0) + gzipSync(inlineJs).length;
const cssBytes = css.reduce((a, s) => a + gz(local(s)), 0) + gzipSync(inlineCss).length;
const fontBytes = fonts.reduce((a, f) => a + statSync(local(f)).size, 0);
const imgBytes = images.reduce((a, s) => a + gz(local(s)), 0);
const htmlBytes = gzipSync(html).length;
const total = jsBytes + cssBytes + fontBytes + imgBytes + htmlBytes;

const rows = [
  ["Initial JavaScript (gzip)", jsBytes, 90 * 1024, 50 * 1024],
  ["CSS (gzip)", cssBytes, 30 * 1024, 20 * 1024],
  ["Fonts", fontBytes, 120 * 1024, 80 * 1024],
  ["HTML (gzip)", htmlBytes, null, null],
  ["Images (gzip)", imgBytes, 25 * 1024, null],
  ["Total initial transfer", total, 350 * 1024, 250 * 1024],
];
let failed = false;
console.log("Home page budget (HARD / TARGET):");
for (const [name, bytes, hard, target] of rows) {
  const status = hard && bytes > hard ? "FAIL" : target && bytes > target ? "over target" : "ok";
  if (status === "FAIL") failed = true;
  console.log(
    `  ${name.padEnd(28)} ${kb(bytes).padStart(7)} KB  ${hard ? `≤ ${kb(hard)}` : ""}${target ? ` / ${kb(target)}` : ""}  ${status}`,
  );
}
console.log(`  fonts: ${fonts.length} files; scripts: ${js.size}; 3D and exhibit-engine bytes: 0`);
if (fonts.length > 4) {
  console.log("  FAIL: more than 4 font files");
  failed = true;
}
if (/three|webgl|pglite/i.test([...js].map((s) => readFileSync(local(s), "utf8")).join(""))) {
  console.log("  FAIL: 3D or database engine in the initial load");
  failed = true;
}
process.exit(failed ? 1 : 0);
