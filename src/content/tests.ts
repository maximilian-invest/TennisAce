// The 8 performance-test stations (Functional Spec §3 / design prototype).
// `normKey` links each station to src/content/norms.json.
import type { Domain } from '@/domain/models';

export type TestInputType = 'value' | 'timer';

export interface TestStation {
  key: string;
  normKey: string;
  domain: Domain;
  name: { de: string; en: string };
  chip: string;
  unit: string;
  step: number;
  sample: number;
  inputType: TestInputType;
  hint: { de: string; en: string };
  steps: { de: string[]; en: string[] };
}

export const TEST_STATIONS: TestStation[] = [
  {
    key: 'sprint',
    normKey: 'sprint20m',
    domain: 'speed',
    name: { de: '20 m Sprint', en: '20 m sprint' },
    chip: '20 m',
    unit: 's',
    step: 0.01,
    sample: 3.12,
    inputType: 'value',
    hint: { de: 'Stoppuhr / Lichtschranke', en: 'Stopwatch / timing gate' },
    steps: {
      de: ['Aus 3-Punkt-Start explosiv beschleunigen.', 'Voll durchziehen bis 20 m.', 'Beste Zeit per Handy oder Lichtschranke.'],
      en: ['Accelerate explosively from a 3-point start.', 'Run all out through 20 m.', 'Best time via phone or timing gate.'],
    },
  },
  {
    key: 'agility',
    normKey: 'agility505',
    domain: 'agility',
    name: { de: '5-0-5 Agilität', en: '5-0-5 agility' },
    chip: '5-0-5',
    unit: 's',
    step: 0.01,
    sample: 2.48,
    inputType: 'value',
    hint: { de: 'Stoppuhr', en: 'Stopwatch' },
    steps: {
      de: ['Anlaufen und an der Linie scharf abbremsen.', '180°-Richtungswechsel, sofort zurück.', 'Beste von 2 Läufen zählt.'],
      en: ['Run in and brake hard at the line.', '180° change of direction, sprint back.', 'Best of 2 runs counts.'],
    },
  },
  {
    key: 'cmj',
    normKey: 'cmj',
    domain: 'powerLower',
    name: { de: 'CMJ Sprungkraft', en: 'Countermovement jump' },
    chip: 'CMJ',
    unit: 'cm',
    step: 1,
    sample: 34,
    inputType: 'value',
    hint: { de: 'Sprungmatte / App', en: 'Jump mat / app' },
    steps: {
      de: ['Hände in die Hüfte, tief in die Hocke.', 'Explosiv maximal hoch springen.', 'Sprunghöhe per App / Matte messen.'],
      en: ['Hands on hips, dip down.', 'Jump as high as possible.', 'Measure jump height via app / mat.'],
    },
  },
  {
    key: 'broad',
    normKey: 'broadJump',
    domain: 'powerLower',
    name: { de: 'Standweitsprung', en: 'Standing broad jump' },
    chip: 'Weitsprung',
    unit: 'cm',
    step: 1,
    sample: 215,
    inputType: 'value',
    hint: { de: 'Maßband', en: 'Tape measure' },
    steps: {
      de: ['Beidbeinig aus dem Stand abspringen.', 'So weit wie möglich nach vorn.', 'Distanz an der Ferse messen.'],
      en: ['Jump forward off both feet from standing.', 'As far forward as possible.', 'Measure distance at the heel.'],
    },
  },
  {
    key: 'medball',
    normKey: 'medBallThrow',
    domain: 'powerUpper',
    name: { de: 'Med-Ball Überkopfwurf', en: 'Overhead med-ball throw' },
    chip: 'Med-Ball',
    unit: 'm',
    step: 0.1,
    sample: 4.8,
    inputType: 'value',
    hint: { de: 'Maßband · 3 kg Ball', en: 'Tape measure · 3 kg ball' },
    steps: {
      de: ['Ball über dem Kopf, Rumpf gespannt.', 'Explosiv nach vorn-oben werfen.', 'Wurfweite messen (3 kg Ball).'],
      en: ['Ball overhead, core braced.', 'Throw explosively up and forward.', 'Measure throw distance (3 kg ball).'],
    },
  },
  {
    key: 'plank',
    normKey: 'plank',
    domain: 'core',
    name: { de: 'Plank Hold', en: 'Forearm plank' },
    chip: 'Plank',
    unit: 's',
    step: 1,
    sample: 90,
    inputType: 'timer',
    hint: { de: 'Mitlaufender Timer', en: 'Built-in timer' },
    steps: {
      de: ['Unterarme schulterbreit, Ellbogen unter den Schultern.', 'Körper bildet eine gerade Linie.', 'Bauch fest, ruhig atmen, so lange wie möglich.'],
      en: ['Forearms shoulder-width, elbows under shoulders.', 'Body forms a straight line.', 'Brace, breathe, hold as long as possible.'],
    },
  },
  {
    key: 'sitreach',
    normKey: 'sitReach',
    domain: 'mobility',
    name: { de: 'Sit-and-Reach', en: 'Sit-and-reach' },
    chip: 'Sit & Reach',
    unit: 'cm',
    step: 1,
    sample: 12,
    inputType: 'value',
    hint: { de: 'Sit-and-Reach-Box (Fußsohle = 0)', en: 'Sit-and-reach box (soles = 0)' },
    steps: {
      de: ['Gestreckte Beine, Füße an die Box.', 'Langsam mit den Fingern nach vorn.', 'Weiteste Position halten und ablesen.'],
      en: ['Legs straight, feet against the box.', 'Reach forward slowly with fingertips.', 'Hold the farthest position and read off.'],
    },
  },
  {
    key: 'beep',
    normKey: 'beepTest',
    domain: 'aerobic',
    name: { de: 'Beep-Test', en: 'Beep test' },
    chip: 'Beep',
    unit: 'Shuttles',
    step: 1,
    sample: 75,
    inputType: 'value',
    hint: { de: 'Beep-Test-Audio · Gesamt-Shuttles', en: 'Beep-test audio · total shuttles' },
    steps: {
      de: ['20 m Shuttle im Takt der Pieptöne.', 'Tempo steigt jede Minute.', 'Gesamtzahl der Shuttles beim Abbruch eintragen.'],
      en: ['20 m shuttle in time with the beeps.', 'Pace increases every minute.', 'Enter total shuttles at drop-out.'],
    },
  },
];
