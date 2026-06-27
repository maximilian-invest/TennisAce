import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Text } from '@/components/ui/Text';
import type { Level } from '@/domain/models';
import type { AthleticExperience } from '@/services/quickClassification';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { RADII } from '@/theme/tokens';

const RATINGS: { id: Level; label: string; sub: string }[] = [
  { id: 'L1', label: 'Ich fange gerade an', sub: 'Wenig/kein Athletiktraining bisher' },
  { id: 'L2', label: 'Ich bin in ok Form', sub: 'Ab und zu aktiv' },
  { id: 'L3', label: 'Ich bin sportlich & trainiere', sub: 'Regelmäßig & strukturiert' },
  { id: 'L4', label: 'Sehr durchtrainiert / Wettkampf', sub: 'Leistungsorientiert' },
];

const EXPERIENCE: { id: AthleticExperience; label: string }[] = [
  { id: 'none', label: 'Nie strukturiert' },
  { id: 'sometimes', label: 'Manchmal' },
  { id: 'structured', label: 'Regelmäßig / Verein' },
];

export default function LevelStep() {
  const { colors } = useTheme();
  const updateDraft = useAppStore((s) => s.updateDraft);
  const [rating, setRating] = useState<Level | null>(null);
  const [exp, setExp] = useState<AthleticExperience>('sometimes');

  return (
    <StepScaffold
      step={3}
      total={7}
      title="Wie schätzt du dich ein?"
      subtitle="Nur ein Startpunkt – der Test verfeinert ihn später."
      ctaTitle="Weiter"
      ctaDisabled={!rating}
      onNext={() => {
        updateDraft({ selfRating: rating!, athleticExperience: exp });
        router.push('/onboarding/schedule');
      }}
    >
      <View style={styles.list}>
        {RATINGS.map((r) => {
          const on = rating === r.id;
          return (
            <Pressable
              key={r.id}
              onPress={() => setRating(r.id)}
              style={[styles.card, { backgroundColor: on ? colors.accent : colors.surface, borderColor: on ? colors.accent : colors.line }]}
            >
              <Text variant="bodySemi" color={on ? colors.accentText : colors.text}>{r.label}</Text>
              <Text variant="small" color={on ? colors.accentText : colors.dim} style={styles.sub}>{r.sub}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text variant="label" color={colors.dim} style={styles.lbl}>ATHLETIK-ERFAHRUNG</Text>
      <View style={styles.expRow}>
        {EXPERIENCE.map((e) => {
          const on = exp === e.id;
          return (
            <Pressable
              key={e.id}
              onPress={() => setExp(e.id)}
              style={[styles.exp, { backgroundColor: on ? colors.accent : colors.surface, borderColor: on ? colors.accent : colors.line }]}
            >
              <Text variant="label" color={on ? colors.accentText : colors.text} center>{e.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  card: { padding: 16, borderRadius: RADII.md, borderWidth: 1.5 },
  sub: { marginTop: 3 },
  lbl: { marginTop: 24, marginBottom: 10 },
  expRow: { flexDirection: 'row', gap: 8 },
  exp: { flex: 1, paddingVertical: 12, paddingHorizontal: 6, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
});
