// RAMP warm-up protocol — research Teil 5.8.
export interface RampPhase {
  key: string;
  letter: string;
  title: string;
  desc: string;
  items: string[];
  durationSec: number;
}

export const RAMP: RampPhase[] = [
  {
    key: 'raise', letter: 'R', title: 'Raise', desc: 'Puls & Körpertemperatur hoch.',
    items: ['Lockeres Joggen', 'Hüpfen / Pogos', 'Side-Shuffles', 'Leichte Leiter'],
    durationSec: 240,
  },
  {
    key: 'activate', letter: 'A', title: 'Activate', desc: 'Schlüsselmuskeln anschalten.',
    items: ['Glute Bridges', 'Band Pull-aparts', 'Monster Walks', 'Dead Bugs', 'Schulterblatt-Aktivierung'],
    durationSec: 180,
  },
  {
    key: 'mobilize', letter: 'M', title: 'Mobilize', desc: 'Bewegungsumfang öffnen.',
    items: ['Beinpendeln', 'Ausfallschritt mit Rotation', "World's Greatest Stretch", 'BWS-Rotationen', 'Hüftöffner'],
    durationSec: 180,
  },
  {
    key: 'potentiate', letter: 'P', title: 'Potentiate', desc: 'Nervensystem scharfschalten.',
    items: ['Beschleunigungen', 'Split-Step-Shuffles', 'Med-Ball-Würfe', 'Steigerungsläufe'],
    durationSec: 120,
  },
];

export const RAMP_TOTAL_SEC = RAMP.reduce((sum, p) => sum + p.durationSec, 0);
