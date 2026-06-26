import { LEVEL_NAMES } from '@/domain/catalog';
import type { Goal, Lang, Level } from '@/domain/models';
import { ATHLETIC_TEXT, GOAL_FOCUS } from '@/content/reasoning';
import type { AthleticExperience } from './quickClassification';

export interface QuickReasoningInput {
  level: Level;
  sessionsPerWeek: number;
  athleticExperience: AthleticExperience;
  primaryGoal?: Goal;
  lang: Lang;
}

/**
 * Quick reasoning (Functional Spec §4, Block 2 — quick variant). No domain
 * scores yet, so it explains the starting level from the onboarding inputs and
 * points forward to the performance test.
 */
export function quickReasoning(input: QuickReasoningInput): string[] {
  const { level, sessionsPerWeek, athleticExperience, primaryGoal, lang } = input;
  const levelName = LEVEL_NAMES[level][lang];
  const sentences: string[] = [];

  if (lang === 'de') {
    sentences.push(
      `Auf Basis deiner Angaben – ${sessionsPerWeek}× Tennis pro Woche und ${ATHLETIC_TEXT[athleticExperience].de} – starten wir dich auf ${level} „${levelName}".`,
    );
    if (primaryGoal) {
      sentences.push(`Du willst vor allem ${GOAL_FOCUS[primaryGoal].de} – dein Plan ist genau darauf ausgerichtet.`);
    }
    sentences.push(
      'Dein erster Leistungstest zeigt dann exakt deine Stärken und deinen größten Hebel – und feintunt den Plan punktgenau.',
    );
  } else {
    sentences.push(
      `Based on your answers – ${sessionsPerWeek}× tennis per week and ${ATHLETIC_TEXT[athleticExperience].en} – we start you at ${level} "${levelName}".`,
    );
    if (primaryGoal) {
      sentences.push(`You mainly want ${GOAL_FOCUS[primaryGoal].en} – your plan is built exactly for that.`);
    }
    sentences.push(
      'Your first performance test then reveals your strengths and biggest lever – and fine-tunes the plan precisely.',
    );
  }

  return sentences;
}
