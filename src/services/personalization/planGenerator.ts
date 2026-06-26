// The personalized weekly plan generator (Master concept Teil 4.5/4.6) — the
// moat. From the profile it builds a safe, goal-weighted week, picks eligible
// exercises, and places sessions around the user's tennis days (no heavy legs
// the day before a match). Replaces the static PLANS table.
import { EXERCISES, type Exercise } from '@/content/exercises';
import type { PlanSession, WeekPlan } from '@/content/plans';
import type { Domain, Goal, HealthCheck, Lang, Level } from '@/domain/models';
import { rulesForAge } from './ageBands';
import { isEligible, type PersonInput } from './eligibility';
import {
  BUCKET_DOMAINS,
  BUCKET_PRIMARY,
  BUCKET_QUALITIES,
  computeEmphasis,
  rankedBuckets,
  type Bucket,
} from './emphasis';
import { toneForAge } from './tonality';

export interface PlanInput {
  age: number;
  level: Level;
  goals: Goal[];
  health?: HealthCheck | null;
  tennisDays?: number[]; // 1=Mon … 7=Sun
  trainingDaysPerWeek?: number; // 1–6
  weakest?: Domain;
  lang: Lang;
}

const LEVEL_DEFAULT_DAYS: Record<Level, number> = { L1: 2, L2: 3, L3: 4, L4: 5 };
const INTENSITY_RANK: Record<Bucket, number> = { power: 3, speedAgility: 3, conditioning: 2, strength: 2, prehabMobility: 0 };
const BASE_DURATION: Record<Bucket, number> = { strength: 45, power: 40, speedAgility: 40, conditioning: 35, prehabMobility: 30 };

const TITLES: Record<Bucket, { de: [string, string]; en: [string, string] }> = {
  strength: { de: ['Kraft', 'Kraft · leicht & gestützt'], en: ['Strength', 'Strength · light & supported'] },
  power: { de: ['Power / Plyometrie', 'Reaktiv & Med-Ball'], en: ['Power / Plyometrics', 'Reactive & med-ball'] },
  speedAgility: { de: ['Schnelligkeit & Agilität', 'Balance & Reaktion'], en: ['Speed & Agility', 'Balance & reaction'] },
  conditioning: { de: ['Kondition', 'Ausdauer locker'], en: ['Conditioning', 'Easy endurance'] },
  prehabMobility: { de: ['Mobilität & Prehab', 'Beweglichkeit & Balance'], en: ['Mobility & Prehab', 'Mobility & balance'] },
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function sessionBuckets(emphasis: ReturnType<typeof computeEmphasis>, count: number, age: number): Bucket[] {
  const ranked = rankedBuckets(emphasis);
  const seq: Bucket[] = [];
  for (let i = 0; i < count; i++) seq.push(ranked[i % ranked.length]);
  // Guarantee prehab/mobility shows up for older athletes.
  if (rulesForAge(age).prehabShift >= 12 && !seq.includes('prehabMobility')) seq[seq.length - 1] = 'prehabMobility';
  return seq;
}

function pickExercises(bucket: Bucket, n: number, person: PersonInput, level: Level, used: Set<string>): Exercise[] {
  const domains = BUCKET_DOMAINS[bucket];
  const quals = BUCKET_QUALITIES[bucket];
  let pool = EXERCISES.filter((e) => domains.includes(e.domain) && quals.includes(e.quality) && isEligible(e, person));
  // Substitution: if the goal-bucket has nothing safe (e.g. a senior's sprints),
  // fall back to safe prehab/mobility/balance work in the same slot.
  if (pool.length === 0) {
    const fb = BUCKET_DOMAINS.prehabMobility;
    pool = EXERCISES.filter((e) => fb.includes(e.domain) && isEligible(e, person));
  }
  const maxDiff = level === 'L1' ? 1 : level === 'L2' ? 2 : 3;
  let pref = pool.filter((e) => e.difficulty <= maxDiff);
  if (pref.length < n) pref = pool;
  const unused = pref.filter((e) => !used.has(e.id));
  const ordered = [...unused, ...pref.filter((e) => used.has(e.id))];
  const chosen = ordered.slice(0, Math.min(n, ordered.length));
  chosen.forEach((e) => used.add(e.id));
  return chosen;
}

/** Pick `count` evenly-spread slots from the available day indices. */
function spreadSlots(avail: number[], count: number): number[] {
  if (count >= avail.length) return [...avail];
  if (count <= 1) return [avail[Math.floor(avail.length / 2)]];
  const out: number[] = [];
  for (let k = 0; k < count; k++) out.push(avail[Math.round((k * (avail.length - 1)) / (count - 1))]);
  return Array.from(new Set(out));
}

export function generateWeekPlan(input: PlanInput): WeekPlan {
  const { age, level, goals, health, lang, weakest } = input;
  const person: PersonInput = { age, health };
  const rules = rulesForAge(age);
  const senior = toneForAge(age) === 'senior';

  const emphasis = computeEmphasis(goals, weakest, age);
  const target = clamp(input.trainingDaysPerWeek ?? LEVEL_DEFAULT_DAYS[level], 1, 6);

  // Available off-court days (avoid the user's tennis weekdays).
  const tennisIdx = new Set((input.tennisDays ?? []).map((d) => ((d - 1) % 7 + 7) % 7));
  let avail = [0, 1, 2, 3, 4, 5, 6].filter((i) => !tennisIdx.has(i));
  if (avail.length === 0) avail = [0, 1, 2, 3, 4, 5, 6];
  const count = Math.min(target, avail.length);

  // Build the sessions.
  const buckets = sessionBuckets(emphasis, count, age);
  const used = new Set<string>();
  const nPerSession = level === 'L3' || level === 'L4' ? 6 : 5;
  const built = buckets.map((bucket) => {
    const exs = pickExercises(bucket, nPerSession, person, level, used);
    const dur = clamp(BASE_DURATION[bucket] + (level === 'L1' ? -5 : level === 'L4' ? 5 : 0), 20, 55);
    const session: PlanSession = {
      title: TITLES[bucket][lang][senior ? 1 : 0],
      domain: BUCKET_PRIMARY[bucket],
      meta: `${dur} Min · ${exs.length} Übungen`,
      exercises: exs.map((e) => e.id),
      intensity: rules.safety?.[lang],
    };
    return { session, rank: INTENSITY_RANK[bucket] };
  });

  // Placement: intense sessions on the "freshest" days (farthest from tennis).
  const slots = spreadSlots(avail, count);
  const freshness = (i: number) =>
    tennisIdx.size === 0 ? 0 : Math.min(...[...tennisIdx].map((t) => Math.min((i - t + 7) % 7, (t - i + 7) % 7)));
  const slotsByFresh = [...slots].sort((a, b) => freshness(b) - freshness(a));
  const sessionsByIntensity = [...built].sort((a, b) => b.rank - a.rank);

  const week: (PlanSession | null)[] = Array(7).fill(null);
  slotsByFresh.forEach((slot, i) => {
    if (sessionsByIntensity[i]) week[slot] = sessionsByIntensity[i].session;
  });

  const prehabNote = rules.safety?.[lang] ?? (lang === 'de'
    ? 'Täglich 5 Min Band-Prehab für Schulter & Hüfte.'
    : 'Daily 5 min band prehab for shoulder & hip.');

  return { sessionsPerWeek: String(count), prehabNote, week };
}
