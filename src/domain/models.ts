// Core domain types — see Functional Spec §1. Kept free of UI/storage concerns.

export type Sex = 'm' | 'w' | 'divers';
export type Level = 'L1' | 'L2' | 'L3' | 'L4';
export type Lang = 'de' | 'en';

export type Goal =
  | 'speed'
  | 'explosive'
  | 'endurance'
  | 'injuryfree'
  | 'strength'
  | 'mobility'
  | 'bodycomp';

/** Scoring domains (note: powerLower & powerUpper, distinct from the icon "power"). */
export type Domain =
  | 'speed'
  | 'agility'
  | 'powerLower'
  | 'powerUpper'
  | 'core'
  | 'aerobic'
  | 'mobility';

export type EquipmentMode = 'none' | 'home' | 'gym';

export type EquipmentItem =
  | 'miniband'
  | 'tubeband'
  | 'jumprope'
  | 'medball'
  | 'dumbbells'
  | 'kettlebell'
  | 'foamroller'
  | 'pullupbar'
  | 'bench'
  | 'barbell';

export type PeriodizationPhase = 'offseason' | 'preseason' | 'inseason' | 'transition';

export interface UserProfile {
  name: string;
  sex: Sex;
  age: number;
  heightCm?: number;
  weightKg?: number;
  tennisSessionsPerWeek: number; // 0–7
  /** Weekdays the user plays tennis (1=Mon … 7=Sun) — drives session placement. */
  tennisDays?: number[];
  /** How many extra athletic sessions per week the user committed to (1–6). */
  trainingDaysPerWeek?: number;
  selfRating: Level; // self-assessment during onboarding
  goals: Goal[];
  language: Lang;
}

export interface EquipmentSet {
  mode: EquipmentMode;
  items: EquipmentItem[];
}

export interface HealthCheck {
  shoulder: boolean;
  knee: boolean;
  back: boolean;
  other: boolean;
}

export interface LevelState {
  currentLevel: Level;
  progressToNext: number; // 0–100 %
  periodizationPhase: PeriodizationPhase;
  source: 'quick' | 'test';
}

export type DomainScores = Record<Domain, number>;

export interface TestResult {
  id: string;
  date: string; // ISO
  type: 'initial' | 'monthly';
  raw: Record<string, number>;
  domainScores: DomainScores;
  totalScore: number; // 0–100
  level: Level;
  strongestDomain: Domain;
  weakestDomain: Domain;
}
