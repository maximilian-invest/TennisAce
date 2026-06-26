import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AceLogo } from '@/components/AceLogo';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { FONTS } from '@/theme/tokens';

const introSource = require('../../../assets/video/intro.mp4');

export default function Welcome() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const player = useVideoPlayer(introSource, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View style={styles.root}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      <LinearGradient
        colors={['rgba(8,10,6,0.5)', 'rgba(8,10,6,0.12)', 'rgba(8,10,6,0.48)', 'rgba(8,10,6,0.94)']}
        locations={[0, 0.3, 0.66, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 24 }]}>
        <AceLogo wordmarkColor="#FFFFFF" />

        <View style={styles.spacer} />

        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { width: i === 0 ? 22 : 7, backgroundColor: i === 0 ? colors.accent : 'rgba(255,255,255,0.4)' },
              ]}
            />
          ))}
        </View>

        <Text style={styles.headline}>
          Werde der <Text style={styles.headlineBold}>fitteste</Text> Tennisspieler, der du sein kannst.
        </Text>
        <Text style={styles.subline}>
          Off-Court-Athletik vom ersten Tag bis Profi-Niveau. Kraft, Schnelligkeit, Power &amp; Beweglichkeit.
        </Text>

        <Pressable
          onPress={() => router.push('/onboarding/goals')}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.accent, transform: [{ translateY: pressed ? 1 : 0 }] },
          ]}
        >
          <Text style={[styles.ctaText, { color: colors.accentText }]}>Los geht&apos;s</Text>
          <Icon name="arrowRight" size={18} color={colors.accentText} strokeWidth={2.3} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E0F0A' },
  content: { flex: 1, paddingHorizontal: 32 },
  spacer: { flex: 1 },
  dots: { flexDirection: 'row', gap: 7, marginBottom: 22 },
  dot: { height: 7, borderRadius: 4 },
  headline: {
    fontFamily: FONTS.displayMed,
    fontSize: 40,
    lineHeight: 41,
    letterSpacing: -0.8,
    color: '#FFFFFF',
  },
  headlineBold: { fontFamily: FONTS.display },
  subline: {
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.84)',
    marginTop: 16,
    maxWidth: 300,
  },
  cta: {
    marginTop: 26,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  ctaText: { fontFamily: FONTS.bodyBold, fontSize: 16 },
});
