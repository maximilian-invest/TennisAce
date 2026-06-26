// Design tokens shared across all themes (from the ACE Athlete design export).

/** Domain colours (icons & charts) — identical across themes. */
export const DOMAIN_COLORS = {
  speed: '#2E7DFF',
  agility: '#9FD80A',
  power: '#FF7A1A',
  strength: '#EE3D3D',
  core: '#8B5CF6',
  aerobic: '#06B6D4',
  mobility: '#14B8A6',
} as const;

export const RADII = { sm: 12, md: 16, lg: 22, xl: 28, pill: 999 } as const;

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;

/** Font family keys must match the names loaded via expo-font in the root layout. */
export const FONTS = {
  body: 'PlusJakartaSans_500Medium',
  bodySemi: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
  display: 'SpaceGrotesk_700Bold',
  displayMed: 'SpaceGrotesk_500Medium',
} as const;
