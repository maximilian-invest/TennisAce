import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { CourtLines } from '@/components/CourtLines';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { EQUIPMENT_MODES, LEVEL_NAMES, t } from '@/domain/catalog';
import type { Domain, Level } from '@/domain/models';
import { generateWeekPlan } from '@/services/personalization/planGenerator';
import { coachCopy } from '@/services/personalization/tonality';
import { useAppStore, useLang } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme/ThemeContext';
import { DOMAIN_COLORS, FONTS, RADII } from '@/theme/tokens';

const WEEKDAYS_DE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const DAY_LETTERS = ['M', 'D', 'M', 'D', 'F', 'S', 'S']; // Mon–Sun
const WEEK_MARKS = [DOMAIN_COLORS.strength, null, DOMAIN_COLORS.speed, null, DOMAIN_COLORS.power, null, null];
const LEVEL_ORDER: Level[] = ['L1', 'L2', 'L3', 'L4'];
const DOMAIN_COLOR: Record<Domain, string> = {
  speed: DOMAIN_COLORS.speed,
  agility: DOMAIN_COLORS.agility,
  powerLower: DOMAIN_COLORS.power,
  powerUpper: DOMAIN_COLORS.strength,
  core: DOMAIN_COLORS.core,
  aerobic: DOMAIN_COLORS.aerobic,
  mobility: DOMAIN_COLORS.mobility,
};

