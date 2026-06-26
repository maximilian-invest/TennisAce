import { Text as RNText, StyleSheet, type TextProps } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import { FONTS } from '@/theme/tokens';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'body'
  | 'bodySemi'
  | 'small'
  | 'label'
  | 'mono';

type Props = TextProps & { variant?: TextVariant; color?: string; center?: boolean };

const V: Record<TextVariant, { fontFamily: string; fontSize: number; lineHeight: number; letterSpacing?: number }> = {
  display: { fontFamily: FONTS.display, fontSize: 40, lineHeight: 44, letterSpacing: -0.5 },
  title: { fontFamily: FONTS.display, fontSize: 27, lineHeight: 33, letterSpacing: -0.3 },
  heading: { fontFamily: FONTS.bodyBold, fontSize: 19, lineHeight: 25 },
  body: { fontFamily: FONTS.body, fontSize: 16, lineHeight: 24 },
  bodySemi: { fontFamily: FONTS.bodySemi, fontSize: 16, lineHeight: 23 },
  small: { fontFamily: FONTS.body, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: FONTS.bodySemi, fontSize: 12, lineHeight: 15, letterSpacing: 0.4 },
  mono: { fontFamily: FONTS.displayMed, fontSize: 14, lineHeight: 20 },
};

export function Text({ variant = 'body', color, center, style, ...rest }: Props) {
  const theme = useTheme();
  return (
    <RNText
      style={[V[variant], { color: color ?? theme.colors.text }, center && styles.center, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({ center: { textAlign: 'center' } });
