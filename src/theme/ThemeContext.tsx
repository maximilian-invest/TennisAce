import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { useAppStore } from '@/store/appStore';
import { chalkTheme, THEMES, type Theme } from './themes';

const ThemeContext = createContext<Theme>(chalkTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useAppStore((s) => s.settings.theme);
  const scheme = useColorScheme();

  const theme =
    preference === 'system'
      ? scheme === 'dark'
        ? THEMES.court
        : THEMES.chalk
      : THEMES[preference];

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
