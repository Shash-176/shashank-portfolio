// Fails a release build (RELEASE=1) while any placeholder remains in the generated site.
// Placeholders render as elements with a data-placeholder attribute; raw [[todo: …]] text is caught too.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith(".html")) yield p;
  }
}

export default function releaseGuard() {
  return {
    name: "release-guard",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const found = new Map();
        for await (const file of htmlFiles(root)) {
          const html = await readFile(file, "utf8");
          for (const m of html.matchAll(/data-placeholder="([^"]+)"|\[\[todo:\s*([^\]]+)\]\]/g)) {
            const label = m[1] ?? m[2];
            found.set(label, [...(found.get(label) ?? []), file.slice(root.length)]);
          }
        }
        if (found.size === 0) return logger.info("No placeholders remain.");
        const lines = [...found].map(([label, files]) => `  - ${label} (${[...new Set(files)].length} pages)`);
        const message = `${found.size} placeholder(s) remain:\n${lines.join("\n")}`;
        if (process.env.RELEASE === "1") throw new Error(`Release blocked. ${message}`);
        logger.warn(message);
      },
    },
  };
}
