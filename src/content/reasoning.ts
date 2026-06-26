// Reasoning text building blocks — Functional Spec §4. DE/EN, easy to edit.
import type { Goal, Lang } from '@/domain/models';
import type { AthleticExperience } from '@/services/quickClassification';

type Bi = { de: string; en: string };
const pick = (bi: Bi, lang: Lang) => bi[lang];

export const ATHLETIC_TEXT: Record<AthleticExperience, Bi> = {
  none: { de: 'noch kein strukturiertes Athletiktraining', en: 'no structured athletic training yet' },
  sometimes: { de: 'gelegentliches Athletiktraining', en: 'occasional athletic training' },
  structured: { de: 'bereits strukturiertes Athletiktraining', en: 'structured athletic training already' },
};

/** Goal → short focus phrase used in the personalised reasoning. */
export const GOAL_FOCUS: Record<Goal, Bi> = {
  speed: { de: 'schneller auf dem Platz zu sein', en: 'to be faster on court' },
  explosive: { de: 'explosiver zu werden', en: 'to get more explosive' },
  endurance: { de: 'länger durchzuhalten', en: 'to last longer' },
  injuryfree: { de: 'verletzungsfrei zu bleiben', en: 'to stay injury-free' },
  strength: { de: 'kräftiger zu werden', en: 'to get stronger' },
  mobility: { de: 'beweglicher zu werden', en: 'to get more mobile' },
  bodycomp: { de: 'deinen Körper zu formen', en: 'to shape your body' },
};

export const reasoningText = { pick };
