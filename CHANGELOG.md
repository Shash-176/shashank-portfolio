# Changelog

## 1.0.0 — 27 Nov 2026 (first public release)

- Published at https://shashank-maheshwar.vercel.app; repository at https://github.com/Shash-176/shashank-portfolio.
- Résumé PDF at `/Shashank-Maheshwar-Resume.pdf` (web copy without the phone number); the `/resume` page lists what it contains.
- Colour on interaction: chartreuse is the interaction colour. Links get a highlighter stroke, buttons fill, and rows and cards get a tint, an edge bar and a highlighted title on hover and keyboard focus. Blue marks actions ("Full case study →", "All work →", links in prose).
- About: capability dots are chartreuse discs; CGPAs carry a highlighter stroke.
- Contact: public email and LinkedIn; LinkedIn added to the structured data.
- The AI-tools statement is approved.
- The four first-screen fonts are preloaded, so text no longer shifts when they load (CI measured CLS 0.145 on one machine; now 0.000).

## 1.0.0-rc.1 — 26 Nov 2026 (V1 candidate)

- Page transitions (progressive): the project title carries over from a list into its case study; the header stays put.
- Case studies: architecture mark in the header, previous and next navigation, short labels in the verification strip.
- Home: a one-line hint that teaches the Evidence Lens.
- About: CGPAs, ICON role and the certificate filled in from the source content; capabilities become a linked list on phones.
- PlanProof: "What would change next", taken from the project's own architecture notes. Smart Attendance credit no longer waits on a name.
- Research: the problem paragraph, within the approved disclosure tier.
- Fixed: generic note class names leaked into page headers (Research and Work titles were centred).
- Theme-aware header mark.

Blocked from 1.0.0 only by: public email, LinkedIn, résumé PDF, approval of the AI-tools statement.

## 0.11.0 — 22 Nov 2026 (release candidate)

- All pages: home, work index, four case studies, About, Research, System, Accessibility, Résumé, 404.
- Evidence engine: typed records, build-time rules, deterministic numbering, margin notes, end-of-page list, tables, strips.
- Evidence Lens: `E` shortcut, pin and Esc, phone bar and all-notes sheet, no text movement.
- Exploded diagrams for all four projects, with text equivalents and phone stacks.
- Exhibits: PlanProof NULL trap (recorded from a real capture) and the Smart Attendance presence timeline.
- Light, dark and system themes; static avatar with five states.
- SEO: metadata, canonical URLs, sitemap, robots, Person and project JSON-LD, share cards.
- Security: hash-based Content-Security-Policy, security headers, release gate.
- Tests: unit, behaviour, no-JS, print, accessibility (both themes), visual, budgets, Lighthouse.

Blocked from 1.0 only by personal details (see `docs/deployment.md`).
