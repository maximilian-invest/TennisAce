import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { LEVEL_NAMES, t } from '@/domain/catalog';
import type { Lang } from '@/domain/models';
import { useAppStore, useLang } from '@/store/appStore';
import type { ThemePreference } from '@/theme/themes';
import { useTheme } from '@/theme/ThemeContext';
import { SPACING } from '@/theme/tokens';

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'chalk', label: 'Chalk' },
  { id: 'court', label: 'Court' },
];

const LANG_OPTIONS: { id: Lang; label: string }[] = [
  { id: 'de', label: 'DE' },
  { id: 'en', label: 'EN' },
];

export default function ProfileTab() {
  const { colors } = useTheme();
  const lang = useLang();
  const de = lang === 'de';
  const profile = useAppStore((s) => s.profile);
  const levelState = useAppStore((s) => s.levelState);
  const settings = useAppStore((s) => s.settings);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const setTheme = useAppStore((s) => s.setTheme);
  const resetAll = useAppStore((s) => s.resetAll);
  const level = levelState?.currentLevel ?? 'L1';

  return (
    <Screen scroll contentStyle={{ paddingBottom: 110 }}>
      <View style={styles.head}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text variant="title" color={colors.accentText}>
            {(profile?.name || 'A').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.flex}>
          <Text variant="heading">{profile?.name || 'Athlete'}</Text>
          <Text variant="small" color={colors.dim}>
            {level} · {t(LEVEL_NAMES[level], lang)}
          </Text>
        </View>
      </View>

      <Setting label={de ? 'Sprache' : 'Language'}>
        {LANG_OPTIONS.map((l) => (
          <Chip key={l.id} label={l.label} selected={settings.language === l.id} onPress={() => setLanguage(l.id)} />
        ))}
      </Setting>

      <Setting label="Theme">
        {THEME_OPTIONS.map((th) => (
          <Chip key={th.id} label={th.label} selected={settings.theme === th.id} onPress={() => setTheme(th.id)} />
        ))}
      </Setting>

      <Button
        title={de ? 'Onboarding zurücksetzen' : 'Reset onboarding'}
        variant="ghost"
        onPress={() => {
          resetAll();
          router.replace('/onboarding/welcome');
        }}
        style={styles.reset}
      />
    </Screen>
  );
}

function Setting({ label, children }: { label: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.setting}>
      <Text variant="label" color={colors.dim}>
        {label.toUpperCase()}
      </Text>
      <View style={styles.optionRow}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  setting: { gap: SPACING.sm, marginTop: SPACING.xl },
  optionRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  reset: { marginTop: SPACING.xxl },
});
