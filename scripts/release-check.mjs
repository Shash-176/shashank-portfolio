// Release gate: run after `RELEASE=1 astro build` (which already refuses placeholders).
// Checks the built site for secrets, private links, forbidden topics, metadata and required files.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const files = [];
const walk = (d) =>
  readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : files.push(join(d, f))));
walk(DIST);
const text = files.filter((f) => /\.(html|js|css|txt|xml|json)$/.test(f)).map((f) => [f, readFileSync(f, "utf8")]);
const problems = [];
const check = (ok, msg) => ok || problems.push(msg);

const SECRETS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bsk-[A-Za-z0-9]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}/,
  /postgres(ql)?:\/\/[^\s"']*:[^\s"'@]+@/i,
];
const FORBIDDEN =
  /internship|full-time|job search|seeking (a )?(role|job)|hiring timeline|deadline|my budget|subscription|Claude Pro|hours a week/i;
const ALLOWED_GITHUB = [/github\.com\/Shash-176\/?$/, /github\.com\/Shash-176\/planproof(\/|$)/];

for (const [f, t] of text) {
  for (const re of SECRETS) check(!re.test(t), `${f}: possible secret (${re})`);
  if (f.endsWith(".html")) {
    check(!FORBIDDEN.test(t.replace(/<script[\s\S]*?<\/script>/g, "")), `${f}: mentions an internal-only topic`);
    for (const m of t.matchAll(/href="(https?:\/\/github\.com[^"]*)"/g))
      check(
        ALLOWED_GITHUB.some((re) => re.test(m[1])),
        `${f}: links a GitHub address that is not public: ${m[1]}`,
      );
    for (const m of t.matchAll(/<a [^>]*target="_blank"[^>]*>/g))
      check(/rel="[^"]*noopener/.test(m[0]), `${f}: target=_blank without rel=noopener`);
    if (!f.endsWith("404.html")) {
      for (const tag of [
        "<title>",
        'name="description"',
        'rel="canonical"',
        'property="og:image"',
        "Content-Security-Policy",
      ])
        check(t.includes(tag), `${f}: missing ${tag}`);
    }
    check(!/icon-26|icon-somaiya/i.test(t), `${f}: references the icon-26 repository or site`);
  }
}
for (const req of [
  "sitemap-index.xml",
  "robots.txt",
  "favicon.svg",
  "apple-touch-icon.png",
  "og/home.png",
  "og/planproof.png",
  "og/smart-attendance.png",
  "og/graph-rag.png",
  "og/research-data-platform.png",
  "404.html",
])
  check(existsSync(join(DIST, req)), `missing ${req}`);

const external = new Set();
for (const [f, t] of text)
  if (f.endsWith(".html")) for (const m of t.matchAll(/href="(https?:\/\/[^"]+)"/g)) external.add(m[1]);

if (problems.length) {
  console.error(`Release check FAILED (${problems.length}):\n  - ${problems.join("\n  - ")}`);
  process.exit(1);
}
console.log(
  `Release check passed: ${files.length} files. External links to verify in production (${external.size}):\n  ${[...external].sort().join("\n  ")}`,
);
