// Bilingual labels & option lists for onboarding and the UI.
import type { EquipmentItem, EquipmentMode, Goal, Lang, Level } from './models';

type Bi = { de: string; en: string };
export const t = (bi: Bi, lang: Lang) => bi[lang];

export const GOALS: { id: Goal; label: Bi }[] = [
  { id: 'speed', label: { de: 'Schneller', en: 'Faster' } },
  { id: 'explosive', label: { de: 'Explosiver', en: 'More explosive' } },
  { id: 'endurance', label: { de: 'Ausdauernder', en: 'More endurance' } },
  { id: 'injuryfree', label: { de: 'Verletzungsfrei', en: 'Injury-free' } },
  { id: 'strength', label: { de: 'Stärker', en: 'Stronger' } },
  { id: 'mobility', label: { de: 'Beweglicher', en: 'More mobile' } },
  { id: 'bodycomp', label: { de: 'Körper formen', en: 'Body composition' } },
];

export const EQUIPMENT_MODES: { id: EquipmentMode; label: Bi; sub: Bi }[] = [
  { id: 'none', label: { de: 'Kein Equipment', en: 'No equipment' }, sub: { de: 'Nur Körpergewicht', en: 'Bodyweight only' } },
  { id: 'home', label: { de: 'Heim-Basics', en: 'Home basics' }, sub: { de: 'Bänder, Hanteln & Co.', en: 'Bands, dumbbells & co.' } },
  { id: 'gym', label: { de: 'Voll-Gym', en: 'Full gym' }, sub: { de: 'Komplette Ausstattung', en: 'Full equipment' } },
];

export const EQUIPMENT_ITEMS: { id: EquipmentItem; label: Bi }[] = [
  { id: 'miniband', label: { de: 'Mini-Bänder', en: 'Mini bands' } },
  { id: 'tubeband', label: { de: 'Tube-Bänder', en: 'Tube bands' } },
  { id: 'jumprope', label: { de: 'Springseil', en: 'Jump rope' } },
  { id: 'medball', label: { de: 'Med-Ball', en: 'Med ball' } },
  { id: 'dumbbells', label: { de: 'Kurzhanteln', en: 'Dumbbells' } },
  { id: 'kettlebell', label: { de: 'Kettlebell', en: 'Kettlebell' } },
  { id: 'foamroller', label: { de: 'Foam Roller', en: 'Foam roller' } },
  { id: 'pullupbar', label: { de: 'Klimmzugstange', en: 'Pull-up bar' } },
];

export const SELF_RATINGS: { id: Level; label: Bi }[] = [
  { id: 'L1', label: { de: 'Anfänger', en: 'Beginner' } },
  { id: 'L2', label: { de: 'Fortgeschritten', en: 'Intermediate' } },
  { id: 'L3', label: { de: 'Stark', en: 'Strong' } },
  { id: 'L4', label: { de: 'Profi', en: 'Pro' } },
];

export const LEVEL_NAMES: Record<Level, Bi> = {
  L1: { de: 'Einsteiger', en: 'Beginner' },
  L2: { de: 'Fortgeschritten', en: 'Intermediate' },
  L3: { de: 'Starker Amateur', en: 'Strong Amateur' },
  L4: { de: 'Profi-Niveau', en: 'Pro Level' },
};
