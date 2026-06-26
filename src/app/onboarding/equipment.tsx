import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { EQUIPMENT_ITEMS, t } from '@/domain/catalog';
import type { EquipmentItem, EquipmentMode } from '@/domain/models';
import { useAppStore, useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';

const MODES: { id: EquipmentMode; icon: IconName; label: string; sub: string }[] = [
  { id: 'none', icon: 'eqNone', label: 'Kein Equipment', sub: 'Nur Körpergewicht' },
  { id: 'home', icon: 'eqHome', label: 'Heim-Basics', sub: 'Bänder · Hanteln' },
  { id: 'gym', icon: 'eqGym', label: 'Voll-Gym', sub: 'Alle Geräte' },
];

export default function Equipment() {
  const { colors } = useTheme();
  const lang = useLang();
  const updateDraft = useAppStore((s) => s.updateDraft);
  const [mode, setMode] = useState<EquipmentMode>('home');
  const [items, setItems] = useState<EquipmentItem[]>(['miniband', 'tubeband', 'jumprope', 'dumbbells', 'foamroller']);

  const toggle = (i: EquipmentItem) =>
    setItems((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <StepScaffold
      step={2}
      title="Welches Equipment hast du?"
      subtitle="Wir passen jede Übung daran an."
      ctaTitle="Weiter"
      onNext={() => {
        updateDraft({ equipment: { mode, items: mode === 'none' ? [] : items } });
        router.push('/onboarding/health');
      }}
    >
      <View style={styles.modes}>
        {MODES.map((m) => {
          const on = mode === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMode(m.id)}
              style={[styles.mode, { backgroundColor: on ? colors.accent : colors.surface, borderColor: on ? colors.accent : colors.line }]}
            >
              <View style={[styles.modeIcon, { backgroundColor: on ? 'rgba(0,0,0,0.10)' : colors.surface2 }]}>
                <Icon name={m.icon} size={20} color={on ? colors.accentText : colors.text} strokeWidth={1.8} />
              </View>
              <Text variant="label" color={on ? colors.accentText : colors.text} style={styles.modeLabel}>
                {m.label}
              </Text>
              <Text style={[styles.modeSub, { color: on ? colors.accentText : colors.dim }]}>{m.sub}</Text>
            </Pressable>
          );
        })}
      </View>

      {mode !== 'none' ? (
        <>
          <Text variant="label" color={colors.dim} style={styles.sectionLabel}>
            EINZELN ANPASSEN
          </Text>
          <View style={styles.grid}>
            {EQUIPMENT_ITEMS.map((it) => {
              const on = items.includes(it.id);
              return (
                <Pressable
                  key={it.id}
                  onPress={() => toggle(it.id)}
                  style={[styles.item, { backgroundColor: colors.surface, borderColor: on ? colors.accent : colors.line }]}
                >
                  <View style={[styles.box, { backgroundColor: on ? colors.accent : 'transparent', borderColor: on ? colors.accent : colors.line }]}>
                    {on ? <Icon name="check" size={13} color={colors.accentText} strokeWidth={3.2} /> : null}
                  </View>
                  <Text variant="small" color={colors.text}>
                    {t(it.label, lang)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  modes: { flexDirection: 'row', gap: 10 },
  mode: { flex: 1, borderWidth: 1.5, borderRadius: 18, padding: 12, alignItems: 'flex-start' },
  modeIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  modeLabel: { marginTop: 10, fontSize: 12.5 },
  modeSub: { fontSize: 10, lineHeight: 13, marginTop: 3, fontFamily: 'PlusJakartaSans_500Medium' },
  sectionLabel: { marginTop: 26, marginBottom: 12, letterSpacing: 1.3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  item: {
    width: '47.8%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  box: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
