// Per-exercise eligibility flags (Master concept Teil 4.3). Rather than hand-tag
// all 85 entries, we derive flags from domain/quality/difficulty and override the
// handful of safety-critical movements by id.
import type { Exercise } from '@/content/exercises';

export type Impact = 'none' | 'low' | 'moderate' | 'high';
export type Skill = 'low' | 'moderate' | 'high';
export type LoadType = 'bodyweight' | 'external' | 'plyometric' | 'sprint' | 'balance' | 'mobility' | 'medball';
export type Joint = 'shoulder' | 'elbow' | 'back' | 'knee' | 'ankle';

export interface ExerciseFlags {
  impact: Impact;
  skill: Skill;
  loadType: LoadType;
  minAge: number;
  maxAge: number;
  /** Joints that must be healthy for this exercise to be safe. */
  joints: Joint[];
  balanceSupport: boolean; // a supported/seated variant exists (seniors)
}

// Explicit overrides for movements where the heuristic would misjudge safety.
const OVERRIDES: Record<string, Partial<ExerciseFlags>> = {
  // Plyometrics — high impact/skill capped at 49; moderate jumps at 59.
  'depth-jump':            { impact: 'high', skill: 'high', loadType: 'plyometric', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  'contrast-depth-broad':  { impact: 'high', skill: 'high', loadType: 'plyometric', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  'single-leg-box-jump':   { impact: 'high', skill: 'high', loadType: 'plyometric', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  'reactive-bound-cut':    { impact: 'high', skill: 'high', loadType: 'plyometric', minAge: 16, maxAge: 59, joints: ['knee', 'ankle'] },
  'box-jump':              { impact: 'moderate', loadType: 'plyometric', minAge: 13, maxAge: 59, joints: ['knee', 'ankle'] },
  'broad-jump':            { impact: 'moderate', loadType: 'plyometric', minAge: 13, maxAge: 59, joints: ['knee', 'ankle'] },
  'lateral-bound':         { impact: 'moderate', loadType: 'plyometric', minAge: 13, maxAge: 59, joints: ['knee', 'ankle'] },
  'cmj':                   { impact: 'moderate', loadType: 'plyometric', minAge: 11, maxAge: 59, joints: ['knee', 'ankle'] },
  'pogo-hops':             { impact: 'low', loadType: 'plyometric', minAge: 11, joints: ['ankle'] },
  'jump-rope':             { impact: 'low', loadType: 'plyometric', minAge: 11, joints: ['ankle'] },
  // Sprints — short 20 m allowed from 13 (Martin) but reduced from 50; intense sprints 16+.
  'sprint-20m':            { impact: 'moderate', loadType: 'sprint', minAge: 13, maxAge: 49, joints: ['knee', 'ankle'] },
  'max-velocity-sprint':   { impact: 'high', skill: 'moderate', loadType: 'sprint', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  'flying-sprint':         { impact: 'high', skill: 'moderate', loadType: 'sprint', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  'resisted-band-sprint':  { impact: 'high', loadType: 'sprint', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  'sled-push':             { impact: 'high', loadType: 'sprint', minAge: 16, maxAge: 49, joints: ['knee', 'ankle', 'back'] },
  'hill-sprint':           { impact: 'high', loadType: 'sprint', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  // High-impact conditioning intervals.
  'on-court-suicides':     { impact: 'high', loadType: 'sprint', minAge: 13, maxAge: 49, joints: ['knee', 'ankle'] },
  'sprint-interval-sit':   { impact: 'high', loadType: 'sprint', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  'repeated-sprints':      { impact: 'high', loadType: 'sprint', minAge: 16, maxAge: 49, joints: ['knee', 'ankle'] },
  // Strength & upper body.
  'heavy-squat-deadlift':  { impact: 'low', loadType: 'external', minAge: 16, joints: ['back', 'knee'] },
  'overhead-press':        { impact: 'none', loadType: 'external', minAge: 16, joints: ['shoulder'] },
  'd2-pnf':                { impact: 'none', loadType: 'external', joints: [] },
  'medball-overhead-slam': { impact: 'low', loadType: 'medball', joints: ['shoulder'] },
  // Senior-friendly mobility/balance.
  'knee-to-wall':          { impact: 'none', loadType: 'mobility', joints: [], balanceSupport: true },
  'thoracic-open-book':    { impact: 'none', loadType: 'mobility', joints: [], balanceSupport: true },
};

export function exerciseFlags(ex: Exercise): ExerciseFlags {
  // Heuristic baseline by domain + quality.
  let base: ExerciseFlags = {
    impact: 'low',
    skill: 'low',
    loadType: 'bodyweight',
    minAge: 8,
    maxAge: 120,
    joints: [],
    balanceSupport: false,
  };

  const q = ex.quality;
  if (q === 'Mobility') base = { ...base, impact: 'none', loadType: 'mobility', balanceSupport: true };
  else if (q === 'Prehab') base = { ...base, impact: 'none', loadType: 'external' };
  else if (q === 'Core') base = { ...base, impact: 'none', loadType: 'bodyweight' };
  else if (q === 'Maximalkraft') base = { ...base, impact: 'low', loadType: 'external', minAge: 16, joints: ['back', 'knee'] };
  else if (q === 'Kraft') base = { ...base, impact: 'low', loadType: 'external', joints: ex.domain === 'powerUpper' ? ['shoulder'] : ['back'] };
  else if (q === 'Power') base = { ...base, impact: ex.domain === 'powerUpper' ? 'low' : 'moderate', skill: 'moderate', loadType: ex.domain === 'powerUpper' ? 'medball' : 'plyometric', joints: ex.domain === 'powerUpper' ? [] : ['knee', 'ankle'] };
  else if (q === 'Speed') base = { ...base, impact: ex.difficulty >= 2 ? 'high' : 'moderate', skill: 'moderate', loadType: 'sprint', minAge: 11, maxAge: ex.difficulty >= 2 ? 59 : 120, joints: ['knee', 'ankle'] };
  else if (q === 'Agilität') base = { ...base, impact: 'moderate', skill: ex.difficulty >= 3 ? 'high' : 'moderate', loadType: 'bodyweight', joints: ['knee', 'ankle'] };
  else if (q === 'Kondition') base = { ...base, impact: ex.difficulty >= 2 ? 'high' : 'low', loadType: ex.difficulty >= 2 ? 'sprint' : 'bodyweight', maxAge: ex.difficulty >= 2 ? 59 : 120, joints: ex.difficulty >= 2 ? ['knee', 'ankle'] : [] };

  return { ...base, ...OVERRIDES[ex.id] };
}
