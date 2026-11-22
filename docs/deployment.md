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

## Placeholders blocking v1.0

| Placeholder                            | Where                                                              |
| -------------------------------------- | ------------------------------------------------------------------ |
| Public email address                   | Footer and menu, every page (`src/site.ts`)                        |
| LinkedIn address                       | Footer (`src/site.ts`)                                             |
| Résumé PDF, its size and date          | Header, About, `/resume` (`src/site.ts`; put the PDF in `public/`) |
| AI-tools statement approval            | About (`src/site.ts` → `aiStatement.approved`)                     |
| What I would change                    | PlanProof case study                                               |
| Collaborator, named with her agreement | Smart Attendance credits                                           |
| Research problem paragraph             | `/research` (`src/content/research.json`)                          |
| ICON edition, team, year               | About (`src/content/roles.json`)                                   |
| Certification credential link          | About                                                              |
| Production domain                      | `SITE_URL` (a `*.vercel.app` address is fine)                      |
