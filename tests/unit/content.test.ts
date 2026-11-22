// Checks the real content files against the same rules the build enforces, plus privacy invariants.
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { evidenceProblems, researchProblems, STATES } from "../../src/lib/rules";

const evidence = JSON.parse(readFileSync("src/content/evidence.json", "utf8"));
const research = JSON.parse(readFileSync("src/content/research.json", "utf8"));
const mdx = readdirSync("src/content/projects").map((f) => readFileSync(`src/content/projects/${f}`, "utf8"));
const ids = new Set(evidence.map((e: { id: string }) => e.id));

describe("content", () => {
  it("every evidence record passes the rules", () => {
    for (const e of evidence) expect(evidenceProblems(e), e.id).toEqual([]);
    for (const e of evidence) expect(STATES).toContain(e.state);
  });
  it("every evidence reference in a case study exists", () => {
    for (const body of mdx) for (const m of body.matchAll(/<Ev id="([\w-]+)"/g)) expect(ids.has(m[1]), m[1]).toBe(true);
  });
  it("private projects never link a repository", () => {
    for (const body of mdx) if (/^access: private/m.test(body)) expect(body).not.toMatch(/^repository:/m);
  });
  it("research stays within its tier and shows no results", () => {
    for (const r of research) {
      expect(researchProblems(r)).toEqual([]);
      expect(r.results).toBeUndefined();
    }
  });
  it("no content mentions job seeking, deadlines, budget or tool subscriptions", () => {
    const all = [JSON.stringify(evidence), JSON.stringify(research), ...mdx, readFileSync("src/site.ts", "utf8")].join(
      "\n",
    );
    expect(all).not.toMatch(
      /internship|full-time|job search|hiring|deadline|development budget|my budget|subscription|Claude Pro|hours a week/i,
    );
  });
});
