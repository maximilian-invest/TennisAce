import { DOMAIN_COLORS } from './tokens';

export type ThemeColors = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  dim: string;
  line: string;
  accent: string;
  accentText: string;
  accentTx: string;
  secondary: string;
  heroBg: string;
  heroText: string;
};

export type Theme = {
  id: ThemeId;
  name: string;
  isDark: boolean;
  colors: ThemeColors;
  domain: typeof DOMAIN_COLORS;
};

// "Chalk" (light) — the design's default light look.
export const chalkTheme: Theme = {
  id: 'chalk',
  name: 'Chalk',
  isDark: false,
  colors: {
    bg: '#F1F2EC',
    surface: '#FFFFFF',
    surface2: '#ECEEE4',
    text: '#16180F',
    dim: '#6E7263',
    line: '#E5E7DB',
    accent: '#C2F23D',
    accentText: '#16180F',
    accentTx: '#516F1A',
    secondary: '#FF7A30',
    heroBg: '#1B1E13',
    heroText: '#F2F4EA',
  },
  domain: DOMAIN_COLORS,
};

// "Court" (dark).
export const courtTheme: Theme = {
  id: 'court',
  name: 'Court',
  isDark: true,
  colors: {
    bg: '#0E0F0A',
    surface: '#181A11',
    surface2: '#23261A',
    text: '#F2F4EA',
    dim: '#9A9E8B',
    line: '#2C3020',
    accent: '#C2F23D',
    accentText: '#16180F',
    accentTx: '#C2F23D',
    secondary: '#FF7A30',
    heroBg: '#15170E',
    heroText: '#F2F4EA',
  },
  domain: DOMAIN_COLORS,
};

// Registry — Grand-Slam themes (Wimbledon, US Open, …) get added here later.
export const THEMES = { chalk: chalkTheme, court: courtTheme } as const;
export type ThemeId = 'chalk' | 'court';

/** User theme preference: an explicit theme, or follow the OS appearance. */
export type ThemePreference = ThemeId | 'system';
