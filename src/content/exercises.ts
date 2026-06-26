// Sample exercise library (placeholder until the research doc's exercise data,
// Teil 5, arrives). Instructional text is DE for now; names are bilingual.
import type { Domain } from '@/domain/models';

export interface Exercise {
  id: string;
  name: { de: string; en: string };
  domain: Domain;
  difficulty: 1 | 2 | 3;
  quality: string; // dosage label, e.g. "Kraft"
  steps: string[];
  formTips: string[];
  mistakes: string[];
  variants: { gym: string; home: string; none: string };
  dosage: { intensity: string; reps: string; sets: string; rest: string };
}

const D = {
  kraft: { intensity: '70–85%', reps: '3–6', sets: '3–5', rest: '2–3′' },
  power: { intensity: '30–60%', reps: '3–5', sets: '3–5', rest: '2–3′' },
  speed: { intensity: 'max', reps: '2–4', sets: '4–6', rest: '3–5′' },
  agility: { intensity: 'max', reps: '3–5', sets: '3–4', rest: '2–3′' },
  core: { intensity: 'Körpergew.', reps: '8–15', sets: '3', rest: '60–90″' },
  prehab: { intensity: 'leicht', reps: '12–15', sets: '2–3', rest: '45–60″' },
  mobility: { intensity: '–', reps: '5–8/Seite', sets: '1–2', rest: 'gering' },
};

