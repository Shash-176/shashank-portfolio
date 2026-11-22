import { describe, expect, it } from "vitest";
import { evidenceProblems, projectProblems, researchProblems, hasPlaceholder } from "../../src/lib/rules";

describe("evidence rules", () => {
  it("rejects a proof state without method, date or source", () => {
    const p = evidenceProblems({ id: "x", state: "Verified" });
    expect(p).toHaveLength(3);
  });
  it("accepts a stated claim with nothing attached", () => {
    expect(evidenceProblems({ id: "x", state: "Stated" })).toEqual([]);
  });
  it("requires a public address for Live", () => {
    expect(evidenceProblems({ id: "x", state: "Live", source: { label: "site" } })).toHaveLength(1);
  });
  it("rejects malformed dates", () => {
    expect(
      evidenceProblems({ id: "x", state: "Tested", method: "m", source: { label: "s" }, date: "14/11/2026" }),
    ).toHaveLength(1);
  });
});

describe("privacy rules", () => {
  it("rejects a repository link on a private project", () => {
    expect(projectProblems({ id: "p", access: "private", repository: "https://github.com/x/y" })).toHaveLength(1);
  });
  it("allows a repository link on a public project", () => {
    expect(projectProblems({ id: "p", access: "public", repository: "https://github.com/x/y" })).toEqual([]);
  });
  it("rejects research results above the approved tier", () => {
    expect(researchProblems({ id: "r", tier: "method", results: "42%" })).toHaveLength(1);
    expect(researchProblems({ id: "r", tier: "status", problem: "p" })).toHaveLength(1);
    expect(researchProblems({ id: "r", tier: "method", problem: "p", method: "m" })).toEqual([]);
  });
});

describe("placeholders", () => {
  it("detects the placeholder syntax", () => {
    expect(hasPlaceholder("[[todo: email]]")).toBe(true);
    expect(hasPlaceholder("hello")).toBe(false);
  });
});
