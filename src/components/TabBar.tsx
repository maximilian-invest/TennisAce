import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Text } from '@/components/ui/Text';
import { useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';

// The design's bottom nav is a floating pill with 4 items (Home · Plan ·
// Progress · Profile). The workout is launched from cards, not a nav tab.
const NAV = ['home', 'plan', 'progress', 'profile'] as const;
type NavKey = (typeof NAV)[number];

const LABELS: Record<NavKey, { de: string; en: string }> = {
  home: { de: 'Start', en: 'Home' },
  plan: { de: 'Plan', en: 'Plan' },
  progress: { de: 'Fortschritt', en: 'Progress' },
  profile: { de: 'Profil', en: 'Profile' },
};

function NavIcon({ name, color }: { name: NavKey; color: string }) {
  const s = { stroke: color, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' as const };
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      {name === 'home' && <Path d="M3 11l9-8 9 8M5 10v10h14V10" {...s} />}
      {name === 'plan' && (
        <>
          <Rect x={3} y={4} width={18} height={17} rx={2.5} {...s} />
          <Path d="M3 9h18M8 2v4M16 2v4" {...s} />
        </>
      )}
      {name === 'progress' && <Path d="M4 19V5M4 19h16M8 16l3-5 3 3 4-7" {...s} />}
      {name === 'profile' && (
        <>
          <Circle cx={12} cy={8} r={4} {...s} />
          <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" {...s} />
        </>
      )}
    </Svg>
  );
}

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

export function TabBar({ state, navigation }: TabBarProps) {
  const { colors } = useTheme();
  const de = useLang() === 'de';
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface, borderColor: colors.line, bottom: insets.bottom + 10 },
      ]}
    >
      {NAV.map((key) => {
        const active = current === key;
        const color = active ? colors.accentTx : colors.dim;
        return (
          <Pressable key={key} onPress={() => navigation.navigate(key)} style={styles.item}>
            <NavIcon name={key} color={color} />
            <Text variant="label" color={color} style={styles.label}>
              {de ? LABELS[key].de : LABELS[key].en}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 18,
    right: 18,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  item: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 6 },
  label: { fontSize: 10 },
});
