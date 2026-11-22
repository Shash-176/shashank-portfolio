/**
 * Content rules from the design freeze (§18) and the Step 3 brief (§3).
 * Pure functions: the content schemas call them at build time, and unit tests call them directly.
 */

export const STATES = [
  "Reproduced",
  "Tested",
  "Live",
  "Stated",
  "Verified",
  "Unsafe",
  "Invalid",
  "Unknown",
  "Not comparable",
  "Limitation",
  "Private",
  "Research in progress",
] as const;
export type EvidenceState = (typeof STATES)[number];

/** States that assert a check happened. They need a method, a date and a source. */
export const PROOF_STATES: readonly EvidenceState[] = ["Verified", "Reproduced", "Tested"];

export interface EvidenceLike {
  id: string;
  state: EvidenceState;
  date?: string;
  method?: string;
  source?: { label: string; url?: string };
}

export function evidenceProblems(e: EvidenceLike): string[] {
  const out: string[] = [];
  if (PROOF_STATES.includes(e.state)) {
    if (!e.method) out.push(`${e.id}: "${e.state}" needs a method`);
    if (!e.date) out.push(`${e.id}: "${e.state}" needs a date`);
    if (!e.source) out.push(`${e.id}: "${e.state}" needs a source (use label "Private" for private sources)`);
  }
  if (e.state === "Live" && !e.source?.url) out.push(`${e.id}: "Live" needs a public address`);
  if (e.date && !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) out.push(`${e.id}: date must be YYYY-MM-DD`);
  return out;
}

export interface ProjectLike {
  id: string;
  access: "public" | "private";
  repository?: string;
}

export function projectProblems(p: ProjectLike): string[] {
  return p.access === "private" && p.repository ? [`${p.id}: a private project cannot link a repository`] : [];
}

/** Disclosure tiers for research, in increasing order of what may be shown. */
export const TIERS = ["status", "overview", "method", "results"] as const;
export type Tier = (typeof TIERS)[number];

export interface ResearchLike {
  id: string;
  tier: Tier;
  problem?: string;
  method?: string;
  results?: string;
}

export function researchProblems(r: ResearchLike): string[] {
  const allowed = TIERS.indexOf(r.tier);
  const out: string[] = [];
  if (r.problem && allowed < TIERS.indexOf("overview")) out.push(`${r.id}: problem exceeds tier "${r.tier}"`);
  if (r.method && allowed < TIERS.indexOf("method")) out.push(`${r.id}: method exceeds tier "${r.tier}"`);
  if (r.results && allowed < TIERS.indexOf("results")) out.push(`${r.id}: results exceed tier "${r.tier}"`);
  return out;
}

/** Placeholder syntax inside content strings: [[todo: what is missing]]. */
export const PLACEHOLDER = /\[\[todo:\s*([^\]]+)\]\]/g;
export const hasPlaceholder = (s: string) => new RegExp(PLACEHOLDER.source).test(s);

/** Numbers evidence by first use on a page. Returns 1-based numbers. */
export function numberEvidence(order: string[], id: string): number {
  const i = order.indexOf(id);
  if (i >= 0) return i + 1;
  order.push(id);
  return order.length;
}
