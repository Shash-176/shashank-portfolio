# Testing

| Layer             | Command                               | What it proves                                                                                                                                                                                                                                    |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types and content | `npm run check`                       | Schemas: every evidence rule, private-repository rule and research tier                                                                                                                                                                           |
| Unit              | `npm test`                            | Rules, real content files (incl. privacy scan), evidence numbering and escaping, presence logic                                                                                                                                                   |
| Behaviour         | `npm run test:e2e` (chromium project) | Pages load with no console errors and one h1; 404; navigation; theme persistence; lens (`E`, pin, Esc focus return, no text shift, phone bar and sheet); menu focus; NULL-trap stepping by buttons and keys; timeline recompute; diagram controls |
| No JavaScript     | same                                  | All six exhibit steps, every numeral's target, diagram text, timeline default                                                                                                                                                                     |
| Print             | same                                  | Evidence list visible with full URLs; header hidden                                                                                                                                                                                               |
| Accessibility     | `npm run test:e2e` (a11y project)     | axe WCAG 2.2 A/AA on every page in light and dark; lens on; skip link; 320 px without sideways scroll                                                                                                                                             |
| Other engines     | `npm run test:browsers`               | Behaviour and no-JS in Firefox and WebKit (runs in CI)                                                                                                                                                                                            |
| Visual            | `npm run test:visual`                 | Home and PlanProof at 360/768/1280 in both themes                                                                                                                                                                                                 |
| Performance       | `npm run budget`, `npm run perf`      | HARD budgets on the built home page; Lighthouse LCP/CLS/TBT                                                                                                                                                                                       |
| Release           | `npm run release:check`               | No placeholders, secrets, private links, internal topics; metadata and required files present                                                                                                                                                     |

## Visual baselines

Screenshots differ slightly between machines and font renderers, so baselines are not committed (`tests/e2e/__screenshots__/` is ignored). Before a visual change: `npm run test:visual -- --update-snapshots` on the current main; after it: `npm run test:visual` and review the diff report.

## Local browsers

Set `CHROME_PATH` to a local Chrome to run Chromium tests and Lighthouse without downloading Playwright's browsers.

## Manual checks before a release

Keyboard-only pass of each page; screen reader (NVDA or VoiceOver) over the lens, an exhibit and a diagram; 200% zoom; reduced motion on; a real phone in both themes.
