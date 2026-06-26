import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { RadarChart } from '@/components/RadarChart';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { TEST_STATIONS } from '@/content/tests';
import { DOMAIN_LABELS } from '@/content/reasoningDomains';
import { LEVEL_NAMES, t } from '@/domain/catalog';
import type { Domain, Level } from '@/domain/models';
import { domainDeltas, isImproved, stationHigherIsBetter, trendForStation } from '@/services/testHistory';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { DOMAIN_COLORS, FONTS, RADII } from '@/theme/tokens';

const DOMAIN_ORDER: Domain[] = ['speed', 'agility', 'powerLower', 'powerUpper', 'core', 'aerobic', 'mobility'];
const LEVEL_ORDER: Level[] = ['L1', 'L2', 'L3', 'L4'];
const DOMAIN_TINT: Record<Domain, string> = {
  speed: DOMAIN_COLORS.speed,
  agility: DOMAIN_COLORS.agility,
  powerLower: DOMAIN_COLORS.power,
  powerUpper: DOMAIN_COLORS.strength,
  core: DOMAIN_COLORS.core,
  aerobic: DOMAIN_COLORS.aerobic,
  mobility: DOMAIN_COLORS.mobility,
};

const mondayOf = (d: Date) => {
  const m = new Date(d);
  m.setHours(0, 0, 0, 0);
  m.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return m;
};

