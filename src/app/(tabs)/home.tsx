import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { LEVEL_NAMES, t } from '@/domain/catalog';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

export default function Home() {
  const { colors } = useTheme();
  const lang = useLang();
  const de = lang === 'de';
  const profile = useAppStore((s) => s.profile);
  const levelState = useAppStore((s) => s.levelState);
  const level = levelState?.currentLevel ?? 'L1';

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <Text variant="small" color={colors.dim}>
            {de ? 'Guten Tag' : 'Hello'}
          </Text>
          <Text variant="title">{profile?.name || (de ? 'Athlet' : 'Athlete')}</Text>
        </View>
        <View style={[styles.streak, { backgroundColor: colors.surface2 }]}>
          <Text variant="bodySemi" color={colors.secondary}>
            🔥 0
          </Text>
        </View>
      </View>

      <View style={[styles.levelChip, { borderColor: colors.line }]}>
        <Text variant="label" color={colors.accentTx}>
          {level} · {t(LEVEL_NAMES[level], lang)}
        </Text>
        <Text variant="label" color={colors.dim}>
          {levelState?.progressToNext ?? 0}% {de ? 'bis nächste Stufe' : 'to next level'}
        </Text>
      </View>

      <Card style={[styles.today, { backgroundColor: colors.heroBg }]}>
        <Text variant="label" color={colors.accent}>
          {de ? 'HEUTIGE EINHEIT' : "TODAY'S SESSION"}
        </Text>
        <Text variant="title" color={colors.heroText}>
          {de ? 'Kraft Unterkörper + Core' : 'Lower-body Strength + Core'}
        </Text>
        <Text variant="small" color={colors.heroText}>
          45 min · {de ? 'Heim-Equipment' : 'Home equipment'}
        </Text>
        <Button title={de ? 'Einheit starten' : 'Start session'} style={styles.todayCta} />
      </Card>

      <View style={styles.miniRow}>
        <Card style={styles.mini}>
          <Text variant="label" color={colors.dim}>
            {de ? 'DIESE WOCHE' : 'THIS WEEK'}
          </Text>
          <Text variant="heading">3/4</Text>
          <Text variant="small" color={colors.dim}>
            {de ? 'Einheiten' : 'sessions'}
          </Text>
        </Card>
        <Card style={styles.mini}>
          <Text variant="label" color={colors.dim}>
            {de ? 'MONATSTEST' : 'MONTHLY TEST'}
          </Text>
          <Text variant="heading">{de ? 'in 30 T' : 'in 30d'}</Text>
          <Text variant="small" color={colors.dim}>
            {de ? 'Fortschritt messen' : 'measure progress'}
          </Text>
        </Card>
      </View>

      <Card surface2 style={styles.prehab}>
        <View style={styles.flex}>
          <Text variant="bodySemi">{de ? 'Tägliche Prehab' : 'Daily prehab'}</Text>
          <Text variant="small" color={colors.dim}>
            {de ? '5 Min Mobilität & Aktivierung' : '5 min mobility & activation'}
          </Text>
        </View>
        <Text variant="title" color={colors.accent}>
          ›
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg },
  streak: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADII.pill },
  levelChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: RADII.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: SPACING.lg,
  },
  today: { gap: 6, marginBottom: SPACING.lg },
  todayCta: { marginTop: SPACING.md },
  miniRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  mini: { flex: 1, gap: 4 },
  prehab: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
});
