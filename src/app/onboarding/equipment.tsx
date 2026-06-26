import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { EQUIPMENT_ITEMS, EQUIPMENT_MODES, t } from '@/domain/catalog';
import type { EquipmentItem, EquipmentMode } from '@/domain/models';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';
import { SPACING } from '@/theme/tokens';

export default function Equipment() {
  const { colors } = useTheme();
  const lang = useLang();
  const de = lang === 'de';
  const updateDraft = useAppStore((s) => s.updateDraft);

  const [mode, setMode] = useState<EquipmentMode>('home');
  const [items, setItems] = useState<EquipmentItem[]>(['miniband', 'tubeband', 'jumprope', 'dumbbells', 'foamroller']);

  const toggle = (i: EquipmentItem) =>
    setItems((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  const onNext = () => {
    updateDraft({ equipment: { mode, items: mode === 'none' ? [] : items } });
    router.push('/onboarding/health');
  };

  return (
    <StepScaffold
      step={3}
      title={de ? 'Equipment' : 'Equipment'}
      subtitle={de ? 'Was steht dir zur Verfügung?' : 'What do you have access to?'}
      ctaTitle={de ? 'Weiter' : 'Continue'}
      onNext={onNext}
    >
      <View style={styles.tiles}>
        {EQUIPMENT_MODES.map((m) => {
          const active = mode === m.id;
          return (
            <Pressable key={m.id} onPress={() => setMode(m.id)} style={styles.tileWrap}>
              <Card style={[styles.tile, active && { borderColor: colors.accent, borderWidth: 2 }]}>
                <Text variant="bodySemi" center>{t(m.label, lang)}</Text>
                <Text variant="small" color={colors.dim} center>{t(m.sub, lang)}</Text>
              </Card>
            </Pressable>
          );
        })}
      </View>

      {mode !== 'none' ? (
        <View style={styles.itemsBlock}>
          <Text variant="label" color={colors.dim}>{de ? 'VORHANDEN' : 'AVAILABLE'}</Text>
          <View style={styles.wrap}>
            {EQUIPMENT_ITEMS.map((it) => (
              <Chip key={it.id} label={t(it.label, lang)} selected={items.includes(it.id)} onPress={() => toggle(it.id)} />
            ))}
          </View>
        </View>
      ) : null}
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', gap: SPACING.sm },
  tileWrap: { flex: 1 },
  tile: { gap: 4, minHeight: 96, alignItems: 'center', justifyContent: 'center' },
  itemsBlock: { gap: SPACING.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
});
