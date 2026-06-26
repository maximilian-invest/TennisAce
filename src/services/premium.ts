import { useAppStore } from '@/store/appStore';

// Premium entitlement. For now the purchase/restore calls drive the local flag
// so the whole flow is testable in Expo Go. Swap these for react-native-purchases
// (RevenueCat) once a development build exists — the rest of the app only ever
// reads `usePremium()` / `useAppStore.getState().isPremium`, so nothing else changes.

export function usePremium(): boolean {
  return useAppStore((s) => s.isPremium);
}

export interface PaywallFeature {
  icon: 'calendar' | 'figure' | 'bolt' | 'flame' | 'steps';
  title: { de: string; en: string };
  sub: { de: string; en: string };
}

export const PREMIUM_FEATURES: PaywallFeature[] = [
  {
    icon: 'calendar',
    title: { de: 'Monatstests & voller Verlauf', en: 'Monthly tests & full history' },
    sub: { de: 'Immer wieder neu vermessen, Trends & PRs über Monate.', en: 'Retest regularly, track trends & PRs over months.' },
  },
  {
    icon: 'figure',
    title: { de: 'Komplette Übungsbibliothek', en: 'Full exercise library' },
    sub: { de: 'Alle 85+ Übungen mit Gym-/Heim-/No-Equipment-Varianten.', en: 'All 85+ exercises with gym/home/no-kit variants.' },
  },
  {
    icon: 'bolt',
    title: { de: 'Periodisierte Pläne bis L4', en: 'Periodised plans up to L4' },
    sub: { de: 'Endlos-Modus: Volumen, Power & Reaktivität skalieren mit.', en: 'Endless mode: volume, power & reactivity keep scaling.' },
  },
  {
    icon: 'flame',
    title: { de: 'Alle Prehab- & Equipment-Routinen', en: 'All prehab & equipment routines' },
    sub: { de: 'Verletzungsprävention und Varianten für jedes Setup.', en: 'Injury prevention and variants for every setup.' },
  },
];

/** Stub purchase — grants the entitlement locally. RevenueCat replaces this. */
export async function purchasePremium(): Promise<boolean> {
  useAppStore.getState().setPremium(true);
  return true;
}

/** Stub restore. With RevenueCat this re-queries the store entitlement. */
export async function restorePurchases(): Promise<boolean> {
  return useAppStore.getState().isPremium;
}
