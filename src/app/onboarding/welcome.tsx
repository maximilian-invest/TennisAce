import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { RADII, SPACING } from '@/theme/tokens';

export default function Welcome() {
  const { colors } = useTheme();
  const de = useLang() === 'de';

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={[styles.glow, { backgroundColor: colors.accent }]} />
          <View style={[styles.badge, { backgroundColor: colors.heroBg }]}>
            <Text variant="display" color={colors.accent} style={styles.logo}>
              ACE
            </Text>
            <Text variant="label" color={colors.heroText} style={styles.logoSub}>
              ATHLETE
            </Text>
          </View>
        </View>

        <View style={styles.copy}>
          <Text variant="title">
            {de
              ? 'Werde der fitteste Tennisspieler, der du sein kannst.'
              : 'Become the fittest tennis player you can be.'}
          </Text>
          <Text variant="body" color={colors.dim}>
            {de ? 'Vom ersten Tag bis Profi-Niveau.' : 'From day one to pro level.'}
          </Text>
        </View>

        <Button
          title={de ? "Los geht's" : "Let's go"}
          onPress={() => router.push('/onboarding/profile')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: SPACING.lg },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 280, height: 280, borderRadius: 140, opacity: 0.16 },
  badge: {
    width: 200,
    height: 200,
    borderRadius: RADII.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { fontSize: 64, lineHeight: 66 },
  logoSub: { letterSpacing: 6, marginTop: 2 },
  copy: { gap: SPACING.md, marginBottom: SPACING.xl },
});
