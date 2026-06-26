// Double progression — Functional Spec §5. Pure logic, applied after a set/session.

export type FeltLabel = 'tooEasy' | 'justRight' | 'tooHard';

export interface ProgressionState {
  currentTargetReps: number;
  currentTargetWeight: number;
  consecutiveFails: number;
}

export interface ProgressionInput {
  allSetsCompleted: boolean;
  sessionRpe: number; // 1–10
  felt: FeltLabel;
  repCeiling: number;
  repFloor: number;
  weightIncrement: number;
}

/**
 * Spec §5:
 *  - all sets done AND rpe ≤ 7 AND felt ≠ tooHard:
 *      reps < ceiling → +1–2 reps; else reps = floor, weight += increment
 *  - felt == tooHard OR sets not completed: consecutiveFails++
 *      ≥ 2 consecutive fails → deload (weight −10% or reps −2)
 */
export function applyProgression(state: ProgressionState, input: ProgressionInput): ProgressionState {
  const { allSetsCompleted, sessionRpe, felt, repCeiling, repFloor, weightIncrement } = input;

  if (allSetsCompleted && sessionRpe <= 7 && felt !== 'tooHard') {
    if (state.currentTargetReps < repCeiling) {
      return { ...state, currentTargetReps: Math.min(repCeiling, state.currentTargetReps + 1), consecutiveFails: 0 };
    }
    return {
      currentTargetReps: repFloor,
      currentTargetWeight: round(state.currentTargetWeight + weightIncrement),
      consecutiveFails: 0,
    };
  }

  if (felt === 'tooHard' || !allSetsCompleted) {
    const fails = state.consecutiveFails + 1;
    if (fails >= 2) {
      return {
        currentTargetReps: Math.max(repFloor, state.currentTargetReps - 2),
        currentTargetWeight: round(state.currentTargetWeight * 0.9),
        consecutiveFails: 0,
      };
    }
    return { ...state, consecutiveFails: fails };
  }

  return state;
}

const round = (n: number) => Math.round(n * 2) / 2; // nearest 0.5 kg