export const EXERCISES: Exercise[] = [
  {
    id: 'goblet-squat', name: { de: 'Goblet Squat', en: 'Goblet Squat' }, domain: 'powerLower', difficulty: 1, quality: 'Kraft',
    steps: ['Gewicht vor der Brust halten, Füße schulterbreit.', 'Tief in die Hocke, Knie Richtung Zehen.', 'Explosiv hoch, oben Po anspannen.'],
    formTips: ['Fersen am Boden, Brust aufrecht.', 'Knie nicht nach innen kippen lassen.'],
    mistakes: ['Rücken rundet sich unten.', 'Nur halbe Tiefe.'],
    variants: { gym: 'Kurzhantel/Kettlebell vor der Brust.', home: 'Rucksack mit Büchern vor der Brust.', none: 'Körpergewicht, Arme nach vorn gestreckt.' },
    dosage: D.kraft,
  },
  {
    id: 'bulgarian-split-squat', name: { de: 'Bulgarian Split Squat', en: 'Bulgarian Split Squat' }, domain: 'powerLower', difficulty: 2, quality: 'Kraft',
    steps: ['Hinteres Bein erhöht ablegen.', 'Vorderes Knie tief beugen.', 'Über die vordere Ferse hochdrücken.'],
    formTips: ['Rumpf leicht vorgeneigt, stabil.', 'Vorderes Knie stabil über dem Fuß.'],
    mistakes: ['Gewicht auf der hinteren Fußspitze.', 'Knie kippt nach innen.'],
    variants: { gym: 'Kurzhanteln in beiden Händen.', home: 'Hinteres Bein auf Couch/Stuhl.', none: 'Körpergewicht, Hände an die Hüfte.' },
    dosage: D.kraft,
  },
  {
    id: 'single-leg-rdl', name: { de: 'Einbeiniges RDL', en: 'Single-leg RDL' }, domain: 'powerLower', difficulty: 2, quality: 'Kraft',
    steps: ['Auf einem Bein stehen, Standbein leicht gebeugt.', 'Hüfte nach hinten, Oberkörper kippt vor.', 'Über die Hüfte zurück nach oben.'],
    formTips: ['Rücken neutral, Hüfte führt die Bewegung.', 'Kontrolliert und langsam.'],
    mistakes: ['Rücken rundet sich.', 'Hüfte rotiert auf.'],
    variants: { gym: 'Kurzhantel in der Gegenhand.', home: 'Wasserkanister/Rucksack als Gewicht.', none: 'Körpergewicht, Arme als Ausgleich.' },
    dosage: D.kraft,
  },
  {
    id: 'hip-thrust', name: { de: 'Hip Thrust', en: 'Hip Thrust' }, domain: 'powerLower', difficulty: 1, quality: 'Kraft',
    steps: ['Schultern erhöht, Füße aufgestellt.', 'Hüfte hoch, oben Po fest anspannen.', 'Kontrolliert absenken.'],
    formTips: ['Rippen unten lassen, kein Hohlkreuz.', 'Schienbein senkrecht oben.'],
    mistakes: ['Überstrecken im unteren Rücken.', 'Nicht voll hochdrücken.'],
    variants: { gym: 'Langhantel/Kurzhantel auf der Hüfte.', home: 'Rucksack auf der Hüfte, Schultern auf Couch.', none: 'Körpergewicht, ggf. einbeinig.' },
    dosage: D.kraft,
  },
  {
    id: 'pallof-press', name: { de: 'Pallof Press', en: 'Pallof Press' }, domain: 'core', difficulty: 1, quality: 'Core',
    steps: ['Seitlich zum Band, Griff vor der Brust.', 'Arme gerade nach vorn drücken.', 'Halten, dann zurückführen.'],
    formTips: ['Hüfte stabil, Rumpf widersteht der Rotation.', 'Ruhig atmen.'],
    mistakes: ['Oberkörper dreht zum Band.', 'Schultern hochgezogen.'],
    variants: { gym: 'Kabelzug auf Brusthöhe.', home: 'Tube-Band an der Türklinke fixieren.', none: 'Isometrisch ohne Band (Rumpf bewusst spannen).' },
    dosage: D.core,
  },
  {
    id: 'medball-rotational-throw', name: { de: 'Med-Ball Rotationswurf', en: 'Med-ball Rotational Throw' }, domain: 'powerUpper', difficulty: 2, quality: 'Power',
    steps: ['Seitlich zur Wand, Ball auf Hüfthöhe.', 'Aus der Hüfte explosiv rotieren.', 'Ball kraftvoll gegen die Wand werfen.'],
    formTips: ['Kraft kommt aus Beinen & Hüfte.', 'Locker und explosiv, nicht verkrampft.'],
    mistakes: ['Nur mit den Armen werfen.', 'Keine Hüftrotation.'],
    variants: { gym: 'Med-Ball (3–4 kg) gegen die Wand.', home: 'Leichter Ball/Rucksack, Schattenwurf.', none: 'Schattenrotation explosiv ohne Ball.' },
    dosage: D.power,
  },
  {
    id: 'lateral-bound', name: { de: 'Lateral Bound', en: 'Lateral Bound' }, domain: 'powerLower', difficulty: 2, quality: 'Power',
    steps: ['Auf einem Bein, leicht in die Hocke.', 'Explosiv seitlich abspringen.', 'Auf dem anderen Bein stabil landen.'],
    formTips: ['Weich landen, Landung 1 s halten.', 'Knie stabil über dem Fuß.'],
    mistakes: ['Wegknicken bei der Landung.', 'Kein Stoppen der Landung.'],
    variants: { gym: 'Auf Markierungen/Hürden seitlich.', home: 'Über ein Handtuch seitlich springen.', none: 'Körpergewicht, seitliche Sprünge.' },
    dosage: D.power,
  },
  {
    id: 'depth-jump', name: { de: 'Depth Jump', en: 'Depth Jump' }, domain: 'powerLower', difficulty: 3, quality: 'Power',
    steps: ['Von kleiner Box heruntertreten.', 'Bei Bodenkontakt sofort explosiv hoch.', 'Bodenkontakt so kurz wie möglich.'],
    formTips: ['Minimaler Bodenkontakt, „heiß" abspringen.', 'Weich aber reaktiv landen.'],
    mistakes: ['Zu lange am Boden.', 'Zu hohe Box (Qualität leidet).'],
    variants: { gym: 'Plyo-Box 20–30 cm.', home: 'Untere Treppenstufe.', none: 'Reaktive Strecksprünge am Boden.' },
    dosage: D.power,
  },
  {
    id: 'sprint-20m', name: { de: '20 m Sprint', en: '20 m Sprint' }, domain: 'speed', difficulty: 2, quality: 'Speed',
    steps: ['Aus 3-Punkt-Start vorspannen.', 'Explosiv beschleunigen, flacher Winkel.', 'Über 20 m voll durchziehen.'],
    formTips: ['Vollständige Pausen zwischen Läufen.', 'Arme aktiv mitführen.'],
    mistakes: ['Zu kurze Pausen (Speed leidet).', 'Aufrichten zu früh.'],
    variants: { gym: 'Halle/Bahn mit Markierungen.', home: 'Im Park / auf dem Court.', none: 'Identisch – nur Platz nötig.' },
    dosage: D.speed,
  },
  {
    id: 'spider-drill', name: { de: 'Spider Drill', en: 'Spider Drill' }, domain: 'agility', difficulty: 2, quality: 'Agilität',
    steps: ['5 Bälle an den Court-Punkten verteilen.', 'Von der Mitte zu jedem Ball sprinten.', 'Ball holen, zurück zur Mitte.'],
    formTips: ['Tiefe Position bei Richtungswechseln.', 'Kurze, schnelle Schritte.'],
    mistakes: ['Aufrecht laufen.', 'Bremsweg zu lang.'],
    variants: { gym: 'Hütchen statt Bälle.', home: 'Markierungen mit Socken/Tape.', none: 'Schattendrill nach Ansage.' },
    dosage: D.agility,
  },
  {
    id: 'band-external-rotation', name: { de: 'Band-Außenrotation', en: 'Band External Rotation' }, domain: 'powerUpper', difficulty: 1, quality: 'Prehab',
    steps: ['Ellbogen am Körper, 90° gebeugt.', 'Unterarm gegen das Band nach außen.', 'Langsam zurückführen.'],
    formTips: ['Ellbogen bleibt am Körper.', 'Langsam und kontrolliert.'],
    mistakes: ['Ellbogen wandert weg.', 'Zu schweres Band.'],
    variants: { gym: 'Kabelzug niedrig, leicht.', home: 'Tube-/Mini-Band an Türgriff.', none: 'Isometrisch gegen die andere Hand.' },
    dosage: D.prehab,
  },
  {
    id: 'worlds-greatest-stretch', name: { de: "World's Greatest Stretch", en: "World's Greatest Stretch" }, domain: 'mobility', difficulty: 1, quality: 'Mobility',
    steps: ['Tiefer Ausfallschritt nach vorn.', 'Ellbogen Richtung vorderem Fuß.', 'Oberkörper zur vorderen Seite öffnen.'],
    formTips: ['Ruhig atmen, in die Dehnung sinken.', 'Hintere Hüfte aktiv strecken.'],
    mistakes: ['Hektisch durchhuschen.', 'Hinteres Knie ganz am Boden ziehen.'],
    variants: { gym: 'Im Warm-up-Bereich.', home: 'Überall ohne Equipment.', none: 'Identisch – kein Equipment nötig.' },
    dosage: D.mobility,
  },
];
