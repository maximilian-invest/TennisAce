// Decides whether an exercise may be planned for a given person, combining the
// age-band ceiling, the exercise flags and the health screen (Teil 4.3 + 4.7).
import type { Exercise } from '@/content/exercises';
import type { HealthCheck } from '@/domain/models';
import { impactAllowed, rulesForAge } from './ageBands';
import { exerciseFlags, type Joint } from './exerciseFlags';

export interface PersonInput {
  age: number;
  health?: HealthCheck | null;
}

/** Map an exercise's required-healthy joint to a captured health flag. */
function jointFlagged(joint: Joint, health?: HealthCheck | null): boolean {
  if (!health) return false;
  switch (joint) {
    case 'shoulder':
      return health.shoulder;
    case 'back':
      return health.back;
    case 'knee':
      return health.knee;
    // elbow & ankle aren't captured separately yet → never block on them.
    default:
      return false;
  }
}

export function isEligible(ex: Exercise, { age, health }: PersonInput): boolean {
  const f = exerciseFlags(ex);
  const rules = rulesForAge(age);

  if (age < f.minAge || age > f.maxAge) return false;
  if (!impactAllowed(f.impact, rules.maxImpact)) return false;

  if (f.loadType === 'sprint' && f.impact === 'high' && !rules.allowMaxSprint) return false;
  if (f.loadType === 'plyometric') {
    if (rules.plyo === 'none') return false;
    if (rules.plyo === 'low' && f.impact === 'high') return false;
  }
  if (ex.quality === 'Maximalkraft' && !rules.allowHeavyStrength) return false;
  // Older bands (low/none impact ceiling) skip high-skill reactive work.
  if (f.skill === 'high' && (rules.maxImpact === 'low' || rules.maxImpact === 'none')) return false;

  // Health: a flagged joint removes anything that stresses it — EXCEPT prehab,
  // which is exactly the corrective work we keep in.
  if (ex.quality !== 'Prehab' && f.joints.some((j) => jointFlagged(j, health))) return false;

  return true;
}

/** Convenience: filter a list to the eligible subset. */
export function eligibleOnly(list: Exercise[], person: PersonInput): Exercise[] {
  return list.filter((ex) => isEligible(ex, person));
}
