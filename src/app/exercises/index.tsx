import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { DOMAIN_LABELS } from '@/content/reasoningDomains';
import { EXERCISES } from '@/content/exercises';
import type { Domain } from '@/domain/models';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { DOMAIN_COLORS, FONTS, RADII } from '@/theme/tokens';

const FREE_EXERCISES = 15;

export const domainColor: Record<Domain, string> = {
  speed: DOMAIN_COLORS.speed,
  agility: DOMAIN_COLORS.agility,
  powerLower: DOMAIN_COLORS.power,
  powerUpper: DOMAIN_COLORS.strength,
  core: DOMAIN_COLORS.core,
  aerobic: DOMAIN_COLORS.aerobic,
  mobility: DOMAIN_COLORS.mobility,
};

const PRESENT: Domain[] = Array.from(new Set(EXERCISES.map((e) => e.domain)));

export default function ExerciseLibrary() {
  const { colors } = useTheme();
  const lang = useLang();
  const isPremium = useAppStore((s) => s.isPremium);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Domain | 'all'>('all');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((e) => {
      if (filter !== 'all' && e.domain !== filter) return false;
      if (q && !`${e.name.de} ${e.name.en}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, filter]);

  // Free: a starter slice; ACE Pro unlocks the full catalogue.
  const visible = isPremium ? list : list.slice(0, FREE_EXERCISES);
  const hiddenCount = list.length - visible.length;

  return (
    <Screen scroll padded={false} contentStyle={styles.content}>
      <View style={styles.head}>
        <Text variant="label" color={colors.dim}>BIBLIOTHEK</Text>
        <Text style={[styles.title, { color: colors.text }]}>Übungen</Text>
      </View>

      <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <Icon name="search" size={17} color={colors.dim} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Übung suchen…"
          placeholderTextColor={colors.dim}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <FilterChip label="Alle" active={filter === 'all'} onPress={() => setFilter('all')} colors={colors} />
        {PRESENT.map((d) => (
          <FilterChip key={d} label={DOMAIN_LABELS[d][lang]} active={filter === d} dot={domainColor[d]} onPress={() => setFilter(d)} colors={colors} />
        ))}
      </ScrollView>

      <View style={styles.list}>
        {visible.map((e) => (
          <Pressable key={e.id} onPress={() => router.push(`/exercises/${e.id}`)} style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <View style={[styles.thumb, { backgroundColor: `${domainColor[e.domain]}26` }]}>
              <Icon name="figure" size={24} color={domainColor[e.domain]} strokeWidth={1.8} />
            </View>
            <View style={styles.rowMain}>
              <Text variant="bodySemi" color={colors.text} style={styles.rowName}>{e.name.de}</Text>
              <Text style={[styles.rowEn, { color: colors.dim }]}>{e.name.en}</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={[styles.tag, { backgroundColor: `${domainColor[e.domain]}26` }]}>
                <Text variant="label" color={domainColor[e.domain]}>{DOMAIN_LABELS[e.domain][lang]}</Text>
              </View>
              <View style={styles.dots}>
                {[1, 2, 3].map((n) => (
                  <View key={n} style={[styles.diffDot, { backgroundColor: n <= e.difficulty ? colors.text : colors.line }]} />
                ))}
              </View>
            </View>
          </Pressable>
        ))}
        {hiddenCount > 0 ? (
          <Pressable onPress={() => router.push('/paywall')} style={[styles.lock, { backgroundColor: colors.heroBg }]}>
            <View style={[styles.lockIcon, { backgroundColor: `${colors.accent}26` }]}>
              <Icon name="bolt" size={20} color={colors.accent} strokeWidth={2.2} />
            </View>
            <View style={styles.rowMain}>
              <Text variant="bodySemi" color={colors.heroText}>+{hiddenCount} weitere Übungen</Text>
              <Text variant="small" color={colors.heroText} style={styles.lockSub}>Komplette Bibliothek mit ACE Pro</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.accent }]}>
              <Text variant="label" color={colors.accentText}>PRO</Text>
            </View>
          </Pressable>
        ) : null}
        {list.length === 0 ? <Text variant="body" color={colors.dim} center style={styles.empty}>Keine Übung gefunden.</Text> : null}
      </View>
    </Screen>
  );
}

function FilterChip({ label, active, dot, onPress, colors }: { label: string; active: boolean; dot?: string; onPress: () => void; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, { backgroundColor: active ? colors.accent : colors.surface, borderColor: active ? colors.accent : colors.line }]}>
      {dot ? <View style={[styles.chipDot, { backgroundColor: dot }]} /> : null}
      <Text variant="label" color={active ? colors.accentText : colors.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  head: { paddingHorizontal: 24, paddingTop: 4 },
  title: { fontFamily: FONTS.display, fontSize: 29, marginTop: 4, letterSpacing: -0.3 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 22, marginTop: 14, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontFamily: FONTS.body, fontSize: 14, padding: 0 },
  chips: { paddingHorizontal: 22, gap: 8, marginTop: 12, paddingRight: 22 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADII.pill, borderWidth: 1.5 },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  list: { paddingHorizontal: 22, marginTop: 14, gap: 9 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, borderWidth: 1 },
  thumb: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  rowMain: { flex: 1, minWidth: 0 },
  rowName: { fontSize: 14.5 },
  rowEn: { fontFamily: FONTS.body, fontSize: 11.5, fontStyle: 'italic', marginTop: 1 },
  rowRight: { alignItems: 'flex-end', gap: 7 },
  tag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: RADII.pill },
  dots: { flexDirection: 'row', gap: 3 },
  diffDot: { width: 6, height: 6, borderRadius: 3 },
  lock: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, marginTop: 3 },
  lockIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  lockSub: { opacity: 0.8, marginTop: 1 },
  empty: { marginTop: 40 },
});
