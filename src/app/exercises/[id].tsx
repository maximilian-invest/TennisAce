import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { domainColor } from './index';
import { CourtLines } from '@/components/CourtLines';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { EXERCISES } from '@/content/exercises';
import { DOMAIN_LABELS } from '@/content/reasoningDomains';
import { useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { FONTS, RADII } from '@/theme/tokens';

type Tab = 'steps' | 'tips' | 'mistakes';
const TABS: { id: Tab; label: string }[] = [
  { id: 'steps', label: 'Anleitung' },
  { id: 'tips', label: 'Form-Tipps' },
  { id: 'mistakes', label: 'Häufige Fehler' },
];
const VARIANTS: { id: 'gym' | 'home' | 'none'; label: string }[] = [
  { id: 'gym', label: 'Gym' },
  { id: 'home', label: 'Heim' },
  { id: 'none', label: 'Kein Equipment' },
];

export default function ExerciseDetail() {
  const { colors } = useTheme();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const ex = EXERCISES.find((e) => e.id === id);

  const [tab, setTab] = useState<Tab>('steps');
  const [variant, setVariant] = useState<'gym' | 'home' | 'none'>('home');

  if (!ex) {
    return (
      <Screen>
        <View style={styles.center}><Text>Übung nicht gefunden.</Text></View>
      </Screen>
    );
  }

  const dColor = domainColor[ex.domain];
  const items = tab === 'steps' ? ex.steps : tab === 'tips' ? ex.formTips : ex.mistakes;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.round, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Icon name="chevronLeft" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.name, { color: colors.text }]}>{ex.name.de}</Text>
          <Text style={[styles.nameEn, { color: colors.dim }]}>{ex.name.en}</Text>
        </View>
        <View style={styles.round} />
      </View>

      <Screen scroll padded={false} contentStyle={styles.scroll}>
        <View style={[styles.anim, { backgroundColor: colors.heroBg }]}>
          <CourtLines color={colors.heroText} opacity={0.1} />
          <View style={[styles.domainPill, { backgroundColor: dColor }]}>
            <Text variant="label" color={colors.heroText}>{DOMAIN_LABELS[ex.domain][lang]}</Text>
          </View>
          <View style={styles.figure}>
            <Icon name="figure" size={96} color={colors.heroText} strokeWidth={1.3} />
          </View>
        </View>

        <View style={[styles.tabs, { backgroundColor: colors.surface2 }]}>
          {TABS.map((t) => (
            <Pressable key={t.id} onPress={() => setTab(t.id)} style={[styles.tab, tab === t.id && { backgroundColor: colors.surface }]}>
              <Text variant="label" color={tab === t.id ? colors.text : colors.dim}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.items}>
          {items.map((text, i) => (
            <View key={i} style={styles.item}>
              <View style={[styles.itemNum, { backgroundColor: colors.surface2 }]}>
                <Text variant="label" color={colors.accentTx}>{i + 1}</Text>
              </View>
              <Text variant="body" color={colors.text} style={styles.itemText}>{text}</Text>
            </View>
          ))}
        </View>

        <Text variant="label" color={colors.dim} style={styles.sectionLabel}>EQUIPMENT-VARIANTE</Text>
        <View style={styles.variants}>
          {VARIANTS.map((v) => (
            <Pressable key={v.id} onPress={() => setVariant(v.id)} style={[styles.variant, { backgroundColor: variant === v.id ? colors.accent : colors.surface, borderColor: variant === v.id ? colors.accent : colors.line }]}>
              <Text variant="label" color={variant === v.id ? colors.accentText : colors.text}>{v.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={[styles.variantText, { backgroundColor: colors.surface2 }]}>
          <Text variant="small" color={colors.text} style={styles.variantTextInner}>{ex.variants[variant]}</Text>
        </View>

        <View style={[styles.dosage, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={styles.dosageHead}>
            <View style={[styles.dosageDot, { backgroundColor: dColor }]} />
            <Text variant="label" color={colors.text}>ZIEL-DOSIS · {ex.quality.toUpperCase()}</Text>
          </View>
          <View style={styles.dosageRow}>
            <DosageCol value={ex.dosage.intensity} label="Intensität" colors={colors} />
            <DosageCol value={ex.dosage.reps} label="Wdh" colors={colors} />
            <DosageCol value={ex.dosage.sets} label="Sätze" colors={colors} />
            <DosageCol value={ex.dosage.rest} label="Pause" colors={colors} />
          </View>
        </View>

        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.cta, { backgroundColor: colors.accent, transform: [{ translateY: pressed ? 1 : 0 }] }]}>
          <Icon name="plus" size={18} color={colors.accentText} strokeWidth={2.4} />
          <Text variant="bodySemi" color={colors.accentText}>Zur Einheit hinzufügen</Text>
        </Pressable>
      </Screen>
    </View>
  );
}

function DosageCol({ value, label, colors }: { value: string; label: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={styles.dosageCol}>
      <Text style={[styles.dosageVal, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.dosageLbl, { color: colors.dim }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22 },
  headerCenter: { alignItems: 'center' },
  name: { fontFamily: FONTS.display, fontSize: 20, lineHeight: 22 },
  nameEn: { fontFamily: FONTS.body, fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  round: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 30 },

  anim: { borderRadius: 24, height: 248, overflow: 'hidden' },
  domainPill: { position: 'absolute', top: 15, left: 17, zIndex: 3, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADII.pill },
  figure: { flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.85 },

  tabs: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 14, marginTop: 14 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  items: { gap: 13, marginTop: 16 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  itemNum: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1, lineHeight: 21 },

  sectionLabel: { marginTop: 22, marginBottom: 10, letterSpacing: 1.3 },
  variants: { flexDirection: 'row', gap: 7 },
  variant: { flex: 1, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  variantText: { marginTop: 11, padding: 14, borderRadius: 13 },
  variantTextInner: { lineHeight: 19 },

  dosage: { marginTop: 20, borderWidth: 1, borderRadius: 18, padding: 18 },
  dosageHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 },
  dosageDot: { width: 9, height: 9, borderRadius: 5 },
  dosageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dosageCol: { alignItems: 'center', flex: 1 },
  dosageVal: { fontFamily: FONTS.display, fontSize: 18 },
  dosageLbl: { fontFamily: FONTS.body, fontSize: 10, marginTop: 3 },

  cta: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 22 },
});
