import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { computeScores } from '@/services/scoringEngine';
import { useTestSession } from '@/store/testSession';
import { useTheme } from '@/theme/ThemeContext';
import { SPACING } from '@/theme/tokens';

const TEXTS = [
  'Werte deine Ergebnisse aus …',
  'Vergleiche mit Tennis-Normdaten …',
  'Zeichne dein Leistungsprofil …',
  'Erstelle deinen Plan …',
];

export default function Analyzing() {
  const { colors } = useTheme();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((x) => x + 1), 800);
    const done = setTimeout(() => {
      const { raw, sex, age, setResult } = useTestSession.getState();
      setResult(computeScores(raw, sex, age));
      router.replace('/test/result');
    }, 3200);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, []);

  return (
    <Screen>
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text variant="heading" center style={styles.text}>
          {TEXTS[tick % TEXTS.length]}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  text: { marginTop: SPACING.xl },
});
