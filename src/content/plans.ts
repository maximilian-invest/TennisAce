// Weekly plans per level — research Teil 6. Mapped onto a Mon–Sun week.
import type { Domain, Level } from '@/domain/models';

export interface PlanSession {
  title: string;
  domain: Domain; // primary domain → card colour
  meta: string;
  /** Generated plans carry the concrete exercise ids & an intensity note. */
  exercises?: string[];
  intensity?: string;
}

export interface WeekPlan {
  sessionsPerWeek: string;
  prehabNote?: string;
  /** 7 entries, Mon–Sun; null = rest day. */
  week: (PlanSession | null)[];
}

const rest = null;

export const PLANS: Record<Level, WeekPlan> = {
  L1: {
    sessionsPerWeek: '2',
    prehabNote: 'Täglich: 5 Min Band-Prehab (Außenrotation · Y-T-W · Knee-to-Wall).',
    week: [
      { title: 'Kraft Ganzkörper', domain: 'powerLower', meta: '35 Min · 6 Übungen' },
      rest,
      rest,
      { title: 'Mobility + Kondition', domain: 'aerobic', meta: '30 Min · 5 Übungen' },
      rest,
      rest,
      rest,
    ],
  },
  L2: {
    sessionsPerWeek: '2–3',
    week: [
      { title: 'Kraft Unterkörper + Core', domain: 'powerLower', meta: '45 Min · 5 Übungen' },
      rest,
      { title: 'Kraft Oberkörper + Power', domain: 'powerUpper', meta: '45 Min · 6 Übungen' },
      rest,
      { title: 'Agilität + Kondition', domain: 'agility', meta: '35 Min · 5 Übungen' },
      rest,
      rest,
    ],
  },
  L3: {
    sessionsPerWeek: '3–4',
    week: [
      { title: 'Maximalkraft', domain: 'powerLower', meta: '50 Min · 5 Übungen' },
      { title: 'Power / Plyometrie', domain: 'powerLower', meta: '45 Min · 5 Übungen' },
      rest,
      { title: 'Schnelligkeit + Agilität', domain: 'speed', meta: '40 Min · 5 Übungen' },
      { title: 'Kondition + Oberkörper', domain: 'aerobic', meta: '45 Min · 5 Übungen' },
      rest,
      rest,
    ],
  },
  L4: {
    sessionsPerWeek: '5–6',
    prehabNote: 'Endlos-Modus: Volumen, Dichte & Reaktivität steigen Block für Block.',
    week: [
      { title: 'Hinge + Rotations-Power', domain: 'powerLower', meta: '45 Min · Court-Tag' },
      { title: 'Max-RFD Plyometrie', domain: 'powerLower', meta: '45 Min · 6 Übungen' },
      { title: 'Reaktive Agilität + Sprint', domain: 'agility', meta: '40 Min · Court-Tag' },
      { title: 'Heavy Kraft', domain: 'powerUpper', meta: '50 Min · 5 Übungen' },
      { title: 'HIIT + Prehab', domain: 'aerobic', meta: '35 Min · 6 Übungen' },
      { title: 'Explosiv-Erhaltung', domain: 'speed', meta: '35 Min · Court-Tag' },
      rest,
    ],
  },
};
