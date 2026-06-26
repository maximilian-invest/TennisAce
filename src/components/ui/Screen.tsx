import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeContext';
import { SPACING } from '@/theme/tokens';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  contentStyle?: ViewStyle;
};

/** Full-bleed themed screen container with safe-area handling. */
export function Screen({ children, scroll, padded = true, background, contentStyle }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bg = background ?? theme.colors.bg;
  const horizontal = padded ? SPACING.xl : 0;

  if (scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingTop: insets.top + SPACING.sm, paddingHorizontal: horizontal, paddingBottom: insets.bottom + SPACING.xxl },
            contentStyle,
          ]}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[
        { flex: 1, backgroundColor: bg, paddingTop: insets.top + SPACING.sm, paddingHorizontal: horizontal, paddingBottom: insets.bottom },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );
}
