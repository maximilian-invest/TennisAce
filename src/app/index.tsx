import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

// Placeholder landing screen. It exists only so the app builds and can be opened
// on a phone to verify the pipeline. The real screens come from the design.
export default function IndexScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">🎾 TennisAce</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
        Grundgerüst steht – bereit für das Design.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  subtitle: {
    textAlign: 'center',
  },
});
