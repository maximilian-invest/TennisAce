import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { FONTS } from '@/theme/tokens';

/** ACE Athlete lockup: lime rounded-square with arrow + wordmark. */
export function AceLogo({ wordmarkColor }: { wordmarkColor?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: colors.accent }]}>
        <Icon name="arrowRight" size={17} color={colors.accentText} strokeWidth={2.4} />
      </View>
      <Text style={[styles.wordmark, { color: wordmarkColor ?? colors.text }]}>ACE Athlete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  badge: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontFamily: FONTS.display, fontSize: 23, letterSpacing: -0.2 },
});
