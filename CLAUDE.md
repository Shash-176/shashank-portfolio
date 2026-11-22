# CLAUDE.md — Shashank Maheshwar's portfolio

Read this before changing anything. It is the working contract for this repository.

## Mission

An engineering portfolio where **claims can be inspected, systems can be pulled apart, and projects show their evidence**. Positioning: _a backend and data engineer who builds systems that check their own answers, including the AI parts._ The site is itself an engineering project: honest, fast, accessible, maintainable.

## Canonical planning documents (in the claude.ai project "My PortFolio")

| Document                                     | Role                                                                                                        |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `claude/step-1-profile-and-project-audit.md` | **Factual contract.** Every number on the site must trace to it or to a newer verified re-run               |
| `claude/step-2-design-freeze.md`             | **Design contract**: visual identity, evidence system, exhibits, motion, responsive and accessibility rules |
| `claude/step-3-architecture-brief.md`        | **Technical requirements**                                                                                  |
| `claude/portfolio-decisions.md`              | Decisions and their status                                                                                  |
| `claude/portfolio-open-items.md`             | What only Shashank can supply                                                                               |

Repository evidence outranks summaries. `docs/decisions.md` records implementation decisions made here.

## Architecture in one paragraph

Astro 7, static output, TypeScript. Content lives in typed, validated collections (`src/content.config.ts`, rules in `src/lib/rules.ts`). Pages render to plain HTML that is complete without JavaScript. Small vanilla-TypeScript islands add the theme switch, menu, Evidence Lens, diagram controls and exhibit steppers. Evidence numbering happens **after** the page renders (`src/lib/evidence-render.ts`): components emit evidence ids, the layout numbers them in document order and fills each section's margin and the end-of-page list from one record. See `docs/architecture.md`.

## Commands

```bash
npm run dev            # local dev server
npm run build          # static build into dist/ (warns about placeholders)
npm run preview        # serve dist/ on :4321
npm run check          # type-check + content validation
npm run lint           # eslint + prettier
npm test               # unit tests (rules, content, numbering, presence logic)
npm run test:e2e       # Playwright: behaviour, no-JS, print, accessibility (needs preview or starts it)
npm run test:browsers  # Firefox + WebKit (CI; needs Playwright browsers)
npm run test:visual    # screenshot regression; baselines are local (see docs/testing.md)
npm run budget         # performance budget on the built home page
npm run perf           # Lighthouse LCP/CLS/TBT (needs preview running and CHROME_PATH)
npm run og             # regenerate share cards after content changes
npm run release:check  # RELEASE build (fails on placeholders) + budget + release gate
```

Locally, set `CHROME_PATH=/usr/bin/google-chrome` (or your Chrome) for Playwright and Lighthouse.

## Design rules (from the freeze)

- Tokens live in `src/styles/tokens.css`. **No raw colours, sizes or durations in components**: use variables.
- Highlighter palette. Chartreuse budget: one large chartreuse area per screen (the headline phrase); otherwise only evidence highlights, the selected diagram layer and the active page.
- Dark mode is graphite with warm text. No glow, no neon, no gradients.
- Every evidence state is **shape + word**; colour is optional. Unknown is hatched, never a colour.
- No card grids, particles, fake terminals, dashboards, scroll-jacking, parallax, loading screens or decorative motion.
- Motion only for evidence reveal, note pin, diagram separation, exhibit progression, verdicts, theme change. Respect reduced motion.
- Every component is checked at 360, ~430, 768, 1100 and 1280/1440 px, in light and dark, before it counts as done.

## Evidence rules (enforced by the build)

- Facts are evidence records in `src/content/evidence.json`. Write `<Ev id="…">claim</Ev>` in content; never type a number into a note.
- `Verified`, `Reproduced` and `Tested` need a method, a date and a source, or the build fails. `Live` needs a public address.
- Without a source, the state is `Stated`.
- Exhibit numbers come from captured data (`src/data/null-trap.json`). **Never invent output.** Re-capture from PlanProof itself.

## Privacy rules (hard)

- Never publish private source code, credentials, private repository links, unpublished research results, or personal data.
- Private projects cannot have a `repository` field (build fails). Research cannot exceed its `tier` (build fails).
- Never mention: job seeking, internships or full-time search, timelines or deadlines, hours available, hardware, budget, AI subscriptions. `tests/unit/content.test.ts` and `scripts/release-check.mjs` scan for these.
- Do not link or copy anything from the `icon-26` repository.
- Do not upload Shashank's photograph anywhere. The avatar is a neutral base model, labelled as not a likeness.
- Collaborators are named only with their agreement (currently a placeholder).

## Placeholders

Write anything only Shashank can supply as `[[todo: what is missing]]` (or `<Placeholder label="…" />` in MDX). It renders visibly, the normal build warns, and `npm run release:check` refuses to build. The current list is in `docs/deployment.md`.

## Accessibility (release-blocking)

The 15 criteria on `/accessibility` are acceptance tests. Automated: axe on every page in both themes, keyboard flows, no-JS, 320 px. Manual before release: screen-reader pass of the lens and exhibits.

## Performance budgets (HARD)

Home: initial JS ≤ 90 KB gzip, CSS ≤ 30 KB, fonts ≤ 4 files and 120 KB, total ≤ 350 KB, LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms. **Zero** 3D or database-engine bytes in the initial load. `npm run budget` and `npm run perf` measure them.

## Release requirements

`npm run lint && npm run check && npm test && npm run test:e2e && npm run release:check`, all green, then deploy (see `docs/deployment.md`), then verify the public site.

## Prohibited shortcuts

- Disabling a test, a lint rule or a budget to get green.
- Typing evidence numbers into prose, or "Verified" without a source.
- Adding a UI framework, a motion library or a CSS framework for something a few lines of CSS or TypeScript can do.
- Building the 3D avatar before v1.0. Replace the internals of `src/components/Avatar.astro` later; keep its props (`state`, `size`, `caption`).
- `set:html` with anything that is not escaped or produced by our own code.
