import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  EquipmentItem,
  EquipmentSet,
  HealthCheck,
  Lang,
  LevelState,
  TestResult,
  UserProfile,
} from '@/domain/models';
import type { ThemePreference } from '@/theme/themes';
import type { AthleticExperience } from '@/services/quickClassification';

type Settings = { theme: ThemePreference; language: Lang };

/** A logged training session (drives streak & weekly compliance). */
export type WorkoutLogEntry = { date: string; felt?: 'tooEasy' | 'justRight' | 'tooHard' };

/** Draft collected across the onboarding slides before it's committed. */
export type OnboardingDraft = Partial<UserProfile> & {
  equipment?: EquipmentSet;
  health?: HealthCheck;
  athleticExperience?: AthleticExperience;
};

type AppState = {
  hasOnboarded: boolean;
  profile: UserProfile | null;
  equipment: EquipmentSet | null;
  health: HealthCheck | null;
  levelState: LevelState | null;
  testHistory: TestResult[];
  workoutLog: WorkoutLogEntry[];
  /** Premium entitlement — set by the purchase flow (RevenueCat later). */
  isPremium: boolean;
  /** Training-block cycle (4–8 weeks with a theme) — drives the block retest. */
  blockStartedAt: string | null;
  blockIndex: number;
  settings: Settings;
  draft: OnboardingDraft;

  updateDraft: (patch: OnboardingDraft) => void;
  completeOnboarding: (data: {
    profile: UserProfile;
    equipment: EquipmentSet;
    health: HealthCheck;
    levelState: LevelState;
  }) => void;
  addTestResult: (result: TestResult) => void;
  setLevelState: (levelState: LevelState) => void;
  logWorkout: (entry: WorkoutLogEntry) => void;
  toggleEquipmentItem: (item: EquipmentItem) => void;
  setPremium: (value: boolean) => void;
  /** Close the current block and start the next (after a block retest). */
  advanceBlock: () => void;
  /** Replace the local store from a remote snapshot (Supabase sync). */
  hydrateFromRemote: (snapshot: RemoteSnapshot) => void;
  setLanguage: (language: Lang) => void;
  setTheme: (theme: ThemePreference) => void;
  resetAll: () => void;
};

/** The subset of state mirrored to Supabase (see services/sync.ts). */
export type RemoteSnapshot = {
  profile: UserProfile | null;
  equipment: EquipmentSet | null;
  health: HealthCheck | null;
  levelState: LevelState | null;
  testHistory: TestResult[];
  workoutLog: WorkoutLogEntry[];
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      profile: null,
      equipment: null,
      health: null,
      levelState: null,
      testHistory: [],
      workoutLog: [],
      isPremium: false,
      blockStartedAt: null,
      blockIndex: 0,
      settings: { theme: 'system', language: 'de' },
      draft: {},

      updateDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      completeOnboarding: ({ profile, equipment, health, levelState }) =>
        set({ hasOnboarded: true, profile, equipment, health, levelState, draft: {}, blockStartedAt: new Date().toISOString(), blockIndex: 0 }),
      addTestResult: (result) =>
        set((s) => ({ testHistory: [...s.testHistory, result] })),
      setLevelState: (levelState) => set({ levelState }),
      logWorkout: (entry) => set((s) => ({ workoutLog: [...s.workoutLog, entry] })),
      toggleEquipmentItem: (item) =>
        set((s) => {
          const base: EquipmentSet = s.equipment ?? { mode: 'home', items: [] };
          const has = base.items.includes(item);
          const items = has ? base.items.filter((i) => i !== item) : [...base.items, item];
          return { equipment: { ...base, items } };
        }),
      setPremium: (value) => set({ isPremium: value }),
      advanceBlock: () => set((s) => ({ blockIndex: s.blockIndex + 1, blockStartedAt: new Date().toISOString() })),
      hydrateFromRemote: (snapshot) =>
        set({
          profile: snapshot.profile,
          equipment: snapshot.equipment,
          health: snapshot.health,
          levelState: snapshot.levelState,
          testHistory: snapshot.testHistory ?? [],
          workoutLog: snapshot.workoutLog ?? [],
          hasOnboarded: !!snapshot.profile,
        }),
      setLanguage: (language) =>
        set((s) => ({ settings: { ...s.settings, language } })),
      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),
      resetAll: () =>
        set({
          hasOnboarded: false,
          profile: null,
          equipment: null,
          health: null,
          levelState: null,
          testHistory: [],
          workoutLog: [],
          blockStartedAt: null,
          blockIndex: 0,
          draft: {},
        }),
    }),
    {
      name: 'ace-athlete',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        profile: s.profile,
        equipment: s.equipment,
        health: s.health,
        levelState: s.levelState,
        testHistory: s.testHistory,
        workoutLog: s.workoutLog,
        isPremium: s.isPremium,
        blockStartedAt: s.blockStartedAt,
        blockIndex: s.blockIndex,
        settings: s.settings,
        draft: s.draft,
      }),
    },
  ),
);

/** Convenience selector for the active language. */
export const useLang = (): Lang => useAppStore((s) => s.settings.language);
