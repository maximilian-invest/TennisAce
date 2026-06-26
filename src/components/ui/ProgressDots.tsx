import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

export function ProgressDots({ count, index }: { count: number; index: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { width: i === index ? 26 : 8, backgroundColor: i <= index ? colors.accent : colors.line },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
});
