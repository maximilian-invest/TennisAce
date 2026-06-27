import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import type { Sex } from '@/domain/models';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { RADII } from '@/theme/tokens';

const SEXES: { id: Sex; label: string }[] = [
  { id: 'm', label: 'Männlich' },
  { id: 'w', label: 'Weiblich' },
  { id: 'divers', label: 'Divers' },
];

export default function ProfileStep() {
  const { colors } = useTheme();
  const updateDraft = useAppStore((s) => s.updateDraft);
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex | null>(null);
  const n = Number(age);
  const valid = n > 0 && n < 120 && !!sex;

  return (
    <StepScaffold
      step={2}
      total={7}
      title="Wie alt bist du?"
      subtitle="Damit wir Intensität und Übungen sicher und passend für dich wählen."
      ctaTitle="Weiter"
      ctaDisabled={!valid}
      onNext={() => {
        updateDraft({ age: n, sex: sex! });
        router.push('/onboarding/level');
      }}
    >
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        placeholder="Alter in Jahren"
        placeholderTextColor={colors.dim}
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.line }]}
      />

      <Text variant="label" color={colors.dim} style={styles.lbl}>GESCHLECHT · FÜR NORMWERTE</Text>
      <View style={styles.row}>
        {SEXES.map((s) => (
          <Chip key={s.id} label={s.label} selected={sex === s.id} onPress={() => setSex(s.id)} />
        ))}
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 56, borderRadius: RADII.md, borderWidth: 1, paddingHorizontal: 16, fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22 },
  lbl: { marginTop: 24, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
});
