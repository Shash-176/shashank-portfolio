// Adds a Content-Security-Policy <meta> to every page, allowing only this site's scripts plus the
// exact inline scripts the build produced (by SHA-256 hash). Styles allow inline attributes (design tokens).
import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

export default function csp() {
  return {
    name: "csp",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        let n = 0;
        for await (const file of htmlFiles(fileURLToPath(dir))) {
          let html = await readFile(file, "utf8");
          const hashes = [
            ...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g),
          ].map((m) => `'sha256-${createHash("sha256").update(m[1]).digest("base64")}'`);
          const policy = [
            "default-src 'self'",
            `script-src 'self' ${[...new Set(hashes)].join(" ")}`.trim(),
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "base-uri 'self'",
            "form-action 'none'",
            "object-src 'none'",
          ].join("; ");
          html = html.replace("<head>", `<head><meta http-equiv="Content-Security-Policy" content="${policy}">`);
          await writeFile(file, html);
          n++;
        }
        logger.info(`CSP added to ${n} pages.`);
      },
    },
  };
}
