import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import type { Sex } from '@/domain/models';
import { useAppStore } from '@/store/appStore';
import { useTestSession } from '@/store/testSession';
import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

const SEXES: { id: Sex; label: string }[] = [
  { id: 'm', label: 'Männlich' },
  { id: 'w', label: 'Weiblich' },
  { id: 'divers', label: 'Divers' },
];

export default function TestIntro() {
  const { colors } = useTheme();
  const start = useTestSession((s) => s.start);
  const profile = useAppStore((s) => s.profile);
  const draft = useAppStore((s) => s.draft);
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const monthly = hasOnboarded;

  // Prefill from the profile (monthly retest) or the onboarding draft (first test).
  const seedSex = monthly ? profile?.sex : draft.sex;
  const seedAge = monthly ? profile?.age : draft.age;
  const [sex, setSex] = useState<Sex | null>(seedSex ?? null);
  const [age, setAge] = useState(seedAge ? String(seedAge) : '');
  const valid = !!sex && Number(age) > 0;

  return (
    <Screen scroll>
      <View style={[styles.hero, { backgroundColor: colors.heroBg }]}>
        <Text style={[styles.heroNum, { color: colors.accent }]}>30</Text>
        <Text variant="label" color={colors.heroText} style={styles.heroLabel}>MINUTEN</Text>
      </View>

      <Text variant="title" style={styles.h}>
        {monthly ? 'Dein Monatstest' : 'Deine erste Leistungsfeststellung'}
      </Text>
      <Text variant="body" color={colors.dim} style={styles.p}>
        {monthly
          ? 'Dieselben 8 Stationen wie beim Eingangstest – gleiche Protokolle für einen fairen Vergleich. Danach siehst du deinen Fortschritt und ob eine neue Stufe ansteht.'
          : '8 kurze Stationen zeigen exakt, wo du stehst – danach startet dein Plan genau richtig. Du brauchst etwas Platz und ca. 30 Minuten.'}
      </Text>

      <Text variant="label" color={colors.dim} style={styles.lbl}>GESCHLECHT · FÜR NORMWERTE</Text>
      <View style={styles.row}>
        {SEXES.map((s) => (
          <Chip key={s.id} label={s.label} selected={sex === s.id} onPress={() => setSex(s.id)} />
        ))}
      </View>

      <Text variant="label" color={colors.dim} style={styles.lbl}>ALTER</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        placeholder="Jahre"
        placeholderTextColor={colors.dim}
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.line }]}
      />

      <Button
        title={monthly ? 'Monatstest starten' : 'Test starten'}
        disabled={!valid}
        onPress={() => {
          start(sex!, Number(age), monthly ? 'monthly' : 'initial');
          router.push('/test/warmup');
        }}
        style={styles.cta}
      />
      {monthly ? (
        <Button title="Abbrechen" variant="ghost" onPress={() => router.back()} style={styles.later} />
      ) : (
        <Button
          title="Später – erstmal vorläufig einstufen"
          variant="ghost"
          onPress={() => router.replace('/onboarding/result')}
          style={styles.later}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { height: 150, borderRadius: RADII.lg, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.sm },
  heroNum: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 56, lineHeight: 60 },
  heroLabel: { letterSpacing: 4, marginTop: 2 },
  h: { marginTop: SPACING.xl },
  p: { marginTop: SPACING.sm },
  lbl: { marginTop: SPACING.xl, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  input: { minHeight: 52, borderRadius: RADII.md, borderWidth: 1, paddingHorizontal: 14, fontFamily: 'PlusJakartaSans_500Medium', fontSize: 16 },
  cta: { marginTop: SPACING.xxl },
  later: { marginTop: SPACING.sm },
});
