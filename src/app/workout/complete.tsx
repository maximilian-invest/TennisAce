import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useAppStore } from '@/store/appStore';
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
  const logWorkout = useAppStore((s) => s.logWorkout);
  const [felt, setFelt] = useState<Felt>('justRight');

  const finish = () => {
    logWorkout({ date: new Date().toISOString(), felt });
    router.replace('/home');
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.checkWrap}>
        <View style={[styles.check, { backgroundColor: colors.accent }]}>
          <Icon name="check" size={46} color={colors.accentText} strokeWidth={2.6} />
        </View>
      </View>
      <Text style={[styles.h, { color: colors.text }]}>Geschafft!</Text>
      <Text variant="body" color={colors.dim} center style={styles.sub}>
        Kraft + Core · Unterkörper abgeschlossen.
      </Text>

      <View style={styles.stats}>
        <StatCard value="4 240" label="kg Volumen" colors={colors} />
        <StatCard value="47:30" label="Dauer" colors={colors} />
        <StatCard value="2" label="neue PRs" color={DOMAIN_COLORS.power} colors={colors} />
      </View>

      <View style={[styles.pr, { backgroundColor: `${DOMAIN_COLORS.power}1F`, borderColor: `${DOMAIN_COLORS.power}4D` }]}>
        <Icon name="bolt" size={24} color={DOMAIN_COLORS.power} />
        <View>
          <Text variant="label" color={colors.dim}>PERSÖNLICHER REKORD</Text>
          <Text variant="bodySemi" color={colors.text}>Goblet Squat · 22,5 kg × 8</Text>
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
