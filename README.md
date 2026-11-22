# Shashank Maheshwar — engineering portfolio

> I build backend and data systems that check their own answers.

A portfolio where claims can be inspected, systems can be pulled apart, and projects show their evidence:

- **Evidence Lens.** Every factual claim carries a numbered note: how it is known, when, by what method, where to check, and its limits. Press `E` to see them all.
- **Exploded diagrams.** Each project's architecture as layers you can step through, with a text version.
- **Exhibits.** PlanProof's NULL trap, recorded from a real run, and Smart Attendance's presence timeline, where a camera outage is _unknown_, never _absent_.
- **Honest by construction.** The build refuses unsupported "verified" claims, private repository links, over-disclosed research and unresolved placeholders.

Static, accessible, fast: the home page is about 128 KB in total, with 2.7 KB of JavaScript, and works without JavaScript.

## Run it

```bash
npm ci
npm run dev        # http://localhost:4321
npm test           # unit tests
npm run build && npm run preview
CHROME_PATH=/path/to/chrome npm run test:e2e
```

## Read next

- `CLAUDE.md`: the working contract (rules, commands, budgets)
- `docs/architecture.md`: stack decision and how the evidence engine works
- `docs/content-guide.md`: adding facts, projects, research
- `docs/testing.md`, `docs/deployment.md`, `docs/decisions.md`, `CHANGELOG.md`

## Licence

Code: MIT. Written content, the avatar and the share cards: © Shashank Maheshwar, all rights reserved.
