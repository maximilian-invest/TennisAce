import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { SPACING } from '@/theme/tokens';

/** Temporary placeholder for tabs whose screens arrive in later phases. */
export function TabPlaceholder({ title, note }: { title: string; note: string }) {
  const { colors } = useTheme();
  return (
    <Screen>
      <View style={styles.center}>
        <Text variant="title" center>
          {title}
        </Text>
        <Text variant="body" color={colors.dim} center>
          {note}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
});
