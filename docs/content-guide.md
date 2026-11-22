# Content and evidence guide

## Add a fact

Add a record to `src/content/evidence.json`:

```json
{
  "id": "pp-tests",
  "claim": "124 automated tests",
  "state": "Tested",
  "date": "2026-11-14",
  "method": "npm test: 8 test files",
  "source": { "label": "planproof repository", "url": "https://github.com/Shash-176/planproof" },
  "limitation": "optional",
  "body": "One or two sentences shown in the note."
}
```

States: Reproduced, Tested, Live, Stated, Verified, Unsafe, Invalid, Unknown, Not comparable, Limitation, Private, Research in progress.
`Verified`, `Reproduced` and `Tested` need `method`, `date` and `source` (use `{ "label": "Private repository" }` for private work). `Live` needs a `url`. If you cannot link to anything, the honest state is `Stated`.

Use it in MDX or Astro: `<Ev id="pp-tests">124 automated tests</Ev>`. Numbers, margin notes, tables and the end list are generated.

## Add a project

1. Create `src/content/projects/<slug>.mdx` with the frontmatter fields in `src/content.config.ts` (`name`, `order`, `depth: full|short`, `access: public|private`, `claim`, `description`, `row`, `brief`, `briefEvidence`, `strip`, `mark`, `limitations`, and optionally `repository`, `live`, `diagram`, `exhibit`).
2. Write sections as `<Section title="…">…</Section>`. Available components: `Ev`, `Diagram`, `NullTrap`, `PresenceTimeline`, `EvidenceTable`, `Timeline`, `Placeholder`, `Limitations`, `Links`, `TwoPanels`.
3. Optional diagram: add an entry to `src/content/diagrams.json` (2–6 layers, each with real modules).
4. Run `npm run og` to create its share card, then `npm run check && npm test`.

The project appears on `/work` and the home page in `order`. Private projects cannot set `repository`.

## Add research

`src/content/research.json`. `tier` controls what may be shown: `status` < `overview` (problem) < `method` < `results`. Fields above the tier fail the build. Results stay out until Shashank approves publication.

## Add experience

`src/content/roles.json` with `kind: "work"`. An "Experience" section appears on About automatically.

## Placeholders

Anything only Shashank can supply: `[[todo: what is missing]]` in strings, `<Placeholder label="…" />` (or `inline`) in MDX. A release build refuses to finish while any remain.

## Voice

Plain, short sentences. Say what the system does, give the number and where it came from, state the limit. Never "passionate", "innovative", "cutting-edge", "leverage". Never mention job seeking, timelines, budget or tools subscriptions.
