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
  email: "shashankmaheshwar.sm@gmail.com",
  linkedin: "https://www.linkedin.com/in/shashank-maheshwar-1b637a248",
  github: "https://github.com/Shash-176",
  resume: { url: "/Shashank-Maheshwar-Resume.pdf", size: "39 KB", updated: "27 Nov 2026" },
  aiStatement: {
    text: "I build with AI coding tools. I am responsible for the design decisions, the verification and what ships.",
    approved: true,
  },
  version: "1.0.0",
  updated: "2026-11-27",
  themeColor: { light: "#F6F6F3", dark: "#0E0F12" },
} as const;
