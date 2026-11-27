// Public changelog, newest first. Each release also has a git tag.
export const CHANGELOG = [
  {
    version: "1.0.0",
    date: "2026-11-27",
    notes:
      "First public release: contact details and the résumé, colour on interaction (a highlighter stroke on links, filled buttons, highlighted rows and cards), highlighted CGPAs, and preloaded fonts so text does not shift while loading.",
  },
  {
    version: "1.0.0-rc.1",
    date: "2026-11-26",
    notes:
      "V1 candidate: page transitions, previous and next case studies, architecture marks on case-study headers, short evidence labels, a phone-first capabilities list, and education, leadership and research details filled in.",
  },
  {
    version: "0.11.0",
    date: "2026-11-22",
    notes:
      "Release candidate: every page, the Evidence Lens, exploded diagrams, both recorded exhibits, tests and budgets. Waiting on personal details before v1.0.",
  },
] as const;
