// Goal → training emphasis (Master concept Teil 4.4). The weakest test domain
// nudges the split ("biggest lever first"); age shifts it toward prehab/mobility.
import type { Domain, Goal } from '@/domain/models';
import { rulesForAge } from './ageBands';

export type Bucket = 'strength' | 'power' | 'speedAgility' | 'conditioning' | 'prehabMobility';
export const BUCKETS: Bucket[] = ['strength', 'power', 'speedAgility', 'conditioning', 'prehabMobility'];

export type Emphasis = Record<Bucket, number>;

// Each goal's split over [strength, power, speedAgility, conditioning, prehabMobility].
const GOAL_SPLIT: Record<Goal, [number, number, number, number, number]> = {
  speed: [20, 25, 35, 10, 10],
  explosive: [25, 35, 10, 5, 25],
  endurance: [20, 10, 15, 45, 10],
  injuryfree: [25, 10, 10, 15, 40],
  mobility: [25, 10, 5, 20, 40],
  strength: [35, 20, 10, 10, 25],
  bodycomp: [30, 15, 15, 25, 15],
};
const DEFAULT_SPLIT: [number, number, number, number, number] = [25, 20, 20, 20, 15];

const DOMAIN_BUCKET: Record<Domain, Bucket> = {
  speed: 'speedAgility',
  agility: 'speedAgility',
  powerLower: 'power',
  powerUpper: 'strength',
  core: 'prehabMobility',
  aerobic: 'conditioning',
  mobility: 'prehabMobility',
};

const toRecord = (a: [number, number, number, number, number]): Emphasis => ({
  strength: a[0], power: a[1], speedAgility: a[2], conditioning: a[3], prehabMobility: a[4],
});

function normalize(e: Emphasis): Emphasis {
  const sum = BUCKETS.reduce((s, b) => s + Math.max(0, e[b]), 0) || 1;
  const out = {} as Emphasis;
  for (const b of BUCKETS) out[b] = Math.round((Math.max(0, e[b]) / sum) * 100);
  return out;
}

export function computeEmphasis(goals: Goal[], weakest: Domain | undefined, age: number): Emphasis {
  const acc: Emphasis = { strength: 0, power: 0, speedAgility: 0, conditioning: 0, prehabMobility: 0 };

  if (goals.length === 0) {
    BUCKETS.forEach((b, i) => (acc[b] = DEFAULT_SPLIT[i]));
  } else {
    goals.forEach((g, idx) => {
      const split = toRecord(GOAL_SPLIT[g] ?? DEFAULT_SPLIT);
      const weight = idx === 0 ? 2 : 1; // primary goal counts double
      BUCKETS.forEach((b) => (acc[b] += split[b] * weight));
    });
  }

  // Biggest-lever-first: bump the weakest domain's bucket.
  if (weakest) acc[DOMAIN_BUCKET[weakest]] += 12;

  // Age shift: move points from the riskier buckets into prehab/mobility.
  const shift = rulesForAge(age).prehabShift;
  if (shift > 0) {
    const fromPower = Math.min(acc.power, shift * 0.6);
    const fromSpeed = Math.min(acc.speedAgility, shift * 0.4);
    acc.power -= fromPower;
    acc.speedAgility -= fromSpeed;
    acc.prehabMobility += fromPower + fromSpeed;
  }

  return normalize(acc);
}

/** Buckets ranked high → low. */
export function rankedBuckets(e: Emphasis): Bucket[] {
  return [...BUCKETS].sort((a, b) => e[b] - e[a]);
}

/** Which exercise domains feed a bucket. */
export const BUCKET_DOMAINS: Record<Bucket, Domain[]> = {
  strength: ['powerLower', 'powerUpper'],
  power: ['powerLower', 'powerUpper'],
  speedAgility: ['speed', 'agility'],
  conditioning: ['aerobic'],
  // powerUpper is included so shoulder-prehab (domain powerUpper, quality Prehab)
  // lands here; the quality filter keeps strength work out.
  prehabMobility: ['mobility', 'core', 'powerUpper'],
};

/** Primary domain for a bucket — used for the session's accent colour. */
export const BUCKET_PRIMARY: Record<Bucket, Domain> = {
  strength: 'powerLower',
  power: 'powerLower',
  speedAgility: 'speed',
  conditioning: 'aerobic',
  prehabMobility: 'mobility',
};

/** Exercise.quality values that belong to each bucket. */
export const BUCKET_QUALITIES: Record<Bucket, string[]> = {
  strength: ['Kraft', 'Maximalkraft'],
  power: ['Power'],
  speedAgility: ['Speed', 'Agilität'],
  conditioning: ['Kondition'],
  prehabMobility: ['Prehab', 'Mobility', 'Core'],
};
