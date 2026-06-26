import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { LEVEL_NAMES, t } from '@/domain/catalog';
import type { Lang } from '@/domain/models';
import { pushSnapshot } from '@/services/sync';
import { useAppStore, useLang } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import type { ThemePreference } from '@/theme/themes';
import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

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

  const authStatus = useAuthStore((s) => s.status);
  const authUser = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const doSync = async () => {
    if (!authUser) return;
    setSyncing(true);
    setSynced(false);
    try {
      await pushSnapshot(authUser.id);
      setSynced(true);
    } finally {
      setSyncing(false);
    }
  };

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

      {authStatus === 'signedIn' && authUser && !authUser.is_anonymous ? (
        <View style={[styles.account, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={styles.accountTop}>
            <View style={[styles.navIcon, { backgroundColor: `${colors.accent}26` }]}>
              <Icon name="check" size={20} color={colors.accentTx} strokeWidth={2.4} />
            </View>
            <View style={styles.flex}>
              <Text variant="bodySemi" color={colors.text}>{de ? 'Cloud-Sync aktiv' : 'Cloud sync active'}</Text>
              <Text variant="small" color={colors.dim}>{authUser?.email}</Text>
            </View>
          </View>
          <Button
            title={synced ? (de ? 'Synchronisiert ✓' : 'Synced ✓') : de ? 'Jetzt synchronisieren' : 'Sync now'}
            variant="secondary"
            loading={syncing}
            onPress={doSync}
            style={styles.syncBtn}
          />
          <Pressable onPress={() => signOut()} style={styles.signout}>
            <Text variant="small" color={colors.secondary} center>{de ? 'Abmelden' : 'Sign out'}</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => router.push('/auth/sign-in')} style={[styles.navRow, styles.account, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={[styles.navIcon, { backgroundColor: `${colors.accent}26` }]}>
            <Icon name="bolt" size={20} color={colors.accentTx} strokeWidth={2.2} />
          </View>
          <View style={styles.flex}>
            <Text variant="bodySemi" color={colors.text}>{de ? 'Konto sichern & Cloud-Sync' : 'Secure account & cloud sync'}</Text>
            <Text variant="small" color={colors.dim}>{de ? 'Dein Fortschritt – auf jedem Gerät' : 'Your progress – on every device'}</Text>
          </View>
          <Icon name="chevronRight" size={20} color={colors.dim} />
        </Pressable>
      )}

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

      <Pressable onPress={() => router.push('/shop')} style={[styles.navRow, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <View style={[styles.navIcon, { backgroundColor: `${colors.accent}26` }]}>
          <Icon name="plus" size={20} color={colors.accentTx} strokeWidth={2.2} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodySemi" color={colors.text}>{de ? 'Equipment & Empfehlungen' : 'Equipment & recommendations'}</Text>
          <Text variant="small" color={colors.dim}>{de ? 'Kaufguide nach Priorität' : 'Buying guide by priority'}</Text>
        </View>
        <Icon name="chevronRight" size={20} color={colors.dim} />
      </Pressable>

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
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: SPACING.xl, padding: 15, borderRadius: RADII.md, borderWidth: 1 },
  navIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  account: { marginTop: SPACING.xl, padding: 15, borderRadius: RADII.md, borderWidth: 1 },
  accountTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  syncBtn: { marginTop: SPACING.md },
  signout: { marginTop: SPACING.md, paddingVertical: SPACING.xs },
  reset: { marginTop: SPACING.xxl },
});
