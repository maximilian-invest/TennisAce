import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Chip } from '@/components/ui/Chip';
import { GOALS, t } from '@/domain/catalog';
import type { Goal } from '@/domain/models';
import { useAppStore, useLang } from '@/store/appStore';
import { SPACING } from '@/theme/tokens';

export default function Goals() {
  const lang = useLang();
  const de = lang === 'de';
  const updateDraft = useAppStore((s) => s.updateDraft);
  const [selected, setSelected] = useState<Goal[]>([]);

  const toggle = (g: Goal) =>
    setSelected((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]));

  const onNext = () => {
    updateDraft({ goals: selected });
    router.push('/onboarding/equipment');
  };

  return (
    <StepScaffold
      step={2}
      title={de ? 'Deine Ziele' : 'Your goals'}
      subtitle={de ? 'Mehrfachauswahl möglich.' : 'Select all that apply.'}
      ctaTitle={de ? 'Weiter' : 'Continue'}
      ctaDisabled={selected.length === 0}
      onNext={onNext}
    >
      <View style={styles.wrap}>
        {GOALS.map((g) => (
          <Chip key={g.id} label={t(g.label, lang)} selected={selected.includes(g.id)} onPress={() => toggle(g.id)} />
        ))}
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
});
