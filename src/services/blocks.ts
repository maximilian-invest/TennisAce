// Training blocks (Master concept Teil 6): 4–8-week cycles with a mini-theme
// that end on a retest + celebration, then roll into the next, slightly harder
// block. "Endless, but with constant finish lines."
import type { Lang } from '@/domain/models';

export const BLOCK_WEEKS = 6;

const THEMES: { de: string; en: string }[] = [
  { de: 'Explosivität', en: 'Explosiveness' },
  { de: 'Ausdauer im 3. Satz', en: 'Third-set endurance' },
  { de: 'Bulletproof Schulter', en: 'Bulletproof shoulder' },
  { de: 'Erster Schritt', en: 'First step' },
  { de: 'Kraftaufbau', en: 'Strength base' },
  { de: 'Beweglichkeit & Balance', en: 'Mobility & balance' },
];

export function blockTheme(index: number, lang: Lang): string {
  return THEMES[((index % THEMES.length) + THEMES.length) % THEMES.length][lang];
}

function weeksSince(startedAt: string | null): number {
  if (!startedAt) return 0;
  return Math.floor((Date.now() - new Date(startedAt).getTime()) / (7 * 86400000));
}

export function blockWeek(startedAt: string | null): number {
  return Math.min(BLOCK_WEEKS, Math.max(1, weeksSince(startedAt) + 1));
}

export function blockRetestDue(startedAt: string | null): boolean {
  return startedAt != null && weeksSince(startedAt) >= BLOCK_WEEKS;
}
