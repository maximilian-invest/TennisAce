import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { isSupabaseConfigured, supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

// 'secure' = attach an email to the current (anonymous) user — same id, no data
// loss. 'signin' = log into an existing account from a fresh device.
type Mode = 'secure' | 'signin';

export default function SignIn() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(params.mode === 'signin' ? 'signin' : 'secure');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'info'; text: string } | null>(null);

  const valid = /\S+@\S+\.\S+/.test(email) && password.length >= 6;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) setMessage({ kind: 'error', text: error.message });
        else router.back();
      } else {
        // Secure the current guest account by attaching email + password.
        const guest = useAuthStore.getState().user;
        if (guest) {
          const { error } = await supabase.auth.updateUser({ email: email.trim(), password });
          if (error) setMessage({ kind: 'error', text: error.message });
          else router.back();
        } else {
          const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
          if (error) setMessage({ kind: 'error', text: error.message });
          else if (!data.session) {
            setMessage({ kind: 'info', text: 'Fast geschafft – bestätige deine E-Mail, dann bist du gesichert.' });
            setMode('signin');
          } else router.back();
        }
      }
    } catch (e) {
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'Etwas ist schiefgelaufen.' });
    } finally {
      setBusy(false);
    }
  };

  const secure = mode === 'secure';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 6 }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.round, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Icon name="chevronLeft" size={20} color={colors.text} />
        </Pressable>
      </View>

      <Screen scroll>
        <View style={[styles.hero, { backgroundColor: colors.heroBg }]}>
          <Icon name={secure ? 'bolt' : 'check'} size={40} color={colors.accent} strokeWidth={2} />
        </View>

        <Text variant="title" style={styles.h}>{secure ? 'Konto sichern' : 'Anmelden'}</Text>
        <Text variant="body" color={colors.dim} style={styles.p}>
          {!isSupabaseConfigured
            ? 'Cloud-Sync ist in diesem Build noch nicht konfiguriert (Supabase-Keys fehlen).'
            : secure
              ? 'Hänge eine E-Mail an dein Konto – dann liegt dein Fortschritt sicher in der Cloud und ist auf jedem Gerät da.'
              : 'Melde dich mit deinem bestehenden Konto an, um deinen Fortschritt zu laden.'}
        </Text>

        {isSupabaseConfigured ? (
          <>
            <Text variant="label" color={colors.dim} style={styles.lbl}>E-MAIL</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="du@example.com"
              placeholderTextColor={colors.dim}
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.line }]}
            />

            <Text variant="label" color={colors.dim} style={styles.lbl}>PASSWORT</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Mind. 6 Zeichen"
              placeholderTextColor={colors.dim}
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.line }]}
            />

            {message ? (
              <View style={[styles.msg, { backgroundColor: message.kind === 'error' ? `${colors.secondary}1F` : `${colors.accent}26` }]}>
                <Text variant="small" color={message.kind === 'error' ? colors.secondary : colors.accentTx}>{message.text}</Text>
              </View>
            ) : null}

            <Button
              title={secure ? 'Konto sichern' : 'Anmelden'}
              onPress={submit}
              disabled={!valid}
              loading={busy}
              style={styles.cta}
            />
            <Pressable onPress={() => { setMode(secure ? 'signin' : 'secure'); setMessage(null); }} style={styles.toggle}>
              <Text variant="small" color={colors.accentTx} center>
                {secure ? 'Schon ein Konto? Anmelden' : 'Neu hier? Konto sichern'}
              </Text>
            </Pressable>
          </>
        ) : null}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 22, paddingBottom: 4 },
  round: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 120, borderRadius: RADII.lg, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.sm },
  h: { marginTop: SPACING.xl },
  p: { marginTop: SPACING.sm },
  lbl: { marginTop: SPACING.lg, marginBottom: SPACING.sm },
  input: { minHeight: 52, borderRadius: RADII.md, borderWidth: 1, paddingHorizontal: 14, fontFamily: 'PlusJakartaSans_500Medium', fontSize: 16 },
  msg: { marginTop: SPACING.lg, padding: 13, borderRadius: RADII.md },
  cta: { marginTop: SPACING.xl },
  toggle: { marginTop: SPACING.lg, paddingVertical: SPACING.sm },
});
