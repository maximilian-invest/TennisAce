import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  EquipmentSet,
  HealthCheck,
  Lang,
  LevelState,
  UserProfile,
} from '@/domain/models';
import type { ThemePreference } from '@/theme/themes';
import type { AthleticExperience } from '@/services/quickClassification';

type Settings = { theme: ThemePreference; language: Lang };

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
  settings: Settings;
  draft: OnboardingDraft;

  updateDraft: (patch: OnboardingDraft) => void;
  completeOnboarding: (data: {
    profile: UserProfile;
    equipment: EquipmentSet;
    health: HealthCheck;
    levelState: LevelState;
  }) => void;
  setLanguage: (language: Lang) => void;
  setTheme: (theme: ThemePreference) => void;
  resetAll: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      profile: null,
      equipment: null,
      health: null,
      levelState: null,
      settings: { theme: 'system', language: 'de' },
      draft: {},

      updateDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      completeOnboarding: ({ profile, equipment, health, levelState }) =>
        set({ hasOnboarded: true, profile, equipment, health, levelState, draft: {} }),
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
        settings: s.settings,
        draft: s.draft,
      }),
    },
  ),
);

/** Convenience selector for the active language. */
export const useLang = (): Lang => useAppStore((s) => s.settings.language);
