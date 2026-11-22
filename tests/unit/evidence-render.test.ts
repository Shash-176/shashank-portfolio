import { describe, expect, it } from "vitest";
import { processEvidence, NUM } from "../../src/lib/evidence-render";

const rec = (state: string) => ({
  claim: "c",
  state,
  body: "b",
  date: "2026-11-14",
  method: "m",
  source: { label: "s" },
});
const all = new Map(Object.entries({ a: rec("Tested"), b: rec("Stated"), c: rec("Reproduced") })) as never;
const scope = (k: string, inner: string, always = "0") =>
  `<div><template data-ev-scope="${k}" data-x></template>${inner}</div><aside><template data-ev-notes="${k}" data-always="${always}" data-x></template></aside>`;

describe("evidence numbering", () => {
  it("numbers by first use in document order and reuses numbers", () => {
    const html = scope("1", `${NUM("b")} ${NUM("a")}`) + scope("2", `${NUM("a")} ${NUM("c")}`);
    const { html: out, order } = processEvidence(html, all);
    expect(order).toEqual(["b", "a", "c"]);
    expect(out).not.toContain("§EV");
  });
  it("puts each note in the margin where it is first used, once", () => {
    const html = scope("1", `${NUM("a")}`) + scope("2", `${NUM("a")} ${NUM("c")}`);
    const { html: out } = processEvidence(html, all);
    expect(out.match(/id="note-1"/g)).toHaveLength(1);
    expect(out.indexOf('id="note-2"')).toBeGreaterThan(out.indexOf('data-ev-scope="2"'));
  });
  it("fails on an unknown id", () => {
    expect(() => processEvidence(NUM("zzz"), all)).toThrow(/Unknown evidence/);
  });
  it("escapes content", () => {
    const evil = new Map([["x", { ...rec("Stated"), body: "<script>alert(1)</script>" }]]) as never;
    const { html } = processEvidence(scope("1", NUM("x")), evil);
    expect(html).not.toContain("<script>");
  });
});
