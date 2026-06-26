import { LEVEL_NAMES } from '@/domain/catalog';
import type { Domain, Goal, Lang, Level } from '@/domain/models';
import { ATHLETIC_TEXT, GOAL_FOCUS } from '@/content/reasoning';
import { DOMAIN_LABELS, DOMAIN_PRAISE, DOMAIN_WHY } from '@/content/reasoningDomains';
import type { AthleticExperience } from './quickClassification';

// ── Quick reasoning (Spec §4, Block 2 — quick variant) ──────────────────────

export interface QuickReasoningInput {
  level: Level;
  sessionsPerWeek: number;
  athleticExperience: AthleticExperience;
  primaryGoal?: Goal;
  lang: Lang;
}

export function quickReasoning(input: QuickReasoningInput): string[] {
  const { level, sessionsPerWeek, athleticExperience, primaryGoal, lang } = input;
  const levelName = LEVEL_NAMES[level][lang];
  const sentences: string[] = [];

  if (lang === 'de') {
    sentences.push(
      `Auf Basis deiner Angaben – ${sessionsPerWeek}× Tennis pro Woche und ${ATHLETIC_TEXT[athleticExperience].de} – starten wir dich auf ${level} „${levelName}".`,
    );
    if (primaryGoal) sentences.push(`Du willst vor allem ${GOAL_FOCUS[primaryGoal].de} – dein Plan ist genau darauf ausgerichtet.`);
    sentences.push('Dein erster Leistungstest zeigt dann exakt deine Stärken und deinen größten Hebel – und feintunt den Plan punktgenau.');
  } else {
    sentences.push(
      `Based on your answers – ${sessionsPerWeek}× tennis per week and ${ATHLETIC_TEXT[athleticExperience].en} – we start you at ${level} "${levelName}".`,
    );
    if (primaryGoal) sentences.push(`You mainly want ${GOAL_FOCUS[primaryGoal].en} – your plan is built exactly for that.`);
    sentences.push('Your first performance test then reveals your strengths and biggest lever – and fine-tunes the plan precisely.');
  }
  return sentences;
}

// ── Full test reasoning (Spec §4, Blocks 1–4) ───────────────────────────────

export interface TestReasoningInput {
  totalScore: number;
  strongest: Domain;
  weakest: Domain;
  primaryGoal?: Goal;
  lang: Lang;
}

export function testReasoning(input: TestReasoningInput): string[] {
  const { totalScore, strongest, weakest, primaryGoal, lang } = input;
  const sName = DOMAIN_LABELS[strongest][lang];
  const wName = DOMAIN_LABELS[weakest][lang];
  const sentences: string[] = [];

  if (lang === 'de') {
    sentences.push(
      `Dein Gesamtscore von ${totalScore}/100 ergibt sich aus deinen Werten in 7 Bereichen, gewichtet nach ihrer Bedeutung im Tennis – Agilität und Schnelligkeit zählen am meisten.`,
    );
    sentences.push(`Deine stärkste Qualität ist die ${sName} – ${DOMAIN_PRAISE[strongest].de}`);
    sentences.push(`Den größten Hebel hast du bei der ${wName} – genau hier setzt dein Plan zuerst an, weil ${DOMAIN_WHY[weakest].de}`);
    if (primaryGoal) sentences.push(`Du willst vor allem ${GOAL_FOCUS[primaryGoal].de} – dein Plan ist genau darauf ausgerichtet.`);
  } else {
    sentences.push(
      `Your total score of ${totalScore}/100 comes from your results across 7 areas, weighted by how much they matter in tennis – agility and speed count most.`,
    );
    sentences.push(`Your strongest quality is ${sName} – ${DOMAIN_PRAISE[strongest].en}`);
    sentences.push(`Your biggest lever is ${wName} – that's where your plan starts, because ${DOMAIN_WHY[weakest].en}`);
    if (primaryGoal) sentences.push(`You mainly want ${GOAL_FOCUS[primaryGoal].en} – your plan is built exactly for that.`);
  }
  return sentences;
}
