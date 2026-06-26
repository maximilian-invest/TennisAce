import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { LEVEL_NAMES, t } from '@/domain/catalog';
import type { Level, PeriodizationPhase } from '@/domain/models';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { DOMAIN_COLORS, FONTS, RADII } from '@/theme/tokens';

const DAY_LETTERS = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];
const LEVEL_ORDER: Level[] = ['L1', 'L2', 'L3', 'L4'];

const PHASES: { id: PeriodizationPhase; label: string; desc: string }[] = [
  { id: 'offseason', label: 'Off-Season', desc: 'Off-Season: Volumen hoch, Grundlagen & Kraftaufbau.' },
  { id: 'preseason', label: 'Pre-Season', desc: 'Pre-Season: Power & Schnelligkeit, Intensität rauf.' },
  { id: 'inseason', label: 'In-Season', desc: 'In-Season: Kraft mikro-dosiert, Prehab-Fokus, frisch für den Wettkampf.' },
  { id: 'transition', label: 'Transition', desc: 'Transition: aktive Erholung & Deload.' },
];

// Sample week plan (real plan generation arrives with the research data).
const SAMPLE_PLAN = [
  { title: 'Kraft Unterkörper + Core', meta: '45 Min · Heim', color: DOMAIN_COLORS.strength, rest: false },
  { title: 'Agilität + Speed', meta: '30 Min · Court', color: DOMAIN_COLORS.agility, rest: false },
  { title: 'Ruhetag', meta: 'Aktive Erholung', color: null, rest: true },
  { title: 'Kraft Oberkörper + Power', meta: '45 Min · Heim', color: DOMAIN_COLORS.power, rest: false },
  { title: 'Kondition · Intervalle', meta: '25 Min', color: DOMAIN_COLORS.aerobic, rest: false },
  { title: 'Mobility + Prehab', meta: '20 Min', color: DOMAIN_COLORS.mobility, rest: false },
  { title: 'Ruhetag', meta: 'Aktive Erholung', color: null, rest: true },
];

