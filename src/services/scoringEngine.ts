// Scoring engine — Functional Spec §3. Converts raw test values into domain
// scores (0–100), a weighted total, a level and strongest/weakest domains,
// using the norm tables in src/content/norms.json.
import normsData from '@/content/norms.json';
import { TEST_STATIONS } from '@/content/tests';
import type { Domain, DomainScores, Level, Sex } from '@/domain/models';

type Band = Record<string, [number, number]>;
type MeanSd = { mean: number; sd: number };
type NormTest = {
  unit: string;
  direction: 'lowerBetter' | 'higherBetter';
  method: 'meanSd' | 'ratingBands' | 'mixed';
  domain: string;
  data?: Record<Sex, Record<string, MeanSd>>;
  data_meanSd?: Record<Sex, Record<string, MeanSd>>;
  bands?: Record<string, Record<string, Band>>;
};
type NormsFile = {
  _meta: { ratingToPoints: Record<string, number> };
  tests: Record<string, NormTest>;
};

const norms = normsData as unknown as NormsFile;
const RATING_TO_POINTS = norms._meta.ratingToPoints;

const DOMAIN_WEIGHTS: Record<Domain, number> = {
  speed: 0.2,
  agility: 0.25,
  powerLower: 0.2,
  powerUpper: 0.15,
  core: 0.1,
  aerobic: 0.07,
  mobility: 0.03,
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function ageBand(age: number): string {
  if (age <= 11) return '10-11';
  if (age <= 13) return '12-13';
  if (age <= 15) return '14-15';
  if (age <= 17) return '16-17';
  if (age <= 29) return '18-29';
  if (age <= 39) return '30-39';
  if (age <= 49) return '40-49';
  return '50plus';
}

function parseAgeKeyRange(key: string): [number, number] {
  if (key === 'all') return [0, 200];
  const k = key.replace('youth_', '');
  if (k.endsWith('plus')) return [parseInt(k, 10), 200];
  const [lo, hi] = k.split('-').map((n) => parseInt(n, 10));
  return [lo, Number.isNaN(hi) ? lo : hi];
}

function resolveKey(keys: string[], age: number): string | undefined {
  if (keys.includes('all')) return 'all';
  const youth = age < 18;
  const candidates = keys.filter((k) => (youth ? true : !k.startsWith('youth')));
  // exact cover
  for (const k of candidates) {
    const [lo, hi] = parseAgeKeyRange(k);
    if (age >= lo && age <= hi) return k;
  }
  // nearest by midpoint
  let best: string | undefined;
  let bestDist = Infinity;
  for (const k of candidates.length ? candidates : keys) {
    const [lo, hi] = parseAgeKeyRange(k);
    const mid = (lo + hi) / 2;
    const d = Math.abs(mid - age);
    if (d < bestDist) {
      bestDist = d;
      best = k;
    }
  }
  return best;
}

function meanSdPoints(ms: MeanSd, value: number, direction: NormTest['direction']): number {
  let z = (value - ms.mean) / ms.sd;
  if (direction === 'lowerBetter') z = -z;
  return clamp(50 + 16.7 * z, 0, 100);
}

function ratingBandsPoints(band: Band, value: number): number {
  for (const [rating, [lo, hi]] of Object.entries(band)) {
    if (value >= lo && value < hi) return RATING_TO_POINTS[rating] ?? 50;
    if (value >= lo && value <= hi) return RATING_TO_POINTS[rating] ?? 50;
  }
  // out of all ranges → take extreme
  return value <= 0 ? 10 : 100;
}

/** Points (0–100) for one test's raw value, given sex & age. */
export function pointsForTest(normKey: string, value: number, sex: Sex, age: number): number {
  const test = norms.tests[normKey];
  if (!test) return 50;
  const sexKey: Sex = sex === 'w' ? 'w' : 'm'; // norms only define m/w

  const useMeanSd = test.method === 'meanSd' || (test.method === 'mixed' && age < 18);

  if (useMeanSd) {
    const data = (test.data ?? test.data_meanSd)?.[sexKey];
    if (data) {
      const key = resolveKey(Object.keys(data), age);
      if (key && data[key]) return meanSdPoints(data[key], value, test.direction);
    }
  }

  if (test.bands) {
    const forSex = test.bands[sexKey] ?? test.bands.youth;
    if (forSex) {
      const key = resolveKey(Object.keys(forSex), age);
      if (key && forSex[key]) return ratingBandsPoints(forSex[key], value);
    }
  }

  return 50;
}

export interface ScoreResult {
  domainScores: DomainScores;
  totalScore: number;
  level: Level;
  strongestDomain: Domain;
  weakestDomain: Domain;
}

const LEVEL_BANDS: Record<Level, [number, number]> = {
  L1: [0, 40],
  L2: [40, 60],
  L3: [60, 80],
  L4: [80, 100],
};

export function levelFor(total: number): Level {
  if (total < 40) return 'L1';
  if (total < 60) return 'L2';
  if (total < 80) return 'L3';
  return 'L4';
}

/** Progress (0–100 %) of a total score within a given level's band. */
export function levelProgressWithin(total: number, level: Level): number {
  const [lo, hi] = LEVEL_BANDS[level];
  return Math.round(clamp(((total - lo) / (hi - lo)) * 100, 0, 100));
}

/** Raw values keyed by TestStation.key. */
export function computeScores(raw: Record<string, number>, sex: Sex, age: number): ScoreResult {
  const perTest: Partial<Record<string, number>> = {};
  for (const station of TEST_STATIONS) {
    const value = raw[station.key];
    if (value != null && !Number.isNaN(value)) {
      perTest[station.key] = pointsForTest(station.normKey, value, sex, age);
    }
  }

  const avg = (keys: string[]) => {
    const vals = keys.map((k) => perTest[k]).filter((v): v is number => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 50;
  };

  const domainScores: DomainScores = {
    speed: avg(['sprint']),
    agility: avg(['agility']),
    powerLower: avg(['cmj', 'broad']),
    powerUpper: avg(['medball']),
    core: avg(['plank']),
    aerobic: avg(['beep']),
    mobility: avg(['sitreach']),
  };

  let totalScore = 0;
  (Object.keys(DOMAIN_WEIGHTS) as Domain[]).forEach((d) => {
    totalScore += domainScores[d] * DOMAIN_WEIGHTS[d];
  });
  totalScore = Math.round(totalScore);

  const entries = Object.entries(domainScores) as [Domain, number][];
  const strongestDomain = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  const weakestDomain = entries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];

  return { domainScores, totalScore, level: levelFor(totalScore), strongestDomain, weakestDomain };
}
