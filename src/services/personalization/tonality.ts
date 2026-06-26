// Coach tonality per age band (Master concept Teil 2 & 8). Same simple UI for
// everyone — but the words adapt: energetic for youth, warm & dignified for
// seniors. Never patronising, never "pro-speak" at the 80-year-old.
import type { Lang } from '@/domain/models';
import { rulesForAge, type ToneKey } from './ageBands';

type Bi = { de: string; en: string };

interface ToneCopy {
  /** How the daily plan is framed. */
  planKicker: Bi;
  /** Coach context line on the home hero. */
  coachLine: Bi;
  /** Session-complete praise. */
  praise: Bi;
  /** Identity mirror ("you are…"). */
  identity: Bi;
}

const TONES: Record<ToneKey, ToneCopy> = {
  youth: {
    planKicker: { de: 'DEIN PROFI-PLAN', en: 'YOUR PRO PLAN' },
    coachLine: { de: 'Heute trainierst du wie die Profis – sauber und explosiv.', en: 'Today you train like the pros – clean and explosive.' },
    praise: { de: 'Stark! Du wirst messbar schneller.', en: 'Strong! You’re getting measurably faster.' },
    identity: { de: 'Du bist ein ernsthafter Athlet.', en: 'You are a serious athlete.' },
  },
  performance: {
    planKicker: { de: 'DEIN TRAININGSPLAN', en: 'YOUR TRAINING PLAN' },
    coachLine: { de: 'Volle Konzentration – heute holen wir Leistung raus.', en: 'Full focus – today we build performance.' },
    praise: { de: 'Top-Einheit. Das zahlt direkt auf dein Spiel ein.', en: 'Top session. This pays straight into your game.' },
    identity: { de: 'Du bist Wettkampf-Athlet.', en: 'You are a competitive athlete.' },
  },
  supportive: {
    planKicker: { de: 'DEINE EINHEIT HEUTE', en: 'YOUR SESSION TODAY' },
    coachLine: { de: 'Auch in kurzer Zeit machbar – du schaffst das.', en: 'Doable even in a short window – you’ve got this.' },
    praise: { de: 'Klasse gemacht – genau so bleibst du dran.', en: 'Nicely done – this is how you stay consistent.' },
    identity: { de: 'Du bist jemand, der dranbleibt.', en: 'You are someone who keeps at it.' },
  },
  mature: {
    planKicker: { de: 'DEIN PLAN HEUTE', en: 'YOUR PLAN TODAY' },
    coachLine: { de: 'Klüger trainieren, nicht härter – gründlich aufwärmen.', en: 'Train smarter, not harder – warm up thoroughly.' },
    praise: { de: 'Sehr gut – stark geblieben und gelenkschonend.', en: 'Very good – strong and joint-friendly.' },
    identity: { de: 'Du bleibst fit und schlägst die Jüngeren.', en: 'You stay fit and beat the younger ones.' },
  },
  senior: {
    planKicker: { de: 'DEINE BEWEGUNG HEUTE', en: 'YOUR MOVEMENT TODAY' },
    coachLine: { de: 'Ganz in deinem Tempo – sicher und mit Freude.', en: 'Entirely at your pace – safe and with joy.' },
    praise: { de: 'Wunderbar gemacht. Jeder Schritt hält dich im Spiel.', en: 'Wonderfully done. Every step keeps you in the game.' },
    identity: { de: 'Du bleibst beweglich und spielst weiter.', en: 'You stay mobile and keep playing.' },
  },
};

export function toneForAge(age: number): ToneKey {
  return rulesForAge(age).tone;
}

export function coachCopy(age: number, lang: Lang) {
  const t = TONES[toneForAge(age)];
  return {
    planKicker: t.planKicker[lang],
    coachLine: t.coachLine[lang],
    praise: t.praise[lang],
    identity: t.identity[lang],
  };
}
