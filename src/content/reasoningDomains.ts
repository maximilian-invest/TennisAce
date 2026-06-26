// Per-domain reasoning copy — Functional Spec §4 (test result). DE/EN.
import type { Domain } from '@/domain/models';

type Bi = { de: string; en: string };

export const DOMAIN_LABELS: Record<Domain, Bi> = {
  speed: { de: 'Schnelligkeit', en: 'Speed' },
  agility: { de: 'Agilität', en: 'Agility' },
  powerLower: { de: 'Sprungkraft', en: 'Lower-body power' },
  powerUpper: { de: 'Oberkörper-Power', en: 'Upper-body power' },
  core: { de: 'Core-Stabilität', en: 'Core' },
  aerobic: { de: 'Ausdauer', en: 'Endurance' },
  mobility: { de: 'Beweglichkeit', en: 'Mobility' },
};

export const DOMAIN_PRAISE: Record<Domain, Bi> = {
  speed: { de: 'dein Antritt auf den ersten Metern ist richtig schnell.', en: 'your first-step speed is genuinely quick.' },
  agility: { de: 'deine Richtungswechsel und dein Antritt sind schon richtig gut.', en: 'your direction changes and acceleration are already strong.' },
  powerLower: { de: 'du bist explosiv aus den Beinen – ideal für den ersten Schritt zum Ball.', en: "you're explosive off the legs – ideal for the first step to the ball." },
  powerUpper: { de: 'du bringst ordentlich Power in Aufschlag und Vorhand.', en: 'you bring real power into serve and forehand.' },
  core: { de: 'dein Rumpf ist stabil und überträgt Kraft sauber in den Schlag.', en: 'your core is stable and transfers force cleanly into your strokes.' },
  aerobic: { de: 'du hältst auch lange Ballwechsel locker durch.', en: 'you cruise through long rallies.' },
  mobility: { de: 'du bewegst dich frei und kommst gut in jede Position.', en: 'you move freely into every position.' },
};

export const DOMAIN_WHY: Record<Domain, Bi> = {
  speed: { de: 'der erste Schritt entscheidet, ob du den Ball früh und in Balance triffst.', en: 'the first step decides whether you reach the ball early and balanced.' },
  agility: { de: 'über 70 % der Tennisbewegung ist seitlich – das bringt dir auf dem Platz am meisten.', en: 'over 70% of tennis movement is lateral – it pays off most on court.' },
  powerLower: { de: 'explosive Beine bringen dich schneller zum Ball und stabiler in den Schlag.', en: 'explosive legs get you to the ball faster and into the shot more stably.' },
  powerUpper: { de: 'mehr Oberkörper-Power gibt Aufschlag und Grundschlägen Tempo.', en: 'more upper-body power adds pace to serve and groundstrokes.' },
  core: { de: 'ein stabiler Rumpf überträgt Kraft in deine Schläge und schützt deinen Rücken.', en: 'a stable core transfers force into your strokes and protects your back.' },
  aerobic: { de: 'gute Ausdauer hält dein Niveau über den dritten Satz hinaus hoch.', en: 'good endurance keeps your level high beyond the third set.' },
  mobility: { de: 'Beweglichkeit beugt genau den Verletzungen vor, die Tennisspieler am häufigsten ausbremsen.', en: 'mobility prevents exactly the injuries that most often sideline players.' },
};
