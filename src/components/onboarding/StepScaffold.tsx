import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { SPACING } from '@/theme/tokens';

type Props = {
  step: number;
  total?: number;
  title: string;
  subtitle?: string;
  ctaTitle: string;
  ctaDisabled?: boolean;
  onNext: () => void;
  children: ReactNode;
};

export function StepScaffold({
  step,
  total = 5,
  title,
  subtitle,
  ctaTitle,
  ctaDisabled,
  onNext,
  children,
}: Props) {
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text variant="heading" color={colors.dim}>
            ‹
          </Text>
        </Pressable>
        <ProgressDots count={total} index={step} />
        <View style={styles.spacer} />
      </View>

      <Text variant="title">{title}</Text>
      {subtitle ? (
        <Text variant="body" color={colors.dim} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      <Button title={ctaTitle} onPress={onNext} disabled={ctaDisabled} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  spacer: { width: 16 },
  subtitle: { marginTop: SPACING.sm },
  body: { flex: 1, marginTop: SPACING.lg },
  bodyContent: { gap: SPACING.xl, paddingBottom: SPACING.lg },
});
