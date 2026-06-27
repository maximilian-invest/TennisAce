import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Text } from '@/components/ui/Text';
import { GOALS, t } from '@/domain/catalog';
import type { Goal } from '@/domain/models';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { RADII } from '@/theme/tokens';

const GOAL_COLORS: Record<Goal, string> = {
  speed: '#2E7DFF',
  explosive: '#FF7A1A',
  endurance: '#06B6D4',
  injuryfree: '#14B8A6',
  strength: '#EE3D3D',
  mobility: '#8B5CF6',
  bodycomp: '#9FD80A',
};

export default function Goals() {
  const { colors } = useTheme();
  const lang = useLang();
  const updateDraft = useAppStore((s) => s.updateDraft);
  const [selected, setSelected] = useState<Goal[]>([]);

  const toggle = (g: Goal) =>
    setSelected((c) => (c.includes(g) ? c.filter((x) => x !== g) : [...c, g]));

  return (
    <StepScaffold
      step={1}
      total={7}
      title="Was willst du auf dem Platz erreichen?"
      subtitle="Wähle alles, was dich antreibt – dein Hauptziel zuerst."
      ctaTitle="Weiter"
      ctaDisabled={selected.length === 0}
      onNext={() => {
        updateDraft({ goals: selected });
        router.push('/onboarding/profile');
      }}
    >
      <View style={styles.wrap}>
        {GOALS.map((g) => {
          const on = selected.includes(g.id);
          return (
            <Pressable
              key={g.id}
              onPress={() => toggle(g.id)}
              style={[styles.chip, { backgroundColor: on ? colors.accent : colors.surface, borderColor: on ? colors.accent : colors.line }]}
            >
              <View style={[styles.dot, { backgroundColor: GOAL_COLORS[g.id] }]} />
              <Text variant="bodySemi" color={on ? colors.accentText : colors.text}>
                {t(g.label, lang)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: RADII.pill,
    borderWidth: 1.5,
  },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
