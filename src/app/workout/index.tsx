import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { CourtLines } from '@/components/CourtLines';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { SAMPLE_SESSION } from '@/content/session';
import { useTheme } from '@/theme/ThemeContext';
import { FONTS, RADII } from '@/theme/tokens';

const REST_TOTAL = 45;
const RING_CIRC = 2 * Math.PI * 34;
const fmt = (n: number) => `${Math.floor(n / 60)}:${(n % 60).toString().padStart(2, '0')}`;

export default function WorkoutPlayer() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [exIdx, setExIdx] = useState(0);
  const ex = SAMPLE_SESSION[exIdx];
  const isPlank = ex.name.de === 'Plank';

  const [setN, setSetN] = useState(1);
  const [reps, setReps] = useState(ex.reps);
  const [weight, setWeight] = useState(ex.weightKg);
  const [rpe, setRpe] = useState(7);
  const [view, setView] = useState<'side' | 'front'>('side');
  const [swapOpen, setSwapOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);

  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(REST_TOTAL);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // reset per exercise
  useEffect(() => {
    setSetN(1);
    setReps(ex.reps);
    setWeight(ex.weightKg);
    setRpe(7);
    setSwapOpen(false);
    setTipOpen(false);
  }, [exIdx, ex.reps, ex.weightKg]);

  useEffect(() => () => { if (restRef.current) clearInterval(restRef.current); }, []);

  const startRest = () => {
    setRestLeft(REST_TOTAL);
    setResting(true);
    if (restRef.current) clearInterval(restRef.current);
    restRef.current = setInterval(() => {
      setRestLeft((t) => {
        if (t <= 1) {
          if (restRef.current) clearInterval(restRef.current);
          setResting(false);
          return REST_TOTAL;
        }
        return t - 1;
      });
    }, 1000);
  };

  const finishSet = () => {
    if (setN < ex.sets) {
      setSetN((n) => n + 1);
      startRest();
    } else if (exIdx < SAMPLE_SESSION.length - 1) {
      setExIdx((i) => i + 1);
    } else {
      router.replace('/workout/complete');
    }
  };

  const sessionPct = Math.round((exIdx / SAMPLE_SESSION.length) * 100);
  const ringOffset = RING_CIRC * (1 - restLeft / REST_TOTAL);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top + 6 }]}>
      {/* header */}
      <View style={styles.header}>
        <RoundBtn onPress={() => router.back()} icon="chevronDown" colors={colors} />
        <View style={styles.headerCenter}>
          <Text style={[styles.exName, { color: colors.text }]}>{ex.name.en}</Text>
          <Text variant="small" color={colors.dim}>{ex.name.de}</Text>
        </View>
        <RoundBtn onPress={() => {}} icon="menu" colors={colors} />
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {/* view toggle */}
        <View style={[styles.toggle, { backgroundColor: colors.surface2 }]}>
          {(['side', 'front'] as const).map((v) => (
            <Pressable key={v} onPress={() => setView(v)} style={[styles.toggleBtn, view === v && { backgroundColor: colors.surface }]}>
              <Text variant="label" color={view === v ? colors.text : colors.dim}>
                {v === 'side' ? 'Seitenansicht' : 'Vorderansicht'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* animation card */}
        <View style={[styles.anim, { backgroundColor: colors.heroBg }]}>
          <CourtLines color={colors.heroText} opacity={0.1} />
          <View style={styles.animTop}>
            <View style={styles.setBadge}>
              <View style={[styles.setDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.setText, { color: colors.heroText }]}>Satz {setN} / {ex.sets}</Text>
            </View>
            <Text style={[styles.repBig, { color: colors.heroText }]}>{reps} {isPlank ? 's' : 'Wdh'}</Text>
          </View>
          <View style={styles.figure}>
            <Icon name="eqHome" size={92} color={colors.heroText} strokeWidth={1.3} />
          </View>
          <Text style={[styles.tempo, { color: colors.heroText }]}>{ex.tempo.de}</Text>
        </View>

        {/* action chips */}
        <View style={styles.chips}>
          <ActionChip icon="swap" label="Equipment" active={swapOpen} onPress={() => { setSwapOpen((o) => !o); setTipOpen(false); }} colors={colors} />
          <ActionChip icon="bulb" label="Form-Tipp" active={tipOpen} onPress={() => { setTipOpen((o) => !o); setSwapOpen(false); }} colors={colors} />
          <ActionChip icon="replace" label="Ersetzen" onPress={() => {}} colors={colors} />
        </View>
        {swapOpen ? (
          <InfoBox tint={colors.accent} colors={colors} bold="Heim-Variante:" text={ex.homeVariant.de} />
        ) : null}
        {tipOpen ? <InfoBox colors={colors} bold="Form-Tipp:" text={ex.formTip.de} /> : null}

        {/* logger */}
        <View style={styles.logger}>
          <Stepper label={isPlank ? 'Sekunden' : 'Wiederh.'} value={reps} onDec={() => setReps((r) => Math.max(1, r - 1))} onInc={() => setReps((r) => r + 1)} colors={colors} />
          <Stepper label="Gewicht" value={weight === 0 ? '–' : `${weight}`} onDec={() => setWeight((w) => Math.max(0, +(w - ex.weightStep).toFixed(1)))} onInc={() => setWeight((w) => +(w + ex.weightStep).toFixed(1))} colors={colors} />
        </View>
        <View style={styles.suggestion}>
          <Icon name="bolt" size={14} color={colors.secondary} />
          <Text variant="small" color={colors.secondary}>Progressionsvorschlag: +{ex.weightStep} kg ggü. letzter Einheit</Text>
        </View>

        {/* RPE */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={styles.rpeHead}>
            <Text variant="bodySemi" color={colors.text}>Anstrengung (RPE)</Text>
            <Text style={[styles.rpeVal, { color: colors.accentTx }]}>
              {rpe}<Text variant="small" color={colors.dim}> / 10</Text>
            </Text>
          </View>
          <View style={styles.rpeBar}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Pressable key={i} onPress={() => setRpe(i + 1)} style={styles.rpeCellWrap}>
                <View style={[styles.rpeCell, { backgroundColor: i < rpe ? colors.accent : colors.surface2 }]} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* rest ring */}
        <View style={[styles.rest, { backgroundColor: colors.surface2 }]}>
          <View style={styles.ring}>
            <Svg width={80} height={80} viewBox="0 0 80 80">
              <Circle cx={40} cy={40} r={34} fill="none" stroke={colors.line} strokeWidth={6} />
              <Circle
                cx={40} cy={40} r={34} fill="none" stroke={colors.accentTx} strokeWidth={6} strokeLinecap="round"
                strokeDasharray={RING_CIRC} strokeDashoffset={resting ? ringOffset : 0} transform="rotate(-90 40 40)"
              />
            </Svg>
            <View style={styles.ringText}>
              <Text style={[styles.ringNum, { color: colors.text }]}>{fmt(resting ? restLeft : REST_TOTAL)}</Text>
            </View>
          </View>
          <View style={styles.flex}>
            <Text variant="bodySemi" color={colors.text}>Pausen-Timer</Text>
            <Text variant="small" color={colors.dim}>Erholung bis zum nächsten Satz.</Text>
            <Pressable onPress={startRest} style={[styles.restBtn, { backgroundColor: colors.accent }]}>
              <Text variant="label" color={colors.accentText}>Pause starten</Text>
            </Pressable>
          </View>
        </View>

        {/* session progress */}
        <View style={styles.progress}>
          <View style={styles.progressHead}>
            <Text variant="small" color={colors.dim}>Übung {exIdx + 1} / {SAMPLE_SESSION.length}</Text>
            <Text variant="small" color={colors.dim}>{sessionPct}%</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.surface2 }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${sessionPct}%` }]} />
          </View>
        </View>

        {/* actions */}
        <Pressable onPress={finishSet} style={({ pressed }) => [styles.primary, { backgroundColor: colors.accent, transform: [{ translateY: pressed ? 1 : 0 }] }]}>
          <Icon name="check" size={18} color={colors.accentText} strokeWidth={2.4} />
          <Text variant="bodySemi" color={colors.accentText}>{setN < ex.sets ? 'Satz abschließen' : exIdx < SAMPLE_SESSION.length - 1 ? 'Nächste Übung' : 'Einheit abschließen'}</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/workout/complete')} style={[styles.secondary, { borderColor: colors.line }]}>
          <Text variant="bodySemi" color={colors.text}>Einheit beenden</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

type C = { colors: ReturnType<typeof useTheme>['colors'] };

function RoundBtn({ onPress, icon, colors }: { onPress: () => void; icon: 'chevronDown' | 'menu' } & C) {
  return (
    <Pressable onPress={onPress} style={[styles.round, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Icon name={icon} size={20} color={colors.text} strokeWidth={icon === 'menu' ? 1.8 : 2} />
    </Pressable>
  );
}

function ActionChip({ icon, label, active, onPress, colors }: { icon: 'swap' | 'bulb' | 'replace'; label: string; active?: boolean; onPress: () => void } & C) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, { backgroundColor: active ? colors.surface2 : colors.surface, borderColor: active ? colors.accent : colors.line }]}>
      <Icon name={icon} size={17} color={colors.text} strokeWidth={1.8} />
      <Text variant="label" color={colors.text} style={styles.chipLabel}>{label}</Text>
    </Pressable>
  );
}

function InfoBox({ tint, colors, bold, text }: { tint?: string; bold: string; text: string } & C) {
  return (
    <View style={[styles.info, { backgroundColor: tint ? `${tint}1F` : colors.surface2, borderColor: tint ? `${tint}4D` : 'transparent', borderWidth: tint ? 1 : 0 }]}>
      <Text variant="small" color={colors.text} style={styles.infoText}>
        <Text variant="small" color={colors.text} style={styles.infoBold}>{bold} </Text>
        {text}
      </Text>
    </View>
  );
}

function Stepper({ label, value, onDec, onInc, colors }: { label: string; value: number | string; onDec: () => void; onInc: () => void } & C) {
  return (
    <View style={[styles.stepper, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Text variant="label" color={colors.dim}>{label.toUpperCase()}</Text>
      <View style={styles.stepperRow}>
        <Pressable onPress={onDec} style={[styles.stepBtn, { borderColor: colors.line }]}>
          <Text style={[styles.stepSign, { color: colors.text }]}>−</Text>
        </Pressable>
        <Text style={[styles.stepValue, { color: colors.text }]}>{value}</Text>
        <Pressable onPress={onInc} style={[styles.stepBtn, { borderColor: colors.line }]}>
          <Text style={[styles.stepSign, { color: colors.text }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22 },
  headerCenter: { alignItems: 'center' },
  exName: { fontFamily: FONTS.display, fontSize: 20, lineHeight: 22 },
  round: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 22, paddingTop: 14, gap: 14 },

  toggle: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 14 },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },

  anim: { borderRadius: 24, height: 268, overflow: 'hidden' },
  animTop: { position: 'absolute', top: 15, left: 17, right: 17, zIndex: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  setBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  setDot: { width: 7, height: 7, borderRadius: 4 },
  setText: { fontFamily: FONTS.bodyBold, fontSize: 12, letterSpacing: 0.4 },
  repBig: { fontFamily: FONTS.display, fontSize: 21 },
  figure: { flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.85 },
  tempo: { position: 'absolute', bottom: 14, left: 17, fontFamily: FONTS.bodySemi, fontSize: 11.5, opacity: 0.78 },

  chips: { flexDirection: 'row', gap: 9 },
  chip: { flex: 1, height: 46, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  chipLabel: { fontSize: 11.5 },
  info: { padding: 13, borderRadius: 13 },
  infoText: { lineHeight: 18 },
  infoBold: { fontFamily: FONTS.bodyBold },

  logger: { flexDirection: 'row', gap: 11 },
  stepper: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 13, alignItems: 'center' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch', marginTop: 9 },
  stepBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepSign: { fontFamily: FONTS.body, fontSize: 20, lineHeight: 22 },
  stepValue: { fontFamily: FONTS.display, fontSize: 24 },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 7 },

  card: { borderWidth: 1, borderRadius: 16, padding: 15 },
  rpeHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  rpeVal: { fontFamily: FONTS.display, fontSize: 20 },
  rpeBar: { flexDirection: 'row', gap: 5, marginTop: 12 },
  rpeCellWrap: { flex: 1 },
  rpeCell: { height: 22, borderRadius: 6 },

  rest: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 16, borderRadius: 18 },
  ring: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  ringText: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  ringNum: { fontFamily: FONTS.display, fontSize: 19 },
  restBtn: { alignSelf: 'flex-start', marginTop: 10, height: 36, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

  progress: { marginTop: 2 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  progressTrack: { height: 7, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: 7, borderRadius: 5 },

  primary: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 2 },
  secondary: { height: 50, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
