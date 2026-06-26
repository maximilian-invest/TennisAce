import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RadarChart } from '@/components/RadarChart';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { DOMAIN_LABELS } from '@/content/reasoningDomains';
import { LEVEL_NAMES, t } from '@/domain/catalog';
import type { LevelState, UserProfile } from '@/domain/models';
import { testReasoning } from '@/services/reasoningEngine';
import { useAppStore, useLang } from '@/store/appStore';
import { useTestSession } from '@/store/testSession';
import { useTheme } from '@/theme/ThemeContext';
import { DOMAIN_COLORS, RADII, SPACING } from '@/theme/tokens';

export default function TestResult() {
  const { colors } = useTheme();
  const lang = useLang();
  const result = useTestSession((s) => s.result);
  const sex = useTestSession((s) => s.sex);
  const age = useTestSession((s) => s.age);
  const draft = useAppStore((s) => s.draft);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!result) return;
    setShown(0);
    const target = result.totalScore;
    const interval = setInterval(() => {
      setShown((s) => {
        if (s >= target) {
          clearInterval(interval);
          return target;
        }
        return s + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [result]);

  if (!result) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text>Kein Ergebnis vorhanden.</Text>
        </View>
      </Screen>
    );
  }

  const reasoning = testReasoning({
    totalScore: result.totalScore,
    strongest: result.strongestDomain,
    weakest: result.weakestDomain,
    primaryGoal: draft.goals?.[0],
    lang,
  });

  const finish = () => {
    const profile: UserProfile = {
      name: draft.name ?? '',
      sex,
      age,
      heightCm: draft.heightCm,
      weightKg: draft.weightKg,
      tennisSessionsPerWeek: draft.tennisSessionsPerWeek ?? 0,
      selfRating: draft.selfRating ?? result.level,
      goals: draft.goals ?? [],
      language: lang,
    };
    const levelState: LevelState = {
      currentLevel: result.level,
      progressToNext: 0,
      periodizationPhase: 'offseason',
      source: 'test',
    };
    completeOnboarding({
      profile,
      equipment: draft.equipment ?? { mode: 'none', items: [] },
      health: draft.health ?? { shoulder: false, knee: false, back: false, other: false },
      levelState,
    });
    router.replace('/home');
  };

  return (
    <Screen scroll>
      <Text variant="label" color={colors.dim} center style={styles.kicker}>
        DEIN ERGEBNIS
      </Text>
      <Text style={[styles.score, { color: colors.text }]}>
        {shown}
        <Text style={[styles.scoreMax, { color: colors.dim }]}> / 100</Text>
      </Text>
      <View style={[styles.badge, { backgroundColor: colors.accent }]}>
        <Text variant="bodySemi" color={colors.accentText}>
          {result.level} · {t(LEVEL_NAMES[result.level], lang)}
        </Text>
      </View>

      <View style={styles.radar}>
        <RadarChart scores={result.domainScores} />
      </View>

      <View style={styles.pills}>
        <View style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={[styles.pillDot, { backgroundColor: DOMAIN_COLORS.agility }]} />
          <View>
            <Text variant="label" color={colors.dim}>STÄRKE</Text>
            <Text variant="bodySemi">{DOMAIN_LABELS[result.strongestDomain][lang]}</Text>
          </View>
        </View>
        <View style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={[styles.pillDot, { backgroundColor: colors.secondary }]} />
          <View>
            <Text variant="label" color={colors.dim}>FOKUS</Text>
            <Text variant="bodySemi">{DOMAIN_LABELS[result.weakestDomain][lang]}</Text>
          </View>
        </View>
      </View>

      <Card style={styles.reasoning}>
        <Text variant="heading">Warum genau diese Einstufung?</Text>
        {reasoning.map((s, i) => (
          <Text key={i} variant="body" color={colors.dim}>
            {s}
          </Text>
        ))}
      </Card>

      <Button title="Plan freischalten" onPress={finish} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  kicker: { marginTop: SPACING.sm },
  score: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 72, lineHeight: 78, textAlign: 'center' },
  scoreMax: { fontFamily: 'SpaceGrotesk_500Medium', fontSize: 26 },
  badge: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADII.pill, marginTop: SPACING.sm },
  radar: { alignItems: 'center', marginTop: SPACING.lg },
  pills: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: SPACING.md, borderRadius: RADII.md, borderWidth: 1 },
  pillDot: { width: 10, height: 10, borderRadius: 5 },
  reasoning: { marginTop: SPACING.lg, gap: SPACING.md },
  cta: { marginTop: SPACING.xl },
});
