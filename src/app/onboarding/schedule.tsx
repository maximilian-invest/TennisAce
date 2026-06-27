import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Text } from '@/components/ui/Text';
import type { Level } from '@/domain/models';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';

const WEEKDAYS = [
  { n: 1, label: 'Mo' }, { n: 2, label: 'Di' }, { n: 3, label: 'Mi' }, { n: 4, label: 'Do' },
  { n: 5, label: 'Fr' }, { n: 6, label: 'Sa' }, { n: 7, label: 'So' },
];
const DEFAULT_TRAINING: Record<Level, number> = { L1: 2, L2: 3, L3: 4, L4: 4 };

export default function ScheduleStep() {
  const { colors } = useTheme();
  const updateDraft = useAppStore((s) => s.updateDraft);
  const draft = useAppStore((s) => s.draft);

  const [tennisDays, setTennisDays] = useState<number[]>([]);
  const [training, setTraining] = useState<number>(DEFAULT_TRAINING[draft.selfRating ?? 'L2']);

  const toggleDay = (n: number) =>
    setTennisDays((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n]).sort((a, b) => a - b));

  return (
    <StepScaffold
      step={4}
      total={7}
      title="Wann spielst du Tennis?"
      subtitle="Wir legen dein Athletiktraining clever um deine Matches herum."
      ctaTitle="Weiter"
      onNext={() => {
        updateDraft({ tennisDays, tennisSessionsPerWeek: tennisDays.length, trainingDaysPerWeek: training });
        router.push('/onboarding/equipment');
      }}
    >
      <Text variant="label" color={colors.dim} style={styles.lbl}>DEINE TENNIS-TAGE</Text>
      <View style={styles.days}>
        {WEEKDAYS.map((d) => {
          const on = tennisDays.includes(d.n);
          return (
            <Pressable
              key={d.n}
              onPress={() => toggleDay(d.n)}
              style={[styles.day, { backgroundColor: on ? colors.accent : colors.surface, borderColor: on ? colors.accent : colors.line }]}
            >
              <Text variant="label" color={on ? colors.accentText : colors.text}>{d.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text variant="label" color={colors.dim} style={styles.lbl}>ZUSÄTZLICHE ATHLETIK-EINHEITEN / WOCHE</Text>
      <View style={styles.days}>
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const on = training === n;
          return (
            <Pressable
              key={n}
              onPress={() => setTraining(n)}
              style={[styles.day, styles.num, { backgroundColor: on ? colors.accent : colors.surface, borderColor: on ? colors.accent : colors.line }]}
            >
              <Text variant="bodySemi" color={on ? colors.accentText : colors.text}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text variant="small" color={colors.dim} style={styles.hint}>
        Realistisch wählen – lieber dranbleiben als überfordern. Anpassen geht jederzeit.
      </Text>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  lbl: { marginBottom: 12 },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  day: { minWidth: 44, height: 44, paddingHorizontal: 12, borderRadius: 13, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  num: { flex: 1 },
  hint: { marginTop: 6, lineHeight: 17 },
});
