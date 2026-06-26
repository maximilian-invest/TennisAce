import { createContext, useContext, type ReactNode } from 'react';

import { chalkTheme, type Theme } from './themes';

const ThemeContext = createContext<Theme>(chalkTheme);

// Single fixed look — the "Lime" (Chalk) design. The Court/dark theme stays in
// themes.ts but is intentionally unreachable; flip this back to a preference
// lookup if a second theme is ever reintroduced.
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={chalkTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