export default function PlanTab() {
  const { colors } = useTheme();
  const lang = useLang();
  const levelState = useAppStore((s) => s.levelState);

  const level = levelState?.currentLevel ?? 'L1';
  const nextLevel = LEVEL_ORDER[Math.min(3, LEVEL_ORDER.indexOf(level) + 1)];
  const progress = levelState?.progressToNext ?? 0;
  const activePhase = levelState?.periodizationPhase ?? 'inseason';
  const phaseDesc = PHASES.find((p) => p.id === activePhase)?.desc ?? PHASES[2].desc;

  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const days = DAY_LETTERS.map((letter, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { letter, date: d.getDate(), isToday: d.toDateString() === now.toDateString(), ...SAMPLE_PLAN[i] };
  });

  return (
    <Screen scroll padded={false} contentStyle={styles.content}>
      <View style={styles.head}>
        <Text variant="label" color={colors.dim}>DEIN TRAININGSPLAN</Text>
        <Text style={[styles.title, { color: colors.text }]}>Diese Woche</Text>
      </View>

      {/* Level banner */}
      <View style={[styles.banner, { backgroundColor: colors.heroBg }]}>
        <View style={styles.bannerTop}>
          <View>
            <Text style={[styles.bannerKicker, { color: colors.heroText }]}>AKTUELLE STUFE</Text>
            <Text style={[styles.bannerLevel, { color: colors.heroText }]}>
              {level} · {t(LEVEL_NAMES[level], lang)}
            </Text>
          </View>
          <Text style={[styles.bannerPct, { color: colors.heroText }]}>{progress}%</Text>
        </View>
        <View style={styles.bannerTrack}>
          <View style={[styles.bannerFill, { width: `${progress}%` }]} />
        </View>
        <Text style={[styles.bannerNote, { color: colors.heroText }]}>
          Noch ein paar Einheiten & 1 bestandener Monatstest bis {nextLevel}.
        </Text>
      </View>

      {/* Periodization */}
      <View style={styles.section}>
        <Text variant="label" color={colors.dim} style={styles.sectionLabel}>PERIODISIERUNG</Text>
        <View style={styles.phases}>
          {PHASES.map((p) => {
            const active = p.id === activePhase;
            return (
              <View key={p.id} style={[styles.phase, { backgroundColor: active ? colors.accent : colors.surface2 }]}>
                <Text variant="label" color={active ? colors.accentText : colors.dim} style={styles.phaseLabel}>
                  {p.label}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={[styles.phaseDesc, { backgroundColor: colors.surface2 }]}>
          <Icon name="info" size={16} color={colors.accentTx} strokeWidth={2} />
          <Text variant="small" color={colors.text} style={styles.phaseDescText}>{phaseDesc}</Text>
        </View>
      </View>

      {/* Week calendar */}
      <View style={[styles.section, styles.calHead]}>
        <Text style={[styles.calTitle, { color: colors.text }]}>Wochenkalender</Text>
      </View>
      <View style={styles.cal}>
        {days.map((d, i) => (
          <View key={i} style={styles.dayRow}>
            <View style={styles.dayCol}>
              <Text style={[styles.dayLetter, { color: d.isToday ? colors.accentTx : colors.dim }]}>{d.letter}</Text>
              <Text style={[styles.dayDate, { color: colors.text }]}>{d.date}</Text>
            </View>
            <View
              style={[
                styles.session,
                { backgroundColor: colors.surface, borderColor: d.isToday ? colors.accent : colors.line, opacity: d.rest ? 0.6 : 1 },
              ]}
            >
              <View style={[styles.sessionBar, { backgroundColor: d.color ?? colors.line }]} />
              <View style={styles.flex}>
                <Text variant="bodySemi" color={colors.text} style={styles.sessionTitle}>{d.title}</Text>
                <Text variant="small" color={colors.dim}>{d.meta}</Text>
              </View>
              {d.isToday ? <Text style={[styles.todayBadge, { color: colors.accentTx }]}>HEUTE</Text> : null}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 110 },
  flex: { flex: 1 },
  head: { paddingHorizontal: 24, paddingTop: 4 },
  title: { fontFamily: FONTS.display, fontSize: 29, marginTop: 4, letterSpacing: -0.3 },

  banner: { marginHorizontal: 22, marginTop: 16, borderRadius: 20, padding: 20 },
  bannerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerKicker: { fontFamily: FONTS.bodyBold, fontSize: 11, letterSpacing: 1.3, opacity: 0.8 },
  bannerLevel: { fontFamily: FONTS.display, fontSize: 23, marginTop: 4 },
  bannerPct: { fontFamily: FONTS.display, fontSize: 34, opacity: 0.9 },
  bannerTrack: { marginTop: 14, height: 7, borderRadius: 5, backgroundColor: 'rgba(242,244,234,0.22)', overflow: 'hidden' },
  bannerFill: { height: 7, borderRadius: 5, backgroundColor: '#F2F4EA' },
  bannerNote: { fontFamily: FONTS.body, fontSize: 11.5, opacity: 0.78, marginTop: 8 },

  section: { marginHorizontal: 24, marginTop: 22 },
  sectionLabel: { letterSpacing: 1.3, marginBottom: 10 },
  phases: { flexDirection: 'row', gap: 6 },
  phase: { flex: 1, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  phaseLabel: { fontSize: 10 },
  phaseDesc: { flexDirection: 'row', gap: 9, marginTop: 11, padding: 13, borderRadius: 13, alignItems: 'flex-start' },
  phaseDescText: { flex: 1, lineHeight: 18 },

  calHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  calTitle: { fontFamily: FONTS.display, fontSize: 19 },
  cal: { paddingHorizontal: 22, gap: 9 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dayCol: { width: 30, alignItems: 'center' },
  dayLetter: { fontFamily: FONTS.bodySemi, fontSize: 11 },
  dayDate: { fontFamily: FONTS.display, fontSize: 15, marginTop: 2 },
  session: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, padding: 13, overflow: 'hidden' },
  sessionBar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  sessionTitle: { fontSize: 14 },
  todayBadge: { fontFamily: FONTS.bodyBold, fontSize: 9.5, letterSpacing: 0.6 },
});
