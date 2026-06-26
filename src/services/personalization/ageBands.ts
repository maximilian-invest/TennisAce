// Age bands → intensity ceiling & eligibility profile (Master concept Teil 4.2).
// The band sets the UPPER LIMIT of what is physically safe; the user's level,
// test and health set where *within* that limit they start (Teil 4.1).
import type { Domain } from '@/domain/models';

export type AgeBand = 'u13' | '13-15' | '16-17' | '18-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70-79' | '80+';

export type Impact = 'none' | 'low' | 'moderate' | 'high';
export const IMPACT_RANK: Record<Impact, number> = { none: 0, low: 1, moderate: 2, high: 3 };
export const impactAllowed = (impact: Impact, max: Impact) => IMPACT_RANK[impact] <= IMPACT_RANK[max];

export type PlyoAllowance = 'none' | 'low' | 'full';
export type ToneKey = 'youth' | 'performance' | 'supportive' | 'mature' | 'senior';

export interface BandRules {
  band: AgeBand;
  maxImpact: Impact;
  allowMaxSprint: boolean; // 30–40 m max-velocity sprints
  plyo: PlyoAllowance;
  allowHeavyStrength: boolean; // ≥85 % 1RM
  /** Additive emphasis shift (percentage points) toward safer domains with age. */
  prehabShift: number;
  tone: ToneKey;
  largeText: boolean;
  /** Short safety note surfaced for this band. */
  safety?: { de: string; en: string };
}

export function ageBandFor(age: number): AgeBand {
  if (age < 13) return 'u13';
  if (age <= 15) return '13-15';
  if (age <= 17) return '16-17';
  if (age <= 29) return '18-29';
  if (age <= 39) return '30-39';
  if (age <= 49) return '40-49';
  if (age <= 59) return '50-59';
  if (age <= 69) return '60-69';
  if (age <= 79) return '70-79';
  return '80+';
}

const SENIOR_SAFETY = { de: 'Sicherheit zuerst – stütz dich ab, wenn nötig, und stopp bei Schmerz.', en: 'Safety first – use support if needed and stop on pain.' };

export const BAND_RULES: Record<AgeBand, BandRules> = {
  u13:     { band: 'u13',     maxImpact: 'low',      allowMaxSprint: false, plyo: 'low',  allowHeavyStrength: false, prehabShift: 5,  tone: 'youth',       largeText: false, safety: { de: 'Spielerisch & technikbetont – kein schweres Gewicht.', en: 'Playful & technique-first – no heavy load.' } },
  '13-15': { band: '13-15',   maxImpact: 'moderate', allowMaxSprint: false, plyo: 'low',  allowHeavyStrength: false, prehabShift: 0,  tone: 'youth',       largeText: false },
  '16-17': { band: '16-17',   maxImpact: 'high',     allowMaxSprint: true,  plyo: 'full', allowHeavyStrength: true,  prehabShift: 0,  tone: 'performance', largeText: false },
  '18-29': { band: '18-29',   maxImpact: 'high',     allowMaxSprint: true,  plyo: 'full', allowHeavyStrength: true,  prehabShift: 0,  tone: 'performance', largeText: false },
  '30-39': { band: '30-39',   maxImpact: 'high',     allowMaxSprint: true,  plyo: 'full', allowHeavyStrength: true,  prehabShift: 3,  tone: 'performance', largeText: false },
  '40-49': { band: '40-49',   maxImpact: 'high',     allowMaxSprint: true,  plyo: 'full', allowHeavyStrength: true,  prehabShift: 8,  tone: 'supportive',  largeText: false, safety: { de: 'Gründliches Warm-up Pflicht – Gelenke schützen.', en: 'A thorough warm-up is a must – protect the joints.' } },
  '50-59': { band: '50-59',   maxImpact: 'moderate', allowMaxSprint: false, plyo: 'low',  allowHeavyStrength: true,  prehabShift: 12, tone: 'mature',      largeText: false, safety: { de: 'Beschleunigungen statt Top-Speed, niedrigere Box, mehr Regeneration.', en: 'Accelerations over top speed, lower box, more recovery.' } },
  '60-69': { band: '60-69',   maxImpact: 'low',      allowMaxSprint: false, plyo: 'none', allowHeavyStrength: false, prehabShift: 18, tone: 'mature',      largeText: false, safety: SENIOR_SAFETY },
  '70-79': { band: '70-79',   maxImpact: 'low',      allowMaxSprint: false, plyo: 'none', allowHeavyStrength: false, prehabShift: 26, tone: 'senior',      largeText: true,  safety: SENIOR_SAFETY },
  '80+':   { band: '80+',     maxImpact: 'low',      allowMaxSprint: false, plyo: 'none', allowHeavyStrength: false, prehabShift: 34, tone: 'senior',      largeText: true,  safety: SENIOR_SAFETY },
};

export function rulesForAge(age: number): BandRules {
  return BAND_RULES[ageBandFor(age)];
}

/** Domains that get the age-driven emphasis shift (toward prehab/mobility/balance). */
export const SAFER_DOMAINS: Domain[] = ['mobility', 'core'];