export default function ProgressTab() {
  const { colors } = useTheme();
  const lang = useLang();
  const testHistory = useAppStore((s) => s.testHistory);
  const workoutLog = useAppStore((s) => s.workoutLog);
  const levelState = useAppStore((s) => s.levelState);

  const latest = testHistory[testHistory.length - 1];
  const baseline = testHistory.length > 1 ? testHistory[0] : undefined;

  // Training streak & weekly compliance from the workout log.
  const now = new Date();
  const thisMonday = mondayOf(now).getTime();
  const weekSet = new Set(workoutLog.map((e) => mondayOf(new Date(e.date)).getTime()));
  const sessionsThisWeek = workoutLog.filter((e) => mondayOf(new Date(e.date)).getTime() === thisMonday).length;
  let weekStreak = 0;
  for (let cursor = thisMonday; weekSet.has(cursor); cursor -= 7 * 86400000) weekStreak += 1;

  return (
    <Screen scroll padded={false} contentStyle={styles.content}>
      <View style={styles.head}>
        <Text variant="label" color={colors.dim}>FORTSCHRITT</Text>
        <Text style={[styles.title, { color: colors.text }]}>Deine Entwicklung</Text>
      </View>

      {!latest ? (
        <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={[styles.emptyIcon, { backgroundColor: `${colors.accent}26` }]}>
            <Icon name="bolt" size={26} color={colors.accentTx} strokeWidth={2} />
          </View>
          <Text variant="heading" color={colors.text} center>Noch keine Testdaten</Text>
          <Text variant="small" color={colors.dim} center style={styles.emptyNote}>
            Mach deinen Leistungstest – danach siehst du hier dein Radar, Verlaufskurven und Stufen-Fortschritt.
          </Text>
          <Pressable onPress={() => router.push('/test/intro')} style={({ pressed }) => [styles.cta, { backgroundColor: colors.accent, transform: [{ translateY: pressed ? 1 : 0 }] }]}>
            <Text variant="bodySemi" color={colors.accentText}>Leistungstest starten</Text>
            <Icon name="arrowRight" size={18} color={colors.accentText} strokeWidth={2.3} />
          </Pressable>
        </View>
      ) : (
        <>
          {/* Radar now vs baseline */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <View style={styles.radarHead}>
              <Text variant="bodySemi" color={colors.text}>Leistungsprofil</Text>
              <Text variant="small" color={colors.dim}>{testHistory.length}× getestet</Text>
            </View>
            <View style={styles.radarWrap}>
              <RadarChart scores={latest.domainScores} compare={baseline?.domainScores} size={264} />
            </View>
            {baseline ? (
              <View style={styles.legend}>
                <View style={styles.legendItem}><View style={[styles.legendSwatch, { backgroundColor: colors.accent }]} /><Text variant="small" color={colors.dim}>Jetzt</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDash, { borderColor: colors.dim }]} /><Text variant="small" color={colors.dim}>Eingangstest</Text></View>
              </View>
            ) : null}
          </View>

          {/* Score + level progress */}
          <LevelCard latest={latest} levelState={levelState} colors={colors} lang={lang} />

          {/* Domain deltas since baseline */}
          {baseline ? (
            <View style={styles.section}>
              <Text variant="label" color={colors.dim} style={styles.sectionLabel}>SEIT DEM EINGANGSTEST</Text>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                {DOMAIN_ORDER.map((d, i) => {
                  const delta = domainDeltas(latest.domainScores, baseline.domainScores)[d];
                  return (
                    <View key={d} style={[styles.domRow, i > 0 && { borderTopColor: colors.line, borderTopWidth: 1 }]}>
                      <View style={[styles.domDot, { backgroundColor: DOMAIN_TINT[d] }]} />
                      <Text variant="body" color={colors.text} style={styles.flex}>{DOMAIN_LABELS[d][lang]}</Text>
                      <Text variant="bodySemi" color={colors.text}>{Math.round(latest.domainScores[d])}</Text>
                      <Text variant="label" color={delta > 0 ? colors.accentTx : delta < 0 ? colors.secondary : colors.dim} style={styles.domDelta}>
                        {delta > 0 ? '+' : delta < 0 ? '−' : '±'}{Math.abs(delta)}
                      </Text>
                      {isImproved(delta) ? <Icon name="bolt" size={14} color={colors.accentTx} strokeWidth={2.2} /> : <View style={styles.boltSpacer} />}
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}

          {/* Per-test trends */}
          <View style={styles.section}>
            <Text variant="label" color={colors.dim} style={styles.sectionLabel}>VERLAUFSKURVEN</Text>
            <View style={styles.trends}>
              {TEST_STATIONS.map((st) => {
                const trend = trendForStation(testHistory, st.key);
                if (trend.length === 0) return null;
                const values = trend.map((p) => p.value);
                const latestVal = values[values.length - 1];
                const firstVal = values[0];
                const higher = stationHigherIsBetter(st.key);
                const better = values.length > 1 && (higher ? latestVal > firstVal : latestVal < firstVal);
                const worse = values.length > 1 && (higher ? latestVal < firstVal : latestVal > firstVal);
                const tint = better ? colors.accentTx : worse ? colors.secondary : colors.dim;
                return (
                  <View key={st.key} style={[styles.trendCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                    <Text variant="small" color={colors.dim} numberOfLines={1}>{st.name.de}</Text>
                    <View style={styles.trendValRow}>
                      <Text style={[styles.trendVal, { color: colors.text }]}>{latestVal}</Text>
                      <Text variant="small" color={colors.dim}>{st.unit}</Text>
                    </View>
                    <Sparkline values={values} color={tint} />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Training compliance */}
          <View style={styles.section}>
            <Text variant="label" color={colors.dim} style={styles.sectionLabel}>TRAINING</Text>
            <View style={styles.statRow}>
              <StatTile value={String(sessionsThisWeek)} label="Diese Woche" tint={colors.accentTx} colors={colors} />
              <StatTile value={String(weekStreak)} label="Wochen-Streak" tint={colors.secondary} colors={colors} />
              <StatTile value={String(workoutLog.length)} label="Einheiten gesamt" tint={DOMAIN_COLORS.speed} colors={colors} />
            </View>
          </View>

          <Pressable onPress={() => router.push('/test/intro')} style={({ pressed }) => [styles.monthlyCta, { backgroundColor: colors.heroBg, transform: [{ translateY: pressed ? 1 : 0 }] }]}>
            <Icon name="calendar" size={20} color={colors.accent} strokeWidth={2} />
            <View style={styles.flex}>
              <Text variant="bodySemi" color={colors.heroText}>Monatstest machen</Text>
              <Text variant="small" color={colors.heroText} style={styles.monthlyCtaSub}>Neu vermessen & Stufe bestätigen</Text>
            </View>
            <Icon name="chevronRight" size={20} color={colors.heroText} />
          </Pressable>
        </>
      )}
    </Screen>
  );
}

function LevelCard({ latest, levelState, colors, lang }: {
  latest: { totalScore: number; level: Level };
  levelState: ReturnType<typeof useAppStore.getState>['levelState'];
  colors: ReturnType<typeof useTheme>['colors'];
  lang: ReturnType<typeof useLang>;
}) {
  const level = levelState?.currentLevel ?? latest.level;
  const progress = levelState?.progressToNext ?? 0;
  const nextLevel = LEVEL_ORDER[Math.min(3, LEVEL_ORDER.indexOf(level) + 1)];
  const atMax = level === 'L4';
  return (
    <View style={[styles.levelCard, { backgroundColor: colors.heroBg }]}>
      <View style={styles.levelTop}>
        <View>
          <Text variant="label" color={colors.heroText} style={styles.levelKicker}>GESAMTSCORE · STUFE {level}</Text>
          <Text style={[styles.levelName, { color: colors.heroText }]}>{t(LEVEL_NAMES[level], lang)}</Text>
        </View>
        <Text style={[styles.levelScore, { color: colors.accent }]}>{latest.totalScore}</Text>
      </View>
      <View style={styles.levelTrack}>
        <View style={[styles.levelFill, { width: `${progress}%` }]} />
      </View>
      <Text variant="small" color={colors.heroText} style={styles.levelNote}>
        {atMax ? 'Endlos-Modus – Volumen & Reaktivität steigen weiter.' : `${progress}% bis ${nextLevel}`}
      </Text>
    </View>
  );
}

function StatTile({ value, label, tint, colors }: { value: string; label: string; tint: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={[styles.statTile, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Text style={[styles.statVal, { color: tint }]}>{value}</Text>
      <Text variant="small" color={colors.dim} center>{label}</Text>
    </View>
  );
}

function Sparkline({ values, color, width = 96, height = 30 }: { values: number[]; color: string; width?: number; height?: number }) {
  if (values.length < 2) {
    return (
      <Svg width={width} height={height}>
        <Polyline points={`0,${height - 4} ${width},${height - 4}`} fill="none" stroke={color} strokeWidth={2} strokeDasharray="3 3" opacity={0.5} />
      </Svg>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - 3 - ((v - min) / span) * (height - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <Svg width={width} height={height}>
      <Polyline points={pts} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120, paddingHorizontal: 22 },
  flex: { flex: 1 },
  head: { paddingHorizontal: 2, paddingTop: 4 },
  title: { fontFamily: FONTS.display, fontSize: 29, marginTop: 4, letterSpacing: -0.3 },

  empty: { marginTop: 24, borderWidth: 1, borderRadius: 22, padding: 24, alignItems: 'center' },
  emptyIcon: { width: 56, height: 56, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyNote: { marginTop: 8, lineHeight: 19 },
  cta: { height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 18, alignSelf: 'stretch' },

  card: { borderWidth: 1, borderRadius: 22, padding: 18, marginTop: 16 },
  radarHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  radarWrap: { alignItems: 'center', marginTop: 6 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 14, height: 8, borderRadius: 3 },
  legendDash: { width: 14, height: 0, borderTopWidth: 2, borderStyle: 'dashed' },

  levelCard: { borderRadius: 22, padding: 20, marginTop: 16 },
  levelTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  levelKicker: { opacity: 0.85, letterSpacing: 1.2 },
  levelName: { fontFamily: FONTS.display, fontSize: 23, marginTop: 4 },
  levelScore: { fontFamily: FONTS.display, fontSize: 40, lineHeight: 42 },
  levelTrack: { marginTop: 16, height: 8, borderRadius: 5, backgroundColor: 'rgba(242,244,234,0.2)', overflow: 'hidden' },
  levelFill: { height: 8, borderRadius: 5, backgroundColor: '#C2F23D' },
  levelNote: { opacity: 0.8, marginTop: 9 },

  section: { marginTop: 22 },
  sectionLabel: { letterSpacing: 1.3, marginBottom: 10, paddingHorizontal: 2 },

  domRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  domDot: { width: 9, height: 9, borderRadius: 5 },
  domDelta: { minWidth: 28, textAlign: 'right' },
  boltSpacer: { width: 14 },

  trends: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  trendCard: { width: '47.5%', borderWidth: 1, borderRadius: 18, padding: 14 },
  trendValRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 6, marginBottom: 8 },
  trendVal: { fontFamily: FONTS.display, fontSize: 22 },

  statRow: { flexDirection: 'row', gap: 11 },
  statTile: { flex: 1, borderWidth: 1, borderRadius: 18, paddingVertical: 16, alignItems: 'center', gap: 5 },
  statVal: { fontFamily: FONTS.display, fontSize: 26 },

  monthlyCta: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, borderRadius: 18, marginTop: 24 },
  monthlyCtaSub: { opacity: 0.78, marginTop: 1 },
});
