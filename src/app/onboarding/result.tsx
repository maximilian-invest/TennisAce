import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { LEVEL_NAMES, t } from '@/domain/catalog';
import type { LevelState, UserProfile } from '@/domain/models';
import { quickClassify } from '@/services/quickClassification';
import { quickReasoning } from '@/services/reasoningEngine';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

export default function Result() {
  const { colors } = useTheme();
  const lang = useLang();
  const de = lang === 'de';
  const draft = useAppStore((s) => s.draft);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const level = useMemo(
    () =>
      quickClassify({
        selfRating: draft.selfRating ?? 'L1',
        tennisSessionsPerWeek: draft.tennisSessionsPerWeek ?? 0,
        athleticExperience: draft.athleticExperience ?? 'none',
      }),
    [draft],
  );

  const reasoning = useMemo(
    () =>
      quickReasoning({
        level,
        sessionsPerWeek: draft.tennisSessionsPerWeek ?? 0,
        athleticExperience: draft.athleticExperience ?? 'none',
        primaryGoal: draft.goals?.[0],
        lang,
      }),
    [level, draft, lang],
  );

  const loadingTexts = de
    ? ['Werte deine Antworten aus …', 'Vergleiche mit Tennis-Normdaten …', 'Erstelle deinen Plan …']
    : ['Analysing your answers …', 'Comparing with tennis norms …', 'Building your plan …'];
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((x) => x + 1), 850);
    const done = setTimeout(() => setLoading(false), 2600);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, []);

  const finish = () => {
    const profile: UserProfile = {
      name: draft.name ?? '',
      sex: draft.sex ?? 'divers',
      age: draft.age ?? 0,
      heightCm: draft.heightCm,
      weightKg: draft.weightKg,
      tennisSessionsPerWeek: draft.tennisSessionsPerWeek ?? 0,
      selfRating: draft.selfRating ?? 'L1',
      goals: draft.goals ?? [],
      language: lang,
    };
    const levelState: LevelState = {
      currentLevel: level,
      progressToNext: 0,
      periodizationPhase: 'offseason',
      source: 'quick',
    };
    completeOnboarding({
      profile,
      equipment: draft.equipment ?? { mode: 'none', items: [] },
      health: draft.health ?? { shoulder: false, knee: false, back: false, other: false },
      levelState,
    });
    router.replace('/home');
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text variant="heading" center>
            {loadingTexts[tick % loadingTexts.length]}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text variant="label" color={colors.dim} center>
        {de ? 'DEINE VORLÄUFIGE STUFE' : 'YOUR PRELIMINARY LEVEL'}
      </Text>

      <View style={styles.badgeWrap}>
        <View style={[styles.badge, { backgroundColor: colors.accent }]}>
          <Text variant="display" color={colors.accentText} style={styles.badgeText}>
            {level}
          </Text>
        </View>
        <Text variant="title" center style={styles.levelName}>
          {t(LEVEL_NAMES[level], lang)}
        </Text>
      </View>

      <Card style={styles.reasoning}>
        <Text variant="heading">{de ? 'Warum diese Einstufung?' : 'Why this level?'}</Text>
        {reasoning.map((s, i) => (
          <Text key={i} variant="body" color={colors.dim}>
            {s}
          </Text>
        ))}
      </Card>

      <Button title={de ? 'Plan starten' : 'Start my plan'} onPress={finish} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.xl, paddingHorizontal: SPACING.xl },
  badgeWrap: { alignItems: 'center', marginTop: SPACING.lg },
  badge: { width: 120, height: 120, borderRadius: RADII.xl, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 56, lineHeight: 60 },
  levelName: { marginTop: SPACING.md },
  reasoning: { marginTop: SPACING.xl, gap: SPACING.md },
  cta: { marginTop: SPACING.xl },
});
