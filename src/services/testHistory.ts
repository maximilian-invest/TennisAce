// Helpers around persisted test results — build a TestResult from a score run
// and derive deltas / trends for the progress dashboard (research Teil 8).
import { TEST_STATIONS } from '@/content/tests';
import type { Domain, DomainScores, TestResult } from '@/domain/models';
import type { ScoreResult } from './scoringEngine';

const DOMAINS: Domain[] = ['speed', 'agility', 'powerLower', 'powerUpper', 'core', 'aerobic', 'mobility'];

let counter = 0;

export function buildTestResult(args: {
  score: ScoreResult;
  raw: Record<string, number>;
  type: TestResult['type'];
  date?: string;
}): TestResult {
  const { score, raw, type } = args;
  counter += 1;
  return {
    id: `${type}-${Date.now()}-${counter}`,
    date: args.date ?? new Date().toISOString(),
    type,
    raw: { ...raw },
    domainScores: score.domainScores,
    totalScore: score.totalScore,
    level: score.level,
    strongestDomain: score.strongestDomain,
    weakestDomain: score.weakestDomain,
  };
}

/** Per-domain point change between two results (current − previous). */
export function domainDeltas(curr: DomainScores, prev?: DomainScores): Record<Domain, number> {
  const out = {} as Record<Domain, number>;
  for (const d of DOMAINS) out[d] = Math.round(curr[d] - (prev?.[d] ?? curr[d]));
  return out;
}

/** "Improved" once a value moves by more than ~3 % (research Teil 8). */
export function isImproved(deltaPoints: number): boolean {
  return deltaPoints >= 3;
}

export interface TrendPoint {
  date: string;
  value: number;
}

/** Raw-value series for one station across the whole history (oldest → newest). */
export function trendForStation(history: TestResult[], stationKey: string): TrendPoint[] {
  return history
    .filter((h) => h.raw[stationKey] != null && !Number.isNaN(h.raw[stationKey]))
    .map((h) => ({ date: h.date, value: h.raw[stationKey] }));
}

/** Does a higher raw value mean a better result for this station? */
export function stationHigherIsBetter(stationKey: string): boolean {
  const unit = TEST_STATIONS.find((s) => s.key === stationKey)?.unit;
  // seconds = lower is better (sprint, agility); everything else higher is better.
  return unit !== 's';
}
