import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import type { HealthCheck } from '@/domain/models';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { SPACING } from '@/theme/tokens';

const FIELDS: { id: keyof HealthCheck; de: string; en: string }[] = [
  { id: 'shoulder', de: 'Schulter-Beschwerden', en: 'Shoulder issues' },
  { id: 'knee', de: 'Knie-Beschwerden', en: 'Knee issues' },
  { id: 'back', de: 'Rücken-Beschwerden', en: 'Back issues' },
  { id: 'other', de: 'Sonstige Vorerkrankung', en: 'Other condition' },
];

export default function Health() {
  const { colors } = useTheme();
  const lang = useLang();
  const de = lang === 'de';
  const updateDraft = useAppStore((s) => s.updateDraft);
  const [health, setHealth] = useState<HealthCheck>({ shoulder: false, knee: false, back: false, other: false });

  const onNext = () => {
    updateDraft({ health });
    router.push('/onboarding/result');
  };

  return (
    <StepScaffold
      step={4}
      title={de ? 'Gesundheits-Check' : 'Health check'}
      subtitle={de ? 'Wir passen Übungen bei Bedarf an.' : 'We adapt exercises if needed.'}
      ctaTitle={de ? 'Zum Ergebnis' : 'See result'}
      onNext={onNext}
    >
      <Card padded={false}>
        {FIELDS.map((f, i) => (
          <View
            key={f.id}
            style={[styles.row, i < FIELDS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.line }]}
          >
            <Text variant="body">{de ? f.de : f.en}</Text>
            <Switch
              value={health[f.id]}
              onValueChange={(v) => setHealth((h) => ({ ...h, [f.id]: v }))}
              trackColor={{ true: colors.accent, false: colors.line }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </Card>
      <Text variant="small" color={colors.dim}>
        {de
          ? 'Kein medizinischer Rat. Bei Beschwerden bitte ärztlich abklären.'
          : 'Not medical advice. Please consult a doctor if in doubt.'}
      </Text>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
});
