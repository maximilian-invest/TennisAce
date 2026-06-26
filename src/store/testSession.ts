import { create } from 'zustand';

import type { Sex } from '@/domain/models';
import type { ScoreResult } from '@/services/scoringEngine';

export type TestMode = 'initial' | 'monthly';

// Transient (in-memory) state for one performance-test run.
type TestSessionState = {
  raw: Record<string, number>;
  sex: Sex;
  age: number;
  mode: TestMode;
  result: ScoreResult | null;
  start: (sex: Sex, age: number, mode?: TestMode) => void;
  setValue: (key: string, value: number) => void;
  setResult: (result: ScoreResult) => void;
};

export const useTestSession = create<TestSessionState>((set) => ({
  raw: {},
  sex: 'm',
  age: 25,
  mode: 'initial',
  result: null,
  start: (sex, age, mode = 'initial') => set({ sex, age, mode, raw: {}, result: null }),
  setValue: (key, value) => set((s) => ({ raw: { ...s.raw, [key]: value } })),
  setResult: (result) => set({ result }),
}));
