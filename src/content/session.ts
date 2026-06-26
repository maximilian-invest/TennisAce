// Sample workout session (real plans/exercises arrive with the research data).
import type { Domain } from '@/domain/models';

export interface SessionExercise {
  name: { de: string; en: string };
  domain: Domain;
  sets: number;
  reps: number;
  weightKg: number;
  weightStep: number;
  repCeiling: number;
  repFloor: number;
  tempo: { de: string; en: string };
  formTip: { de: string; en: string };
  homeVariant: { de: string; en: string };
}

export const SESSION_TITLE = { de: 'Kraft Unterkörper + Core', en: 'Lower-body Strength + Core' };

export const SAMPLE_SESSION: SessionExercise[] = [
  {
    name: { de: 'Goblet Squat', en: 'Goblet Squat' },
    domain: 'powerLower',
    sets: 4, reps: 8, weightKg: 22.5, weightStep: 2.5, repCeiling: 12, repFloor: 8,
    tempo: { de: '2 s runter · 1 s explosiv hoch', en: '2 s down · 1 s explosive up' },
    formTip: { de: 'Knie Richtung Zehen, Fersen am Boden, Brust aufrecht.', en: 'Knees track over toes, heels down, chest tall.' },
    homeVariant: { de: 'Rucksack mit Büchern statt Kurzhantel – gleiche Bewegung.', en: 'Backpack with books instead of a dumbbell – same movement.' },
  },
  {
    name: { de: 'Bulgarian Split Squat', en: 'Bulgarian Split Squat' },
    domain: 'powerLower',
    sets: 3, reps: 10, weightKg: 12.5, weightStep: 2.5, repCeiling: 12, repFloor: 8,
    tempo: { de: '2 s runter · kontrolliert hoch', en: '2 s down · controlled up' },
    formTip: { de: 'Vorderes Knie stabil, Rumpf leicht vorgeneigt.', en: 'Front knee stable, slight forward lean.' },
    homeVariant: { de: 'Hinteres Bein auf Couch/Stuhl, Körpergewicht.', en: 'Rear foot on couch/chair, bodyweight.' },
  },
  {
    name: { de: 'Einbeiniges RDL', en: 'Single-leg RDL' },
    domain: 'powerLower',
    sets: 3, reps: 10, weightKg: 10, weightStep: 2.5, repCeiling: 12, repFloor: 8,
    tempo: { de: 'langsam runter · Hüfte zurück', en: 'slow down · hips back' },
    formTip: { de: 'Rücken neutral, Hüfte nach hinten, Standbein leicht gebeugt.', en: 'Neutral spine, hinge at hips, soft knee.' },
    homeVariant: { de: 'Wasserkanister oder Rucksack als Gewicht.', en: 'Water canister or backpack as load.' },
  },
  {
    name: { de: 'Hip Thrust', en: 'Hip Thrust' },
    domain: 'powerLower',
    sets: 3, reps: 12, weightKg: 30, weightStep: 5, repCeiling: 15, repFloor: 10,
    tempo: { de: '1 s hoch · 1 s halten · 2 s runter', en: '1 s up · 1 s hold · 2 s down' },
    formTip: { de: 'Oben Po fest anspannen, Rippen unten lassen.', en: 'Squeeze glutes at the top, ribs down.' },
    homeVariant: { de: 'Schultern auf Couch, Rucksack auf der Hüfte.', en: 'Shoulders on couch, backpack on hips.' },
  },
  {
    name: { de: 'Pallof Press', en: 'Pallof Press' },
    domain: 'core',
    sets: 3, reps: 12, weightKg: 0, weightStep: 1, repCeiling: 15, repFloor: 10,
    tempo: { de: '2 s rausdrücken · 2 s halten', en: '2 s press out · 2 s hold' },
    formTip: { de: 'Hüfte stabil, der Rumpf widersteht der Rotation.', en: 'Hips still, brace against the rotation.' },
    homeVariant: { de: 'Tube-Band an der Türklinke fixieren.', en: 'Anchor a resistance band at the door handle.' },
  },
  {
    name: { de: 'Plank', en: 'Plank' },
    domain: 'core',
    sets: 3, reps: 45, weightKg: 0, weightStep: 5, repCeiling: 75, repFloor: 30,
    tempo: { de: 'Halten · ruhig atmen', en: 'Hold · breathe calmly' },
    formTip: { de: 'Gerade Linie von Kopf bis Ferse, Bauch fest.', en: 'Straight line head to heel, brace the core.' },
    homeVariant: { de: 'Identisch – überall ohne Equipment machbar.', en: 'Identical – doable anywhere, no equipment.' },
  },
];