export default function Home() {
  const { colors } = useTheme();
  const lang = useLang();
  const profile = useAppStore((s) => s.profile);
  const levelState = useAppStore((s) => s.levelState);
  const workoutLog = useAppStore((s) => s.workoutLog);
  const testHistory = useAppStore((s) => s.testHistory);
  const isPremium = useAppStore((s) => s.isPremium);
  const health = useAppStore((s) => s.health);
  const equipment = useAppStore((s) => s.equipment);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const authStatus = useAuthStore((s) => s.status);
  const authUser = useAuthStore((s) => s.user);
  const de = lang === 'de';

  const now = new Date();
  const hour = now.getHours();
  const greet = de
    ? hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
    : hour < 11 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateline = de
    ? `${WEEKDAYS_DE[now.getDay()]}, ${now.getDate()}. ${MONTHS_DE[now.getMonth()]}`
    : now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  // Monday-based current week
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const week = DAY_LETTERS.map((letter, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { letter, date: d.getDate(), isToday: d.toDateString() === now.toDateString(), mark: WEEK_MARKS[i] };
  });

  const level = levelState?.currentLevel ?? 'L1';
  const nextLevel = LEVEL_ORDER[Math.min(3, LEVEL_ORDER.indexOf(level) + 1)];
  const progress = levelState?.progressToNext ?? 0;

  // Real week-streak from the workout log.
  const mondayOf = (d: Date) => {
    const m = new Date(d);
    m.setHours(0, 0, 0, 0);
    m.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return m.getTime();
  };
  const weekSet = new Set(workoutLog.map((e) => mondayOf(new Date(e.date))));
  let weekStreak = 0;
  for (let cursor = mondayOf(now); weekSet.has(cursor); cursor -= 7 * 86400000) weekStreak += 1;

  const lastTest = testHistory[testHistory.length - 1];
  const daysSinceTest = lastTest ? Math.floor((now.getTime() - new Date(lastTest.date).getTime()) / 86400000) : null;
  const monthlySub = daysSinceTest == null
    ? (de ? 'genaue Einstufung' : 'exact rating')
    : daysSinceTest >= 30
      ? (de ? 'jetzt fällig · genaue Einstufung' : 'due now · exact rating')
      : (de ? `in ${30 - daysSinceTest} Tagen · genaue Einstufung` : `in ${30 - daysSinceTest} days · exact rating`);

  // Nudge guests to secure their account once they have progress to lose.
  const secured = authStatus === 'signedIn' && authUser != null && !authUser.is_anonymous;
  const showSecure = !secured && (testHistory.length > 0 || workoutLog.length > 0);

  // First performance test is free; monthly retests are ACE Pro.
  const lockedTest = !isPremium && testHistory.length > 0;

  // Forgiving comeback: after a gap, welcome back — never shame the lapse.
  const lastWorkout = workoutLog.length ? workoutLog[workoutLog.length - 1].date : null;
  const gapDays = lastWorkout ? Math.floor((now.getTime() - new Date(lastWorkout).getTime()) / 86400000) : 0;
  const comeback = lastWorkout != null && gapDays >= 10;

  // Personalized "today" from the engine.
  const plan = profile
    ? generateWeekPlan({
        age: profile.age, level, goals: profile.goals, health,
        tennisDays: profile.tennisDays, trainingDaysPerWeek: profile.trainingDaysPerWeek,
        weakest: testHistory[testHistory.length - 1]?.weakestDomain, lang,
      })
    : null;
  const todayIdx = (now.getDay() + 6) % 7; // Mon=0
  const todaySession = plan?.week[todayIdx] ?? null;
  const isTennisToday = (profile?.tennisDays ?? []).includes(todayIdx + 1);
  const marks = plan ? plan.week.map((s) => (s ? DOMAIN_COLOR[s.domain] : null)) : WEEK_MARKS;
  const coach = profile ? coachCopy(profile.age, lang) : null;
  const equipLabel = equipment ? t(EQUIPMENT_MODES.find((m) => m.id === equipment.mode)?.label ?? EQUIPMENT_MODES[0].label, lang) : (de ? 'Athletik' : 'Athletic');

  // The hero's headline session: tennis-day activation, a training session, or active recovery.
  const hero = isTennisToday
    ? { kicker: de ? 'HEUTE SPIELST DU' : 'YOU PLAY TODAY', title: de ? 'Aktivierung vor dem Match' : 'Pre-match activation', meta: de ? '5 Min · frisch bleiben' : '5 min · stay fresh', color: DOMAIN_COLORS.mobility, cta: de ? 'Aktivierung starten' : 'Start activation' }
    : todaySession
      ? { kicker: coach?.planKicker ?? (de ? 'HEUTIGE EINHEIT' : "TODAY'S SESSION"), title: todaySession.title, meta: todaySession.meta, color: DOMAIN_COLOR[todaySession.domain], cta: de ? 'Einheit starten' : 'Start session' }
      : { kicker: de ? 'RUHETAG' : 'REST DAY', title: de ? 'Aktive Erholung · Mobilität' : 'Active recovery · mobility', meta: de ? '15 Min · locker' : '15 min · easy', color: DOMAIN_COLORS.mobility, cta: de ? 'Mobilität starten' : 'Start mobility' };

  return (
    <Screen scroll padded={false} contentStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.heroBg }]}>
            <Text style={[styles.avatarText, { color: colors.heroText }]}>
              {(profile?.name || 'A').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text variant="label" color={colors.dim}>{dateline}</Text>
            <Text style={[styles.greet, { color: colors.text }]}>
              {greet}{profile?.name ? `, ${profile.name}` : ''}
            </Text>
          </View>
        </View>
        <View style={[styles.langToggle, { backgroundColor: colors.surface2 }]}>
          {(['de', 'en'] as const).map((l) => {
            const active = lang === l;
            return (
              <Pressable key={l} onPress={() => setLanguage(l)} style={[styles.langBtn, active && { backgroundColor: colors.accent }]}>
                <Text variant="label" color={active ? colors.accentText : colors.dim}>{l.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Week strip */}
      <View style={[styles.week, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        {week.map((d, i) => (
          <View key={i} style={[styles.dayPill, d.isToday && { backgroundColor: colors.accent }]}>
            <Text style={[styles.dayLetter, { color: d.isToday ? colors.accentText : colors.dim }]}>{d.letter}</Text>
            <Text style={[styles.dayDate, { color: d.isToday ? colors.accentText : colors.text }]}>{d.date}</Text>
            <View style={[styles.dayMark, { backgroundColor: marks[i] ?? 'transparent' }]} />
          </View>
        ))}
      </View>

      {/* Today hero card */}
      <View style={[styles.hero, { backgroundColor: colors.heroBg }]}>
        <CourtLines color={colors.heroText} />
        <View style={styles.heroInner}>
          <View style={styles.heroTop}>
            <Text style={[styles.heroKicker, { color: colors.heroText }]}>{hero.kicker}</Text>
            <View style={styles.heroPill}>
              <Text variant="label" color={colors.heroText}>{equipLabel}</Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: colors.heroText }]}>{hero.title}</Text>
          <View style={styles.heroMeta}>
            <Meta color={hero.color} label={hero.meta} heroText={colors.heroText} />
          </View>
          {coach ? <Text style={[styles.coachLine, { color: colors.heroText }]}>{coach.coachLine}</Text> : null}
          <Pressable
            onPress={() => router.push('/workout')}
            style={({ pressed }) => [styles.playBtn, { backgroundColor: colors.accent, transform: [{ translateY: pressed ? 1 : 0 }] }]}
          >
            <Icon name="play" size={20} color={colors.accentText} />
            <Text style={[styles.playText, { color: colors.accentText }]}>{hero.cta}</Text>
          </Pressable>
          <Pressable onPress={() => router.push({ pathname: '/workout', params: { short: '1' } })} style={styles.shortLink} hitSlop={6}>
            <Text style={[styles.shortLinkText, { color: colors.heroText }]}>{de ? 'Wenig Zeit? Kurzversion ≈ 12 Min' : 'Short on time? ≈ 12-min version'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Forgiving comeback (after a gap) */}
      {comeback ? (
        <Pressable onPress={() => router.push({ pathname: '/workout', params: { short: '1' } })} style={[styles.secure, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Icon name="bolt" size={20} color={colors.accentTx} strokeWidth={2.2} />
          <View style={styles.flex}>
            <Text variant="bodySemi" color={colors.text}>{de ? 'Willkommen zurück!' : 'Welcome back!'}</Text>
            <Text variant="small" color={colors.dim}>{de ? 'Kein Stress – 10 Minuten heute halten dich im Rhythmus.' : 'No pressure – 10 minutes today keeps your rhythm.'}</Text>
          </View>
          <Icon name="chevronRight" size={20} color={colors.dim} />
        </Pressable>
      ) : null}

      {/* Secure-account nudge (guests with progress) */}
      {showSecure ? (
        <Pressable onPress={() => router.push('/auth/sign-in')} style={[styles.secure, { backgroundColor: `${colors.accent}1F`, borderColor: colors.accent }]}>
          <Icon name="bolt" size={20} color={colors.accentTx} strokeWidth={2.2} />
          <View style={styles.flex}>
            <Text variant="bodySemi" color={colors.text}>{de ? 'Sichere deinen Fortschritt' : 'Secure your progress'}</Text>
            <Text variant="small" color={colors.dim}>{de ? 'E-Mail anhängen – dann auf jedem Gerät da' : 'Add an email – then on every device'}</Text>
          </View>
          <Icon name="chevronRight" size={20} color={colors.dim} />
        </Pressable>
      ) : null}

      {/* Today stats */}
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{de ? 'Heute' : 'Today'}</Text>
        <Pressable onPress={() => router.push('/progress')}>
          <Text variant="label" color={colors.accentTx}>{de ? 'Mehr ›' : 'More ›'}</Text>
        </Pressable>
      </View>
      <View style={styles.stats}>
        <Stat icon="steps" tint={DOMAIN_COLORS.speed} value="1.840" label={de ? 'Schritte' : 'Steps'} />
        <Stat icon="flame" tint={colors.secondary} value="328" label="kcal" filled />
        <Stat icon="bolt" tint={colors.accentTx} value={String(weekStreak)} label="Streak" filled />
      </View>

      {/* Level card */}
      <Pressable onPress={() => router.push('/progress')} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <View style={styles.levelRow}>
          <View style={styles.levelLeft}>
            <View style={[styles.levelBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.levelBadgeText, { color: colors.accentText }]}>{level}</Text>
            </View>
            <View>
              <Text variant="bodySemi" color={colors.text}>{t(LEVEL_NAMES[level], lang)}</Text>
              <Text variant="small" color={colors.dim}>
                {progress}% {de ? `bis ${nextLevel}` : `to ${nextLevel}`}
              </Text>
            </View>
          </View>
          <Text style={[styles.levelPct, { color: colors.text }]}>{progress}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.surface2 }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${progress}%` }]} />
        </View>
      </Pressable>

      {/* Monthly test card (Pro after the first free test) */}
      <Pressable onPress={() => router.push(lockedTest ? '/paywall' : '/test/intro')} style={[styles.card, styles.monthly, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <View style={[styles.monthlyIcon, { backgroundColor: hexTint(colors.secondary) }]}>
          <Icon name="calendar" size={22} color={colors.secondary} strokeWidth={1.9} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodySemi" color={colors.text}>{de ? 'Monatstest' : 'Monthly test'}</Text>
          <Text variant="small" color={colors.dim}>{monthlySub}</Text>
        </View>
        {lockedTest ? (
          <View style={[styles.proPill, { backgroundColor: colors.accent }]}>
            <Text variant="label" color={colors.accentText}>PRO</Text>
          </View>
        ) : (
          <Icon name="chevronRight" size={20} color={colors.dim} />
        )}
      </Pressable>
    </Screen>
  );
}

function Meta({ color, label, heroText }: { color: string; label: string; heroText: string }) {
  return (
    <View style={styles.metaItem}>
      <View style={[styles.metaDot, { backgroundColor: color }]} />
      <Text style={[styles.metaLabel, { color: heroText }]}>{label}</Text>
    </View>
  );
}

function Stat({ icon, tint, value, label, filled }: { icon: 'steps' | 'flame' | 'bolt'; tint: string; value: string; label: string; filled?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <View style={[styles.statIcon, { backgroundColor: hexTint(tint) }]}>
        <Icon name={icon} size={17} color={tint} strokeWidth={1.9} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text variant="small" color={colors.dim}>{label}</Text>
    </View>
  );
}

/** ~15% tint of a hex colour for icon backgrounds. */
function hexTint(hex: string): string {
  return `${hex}26`;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 110 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 4 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONTS.display, fontSize: 19 },
  greet: { fontFamily: FONTS.display, fontSize: 22, lineHeight: 24, letterSpacing: -0.2, marginTop: 1 },
  langToggle: { flexDirection: 'row', borderRadius: 11, padding: 3 },
  langBtn: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 8 },

  week: { flexDirection: 'row', gap: 2, marginHorizontal: 22, marginTop: 20, borderWidth: 1, borderRadius: 20, padding: 8 },
  dayPill: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 14, gap: 4 },
  dayLetter: { fontFamily: FONTS.bodySemi, fontSize: 11 },
  dayDate: { fontFamily: FONTS.display, fontSize: 16 },
  dayMark: { width: 5, height: 5, borderRadius: 3 },

  hero: { marginHorizontal: 22, marginTop: 16, borderRadius: 24, overflow: 'hidden' },
  heroInner: { padding: 22 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroKicker: { fontFamily: FONTS.bodySemi, fontSize: 10.5, letterSpacing: 1.4, opacity: 0.82 },
  heroPill: { backgroundColor: 'rgba(242,244,234,0.16)', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20 },
  heroTitle: { fontFamily: FONTS.display, fontSize: 27, lineHeight: 30, marginTop: 10 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 13 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaDot: { width: 8, height: 8, borderRadius: 4 },
  metaLabel: { fontFamily: FONTS.bodySemi, fontSize: 13, opacity: 0.9 },
  heroMetaDim: { fontFamily: FONTS.bodySemi, fontSize: 13, opacity: 0.7 },
  coachLine: { fontFamily: FONTS.body, fontSize: 12.5, lineHeight: 17, opacity: 0.8, marginTop: 11 },
  playBtn: { marginTop: 16, height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  playText: { fontFamily: FONTS.bodyBold, fontSize: 15.5 },
  shortLink: { alignItems: 'center', marginTop: 11 },
  shortLinkText: { fontFamily: FONTS.bodySemi, fontSize: 12.5, opacity: 0.72 },

  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 24 },
  sectionTitle: { fontFamily: FONTS.display, fontSize: 17 },
  stats: { flexDirection: 'row', gap: 11, marginHorizontal: 22, marginTop: 13 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 14 },
  statIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontFamily: FONTS.display, fontSize: 24, lineHeight: 26, marginTop: 11 },

  card: { marginHorizontal: 22, marginTop: 16, borderWidth: 1, borderRadius: 20, padding: 18 },
  levelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelBadge: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  levelBadgeText: { fontFamily: FONTS.display, fontSize: 16 },
  levelPct: { fontFamily: FONTS.display, fontSize: 19 },
  progressTrack: { marginTop: 13, height: 8, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 5 },

  monthly: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 11 },
  monthlyIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },

  secure: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 22, marginTop: 16, padding: 15, borderRadius: 18, borderWidth: 1 },
  proPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
});
