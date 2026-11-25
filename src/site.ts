/**
 * Site-wide facts. Anything only Shashank can supply is written as [[todo: …]];
 * it renders as a visible placeholder and blocks a release build (see src/integrations/release-guard.mjs).
 */
export const SITE = {
  name: "Shashank Maheshwar",
  shortName: "S. Maheshwar",
  role: "Backend and data engineer",
  place: "Mumbai",
  headline: { lead: "I build backend and data systems that", highlight: "check their own answers." },
  supporting:
    "MCA student at K. J. Somaiya Institute of Management, graduating in 2027. PostgreSQL at the centre of most of what I build, and an explicit state for “cannot tell”.",
  description:
    "Shashank Maheshwar, backend and data engineer. Systems that verify their own results, including the AI parts, with the evidence attached.",
  email: "[[todo: public email address]]",
  linkedin: "[[todo: LinkedIn address]]",
  github: "https://github.com/Shash-176",
  resume: { url: "[[todo: résumé PDF]]", size: "[[todo: size]]", updated: "[[todo: date]]" },
  aiStatement: {
    text: "I build with AI coding tools. I am responsible for the design decisions, the verification and what ships.",
    approved: true,
  },
  version: "1.0.0-rc.1",
  updated: "2026-11-26",
  themeColor: { light: "#F6F6F3", dark: "#0E0F12" },
} as const;
