# Deployment

## Primary: Vercel (Hobby, free)

One-time setup (Shashank):

1. Push this repository to GitHub (for example `Shash-176/portfolio`).
2. In Vercel, **Add New → Project**, import the repository. Framework preset: Astro (read from `vercel.json`).
3. Environment variable `SITE_URL` = the production address (for example `https://shashank-maheshwar.vercel.app`).
4. Deploy. Every pull request then gets a preview deployment; `main` deploys to production.

Security headers and caching come from `vercel.json`; the Content-Security-Policy with script hashes is written into each page at build.

## Backup: Cloudflare Pages

Build command `npm run build`, output `dist`, environment variable `SITE_URL`. Headers come from `public/_headers`. Any static host works.

## Release checklist (v1.0)

1. All placeholders resolved: `npm run release:check` passes.
2. `npm run lint && npm run check && npm test && npm run test:e2e` pass; CI green, including Firefox and WebKit.
3. `npm run perf` within budget.
4. Deploy, then verify the public site: every page, lens, both exhibits, themes, a phone, 404, metadata, share card (paste a link into a messenger), external links, console and network errors.

## Placeholders

None remain as of v1.0.0. A new `[[todo: …]]` anywhere in content makes a release build fail again; set the value where the build error points.

## Production

- Address: https://shashank-maheshwar.vercel.app (Vercel project `shashank-maheshwar`, Hobby).
- Every push to `main` deploys to production; CI runs on the same push.
- The résumé is `public/Shashank-Maheshwar-Resume.pdf`. To update it, replace the file and set `size` and `updated` in `src/site.ts`.

Optional: `SITE_URL` for a custom domain (a free `*.vercel.app` address works as is).
