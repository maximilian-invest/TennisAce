import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { TEST_STATIONS } from '@/content/tests';
import { useTestSession } from '@/store/testSession';
import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

export default function TestRun() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const setValue = useTestSession((s) => s.setValue);

  const [idx, setIdx] = useState(0);
  const station = TEST_STATIONS[idx];
  const isLast = idx === TEST_STATIONS.length - 1;

  const [text, setText] = useState(String(station.sample));
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setText(String(station.sample));
    setRunning(false);
    setElapsed(0);
  }, [idx, station.sample]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  const next = () => {
    const value = station.inputType === 'timer' ? elapsed : Number(text.replace(',', '.'));
    setValue(station.key, Number.isFinite(value) ? value : 0);
    if (isLast) router.replace('/test/analyzing');
    else setIdx((i) => i + 1);
  };

  const canNext = station.inputType === 'timer' ? elapsed > 0 : Number(text) > 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (idx === 0 ? router.back() : setIdx((i) => i - 1))}
          style={[styles.back, { backgroundColor: colors.surface, borderColor: colors.line }]}
        >
          <Icon name="chevronLeft" size={20} color={colors.text} />
        </Pressable>
        <Text variant="label" color={colors.dim}>
          STATION {idx + 1} / {TEST_STATIONS.length}
        </Text>
        <View style={styles.headSpacer} />
      </View>

      <View style={[styles.bar, { backgroundColor: colors.line }]}>
        <View style={[styles.barFill, { backgroundColor: colors.accent, width: `${((idx + 1) / TEST_STATIONS.length) * 100}%` }]} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={[styles.illu, { backgroundColor: colors.surface2 }]}>
          <Text style={[styles.chip, { backgroundColor: colors.accent, color: colors.accentText }]}>{station.chip}</Text>
          <Text style={[styles.illuUnit, { color: colors.dim }]}>{station.unit}</Text>
        </View>

        <Text variant="title" style={styles.name}>{station.name.de}</Text>

        <View style={styles.steps}>
          {station.steps.de.map((s, i) => (
            <View key={i} style={styles.step}>
              <View style={[styles.stepNum, { backgroundColor: colors.surface2 }]}>
                <Text variant="label" color={colors.accentTx}>{i + 1}</Text>
              </View>
              <Text variant="small" color={colors.dim} style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </View>

        {station.inputType === 'timer' ? (
          <View style={styles.timerWrap}>
            <Text style={[styles.timer, { color: colors.text }]}>{fmt(elapsed)}</Text>
            <Pressable onPress={() => setRunning((r) => !r)} style={[styles.timerBtn, { backgroundColor: running ? colors.surface2 : colors.accent }]}>
              <Text variant="bodySemi" color={running ? colors.text : colors.accentText}>
                {running ? 'Stopp' : elapsed > 0 ? 'Weiter' : 'Start'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              keyboardType="decimal-pad"
              selectTextOnFocus
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.line }]}
            />
            <Text variant="heading" color={colors.dim}>{station.unit}</Text>
          </View>
        )}

        <Text variant="small" color={colors.dim} style={styles.hint}>Messung: {station.hint.de}</Text>
      </ScrollView>

      <Pressable
        onPress={next}
        disabled={!canNext}
        style={({ pressed }) => [styles.cta, { backgroundColor: colors.accent, opacity: canNext ? 1 : 0.4, transform: [{ translateY: pressed && canNext ? 1 : 0 }] }]}
      >
        <Text variant="bodySemi" color={colors.accentText}>{isLast ? 'Auswerten' : 'Weiter'}</Text>
        <Icon name="arrowRight" size={18} color={colors.accentText} strokeWidth={2.3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 26 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 14 },
  back: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headSpacer: { width: 40 },
  bar: { height: 5, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  scroll: { flex: 1 },
  body: { paddingTop: SPACING.lg, paddingBottom: SPACING.lg },
  illu: { height: 150, borderRadius: RADII.lg, alignItems: 'center', justifyContent: 'center' },
  chip: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADII.pill, overflow: 'hidden' },
  illuUnit: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 30, marginTop: 8, opacity: 0.5 },
  name: { marginTop: SPACING.lg },
  steps: { gap: SPACING.sm, marginTop: SPACING.md },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepNum: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepText: { flex: 1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: SPACING.xl },
  input: { flex: 1, minHeight: 64, borderRadius: RADII.md, borderWidth: 1, paddingHorizontal: 16, fontFamily: 'SpaceGrotesk_700Bold', fontSize: 28 },
  timerWrap: { alignItems: 'center', gap: SPACING.md, marginTop: SPACING.xl },
  timer: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 56 },
  timerBtn: { minWidth: 140, height: 50, borderRadius: RADII.lg, alignItems: 'center', justifyContent: 'center' },
  hint: { marginTop: SPACING.md },
  cta: { height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 },
});
