import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { FONTS } from '@/theme/tokens';

type Props = {
  step: number;
  total?: number;
  title: string;
  subtitle?: string;
  ctaTitle: string;
  ctaDisabled?: boolean;
  ctaIcon?: boolean;
  onNext: () => void;
  children: ReactNode;
};

export function StepScaffold({
  step,
  total = 4,
  title,
  subtitle,
  ctaTitle,
  ctaDisabled,
  ctaIcon,
  onNext,
  children,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.back, { backgroundColor: colors.surface, borderColor: colors.line }]}
          hitSlop={8}
        >
          <Icon name="chevronLeft" size={20} color={colors.text} strokeWidth={2} />
        </Pressable>
        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { width: i === step ? 22 : 7, backgroundColor: i <= step ? colors.accent : colors.line }]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text variant="small" color={colors.dim} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          onPress={onNext}
          disabled={ctaDisabled}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.accent, opacity: ctaDisabled ? 0.4 : 1, transform: [{ translateY: pressed && !ctaDisabled ? 1 : 0 }] },
          ]}
        >
          <Text style={[styles.ctaText, { color: colors.accentText }]}>{ctaTitle}</Text>
          {ctaIcon ? <Icon name="arrowRight" size={18} color={colors.accentText} strokeWidth={2.3} /> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 26 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  back: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 7 },
  dot: { height: 7, borderRadius: 4 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 26, paddingBottom: 16 },
  title: { fontFamily: FONTS.display, fontSize: 31, lineHeight: 34, letterSpacing: -0.3 },
  subtitle: { marginTop: 9 },
  body: { marginTop: 22 },
  footer: { paddingTop: 8 },
  cta: { height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 },
  ctaText: { fontFamily: FONTS.bodyBold, fontSize: 16 },
});
