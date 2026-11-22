// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import releaseGuard from "./src/integrations/release-guard.mjs";
import csp from "./src/integrations/csp.mjs";

// SITE_URL is set by the host at build time. The fallback is the planned production address.
const site = process.env.SITE_URL ?? "https://shashank-maheshwar.vercel.app";

export default defineConfig({
  site,
  trailingSlash: "never",
  build: { format: "directory", inlineStylesheets: "auto" },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes("/404") }), releaseGuard(), csp()],
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
});
