import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { HealthCheck } from '@/domain/models';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';

const FIELDS: { id: keyof HealthCheck; label: string }[] = [
  { id: 'shoulder', label: 'Schulter' },
  { id: 'knee', label: 'Knie' },
  { id: 'back', label: 'Rücken' },
  { id: 'other', label: 'Sonstige Vorerkrankung' },
];

export default function Health() {
  const { colors } = useTheme();
  const updateDraft = useAppStore((s) => s.updateDraft);
  const [health, setHealth] = useState<HealthCheck>({ shoulder: false, knee: false, back: false, other: false });

  const toggle = (k: keyof HealthCheck) => setHealth((h) => ({ ...h, [k]: !h[k] }));

  return (
    <StepScaffold
      step={3}
      title="Kurzer Gesundheits-Check"
      subtitle="Damit wir Belastung und Prehab anpassen."
      ctaTitle="Weiter zum Leistungstest"
      ctaIcon
      onNext={() => {
        updateDraft({ health });
        router.push('/test/intro');
      }}
    >
      <View style={styles.list}>
        {FIELDS.map((f) => {
          const on = health[f.id];
          return (
            <View key={f.id} style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Text variant="bodySemi" color={colors.text} style={styles.rowLabel}>
                Beschwerden: {f.label}
              </Text>
              <Pressable onPress={() => toggle(f.id)} style={[styles.track, { backgroundColor: on ? colors.accent : colors.line }]}>
                <View style={[styles.knob, { alignSelf: on ? 'flex-end' : 'flex-start' }]} />
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={[styles.info, { backgroundColor: colors.surface2 }]}>
        <Icon name="info" size={17} color={colors.dim} strokeWidth={1.8} />
        <Text style={[styles.infoText, { color: colors.dim }]}>
          Kein medizinischer Rat. Bei anhaltenden Beschwerden ärztlich abklären lassen.
        </Text>
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 15,
  },
  rowLabel: { fontSize: 14 },
  track: { width: 46, height: 28, borderRadius: 14, padding: 3, justifyContent: 'center' },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF' },
  info: { flexDirection: 'row', gap: 10, marginTop: 18, padding: 14, borderRadius: 14, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 11.5, lineHeight: 17, fontFamily: 'PlusJakartaSans_500Medium' },
});
