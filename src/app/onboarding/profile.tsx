import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { SELF_RATINGS, t } from '@/domain/catalog';
import type { Level, Sex } from '@/domain/models';
import type { AthleticExperience } from '@/services/quickClassification';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

const SEXES: { id: Sex; de: string; en: string }[] = [
  { id: 'm', de: 'Männlich', en: 'Male' },
  { id: 'w', de: 'Weiblich', en: 'Female' },
  { id: 'divers', de: 'Divers', en: 'Other' },
];

const EXPERIENCE: { id: AthleticExperience; de: string; en: string }[] = [
  { id: 'none', de: 'Nein', en: 'No' },
  { id: 'sometimes', de: 'Gelegentlich', en: 'Sometimes' },
  { id: 'structured', de: 'Strukturiert', en: 'Structured' },
];

export default function Profile() {
  const { colors } = useTheme();
  const lang = useLang();
  const de = lang === 'de';
  const updateDraft = useAppStore((s) => s.updateDraft);

  const [name, setName] = useState('');
  const [sex, setSex] = useState<Sex | null>(null);
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [sessions, setSessions] = useState(2);
  const [selfRating, setSelfRating] = useState<Level | null>(null);
  const [experience, setExperience] = useState<AthleticExperience | null>(null);

  const valid = !!name.trim() && !!sex && Number(age) > 0 && !!selfRating && !!experience;

  const onNext = () => {
    updateDraft({
      name: name.trim(),
      sex: sex!,
      age: Number(age),
      heightCm: heightCm ? Number(heightCm) : undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
      tennisSessionsPerWeek: sessions,
      selfRating: selfRating!,
      athleticExperience: experience!,
    });
    router.push('/onboarding/goals');
  };

  const inputStyle = [styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.line }];

  return (
    <StepScaffold
      step={1}
      title={de ? 'Dein Profil' : 'Your profile'}
      subtitle={de ? 'Damit wir dein Training richtig einstellen.' : 'So we can dial in your training.'}
      ctaTitle={de ? 'Weiter' : 'Continue'}
      ctaDisabled={!valid}
      onNext={onNext}
    >
      <Field label={de ? 'Name' : 'Name'}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={de ? 'Vorname' : 'First name'}
          placeholderTextColor={colors.dim}
          style={inputStyle}
        />
      </Field>

      <Field label={de ? 'Geschlecht' : 'Sex'}>
        <View style={styles.wrap}>
          {SEXES.map((s) => (
            <Chip key={s.id} label={de ? s.de : s.en} selected={sex === s.id} onPress={() => setSex(s.id)} />
          ))}
        </View>
      </Field>

      <View style={styles.row}>
        <Field label={de ? 'Alter' : 'Age'} flex>
          <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="—" placeholderTextColor={colors.dim} style={inputStyle} />
        </Field>
        <Field label={de ? 'Größe (cm)' : 'Height (cm)'} flex>
          <TextInput value={heightCm} onChangeText={setHeightCm} keyboardType="number-pad" placeholder={de ? 'optional' : 'optional'} placeholderTextColor={colors.dim} style={inputStyle} />
        </Field>
        <Field label={de ? 'Gewicht (kg)' : 'Weight (kg)'} flex>
          <TextInput value={weightKg} onChangeText={setWeightKg} keyboardType="number-pad" placeholder={de ? 'optional' : 'optional'} placeholderTextColor={colors.dim} style={inputStyle} />
        </Field>
      </View>

      <Field label={de ? `Tennis pro Woche: ${sessions}×` : `Tennis per week: ${sessions}×`}>
        <View style={styles.wrap}>
          {Array.from({ length: 8 }).map((_, n) => {
            const active = sessions === n;
            return (
              <Pressable
                key={n}
                onPress={() => setSessions(n)}
                style={[styles.num, { backgroundColor: active ? colors.accent : colors.surface, borderColor: active ? colors.accent : colors.line }]}
              >
                <Text variant="bodySemi" color={active ? colors.accentText : colors.text}>
                  {n}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Field label={de ? 'Selbsteinschätzung' : 'Self-assessment'}>
        <View style={styles.wrap}>
          {SELF_RATINGS.map((r) => (
            <Chip key={r.id} label={t(r.label, lang)} selected={selfRating === r.id} onPress={() => setSelfRating(r.id)} />
          ))}
        </View>
      </Field>

      <Field label={de ? 'Trainierst du bereits Athletik?' : 'Do you already train athletically?'}>
        <View style={styles.wrap}>
          {EXPERIENCE.map((e) => (
            <Chip key={e.id} label={de ? e.de : e.en} selected={experience === e.id} onPress={() => setExperience(e.id)} />
          ))}
        </View>
      </Field>
    </StepScaffold>
  );
}

function Field({ label, children, flex }: { label: string; children: React.ReactNode; flex?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.field, flex && { flex: 1 }]}>
      <Text variant="label" color={colors.dim} style={styles.fieldLabel}>
        {label.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: SPACING.sm },
  fieldLabel: {},
  input: {
    minHeight: 50,
    borderRadius: RADII.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  row: { flexDirection: 'row', gap: SPACING.sm },
  num: {
    width: 44,
    height: 44,
    borderRadius: RADII.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
