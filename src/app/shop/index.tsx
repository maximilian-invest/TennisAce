import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { SHOP, SHOP_TIERS, STARTER_NOTE } from '@/content/shop';
import { EQUIPMENT_MODES } from '@/domain/catalog';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { FONTS, RADII } from '@/theme/tokens';

export default function EquipmentShop() {
  const { colors } = useTheme();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const equipment = useAppStore((s) => s.equipment);
  const toggleEquipmentItem = useAppStore((s) => s.toggleEquipmentItem);

  const owned = equipment?.items ?? [];
  const modeLabel = EQUIPMENT_MODES.find((m) => m.id === (equipment?.mode ?? 'none'))?.label[lang];

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.round, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Icon name="chevronLeft" size={20} color={colors.text} />
        </Pressable>
        <Text variant="bodySemi" color={colors.text}>Equipment</Text>
        <View style={styles.round} />
      </View>

      <Screen scroll padded={false} contentStyle={styles.scroll}>
        <View style={[styles.intro, { backgroundColor: colors.heroBg }]}>
          <Text variant="label" color={colors.accent}>DEIN SETUP · {modeLabel?.toUpperCase()}</Text>
          <Text style={[styles.introTitle, { color: colors.heroText }]}>Jede Übung passt sich an</Text>
          <Text variant="small" color={colors.heroText} style={styles.introText}>
            ACE adaptiert jede Einheit an dein vorhandenes Equipment. Wer aufrüsten will, geht am besten in dieser Reihenfolge vor – tippe an, was du schon hast.
          </Text>
        </View>

        {SHOP_TIERS.map((tier) => (
          <View key={tier.tier} style={styles.tier}>
            <View style={styles.tierHead}>
              <Text variant="bodySemi" color={colors.text}>{tier.title[lang]}</Text>
              <Text variant="small" color={colors.dim}>{tier.sub[lang]}</Text>
            </View>
            {SHOP.filter((it) => it.tier === tier.tier).map((it, i) => {
              const isOwned = !!it.id && owned.includes(it.id);
              const interactive = !!it.id;
              return (
                <Pressable
                  key={`${tier.tier}-${i}`}
                  disabled={!interactive}
                  onPress={() => it.id && toggleEquipmentItem(it.id)}
                  style={[styles.item, { backgroundColor: colors.surface, borderColor: isOwned ? colors.accent : colors.line }]}
                >
                  <View style={styles.itemMain}>
                    <View style={styles.itemTop}>
                      <Text variant="bodySemi" color={colors.text} style={styles.flex}>{it.name[lang]}</Text>
                      <Text variant="label" color={colors.accentTx}>{it.price}</Text>
                    </View>
                    <Text variant="small" color={colors.dim} style={styles.why}>{it.why[lang]}</Text>
                  </View>
                  {interactive ? (
                    <View style={[styles.check, { backgroundColor: isOwned ? colors.accent : 'transparent', borderColor: isOwned ? colors.accent : colors.line }]}>
                      {isOwned ? <Icon name="check" size={15} color={colors.accentText} strokeWidth={2.6} /> : null}
                    </View>
                  ) : (
                    <View style={styles.check} />
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}

        <View style={[styles.starter, { backgroundColor: colors.surface2 }]}>
          <Icon name="bulb" size={18} color={colors.accentTx} strokeWidth={2} />
          <Text variant="small" color={colors.text} style={styles.starterText}>{STARTER_NOTE[lang]}</Text>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingBottom: 6 },
  round: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 36 },

  intro: { borderRadius: 22, padding: 20 },
  introTitle: { fontFamily: FONTS.display, fontSize: 22, marginTop: 8 },
  introText: { opacity: 0.82, marginTop: 6, lineHeight: 19 },

  tier: { marginTop: 22, gap: 9 },
  tierHead: { marginBottom: 3 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 16, padding: 15 },
  itemMain: { flex: 1 },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  why: { marginTop: 4, lineHeight: 17 },
  check: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },

  starter: { flexDirection: 'row', gap: 11, alignItems: 'flex-start', marginTop: 24, padding: 15, borderRadius: 16 },
  starterText: { flex: 1, lineHeight: 18 },
});
