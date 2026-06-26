import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet, type GestureResponderEvent, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import { RADII } from '@/theme/tokens';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  const bg = isPrimary ? colors.accent : variant === 'secondary' ? colors.surface2 : 'transparent';
  const fg = isPrimary ? colors.accentText : colors.text;

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={(e) => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg },
        variant === 'ghost' && { borderWidth: 1.5, borderColor: colors.line },
        isPrimary && {
          shadowColor: colors.accent,
          shadowOpacity: 0.45,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        },
        { opacity: disabled ? 0.45 : pressed ? 0.9 : 1 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text variant="bodySemi" color={fg}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
});
