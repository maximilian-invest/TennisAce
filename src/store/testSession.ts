import { create } from 'zustand';

import type { Sex } from '@/domain/models';
import type { ScoreResult } from '@/services/scoringEngine';

// Transient (in-memory) state for one performance-test run.
type TestSessionState = {
  raw: Record<string, number>;
  sex: Sex;
  age: number;
  result: ScoreResult | null;
  start: (sex: Sex, age: number) => void;
  setValue: (key: string, value: number) => void;
  setResult: (result: ScoreResult) => void;
};

export const useTestSession = create<TestSessionState>((set) => ({
  raw: {},
  sex: 'm',
  age: 25,
  result: null,
  start: (sex, age) => set({ sex, age, raw: {}, result: null }),
  setValue: (key, value) => set((s) => ({ raw: { ...s.raw, [key]: value } })),
  setResult: (result) => set({ result }),
}));
