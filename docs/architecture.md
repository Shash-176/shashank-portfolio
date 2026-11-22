# Architecture

## Stack decision (Step 3, 22 Nov 2026)

| Concern       | Choice                                                   | Why                                                                                                                                                                                                                                      | Rejected                                                                                                                           |
| ------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | **Astro 7**                                              | Static-first; ships zero JavaScript unless a component asks for it; content collections defined in `src/content.config.ts` with Zod schemas and cross-collection `reference()`; MDX; can host React or a 3D island later                 | Next.js: built around a React runtime and server features this site does not need; a static export still ships React to every page |
| Language      | TypeScript (strict)                                      | Typed content and scripts                                                                                                                                                                                                                | —                                                                                                                                  |
| Styling       | Vanilla CSS with custom properties + Astro scoped styles | The frozen design _is_ a token system; CSS variables give light/dark switching with no build step                                                                                                                                        | Tailwind (a second vocabulary over our tokens); CSS Modules (scoped styles already exist)                                          |
| Islands       | Vanilla TypeScript modules                               | Theme, menu, lens, diagram and exhibit logic total about 3 KB gzip                                                                                                                                                                       | React/Preact/Svelte islands: unnecessary weight for this interaction size                                                          |
| Motion        | CSS transitions and keyframes                            | Every motion in the freeze is a state change                                                                                                                                                                                             | GSAP/Motion                                                                                                                        |
| Content       | Astro content collections (JSON and MDX)                 | Typed, validated, referenced; MDX lets prose call `<Ev>`, `<Diagram>`, `<NullTrap>`                                                                                                                                                      | CMS (nothing to edit online)                                                                                                       |
| Unit tests    | Vitest                                                   | Pure rules, numbering, presence logic                                                                                                                                                                                                    | —                                                                                                                                  |
| Browser tests | Playwright + axe-core                                    | Behaviour, no-JS, print, accessibility, visual                                                                                                                                                                                           | —                                                                                                                                  |
| Performance   | Budget script on `dist/` + Lighthouse                    | Measured, not guessed                                                                                                                                                                                                                    | —                                                                                                                                  |
| Hosting       | **Vercel (Hobby)** primary; **Cloudflare Pages** backup  | Shashank already hosts PlanProof on Vercel; Hobby includes 100 GB transfer and 100 deployments a day. Cloudflare Pages' free plan allows 500 builds a month and a `_headers` file. Output is plain static files, so moving takes minutes | Netlify (similar, no advantage); GitHub Pages (no custom headers)                                                                  |

## Rendering

All routes are pre-rendered. Every page is complete HTML: claims, evidence notes, the six exhibit steps, diagram text equivalents. JavaScript only enhances.

```
src/
  content.config.ts        collections + build-time rules
  content/                 evidence.json, diagrams.json, research.json, capabilities.json, roles.json, projects/*.mdx
  data/null-trap.json      captured PlanProof output (15 Nov 2026)
  lib/rules.ts             content rules (pure; unit-tested)
  lib/evidence-render.ts   numbering + notes after render (pure; unit-tested)
  lib/presence.ts          presence timeline logic (pure; unit-tested)
  components/              Ev, Annotated, Section, Diagram, ExhibitFrame, NullTrap, PresenceTimeline, Avatar, …
  layouts/Base.astro       head, metadata, JSON-LD, evidence processing, header/footer
  integrations/            release-guard (placeholders), csp (hash-based Content-Security-Policy)
  pages/                   /, /work, /work/[slug], /about, /research, /system, /accessibility, /resume, 404, robots.txt
  scripts/                 theme, menu, lens, avatar
  styles/                  tokens.css, global.css, evidence.css
```

## The evidence engine

1. Content writes `<Ev id="pp-eval">claim text</Ev>`. `Ev` renders the claim and a numeral containing a marker `§EV:pp-eval§`.
2. `Annotated` (and `Section`, which wraps it) marks its content and margin with paired `<template>` markers.
3. `Base.astro` renders the page body to a string, then `processEvidence()`:
   - numbers ids by **first use in document order** (deterministic; Astro renders slots concurrently, so render order cannot be trusted);
   - inserts each note into the margin of the section where it is first used;
   - replaces markers with numbers.
4. The same records produce the end-of-page list (no-JS and print target), the evidence tables, the verification strips and the footer's claim count.

Notes are plain HTML generated in `evidence-render.ts`, with every string escaped, and styled globally (`styles/evidence.css`).

## Interactions

| Island                                                    | File                                    | Without JS                      |
| --------------------------------------------------------- | --------------------------------------- | ------------------------------- |
| Theme (system → light → dark, remembered)                 | `scripts/theme.ts` + inline head script | Follows the OS                  |
| Menu (native modal `<dialog>`)                            | `scripts/menu.ts`                       | Footer links                    |
| Evidence Lens (`E`, pin, Esc, phone bar, all-notes sheet) | `scripts/lens.ts`                       | Numerals link to the list       |
| Diagrams (assemble, previous/next, direct pick)           | `components/Diagram.astro`              | Separated SVG + ordered list    |
| Exhibit stepper (buttons, arrows, focus, announcements)   | `components/ExhibitFrame.astro`         | All six steps printed           |
| Presence timeline (buttons, drag)                         | `components/PresenceTimeline.astro`     | Default hour, computed at build |

## Live PlanProof mode: deferred to v1.1

The recorded exhibit is complete. Running the real engine here would add about 15 MB (uncompressed), need cross-origin isolation headers on the portfolio, and duplicate a tool that already runs at planproof-two.vercel.app. v1 links to the live tool. v1.1 options: an isolated `/lab/planproof` route with its own headers, or a deep link into PlanProof with the example preselected.

## Future modules (not built; nothing blocks them)

3D avatar (swap `Avatar.astro` internals), writing (a new collection reusing `Ev`), roles (the `roles` collection already exists), role views (`/for/[role]` filtering the same records), command palette, more exhibits (reuse `ExhibitFrame`), filters on `/work` at eight projects.
