import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { coachCopy } from '@/services/personalization/tonality';
import { useAppStore, useLang } from '@/store/appStore';
import type { ThemeColors } from '@/theme/themes';
import { useTheme } from '@/theme/ThemeContext';
import { DOMAIN_COLORS, FONTS } from '@/theme/tokens';

type Felt = 'tooEasy' | 'justRight' | 'tooHard';

const MOUTHS: Record<Felt, string> = {
  tooEasy: 'M11 22c1.8 3 5 4 7 4s5.2-1 7-4',
  justRight: 'M12 22c1.5 1.8 3.7 2.6 6 2.6s4.5-.8 6-2.6',
  tooHard: 'M12 24c1.5-2 3.7-3 6-3s4.5 1 6 3',
};
const FELTS: { id: Felt; label: string }[] = [
  { id: 'tooEasy', label: 'Zu leicht' },
  { id: 'justRight', label: 'Genau richtig' },
  { id: 'tooHard', label: 'Zu hart' },
];

function Smiley({ mood, color }: { mood: Felt; color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={18} cy={18} r={15} />
      <Circle cx={12.5} cy={15} r={1.4} fill={color} />
      <Circle cx={23.5} cy={15} r={1.4} fill={color} />
      <Path d={MOUTHS[mood]} />
    </Svg>
  );
}

export default function SessionComplete() {
  const { colors } = useTheme();
  const lang = useLang();
  const de = lang === 'de';
  const logWorkout = useAppStore((s) => s.logWorkout);
  const workoutLog = useAppStore((s) => s.workoutLog);
  const profile = useAppStore((s) => s.profile);
  const [felt, setFelt] = useState<Felt>('justRight');

  const finish = () => {
    logWorkout({ date: new Date().toISOString(), felt });
    router.replace('/home');
  };

  // Stats including this just-finished session.
  const mondayOf = (d: Date) => {
    const m = new Date(d);
    m.setHours(0, 0, 0, 0);
    m.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return m.getTime();
  };
  const now = new Date();
  const total = workoutLog.length + 1;
  const sessionsThisWeek = workoutLog.filter((e) => mondayOf(new Date(e.date)) === mondayOf(now)).length + 1;
  const weekSet = new Set([...workoutLog.map((e) => mondayOf(new Date(e.date))), mondayOf(now)]);
  let weekStreak = 0;
  for (let c = mondayOf(now); weekSet.has(c); c -= 7 * 86400000) weekStreak += 1;

  const praise = profile ? coachCopy(profile.age, lang).praise : de ? 'Stark gemacht!' : 'Well done!';

  // Variable peak-end reward — rotates so it never feels the same (Hook model).
  const rewards = [
    { label: de ? 'WOCHENZIEL' : 'WEEKLY GOAL', value: de ? `${sessionsThisWeek}. Einheit diese Woche` : `Session ${sessionsThisWeek} this week` },
    { label: de ? 'WOCHEN-STREAK' : 'WEEK STREAK', value: de ? `${weekStreak} Wochen am Stück` : `${weekStreak} weeks in a row` },
    { label: de ? 'DRANGEBLIEBEN' : 'CONSISTENCY', value: de ? `${total} Einheiten insgesamt` : `${total} sessions total` },
  ];
  const reward = rewards[total % rewards.length];

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.checkWrap}>
        <View style={[styles.check, { backgroundColor: colors.accent }]}>
          <Icon name="check" size={46} color={colors.accentText} strokeWidth={2.6} />
        </View>
      </View>
      <Text style={[styles.h, { color: colors.text }]}>{de ? 'Geschafft!' : 'Done!'}</Text>
      <Text variant="body" color={colors.dim} center style={styles.sub}>{praise}</Text>

      <View style={styles.stats}>
        <StatCard value={String(sessionsThisWeek)} label={de ? 'Diese Woche' : 'This week'} colors={colors} />
        <StatCard value={String(weekStreak)} label="Streak" colors={colors} />
        <StatCard value={String(total)} label={de ? 'Gesamt' : 'Total'} color={DOMAIN_COLORS.power} colors={colors} />
      </View>

      <View style={[styles.pr, { backgroundColor: `${DOMAIN_COLORS.power}1F`, borderColor: `${DOMAIN_COLORS.power}4D` }]}>
        <Icon name="bolt" size={24} color={DOMAIN_COLORS.power} />
        <View>
          <Text variant="label" color={colors.dim}>{reward.label}</Text>
          <Text variant="bodySemi" color={colors.text}>{reward.value}</Text>
        </View>
      </View>

      <Text variant="bodySemi" color={colors.text} style={styles.feltQ}>
        Wie hat sich die Einheit angefühlt?
      </Text>
      <View style={styles.felts}>
        {FELTS.map((f) => {
          const active = felt === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFelt(f.id)}
              style={[styles.felt, { backgroundColor: active ? colors.accent : colors.surface, borderColor: active ? colors.accent : colors.line }]}
            >
              <Smiley mood={f.id} color={active ? colors.accentText : colors.text} />
              <Text variant="label" color={active ? colors.accentText : colors.text} style={styles.feltLabel}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text variant="small" color={colors.dim} style={styles.feltHint}>
        Wir passen die nächste Einheit automatisch an.
      </Text>

      <Button title="Fertig" onPress={finish} style={styles.cta} />
    </Screen>
  );
}

function StatCard({ value, label, color, colors }: { value: string; label: string; color?: string; colors: ThemeColors }) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Text style={[styles.statVal, { color: color ?? colors.text }]}>{value}</Text>
      <Text style={[styles.statLbl, { color: colors.dim }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 12, paddingBottom: 24 },
  checkWrap: { alignItems: 'center', marginTop: 16 },
  check: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  h: { fontFamily: FONTS.display, fontSize: 38, textAlign: 'center', marginTop: 22 },
  sub: { marginTop: 10 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 26 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 18, paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center' },
  statVal: { fontFamily: FONTS.display, fontSize: 24 },
  statLbl: { fontFamily: FONTS.bodyBold, fontSize: 10, letterSpacing: 0.8, marginTop: 6, textAlign: 'center' },
  pr: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 12, padding: 15, borderRadius: 16, borderWidth: 1 },
  feltQ: { marginTop: 26 },
  felts: { flexDirection: 'row', gap: 10, marginTop: 11 },
  felt: { flex: 1, borderWidth: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 6 },
  feltLabel: { fontSize: 11.5 },
  feltHint: { marginTop: 9 },
  cta: { marginTop: 26 },
});
