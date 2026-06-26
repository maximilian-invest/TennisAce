// Equipment buying guide — research Teil 9. The app adapts every exercise to
// the user's available kit; for those who own nothing, this is the priority
// order. `id` links to an EquipmentItem so owned gear can be ticked off.
import type { EquipmentItem } from '@/domain/models';

export interface ShopItem {
  id?: EquipmentItem;
  name: { de: string; en: string };
  price: string;
  tier: 1 | 2 | 3;
  why: { de: string; en: string };
}

export const SHOP_TIERS: { tier: 1 | 2 | 3; title: { de: string; en: string }; sub: { de: string; en: string } }[] = [
  { tier: 1, title: { de: 'Tier 1 · Zuerst', en: 'Tier 1 · First' }, sub: { de: 'Bestes Preis/Wert – Prehab & Aktivierung', en: 'Best value – prehab & activation' } },
  { tier: 2, title: { de: 'Tier 2 · Danach', en: 'Tier 2 · Next' }, sub: { de: 'Power & Last', en: 'Power & load' } },
  { tier: 3, title: { de: 'Tier 3 · Bei Commitment', en: 'Tier 3 · When committed' }, sub: { de: 'Komfort & Feinschliff', en: 'Convenience & polish' } },
];

export const SHOP: ShopItem[] = [
  // Tier 1
  { id: 'miniband', tier: 1, name: { de: 'Mini-Bänder', en: 'Mini bands' }, price: '10–15 €', why: { de: 'Glute-/Hüft-Aktivierung – über 50 % der Court-Bewegung.', en: 'Glute/hip activation – over 50 % of court movement.' } },
  { id: 'tubeband', tier: 1, name: { de: 'Tube-Bänder + Türanker', en: 'Tube bands + door anchor' }, price: '20–30 €', why: { de: 'Schulter-Prehab (Rotatorenmanschette), Rudern, Face Pulls.', en: 'Shoulder prehab (rotator cuff), rows, face pulls.' } },
  { id: 'jumprope', tier: 1, name: { de: 'Springseil', en: 'Jump rope' }, price: '10 €', why: { de: 'Kondition und Fußschnelligkeit in einem.', en: 'Conditioning and foot speed in one.' } },
  // Tier 2
  { id: 'medball', tier: 2, name: { de: 'Medizin-/Slam-Ball 3–5 kg', en: 'Med/slam ball 3–5 kg' }, price: '25–40 €', why: { de: 'Höchster Power-Wert: Rotationswürfe → Aufschlag & Grundschlag.', en: 'Highest power value: rotational throws → serve & groundstrokes.' } },
  { id: 'kettlebell', tier: 2, name: { de: 'Kettlebell 12–16 kg', en: 'Kettlebell 12–16 kg' }, price: '30–80 €', why: { de: 'Grundkraft & Hinge – eine Kugel deckt viel ab (alt.: Kurzhantelpaar).', en: 'Base strength & hinge – one bell covers a lot (alt: dumbbell pair).' } },
  { id: 'foamroller', tier: 2, name: { de: 'Foam Roller', en: 'Foam roller' }, price: '20–30 €', why: { de: 'Regeneration und Beweglichkeit (ROM).', en: 'Recovery and range of motion.' } },
  // Tier 3
  { id: 'dumbbells', tier: 3, name: { de: 'Verstellbare Kurzhanteln', en: 'Adjustable dumbbells' }, price: '80–150 €', why: { de: 'Feinere Laststufen für progressive Kraft.', en: 'Finer load steps for progressive strength.' } },
  { tier: 3, name: { de: 'Hütchen', en: 'Cones' }, price: '10–15 €', why: { de: 'Agilität & reaktive Drills – übertragen besser als die Leiter.', en: 'Agility & reactive drills – transfer better than the ladder.' } },
  { id: 'pullupbar', tier: 3, name: { de: 'Türklimmzugstange', en: 'Doorway pull-up bar' }, price: '20–30 €', why: { de: 'Zugkraft für die Schulterbalance.', en: 'Pulling strength for shoulder balance.' } },
  { tier: 3, name: { de: 'TRX / Schlingentrainer', en: 'TRX / suspension trainer' }, price: '40–100 €', why: { de: 'Körpergewicht in allen Ebenen.', en: 'Bodyweight in every plane.' } },
  { tier: 3, name: { de: 'Agility-Leiter', en: 'Agility ladder' }, price: '10–20 €', why: { de: 'Niedrigste Priorität – schult Rhythmus, nicht die reaktive Bewegung.', en: 'Lowest priority – trains rhythm, not reactive movement.' } },
];

export const STARTER_NOTE = {
  de: 'Minimalist-Starter (~70–90 €): Mini-Bänder + Tube-Bänder + Springseil + ein Med-Ball. +50–80 €: Kettlebell + Foam Roller – deckt Prehab, Power, Kondition und Grundkraft ab.',
  en: 'Minimalist starter (~70–90 €): mini bands + tube bands + jump rope + a med ball. +50–80 €: kettlebell + foam roller – covers prehab, power, conditioning and base strength.',
};
