// Renders 1200×630 share cards from the project records into public/og. Run after content changes: npm run og.
import { chromium } from "@playwright/test";
import { readFileSync, readdirSync, writeFileSync, rmSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const font = (p) => pathToFileURL(resolve("node_modules", p)).href;
const FACES = `
@font-face{font-family:B;src:url(${font("@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2")});font-weight:200 800}
@font-face{font-family:A;src:url(${font("@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-400-normal.woff2")})}
@font-face{font-family:M;src:url(${font("@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2")});font-weight:100 800}`;
const avatar = pathToFileURL(resolve("public/avatar/mono-light-neutral.svg")).href;
const mark = pathToFileURL(resolve("public/avatar/mark-light.svg")).href;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const card = ({ kicker, title, sub, foot, big }) => `<!doctype html><html><head><style>${FACES}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#F6F6F3;color:#14161A;font-family:A}
.w{display:grid;grid-template-columns:1fr 300px;height:100%;padding:56px 0 56px 64px}
.l{display:flex;flex-direction:column;justify-content:space-between;padding-right:48px}
.k{font-family:M;font-size:22px;color:#5A5F69}.t{font-family:B;font-weight:600;letter-spacing:-.025em;line-height:1;font-size:${big ? 92 : 78}px}
.t span{background:#E3F23A;padding:0 8px}.s{font-family:B;font-size:34px;line-height:1.15;margin-top:18px;max-width:20ch}
.f{font-family:M;font-size:22px;display:flex;gap:28px;border-top:2px solid #14161A;padding-top:16px}
.r{border-left:1.5px solid #14161A;background:linear-gradient(#14161A 2px,transparent 2px) left top/12px 34px repeat-y;display:flex;flex-direction:column;justify-content:space-between;align-items:center;padding:8px 0 0 24px}
.r img.a{width:250px;height:250px}.r img.m{width:56px;height:56px;align-self:flex-end;margin-right:56px}</style></head>
<body><div class="w"><div class="l"><div><p class="k">${kicker}</p><p class="t">${title}</p>${sub ? `<p class="s">${sub}</p>` : ""}</div><p class="f">${foot}</p></div>
<div class="r"><img class="m" src="${mark}"><img class="a" src="${avatar}"></div></div></body></html>`;

const projects = readdirSync("src/content/projects").map((f) => {
  const src = readFileSync(`src/content/projects/${f}`, "utf8");
  const get = (k) => src.match(new RegExp(`^${k}: (.+)$`, "m"))?.[1].replace(/^"|"$/g, "");
  return {
    slug: f.replace(".mdx", ""),
    name: get("name"),
    claim: get("claim"),
    depth: get("depth"),
    access: get("access"),
  };
});
const jobs = [
  {
    out: "home",
    kicker: "Shashank Maheshwar · backend and data engineer",
    title: `I build backend and data systems that <span>check their own answers.</span>`,
    foot: "<span>✕ UNSAFE</span><span>◍ UNKNOWN</span><span>▣ VERIFIED</span>",
    big: false,
  },
  ...projects.map((p) => ({
    out: p.slug,
    kicker: `Work · ${p.depth === "full" ? "full" : "short"} case study · Shashank Maheshwar`,
    title: esc(p.name),
    sub: esc(p.claim),
    foot: `<span>${p.access === "public" ? "Public" : "Private source"}</span><span>Evidence attached</span>`,
    big: true,
  })),
];
const dir = mkdtempSync(join(tmpdir(), "og-"));
const open = async (page, html) => {
  const f = join(dir, "card.html");
  writeFileSync(f, html);
  await page.goto(pathToFileURL(f).href);
};
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const j of jobs) {
  await open(page, card(j));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/og/${j.out}.png` });
  console.log("og", j.out);
}
await page.setViewportSize({ width: 180, height: 180 });
await open(
  page,
  `<body style="margin:0;background:#F6F6F3"><img src="${mark}" style="width:180px;height:180px;display:block">`,
);
await page.screenshot({ path: "public/apple-touch-icon.png" });
await browser.close();
rmSync(dir, { recursive: true });
