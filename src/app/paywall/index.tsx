import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourtLines } from '@/components/CourtLines';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { PREMIUM_FEATURES, purchasePremium, restorePurchases } from '@/services/premium';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { FONTS, RADII } from '@/theme/tokens';

type Plan = 'year' | 'month';
const PLAN_INFO: Record<Plan, { price: string; per: { de: string; en: string }; note: { de: string; en: string }; badge?: { de: string; en: string } }> = {
  year: { price: '59,99 €', per: { de: '/ Jahr', en: '/ year' }, note: { de: '≈ 5,00 €/Monat', en: '≈ €5.00/mo' }, badge: { de: 'Spare 44 %', en: 'Save 44%' } },
  month: { price: '8,99 €', per: { de: '/ Monat', en: '/ month' }, note: { de: 'monatlich kündbar', en: 'cancel anytime' } },
};

export default function Paywall() {
  const { colors } = useTheme();
  const lang = useLang();
  const de = lang === 'de';
  const insets = useSafeAreaInsets();
  const isPremium = useAppStore((s) => s.isPremium);
  const setPremium = useAppStore((s) => s.setPremium);
  const [plan, setPlan] = useState<Plan>('year');
  const [busy, setBusy] = useState(false);

  const buy = async () => {
    setBusy(true);
    try {
      await purchasePremium();
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top + 6, paddingBottom: insets.bottom + 14 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.round, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Icon name="chevronDown" size={20} color={colors.text} />
        </Pressable>
        <Pressable onPress={() => restorePurchases()} hitSlop={10}>
          <Text variant="small" color={colors.dim}>{de ? 'Wiederherstellen' : 'Restore'}</Text>
        </Pressable>
      </View>

      <Screen scroll padded={false} contentStyle={styles.scroll}>
        <View style={[styles.hero, { backgroundColor: colors.heroBg }]}>
          <CourtLines color={colors.heroText} opacity={0.12} />
          <Text style={[styles.brand, { color: colors.accent }]}>ACE PRO</Text>
          <Text style={[styles.heroTitle, { color: colors.heroText }]}>{de ? 'Hol alles aus deinem Training' : 'Get the most out of your training'}</Text>
        </View>

        <View style={styles.features}>
          {PREMIUM_FEATURES.map((f) => (
            <View key={f.icon} style={styles.feature}>
              <View style={[styles.featureIcon, { backgroundColor: `${colors.accent}26` }]}>
                <Icon name={f.icon} size={20} color={colors.accentTx} strokeWidth={2} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodySemi" color={colors.text}>{f.title[lang]}</Text>
                <Text variant="small" color={colors.dim} style={styles.featureSub}>{f.sub[lang]}</Text>
              </View>
            </View>
          ))}
        </View>

        {isPremium ? (
          <View style={[styles.active, { backgroundColor: `${colors.accent}1F`, borderColor: colors.accent }]}>
            <Icon name="check" size={22} color={colors.accentTx} strokeWidth={2.6} />
            <Text variant="bodySemi" color={colors.text} style={styles.flex}>{de ? 'ACE Pro ist aktiv 🎾' : 'ACE Pro is active 🎾'}</Text>
            <Pressable onPress={() => setPremium(false)} hitSlop={8}>
              <Text variant="label" color={colors.dim}>{de ? 'Test: zurücksetzen' : 'Test: reset'}</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.plans}>
              {(['year', 'month'] as Plan[]).map((p) => {
                const info = PLAN_INFO[p];
                const active = plan === p;
                return (
                  <Pressable key={p} onPress={() => setPlan(p)} style={[styles.plan, { borderColor: active ? colors.accent : colors.line, backgroundColor: active ? `${colors.accent}14` : colors.surface }]}>
                    <View style={styles.flex}>
                      <Text variant="bodySemi" color={colors.text}>{p === 'year' ? (de ? 'Jährlich' : 'Yearly') : de ? 'Monatlich' : 'Monthly'}</Text>
                      <Text variant="small" color={colors.dim}>{info.note[lang]}</Text>
                    </View>
                    {info.badge ? (
                      <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                        <Text variant="label" color={colors.accentText}>{info.badge[lang]}</Text>
                      </View>
                    ) : null}
                    <View style={styles.priceCol}>
                      <Text style={[styles.price, { color: colors.text }]}>{info.price}</Text>
                      <Text variant="small" color={colors.dim}>{info.per[lang]}</Text>
                    </View>
                    <View style={[styles.radio, { borderColor: active ? colors.accent : colors.line }]}>
                      {active ? <View style={[styles.radioDot, { backgroundColor: colors.accent }]} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={buy} disabled={busy} style={({ pressed }) => [styles.cta, { backgroundColor: colors.accent, opacity: busy ? 0.6 : 1, transform: [{ translateY: pressed ? 1 : 0 }] }]}>
              <Text variant="bodySemi" color={colors.accentText}>{de ? 'ACE Pro freischalten' : 'Unlock ACE Pro'}</Text>
            </Pressable>
            <Text variant="small" color={colors.dim} center style={styles.legal}>
              {de ? 'Jederzeit kündbar. Verlängert sich automatisch.' : 'Cancel anytime. Auto-renews.'}
            </Text>
          </>
        )}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingBottom: 6 },
  round: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 30 },

  hero: { borderRadius: 24, padding: 22, height: 150, justifyContent: 'flex-end', overflow: 'hidden' },
  brand: { fontFamily: FONTS.display, fontSize: 13, letterSpacing: 3 },
  heroTitle: { fontFamily: FONTS.display, fontSize: 24, lineHeight: 27, marginTop: 6 },

  features: { marginTop: 22, gap: 16 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  featureIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  featureSub: { marginTop: 2, lineHeight: 17 },

  plans: { marginTop: 26, gap: 10 },
  plan: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 16, padding: 16 },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: RADII.pill },
  priceCol: { alignItems: 'flex-end' },
  price: { fontFamily: FONTS.display, fontSize: 19 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 11, height: 11, borderRadius: 6 },

  cta: { height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
  legal: { marginTop: 12 },

  active: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24, padding: 16, borderRadius: 16, borderWidth: 1.5 },
});
