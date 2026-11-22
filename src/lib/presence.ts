/**
 * The presence timeline exhibit, for one synthetic hour.
 * Mirrors the rules in Smart Attendance's shared/presence_math.py for this scenario:
 * the person is present all hour and is seen whenever the camera covers; camera downtime is UNKNOWN,
 * never ABSENT; below the minimum coverage the result is INCONCLUSIVE.
 * Policy values are the project's demo policy (required 75%, minimum coverage 80%).
 */
export const HOUR = 60;
export const POLICY = { requiredPct: 75, minCoverage: 0.8 } as const;

export type Status = "MEETS_REQUIREMENT" | "BELOW_REQUIREMENT" | "INCONCLUSIVE";

export interface Outage {
  start: number; // minutes after 09:00
  length: number; // minutes
}

export function clampOutage(o: Outage): Outage {
  const length = Math.min(40, Math.max(2, Math.round(o.length)));
  const start = Math.min(HOUR - length, Math.max(0, Math.round(o.start)));
  return { start, length };
}

export function presence(o: Outage) {
  const { length } = clampOutage(o);
  const seen = HOUR - length;
  const naivePct = (seen / HOUR) * 100;
  const coverage = seen / HOUR;
  const enginePct = seen === 0 ? 0 : 100; // present time / observable time
  const engineStatus: Status =
    coverage < POLICY.minCoverage
      ? "INCONCLUSIVE"
      : enginePct >= POLICY.requiredPct
        ? "MEETS_REQUIREMENT"
        : "BELOW_REQUIREMENT";
  return {
    naive: {
      present: seen,
      absent: length,
      pct: naivePct,
      status: (naivePct >= POLICY.requiredPct ? "MEETS_REQUIREMENT" : "BELOW_REQUIREMENT") as Status,
    },
    engine: {
      observed: seen,
      unknown: length,
      absent: 0,
      pct: enginePct,
      lowerBound: naivePct,
      coverage,
      status: engineStatus,
    },
  };
}

export const clock = (min: number) =>
  `${String(9 + Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
export const statusWords = (s: Status) => s.replace(/_/g, " ").toLowerCase();
