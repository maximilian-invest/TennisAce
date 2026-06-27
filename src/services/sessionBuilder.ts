// Turns a generated PlanSession (exercise ids) into the workout player's
// SessionExercise[] using the catalogue's dosage, variants and tips. Also
// provides the "short on time" trim and in-flow exercise swap (Teil 5).
import { EXERCISES, type Exercise } from '@/content/exercises';
import type { PlanSession } from '@/content/plans';
import { DOMAIN_WHY } from '@/content/reasoningDomains';
import type { SessionExercise } from '@/content/session';
import type { Domain, EquipmentMode, HealthCheck } from '@/domain/models';
import { eligibleOnly } from './personalization/eligibility';

const firstInt = (s: string, fallback: number) => {
  const m = s.match(/\d+/);
  return m ? parseInt(m[0], 10) : fallback;
};

const TEMPO: Record<string, { de: string; en: string }> = {
  Kraft: { de: '2 s runter · explosiv hoch', en: '2 s down · explosive up' },
  Maximalkraft: { de: 'kontrolliert · maximale Spannung', en: 'controlled · max tension' },
  Power: { de: 'maximal explosiv', en: 'maximally explosive' },
  Speed: { de: 'volle Intensität · volle Pause', en: 'full intensity · full rest' },
  Agilität: { de: 'schnell & sauber', en: 'fast & clean' },
  Kondition: { de: 'Tempo halten', en: 'hold the pace' },
  Core: { de: 'halten · ruhig atmen', en: 'hold · breathe calmly' },
  Prehab: { de: 'langsam & kontrolliert', en: 'slow & controlled' },
  Mobility: { de: 'ruhig in die Dehnung sinken', en: 'ease into the stretch' },
};

function variantFor(ex: Exercise, mode: EquipmentMode): string {
  return mode === 'gym' ? ex.variants.gym : mode === 'none' ? ex.variants.none : ex.variants.home;
}

export function toSessionExercise(ex: Exercise, mode: EquipmentMode): SessionExercise {
  const isHold = ex.dosage.reps.includes(' s');
  const reps = firstInt(ex.dosage.reps, isHold ? 30 : 10);
  const sets = firstInt(ex.dosage.sets, 3);
  const tip = ex.formTips[0] ?? ex.steps[0] ?? '';
  const variant = variantFor(ex, mode);
  return {
    name: ex.name,
    domain: ex.domain,
    sets,
    reps,
    weightKg: 0,
    weightStep: 2.5,
    repCeiling: reps + 4,
    repFloor: Math.max(1, reps - 2),
    tempo: TEMPO[ex.quality] ?? TEMPO.Kraft,
    formTip: { de: tip, en: tip },
    homeVariant: { de: variant, en: variant },
    why: DOMAIN_WHY[ex.domain],
    unit: isHold ? 's' : 'reps',
  };
}

export interface BuiltSession {
  title: string;
  items: SessionExercise[];
}

export function buildSession(opts: {
  session: PlanSession | null;
  mode: EquipmentMode;
  age: number;
  health?: HealthCheck | null;
  short?: boolean;
}): BuiltSession {
  const { session, mode, age, health, short } = opts;
  const byId = (id: string) => EXERCISES.find((e) => e.id === id);
  let items = (session?.exercises ?? [])
    .map(byId)
    .filter((e): e is Exercise => !!e)
    .map((e) => toSessionExercise(e, mode));

  // Rest/tennis day (no session) → a short, safe recovery flow.
  if (items.length === 0) {
    const pool = eligibleOnly(EXERCISES.filter((e) => e.domain === 'mobility' || e.domain === 'core'), { age, health });
    items = pool.slice(0, 4).map((e) => toSessionExercise(e, mode));
  }

  if (short) items = items.slice(0, Math.max(3, Math.ceil(items.length / 2)));

  return { title: session?.title ?? 'Aktive Erholung', items };
}

/** A same-domain, eligible replacement not already in the session. */
export function swapExercise(domain: Domain, excludeNames: string[], mode: EquipmentMode, age: number, health?: HealthCheck | null): SessionExercise | null {
  const pool = eligibleOnly(
    EXERCISES.filter((e) => e.domain === domain && !excludeNames.includes(e.name.de)),
    { age, health },
  );
  return pool.length ? toSessionExercise(pool[0], mode) : null;
}
