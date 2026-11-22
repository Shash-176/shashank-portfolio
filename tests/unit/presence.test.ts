import { describe, expect, it } from "vitest";
import { presence, clampOutage, clock } from "../../src/lib/presence";

describe("presence timeline", () => {
  it("records camera downtime as unknown, never absent", () => {
    const r = presence({ start: 24, length: 12 });
    expect(r.engine).toMatchObject({ observed: 48, unknown: 12, absent: 0 });
    expect(r.naive).toMatchObject({ present: 48, absent: 12 });
  });
  it("is conclusive at exactly 80% coverage", () => {
    expect(presence({ start: 0, length: 12 }).engine.status).toBe("MEETS_REQUIREMENT");
  });
  it("is inconclusive below 80% coverage", () => {
    expect(presence({ start: 0, length: 14 }).engine.status).toBe("INCONCLUSIVE");
  });
  it("the naive system wrongly penalises past 15 minutes", () => {
    expect(presence({ start: 0, length: 15 }).naive.status).toBe("MEETS_REQUIREMENT");
    expect(presence({ start: 0, length: 16 }).naive.status).toBe("BELOW_REQUIREMENT");
  });
  it("keeps the outage inside the hour", () => {
    expect(clampOutage({ start: 58, length: 12 })).toEqual({ start: 48, length: 12 });
    expect(clampOutage({ start: -5, length: 1 })).toEqual({ start: 0, length: 2 });
  });
  it("formats the clock", () => {
    expect(clock(0)).toBe("09:00");
    expect(clock(60)).toBe("10:00");
  });
});
