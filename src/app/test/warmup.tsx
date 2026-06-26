import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourtLines } from '@/components/CourtLines';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { RAMP, RAMP_TOTAL_SEC } from '@/content/warmup';
import { useTheme } from '@/theme/ThemeContext';
import { DOMAIN_COLORS, FONTS, RADII, SPACING } from '@/theme/tokens';

const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

// One accent colour per RAMP phase — warm → activate → mobile → explosive.
const PHASE_COLORS: Record<string, string> = {
  raise: DOMAIN_COLORS.power,
  activate: DOMAIN_COLORS.strength,
  mobilize: DOMAIN_COLORS.mobility,
  potentiate: DOMAIN_COLORS.speed,
};

export default function TestWarmup() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Icon name="chevronLeft" size={20} color={colors.text} />
        </Pressable>
        <Text variant="label" color={colors.dim}>AUFWÄRMEN</Text>
        <View style={styles.headSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.heroBg }]}>
          <CourtLines color={colors.heroText} opacity={0.1} />
          <Text variant="label" color={colors.heroText} style={styles.heroKicker}>RAMP-PROTOKOLL</Text>
          <Text style={[styles.heroTime, { color: colors.accent }]}>{fmt(RAMP_TOTAL_SEC)}</Text>
          <Text variant="small" color={colors.heroText} style={styles.heroSub}>Minuten · 4 Phasen bis startklar</Text>
        </View>

        <Text variant="title" style={styles.h}>Erst warm, dann messen</Text>
        <Text variant="body" color={colors.dim} style={styles.p}>
          Ein sauberes Warm-up schützt vor Verletzungen und holt deine echten Bestwerte raus. Arbeite die vier Phasen der Reihe nach ab.
        </Text>

        <View style={styles.phases}>
          {RAMP.map((phase) => {
            const c = PHASE_COLORS[phase.key] ?? colors.accent;
            return (
              <View key={phase.key} style={[styles.phase, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                <View style={styles.phaseHead}>
                  <View style={[styles.letter, { backgroundColor: c }]}>
                    <Text style={styles.letterText}>{phase.letter}</Text>
                  </View>
                  <View style={styles.flex}>
                    <View style={styles.phaseTitleRow}>
                      <Text variant="bodySemi" color={colors.text}>{phase.title}</Text>
                      <Text variant="label" color={colors.dim}>{fmt(phase.durationSec)}</Text>
                    </View>
                    <Text variant="small" color={colors.dim}>{phase.desc}</Text>
                  </View>
                </View>
                <View style={styles.items}>
                  {phase.items.map((item) => (
                    <View key={item} style={[styles.itemChip, { backgroundColor: colors.surface2 }]}>
                      <View style={[styles.itemDot, { backgroundColor: c }]} />
                      <Text variant="small" color={colors.text}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.replace('/test/run')}
        style={({ pressed }) => [styles.cta, { backgroundColor: colors.accent, transform: [{ translateY: pressed ? 1 : 0 }] }]}
      >
        <Text variant="bodySemi" color={colors.accentText}>Warm – Test starten</Text>
        <Icon name="arrowRight" size={18} color={colors.accentText} strokeWidth={2.3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 26 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 14 },
  back: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headSpacer: { width: 40 },
  scroll: { flex: 1 },
  body: { paddingTop: SPACING.sm, paddingBottom: SPACING.xl },

  hero: { height: 168, borderRadius: RADII.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  heroKicker: { letterSpacing: 3, opacity: 0.85 },
  heroTime: { fontFamily: FONTS.display, fontSize: 56, lineHeight: 60, marginTop: 4 },
  heroSub: { opacity: 0.78, marginTop: 2 },

  h: { marginTop: SPACING.xl },
  p: { marginTop: SPACING.sm },

  phases: { gap: SPACING.md, marginTop: SPACING.xl },
  phase: { borderWidth: 1, borderRadius: RADII.lg, padding: 16 },
  phaseHead: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  letter: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontFamily: FONTS.display, fontSize: 22, color: '#FFFFFF' },
  phaseTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  items: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 14 },
  itemChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 7, borderRadius: RADII.pill },
  itemDot: { width: 6, height: 6, borderRadius: 3 },

  cta: { height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, marginTop: 4 },
});
