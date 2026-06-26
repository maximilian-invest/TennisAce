import type { Level } from '@/domain/models';

export type AthleticExperience = 'none' | 'sometimes' | 'structured';

const RATING_VALUE: Record<Level, number> = { L1: 1, L2: 2, L3: 3, L4: 4 };

export interface QuickInput {
  selfRating: Level;
  tennisSessionsPerWeek: number; // 0–7
  athleticExperience: AthleticExperience;
}

/**
 * Quick classification rule-set — Functional Spec §2.
 *   basis = selfRating(1..4)
 *   + sessions/week: 0–1 → -0.5 | 2–3 → 0 | 4–5 → +0.5 | 6–7 → +1
 *   + athletic experience: none → -0.5 | sometimes → 0 | structured → +0.5
 *   → round, clamp L1..L4
 */
export function quickClassify(input: QuickInput): Level {
  let v = RATING_VALUE[input.selfRating];

  const s = input.tennisSessionsPerWeek;
  if (s <= 1) v -= 0.5;
  else if (s <= 3) v += 0;
  else if (s <= 5) v += 0.5;
  else v += 1;

  if (input.athleticExperience === 'none') v -= 0.5;
  else if (input.athleticExperience === 'structured') v += 0.5;

  const rounded = Math.max(1, Math.min(4, Math.round(v)));
  return `L${rounded}` as Level;
}
