import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { RadarChart } from '@/components/RadarChart';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { DOMAIN_LABELS } from '@/content/reasoningDomains';
import { LEVEL_NAMES, t } from '@/domain/catalog';
import type { Domain, LevelState, UserProfile } from '@/domain/models';
import { levelProgressWithin } from '@/services/scoringEngine';
import { testReasoning } from '@/services/reasoningEngine';
import { buildTestResult, domainDeltas, isImproved } from '@/services/testHistory';
import { useAppStore, useLang } from '@/store/appStore';
import { useTestSession } from '@/store/testSession';
import { useTheme } from '@/theme/ThemeContext';
import { DOMAIN_COLORS, FONTS, RADII, SPACING } from '@/theme/tokens';

const DOMAIN_ORDER: Domain[] = ['speed', 'agility', 'powerLower', 'powerUpper', 'core', 'aerobic', 'mobility'];

export default function TestResult() {
  const { colors } = useTheme();
  const lang = useLang();
  const result = useTestSession((s) => s.result);
  const raw = useTestSession((s) => s.raw);
  const sex = useTestSession((s) => s.sex);
  const age = useTestSession((s) => s.age);
  const mode = useTestSession((s) => s.mode);
  const monthly = mode === 'monthly';

  const draft = useAppStore((s) => s.draft);
  const levelState = useAppStore((s) => s.levelState);
  const testHistory = useAppStore((s) => s.testHistory);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const addTestResult = useAppStore((s) => s.addTestResult);
  const setLevelState = useAppStore((s) => s.setLevelState);

  const currentLevel = levelState?.currentLevel ?? result?.level ?? 'L1';
  const suggestChange = monthly && !!result && result.level !== currentLevel;
  const [acceptLevel, setAcceptLevel] = useState(true);

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

  const prev = monthly ? testHistory[testHistory.length - 1] : undefined;
  const baseline = monthly && testHistory.length > 0 ? testHistory[0] : undefined;
  const deltas = domainDeltas(result.domainScores, prev?.domainScores);
  const totalDelta = prev ? result.totalScore - prev.totalScore : 0;

  const reasoning = testReasoning({
    totalScore: result.totalScore,
    strongest: result.strongestDomain,
    weakest: result.weakestDomain,
    primaryGoal: draft.goals?.[0],
    lang,
  });

  const finishInitial = () => {
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
    const levelStateNext: LevelState = {
      currentLevel: result.level,
      progressToNext: levelProgressWithin(result.totalScore, result.level),
      periodizationPhase: 'offseason',
      source: 'test',
    };
    completeOnboarding({
      profile,
      equipment: draft.equipment ?? { mode: 'none', items: [] },
      health: draft.health ?? { shoulder: false, knee: false, back: false, other: false },
      levelState: levelStateNext,
    });
    addTestResult(buildTestResult({ score: result, raw, type: 'initial' }));
    router.replace('/home');
  };

  const saveMonthly = () => {
    addTestResult(buildTestResult({ score: result, raw, type: 'monthly' }));
    const targetLevel = suggestChange && acceptLevel ? result.level : currentLevel;
    setLevelState({
      currentLevel: targetLevel,
      progressToNext: levelProgressWithin(result.totalScore, targetLevel),
      periodizationPhase: levelState?.periodizationPhase ?? 'inseason',
      source: 'test',
    });
    router.replace('/progress');
  };

  const up = result.level > currentLevel; // 'L2' > 'L1' lexicographically holds for L1–L4

  return (
    <Screen scroll>
      <Text variant="label" color={colors.dim} center style={styles.kicker}>
        {monthly ? 'MONATSTEST · ERGEBNIS' : 'DEIN ERGEBNIS'}
      </Text>
      <Text style={[styles.score, { color: colors.text }]}>
        {shown}
        <Text style={[styles.scoreMax, { color: colors.dim }]}> / 100</Text>
      </Text>

      {monthly && prev ? (
        <View style={styles.deltaWrap}>
          <View style={[styles.deltaChip, { backgroundColor: totalDelta >= 0 ? `${colors.accent}2E` : `${colors.secondary}26` }]}>
            <Icon name={totalDelta >= 0 ? 'bolt' : 'info'} size={14} color={totalDelta >= 0 ? colors.accentTx : colors.secondary} strokeWidth={2.2} />
            <Text variant="label" color={totalDelta >= 0 ? colors.accentTx : colors.secondary}>
              {totalDelta >= 0 ? '+' : '−'}{Math.abs(totalDelta)} vs. letzter Test
            </Text>
          </View>
        </View>
      ) : null}

      <View style={[styles.badge, { backgroundColor: colors.accent }]}>
        <Text variant="bodySemi" color={colors.accentText}>
          {result.level} · {t(LEVEL_NAMES[result.level], lang)}
        </Text>
      </View>

      <View style={styles.radar}>
        <RadarChart scores={result.domainScores} compare={baseline?.domainScores} />
      </View>
      {monthly && baseline ? (
        <Text variant="small" color={colors.dim} center style={styles.radarNote}>
          Gestrichelt = Eingangstest · Fläche = jetzt
        </Text>
      ) : null}

      {suggestChange ? (
        <View style={[styles.levelCard, { backgroundColor: up ? colors.heroBg : colors.surface, borderColor: up ? colors.accent : colors.line }]}>
          <Text variant="label" color={up ? colors.accent : colors.dim}>
            {up ? 'STUFENAUFSTIEG MÖGLICH' : 'EINSTUFUNG ANPASSEN'}
          </Text>
          <Text variant="heading" color={up ? colors.heroText : colors.text} style={styles.levelCardTitle}>
            {currentLevel} → {result.level} · {t(LEVEL_NAMES[result.level], lang)}
          </Text>
          <View style={styles.levelChoice}>
            <Pressable
              onPress={() => setAcceptLevel(true)}
              style={[styles.choice, { backgroundColor: acceptLevel ? colors.accent : 'transparent', borderColor: acceptLevel ? colors.accent : colors.line }]}
            >
              <Text variant="label" color={acceptLevel ? colors.accentText : up ? colors.heroText : colors.text}>
                {up ? `Auf ${result.level} wechseln` : `${result.level} übernehmen`}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAcceptLevel(false)}
              style={[styles.choice, { backgroundColor: !acceptLevel ? colors.accent : 'transparent', borderColor: !acceptLevel ? colors.accent : colors.line }]}
            >
              <Text variant="label" color={!acceptLevel ? colors.accentText : up ? colors.heroText : colors.text}>
                Bei {currentLevel} bleiben
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {monthly ? (
        <Card style={styles.compare}>
          <Text variant="heading">Domänen im Detail</Text>
          {DOMAIN_ORDER.map((d) => {
            const delta = deltas[d];
            const improved = isImproved(delta);
            return (
              <View key={d} style={styles.compareRow}>
                <View style={[styles.compareDot, { backgroundColor: domainTint(d) }]} />
                <Text variant="body" color={colors.text} style={styles.compareName}>{DOMAIN_LABELS[d][lang]}</Text>
                <Text variant="bodySemi" color={colors.text}>{Math.round(result.domainScores[d])}</Text>
                {prev ? (
                  <Text variant="label" color={delta > 0 ? colors.accentTx : delta < 0 ? colors.secondary : colors.dim} style={styles.compareDelta}>
                    {delta > 0 ? '+' : delta < 0 ? '−' : '±'}{Math.abs(delta)}
                  </Text>
                ) : null}
                {improved ? <Icon name="bolt" size={14} color={colors.accentTx} strokeWidth={2.2} /> : null}
              </View>
            );
          })}
        </Card>
      ) : (
        <>
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
        </>
      )}

      <Button
        title={monthly ? 'Speichern & Fertig' : 'Plan freischalten'}
        onPress={monthly ? saveMonthly : finishInitial}
        style={styles.cta}
      />
    </Screen>
  );
}

function domainTint(d: Domain): string {
  const map: Record<Domain, string> = {
    speed: DOMAIN_COLORS.speed,
    agility: DOMAIN_COLORS.agility,
    powerLower: DOMAIN_COLORS.power,
    powerUpper: DOMAIN_COLORS.strength,
    core: DOMAIN_COLORS.core,
    aerobic: DOMAIN_COLORS.aerobic,
    mobility: DOMAIN_COLORS.mobility,
  };
  return map[d];
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  kicker: { marginTop: SPACING.sm },
  score: { fontFamily: FONTS.display, fontSize: 72, lineHeight: 78, textAlign: 'center' },
  scoreMax: { fontFamily: 'SpaceGrotesk_500Medium', fontSize: 26 },
  deltaWrap: { alignItems: 'center', marginTop: 2 },
  deltaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADII.pill },
  badge: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADII.pill, marginTop: SPACING.sm },
  radar: { alignItems: 'center', marginTop: SPACING.lg },
  radarNote: { marginTop: 2 },

  levelCard: { marginTop: SPACING.lg, padding: 18, borderRadius: RADII.lg, borderWidth: 1.5 },
  levelCardTitle: { marginTop: 6 },
  levelChoice: { flexDirection: 'row', gap: 8, marginTop: 14 },
  choice: { flex: 1, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },

  compare: { marginTop: SPACING.lg, gap: SPACING.sm },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  compareDot: { width: 9, height: 9, borderRadius: 5 },
  compareName: { flex: 1 },
  compareDelta: { minWidth: 30, textAlign: 'right' },

  pills: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: SPACING.md, borderRadius: RADII.md, borderWidth: 1 },
  pillDot: { width: 10, height: 10, borderRadius: 5 },
  reasoning: { marginTop: SPACING.lg, gap: SPACING.md },
  cta: { marginTop: SPACING.xl },
});
