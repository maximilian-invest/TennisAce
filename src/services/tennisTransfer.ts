// The "tennis-transfer mirror" (Master concept Teil 6.5): translate a physical
// gain into a felt on-court benefit — the emotional payoff of the training.
import { DOMAIN_LABELS } from '@/content/reasoningDomains';
import type { Domain, Lang, TestResult } from '@/domain/models';

const DOMAINS: Domain[] = ['speed', 'agility', 'powerLower', 'powerUpper', 'core', 'aerobic', 'mobility'];

const BENEFIT: Record<Domain, { de: string; en: string }> = {
  speed: { de: 'beim Anlaufen zum Stoppball', en: 'chasing down the drop shot' },
  agility: { de: 'beim Richtungswechsel an der Grundlinie', en: 'changing direction on the baseline' },
  powerLower: { de: 'beim ersten Schritt zum Ball', en: 'on your first step to the ball' },
  powerUpper: { de: 'in Aufschlag und Vorhand', en: 'in your serve and forehand' },
  core: { de: 'wenn du im Ausfallschritt noch sauber triffst', en: 'striking cleanly while stretched' },
  aerobic: { de: 'im dritten Satz', en: 'deep in the third set' },
  mobility: { de: 'wenn du tief zum Ball kommst', en: 'getting low to the ball' },
};

/** Most-improved domain since the baseline → a felt on-court sentence (or null). */
export function tennisTransfer(latest: TestResult, baseline: TestResult, lang: Lang): string | null {
  let best: Domain | null = null;
  let bestDelta = 0;
  for (const d of DOMAINS) {
    const delta = latest.domainScores[d] - baseline.domainScores[d];
    if (delta > bestDelta) {
      bestDelta = delta;
      best = d;
    }
  }
  if (!best || bestDelta < 3) return null;
  const pct = Math.round(bestDelta);
  const label = DOMAIN_LABELS[best][lang];
  return lang === 'de'
    ? `Deine ${label} ist ${pct}% besser — das spürst du ${BENEFIT[best].de}.`
    : `Your ${label.toLowerCase()} is ${pct}% better — you feel it ${BENEFIT[best].en}.`;
}
