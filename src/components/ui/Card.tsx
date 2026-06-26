import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

type Props = ViewProps & { surface2?: boolean; padded?: boolean };

export function Card({ surface2, padded = true, style, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: surface2 ? colors.surface2 : colors.surface,
          borderRadius: RADII.lg,
          borderWidth: 1,
          borderColor: colors.line,
        },
        padded && { padding: SPACING.lg },
        style,
      ]}
      {...rest}
    />
  );
}
