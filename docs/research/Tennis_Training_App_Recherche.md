# Tennis Off-Court Training App – Wissenschaftliche Recherche & kompletter Trainingsplan

> **Zweck:** Vollständige, quellenbelegte Grundlage für eine Tennis-Athletik-App (nur Kondition, Kraft, Schnelligkeit, Agilität, Core, Beweglichkeit/Prehab – **keine** Schlagtechnik). Deckt jedes Niveau ab: Anfänger → Fortgeschritten → starker Amateur → Profi (Alcaraz-Level) – mit **endloser Progression**, Eingangs-Leistungstest, Monatstest, Fortschritts-Tracking und Equipment-Adaption.
>
> Begleitdokument zu: **Tennis_App_Claude_Design_Prompt.md**

---

## TEIL 1 – WISSENSCHAFTLICHE GRUNDLAGEN (warum die App so aufgebaut ist)

### 1.1 Energiesysteme – worauf Tennis-Kondition wirklich basiert
Tennis ist ein **intervall-/anaerob-dominanter Sport mit aerober Erholungsbasis**. Die dominanten Systeme sind das **ATP-PC-System (anaerob-alaktazid)** und das **aerobe System**; die anaerobe Glykolyse (Laktat) trägt geringer bei.

| Variable | Wert | Konsequenz fürs Training |
|---|---|---|
| Ballwechseldauer | 4–10 s (Ø ~5–7 s) | Belastungsspitzen sind kurz & explosiv |
| Schläge pro Ballwechsel | 2,5–3 | Wenige, harte Aktionen |
| Pause zwischen Punkten (ITF) | 20 s; Seitenwechsel 90 s | Verhältnis Belastung:Pause ~1:3–1:5 |
| Effektive Spielzeit | 20–30 % (Sand), 10–15 % (schnell) | Aerobe Basis dient der Erholung |
| Hochintensive Aktionen / Match (best of 3) | 300–500 | Wiederholte-Sprint-Fähigkeit ist zentral |
| Herzfrequenz im Match | ~140–160 bpm (bis 190+ in langen Rallys) | Mittel-hohe Dauerbelastung |
| Ballwechsel-Verteilung | ~70 % der Punkte = 0–4 Schläge; nur ~3,8 % = 9+ Schläge | **ATP-PC/Repeated-Sprint vorrangig trainieren** |

**Fazit:** Kein langes, langsames Ausdauertraining – sondern kurze, intensive, multidirektionale Intervalle (Belastung:Pause 1:2–1:5) auf solider aerober Grundlage. (Quellen: Fernandez/Mendez-Villanueva/Pluim, BJSM 2006 – PMC2653872; Kovacs 2006.)

### 1.2 Bewegungsmuster – wie sich ein Tennisspieler bewegt
- **>70 % aller Bewegungen sind seitlich (lateral).** → Frontalebene & Adduktoren/Abduktoren trainieren.
- ~3 m pro Schlag, 8–12 m pro Punkt; **~80 % der Schläge innerhalb von 2,5 m** der Ausgangsposition.
- **~90 % der zurückgelegten Distanz ist Beschleunigung/Abbremsen.** → **Deceleration (Abbremsen) ist die meistvernachlässigte trainierbare Qualität.**
- Richtungswechsel: ~1,6 mittel-/hochintensive Richtungswechsel pro Punkt, oft >105°.
- **Rotationskraft über die kinetische Kette** (Füße/Knie → Core/Rumpf → Schulter/Ellbogen → Handgelenk). Rumpfrotation ist die Hauptkraftquelle für Grundschläge & Aufschlag.

### 1.3 Häufigste Verletzungen – wogegen die App präventiv trainiert
Faustregel: **Akute Verletzungen → untere Extremität; chronische/Überlastung → obere Extremität & Rumpf.** Untere Extremität = ~48–54 % aller Verletzungen.

| Region | Typ | Häufigste Pathologien | Prehab-Schwerpunkt in der App |
|---|---|---|---|
| Schulter (~17 %, meistbetroffen) | chronisch | Impingement, Rotatorenmanschette, GIRD (~45 % der Junioren) | hintere Manschette, Schulterblattstabilisatoren, Sleeper-/Cross-Body-Stretch |
| Ellbogen | chronisch | "Tennisarm" (laterale Epicondylitis) | exzentrische Unterarm-/Handgelenkarbeit |
| Unterer Rücken | chronisch | Lumbalbelastung, Bandscheibe | Anti-Extension-/Anti-Rotation-Core |
| Knie/Oberschenkel | gemischt | Patellasehne, Bänder/Meniskus | exzentrische Landekontrolle, einbeinige Kraft |
| Sprunggelenk | akut | Umknicken (häufigste Akutverletzung) | Dorsalflexions-Mobilität, Einbeinbalance, Band-Eversion |

**Wichtigster Befund:** Ein Programm aus **Core-Stabilität + exzentrischer Rotatorenmanschettenarbeit senkt Schulter-Überlastungsverletzungen um ~26 %.** → In der App ist Prehab in **jedes** Warm-up & jede Oberkörpereinheit fest eingebaut.

---

## TEIL 2 – DAS ENDLOSE LEVEL-SYSTEM

Vier Hauptstufen, jede mit **unendlich vielen Wochen-Zyklen**, die durch Progression nie „enden". Wer eine Stufe „übersteht" (Monatstest + Auto-Progression), wird hochgestuft. Wer am oberen Ende ist, bleibt im endlosen Profi-Modus mit immer härteren Mikrozyklen.

| Stufe | Wer | Off-Court Einheiten/Woche | Fokus | Intensität |
|---|---|---|---|---|
| **L1 Anfänger / Freizeit** | wenig/kein strukturiertes Training | 2 (1 Kraft + 1 Mobility/Kondition) + tägl. Band-Prehab | Bewegungsqualität, Grundkraft, Glute/Schulter-Prehab | 60–70 % | 
| **L2 Fortgeschritten / Club** | trainiert regelmäßig, spielt 3–4×/Wo | 2–3 (2 Kraft/Power + 1 Agilität/Kondition) | Maximalkraft-Basis, erste Plyometrie, Agilität | 70–80 % |
| **L3 Starker Amateur** | wettkampforientiert, athletisch | 3–4 periodisiert | Power, Schnelligkeit, Wiederholte-Sprint-Fähigkeit, Periodisierung | 80–90 % |
| **L4 Profi / Leistungssport** | endloser Hochleistungsmodus | 5–6 (in ~33–38 h/Wo eingebettet) | Maximale Power/RFD, Sprints links-rechts Vollgas, reaktive Agilität, Taper | 85–100 % |

**Innerhalb jeder Stufe** läuft eine **lineare bzw. undulierende Progression**: Gewicht/Wiederholungen/Sätze/Komplexität steigen wöchentlich. Erst wenn der Monatstest die Schwelle der nächsten Stufe erreicht, schaltet die App die nächste Stufe frei. **Es gibt kein Ende** – L4 generiert prozedural härtere Wochen (mehr Volumen, kürzere Pausen, reaktivere Drills, höhere Sprintqualität).

### Periodisierung (übergreifend, va. ab L3)
| Phase | Dauer | Fokus | Krafteinheiten/Wo |
|---|---|---|---|
| Off-Season (allg. Vorbereitung) | 8–12 Wo | Basis: Kondition, Hypertrophie/Kraft, Defizite beheben | 3–4 |
| Pre-Season (spez. Vorbereitung) | mehrere Wo | früh = Maximalkraft → spät = Power/Schnelligkeit | 2–3 |
| In-Season (Wettkampf) | Monate | Kraft/Power erhalten, Ermüdung minimieren, Prehab | 1–2 |
| Transition (aktive Erholung) | ~2 Wo | Regeneration, Cross-Training | minimal |

Tennis-Periodisierung ist eher **Load-Management** als klassische Blockperiodisierung (voller Turnierkalender): nur in Prioritäts-Wettkämpfe hinein tapern (Volumen runter, Intensität hoch halten), Kraft in-season „mikro-dosieren" (1–2 Einheiten).

---

## TEIL 3 – EINGANGS-LEISTUNGSTEST („Die erste Leistungsfeststellung", ~30 min)

8 Tests, je einer pro Leistungsdomäne, selbst durchführbar mit Handy, Maßband, Kreppband, 2–4 Hütchen/Flaschen, Stoppuhr. Jeder Test mit **No-Equipment-Variante**.

| # | Test | Misst | Protokoll (Kurz) | Equipment → Heim-Variante |
|---|---|---|---|---|
| 1 | **20 m Sprint (5 m/10 m Splits)** | Beschleunigung/Speed | Aus Stand max. 20 m; Bestzeit aus 2–3 Versuchen | Hütchen, Stoppuhr → Handy-Zeitlupe vs. Markierungen |
| 2 | **5-0-5 Agilität** (oder Spider Run am Court) | 180°-Richtungswechsel | 15 m anlaufen, letzte 5 m gestoppt: Plant + 180°-Wende + 5 m zurück; beide Beine | Hütchen, Stoppuhr |
| 3 | **Counter-Movement Jump (CMJ)** | Sprungkraft unten | Aus Stand max. hoch, Hände an Hüfte; Wand-Reach oder Flugzeit-App; Beste aus 3 | Wand + Kreide / App |
| 4 | **Standweitsprung** | Horizontale Power | Beidbeinig nach vorn, Landung 2 Füße; Linie bis Ferse | Maßband |
| 5 | **Medizinball-Überkopfwurf** (oder Liegestütze max) | Oberkörper-/Rumpf-Power (korreliert mit Aufschlag) | 2–3 kg Ball hinter Kopf, nach vorn werfen; 3 Versuche | Med-Ball → schwerer Ball / Liegestütze |
| 6 | **Unterarmstütz/Plank (max Haltezeit)** | Core-Ausdauer | Neutraler Plank bis zum Abbruch; Zeit | Stoppuhr |
| 7 | **Sit-and-Reach** | Beweglichkeit Hamstrings/unterer Rücken | Sitzend nach vorn reichen; Beste aus 3 | Box/Lineal an Wand/Stufe |
| 8 | **Beep-Test (20 m MSFT)** oder Yo-Yo IR1 | Aerobe/intermittierende Ausdauer | 20 m Shuttles im Takt der Pieptöne; Level + Shuttle beim Abbruch | Beep-App, 20 m, Hütchen |

**Vor jedem Test:** integriertes RAMP-Warm-up (s. Teil 5.8). Sicherheits-Screening vorab (PAR-Q-Stil): bei Schmerzen/Vorerkrankungen einzelne Tests überspringbar.

### Scoring → Leveleinstufung
**Schritt 1 – Punkte pro Test (0–100):** Rohwert auf Normtabelle (Teil 4) für Geschlecht & Alter mappen. Wo nur Mittelwert ± SD vorliegt: z-Score → `Punkte = 50 + 16,7 × z` (gekappt 0–100; bei Zeit-Tests invertieren, schneller = mehr Punkte).

**Schritt 2 – Tennis-Gewichtung:**

| Domäne | Tests | Gewicht |
|---|---|---|
| Schnelligkeit/Beschleunigung | 5/10/20 m Sprint | 20 % |
| Agilität/Richtungswechsel | 5-0-5, Spider, Hexagon | 25 % |
| Untere Power | CMJ, Standweitsprung | 20 % |
| Obere/rotative Power | Med-Ball, Liegestütze, Griffkraft | 15 % |
| Core-Ausdauer | Plank | 10 % |
| Aerob | Beep / Yo-Yo IR1 | 7 % |
| Beweglichkeit | Sit-and-Reach | 3 % |

**Schritt 3 – Gesamtscore → Stufe:**

| Score | Stufe |
|---|---|
| 0–39 | L1 Anfänger |
| 40–59 | L2 Fortgeschritten |
| 60–79 | L3 Starker Amateur |
| 80–100 | L4 Profi/Elite |

**App-Hinweise:** immer innerhalb Geschlecht × Altersband einstufen; **Domänen-Subscores als Radar/Spider-Chart** zeigen (motiviert mehr als eine Zahl und deckt die schwächste Tennis-Qualität auf → daraus Trainingspriorität ableiten). Monatlich **Rohwert-Veränderung** tracken (Band ist zu grob für 1 Monat); „verbessert" ab Veränderung > ~3–5 % (Messfehlerschwelle, da Tests ICC > 0,90).

---

## TEIL 4 – NORMWERTE-TABELLEN (für Einstufung & Tracking)

> Tennis-spezifische Normen existieren robust v. a. für **Jugend (U8–U18)**. Für **Erwachsene** wird auf allgemeine S&C-Normen zurückgegriffen (in der App als „allgemeine Bevölkerung, nicht tennis-spezifisch" kennzeichnen).

### 4.1 Jugend-Tennis männlich (U12/U14/U16), Mittel ± SD
| Test | U12 | U14 | U16 |
|---|---|---|---|
| CMJ (ohne Arme), cm | 32,6 ± 4,1 | 36,6 ± 4,8 | 43,8 ± 4,5 |
| CMJ mit Armschwung, cm | 38,3 ± 4,2 | 44,4 ± 8,4 | 52,5 ± 4,3 |
| 5 m Sprint, s | 1,68 | 1,63 | 1,52 |
| 10 m Sprint, s | 2,56 | 2,45 | 2,29 |
| 20 m Sprint, s | 4,12 | 3,89 | 3,56 |

### 4.2 Jugend-Tennis 20 m Sprint nach Alter & Geschlecht (Meta-Analyse, 8.008 Spieler)
| Alter | m (s) | w (s) |
|---|---|---|
| U8 | 4,31 ± 0,37 | 4,42 ± 0,23 |
| U18 | 3,08 ± 0,11 | 3,38 ± 0,19 |

### 4.3 Spider Run (Tennis) Zielzeiten
| Gruppe | Ziel |
|---|---|
| Junioren 8–10 J | 22–23 s |
| Junioren 10–12 J | 20–22 s |
| Junioren 12–15 J | ~20 s |
| Erwachsene/Fortgeschritten | 18–20 s (Elite-Junioren ~15–17 s) |

### 4.4 CMJ Erwachsene (allgemein, ~20–30 J)
| Bewertung | m (cm) | w (cm) |
|---|---|---|
| Exzellent | >70 | >60 |
| Sehr gut | 61–70 | 51–60 |
| Überdurchschnittl. | 51–60 | 41–50 |
| Durchschnitt | 41–50 | 31–40 |
| Unterdurchschnittl. | 31–40 | 21–30 |

### 4.5 Standweitsprung (Erwachsene Faustregel)
Untrainierte Männer ~180–215 cm, Frauen ~120–150 cm. Jugend 50. Perzentil: m 12 J 160 cm / 16 J 203 cm; w 12 J 148 cm / 16 J 157 cm.

### 4.6 Medizinball-Überkopfwurf (3 kg, athletische Erwachsene)
| Level | m (m) | w (m) |
|---|---|---|
| Elite | >12,5 | >9,5 |
| Sehr gut | 11,0–12,5 | 8,0–9,5 |
| Gut | 9,0–11,0 | 6,5–8,0 |
| Durchschnitt | 7,0–9,0 | 5,0–6,5 |

### 4.7 Plank-Haltezeit
| Bewertung | Zeit |
|---|---|
| Anfänger | <30 s |
| Durchschnitt | 45–90 s |
| Gut/athletisch | 90–120 s |
| Exzellent | >120 s |

### 4.8 Liegestütze (max, ACSM, 20–29 J)
| | m | w (modifiziert) |
|---|---|---|
| Exzellent | 36+ | 30+ |
| Gut | 29–35 | 21–29 |
| Durchschnitt | 22–28 | 15–20 |
| Unterdurchschnittl. | 17–21 | 10–14 |
(pro Lebensdekade ~3–5 Wdh. weniger)

### 4.9 Beep-Test (20 m MSFT, 21–30 J)
| | m | w |
|---|---|---|
| Exzellent | L12 S12 | L10 S8 |
| Überdurchschnittl. | L11 S7 | L9 S2 |
| Durchschnitt | L9 S3 | L6 S6 |
VO2max-Schätzung (intermittierend): `VO2max = 0,38 × Gesamt-Shuttles + 25,98`.

---

## TEIL 5 – ÜBUNGSDATENBANK (jede Übung mit Heim-/No-Equipment-Variante)

Jede Übung: Zweck · Equipment → Heim-Substitution. Reihenfolge leicht → schwer (= App-Progression innerhalb der Kategorie).

### 5.1 Beinkraft
1. Körpergewicht-Kniebeuge – Grundmuster · keins
2. Glute Bridge – Glute/Ham-Aktivierung · keins
3. Box Squat – Tiefe/Kontrolle · Stuhl/Couch
4. Goblet Squat – belastete Kniebeuge · KH/KB → Rucksack/Wasserkanister
5. Ausfallschritt rückwärts/gehend – einbeinig + Balance · Rucksack
6. Seitlicher Ausfallschritt – Frontalebene, Adduktoren (court-spezifisch) · Rucksack
7. Step-Up – Abdruck einbeinig · Treppe + Rucksack
8. KH-Rumänisches Kreuzheben – hintere Kette · Kanister
9. Kniebeuge/Trap-Bar-Kreuzheben schwer – Maximalkraftbasis · schwerstes Goblet
10. Hip Thrust – max. Glute-Power (Abdruck & Aufschlag) · einbeinig/Band-Bridge
11. Bulgarian Split Squat – einbeinige Kraft + Balance · Couch + Rucksack
12. Einbeiniges RDL – schwerstes einbeiniges Hinge, korrigiert L/R-Asymmetrie · Kanister
*Beispiel-Dosis: Kniebeuge 4×6–8, RDL 3×6–8.*

### 5.2 Oberkörper & Schulter + Rotatorenmanschette/Schulterblatt-Prehab
1. Schulterblatt-Retraktion · Band
2. Sleeper-Stretch (Mobility, GIRD) · keins
3. Cross-Body-Adduktionsstretch · keins
4. Band-Außenrotation @0° (Manschette/Abbremser) · Band
5. Prone Y-T-W (unterer/mittlerer Trapez) · leichte KH
6. Serratus-Punch / Push-up-Plus · Band/Körpergewicht
7. Band-/Ruderzug · Rucksack / Inverted Row an Tischkante
8. Face Pull (gegen Innenrotationsdominanz) · Band über Tür
9. Band-Außenrotation @90° (Aufschlagposition) · Band
10. Liegestütz (Inkline→Standard→Plus) · keins
11. Einarm-KH-Rudern · Rucksack/Stuhl
12. Überkopfdrücken (nur bei gesunder Manschette) · Landmine/Rucksack
13. Diagonales D2-PNF-Muster (Wurfmuster) · Band/KH
**Regel: ziehen > drücken; an Überkopftagen nie Prehab auslassen; GIRD dauerhaft adressieren.**

### 5.3 Core & Anti-Rotation
1. Front-Plank (Anti-Extension) · keins · 20/30/60 s ×3
2. Side-Plank (Anti-Lateralflexion) · keins · 20/30/60 s ×2–3/Seite
3. Dead Bug · keins · 8–12/Seite ×2–3
4. Bird Dog · keins · 8–10/Seite ×2–3
5. Hüftbrücke · keins
6. Band-Anti-Rotation Dead Bug · Tür-Band
7. **Pallof Press** (Flaggschiff Anti-Rotation – genau die Core-Aufgabe im Tennis) · Tür-Band/Kabel
8. Stehende Band-/Kabel-Rotation · Tür-Band · 8–10/Seite
9. Med-Ball-Rotationswurf (VH/RH-Imitation) – explosive Rumpfpower → Aufschlag/Grundschlag · Med-Ball + Wand
10. Overhead-/Step-behind-Rotationswurf (fortgeschritten, volle Kette) · Med-Ball + Wand
*Sequenz: erst Stabilität/Anti-Rotation, dann Rotationspower.*

### 5.4 Explosive Power / Plyometrie
*Cue: Landung/Abbremsen meistern, bevor reaktive (Depth-)Arbeit. 2–3×/Wo, 6–12-Wochen-Blöcke.*
1. Pogo Hops · keins
2. Seilspringen · Seil → Pogos
3. Squat/Counter-Movement Jump · keins
4. Box Jump (weiche Landung) · niedrige Stufe/Tuck Jump
5. Standweitsprung (horizontale Power, sehr tennis-relevant) · keins
6. Lateral Bound / Skater (laterale Power + einbeiniges Abbremsen) · keins
7. Med-Ball Chest Pass · Plyo-Liegestütz
8. Med-Ball Overhead Slam (Aufschlagmuster) · Burpee/Woodchop mit Rucksack
9. Med-Ball Rotationswurf · Band-Chop
10. Einbeiniger Box Jump / Bound (unilaterale RFD) · einbeinige Wiesen-Hops
11. Reaktiver Bound + Cut auf Signal · Hütchen/Partner
12. Depth Jump (reaktive Kraft, fortgeschritten) · unterste Treppenstufe
13. Kontrast: Depth Jump → Broad Jump/Lateral Bound · Box

### 5.5 Schnelligkeit & Beschleunigung
*Prinzip: ≥90 % Intensität; Accel 5–15 m, Top-Speed 20–40 m; volle Erholung; 6–12 Sprints/Einheit; Abbruch wenn 2 Sprints in Folge >10 % langsamer; ≥48 h zwischen Sprinteinheiten.*
1. A-March · keins
2. A-Skip · keins
3. Wall Drive (Beschleunigungswinkel) · Wand
4. Falling Start → 5 m · keins
5. 5 m & 10 m Accel (aus Ready-Position) · Hütchen → Handy
6. 20 m Sprint · Hütchen
7. Varied-Start-Sprints (aus seitl./rückw. → Sprint) · Hütchen
8. 30–40 m Max-Velocity-Sprint · Freifläche
9. Berg-/Steigungssprints (kraftvoll, gelenkschonend) · Steigung
10. Resisted Band Sprint · Band+Partner → Handtuch von Partner gehalten
11. Schlitten schieben/ziehen (fortgeschritten) · Wäschekorb beladen/Reifen
12. Flying 10–20 m (reines Top-End, fortgeschritten) · Freifläche

### 5.6 Agilität & Richtungswechsel
*Erst vorgeplante CODs, dann reaktive Agilität; Abbremsen betonen.*
1. Lateral Shuffle · 2 Hütchen
2. Leiter – beide Füße rein · Leiter → Kreide/Tape
3. Leiter – Icky Shuffle · Tape
4. Lateral Shuffle mit abruptem Stopp (Decel) · 2 Hütchen
5. Decel-Drill (5–10 m Sprint → kontrollierter Stopp) · Hütchen
6. Figure-8-Hütchenlauf · Flaschen
7. T-Test / modifizierter T-Test · 4 Hütchen
8. Pro-Agility / 5-10-5 · 3 Hütchen
9. 5-0-5 (isolierte 180°-Wende) · 2 Hütchen
10. **Spider Drill** (5 Bälle, Court – tennis-spezifischste multidirektionale Agilität, ICC 0,93–0,95) · 5 Bälle/Court → Stern-Markierungen
11. Partner-Spiegel-Drill (reaktive Agilität) · 2 Hütchen + Partner
12. Ball-Drop-Reaktionssprint (Erststep-Reaktion) · Ball + Partner
13. Reaktionslicht/„Call-the-Cone"-Cut · Lichter/Hütchen + Zuruf
14. Reaktive Bound-and-Cut-Kombis · Hütchen + Signal

### 5.7 Aerobe & anaerobe Kondition
*Kurz, intensiv, multidirektional, Belastung:Pause 1:2–1:5 – kein langes Dauerlaufen. HIIT brachte +28,9 % tennis-spezifische Ausdauer vs. RST +14,5 %; RST senkte Sprintzeit −3,8 %.*
1. Aerobe Basis 20–40 min (Rad/Lauf) · Gehen-Joggen
2. Tempo-Intervalle 30s/30s · Shuttle-Joggen
3. **Punktsimulation 6–8 s/20 s ×6–8** (~1:3) · Hütchen → In-Place-Sprints
4. Repeated-Effort 20–30 s/20–30 s ×6–8, 2–3 min zwischen Drills · Court/Hütchen
5. On-Court-Suicides 5–20 Wdh., 30–90 s Pause · Park-Markierungen
6. Spider Run als Intervall (3–4 Sätze, ~90 s Pause) · 5 Bälle
7. Star/Box/Big-X-Court-Muster (multidirektional unter Ermüdung) · Hütchen
8. Rad/Lauf-HIIT (~15–30 s hart/Pause matched) · Hügel-/Treppenrepeats
9. SIT/RSA: 6–8 × 20–30 m max, 20–30 s Pause, 2–3×/Wo · Park
10. Wiederholte Sprints, unvollständige Erholung (~1:2–1:3) · Freifläche
*Anaerob-Blöcke ~4–5×/Jahr, 2–4 Wo, ~6–8 Wo vor Turnier – nicht ganzjährig.*

### 5.8 Mobilität, Beweglichkeit & Warm-up/Cooldown – RAMP-Protokoll
**RAMP (~10–15 min, Intensität steigt):**
- **R – Raise:** 3–5 min Jog, Hüpfen, Shuffles, leichte Leiter
- **A – Activate:** Glute Bridges, Band Pull-aparts, Monster Walks, Dead Bugs, Schulterblatt-Aktivierung
- **M – Mobilize:** Beinpendeln, Ausfallschritt mit Rotation, World's Greatest Stretch, BWS-Rotationen, Hüftöffner
- **P – Potentiate:** Beschleunigungen, Split-Step-Shuffles, Med-Ball-Würfe, Steigerungsläufe

**Prehab-Prioritäten:** (1) Schulter/Schulterblatt – Sleeper/Cross-Body, Band-AR exzentrisch, Y/T/W; (2) BWS – Open-Book, Foam-Roller-Extension; (3) Sprunggelenk – Knee-to-Wall + Einbeinbalance + Band-Eversion; (4) Handgelenk/Unterarm – Flex/Ext + Pro-/Supination, exzentrische Extensoren.
**Cooldown:** statisches Dehnen gehört **hierhin** (~30 s Halten), nicht ins Warm-up (vorher senkt es kurzfristig die Power). Foam Rolling für Regeneration/ROM.

---

## TEIL 6 – TRAININGSPLÄNE PRO STUFE (Wochenstruktur)

### L1 Anfänger – 2 Einheiten/Woche + tägl. 5-min-Band-Prehab
- **Tag A (Kraft, Ganzkörper, 30–45 min):** RAMP → Goblet Squat 3×8 · Glute Bridge 3×10 · Liegestütz (Inkline) 3×8 · Einarm-Rudern 3×10 · Pallof Press 2×8/Seite · Front-Plank 3×20–30 s → Cooldown
- **Tag B (Mobility/Kondition, 30 min):** RAMP → Lateral Shuffle · Leiter Basics · Pogo Hops 3×10 · Standweitsprung 3×3 · Punktsimulation 6 s/18 s ×6 → Cooldown
- **Täglich:** Band-Außenrotation 2×15 · Y-T-W 2×10 · Knee-to-Wall 2×10

### L2 Fortgeschritten – 2–3 Einheiten/Woche
- **Tag A (Kraft unten + Core):** Kniebeuge 4×6 · RDL 3×8 · Bulgarian Split Squat 3×8/Bein · Pallof 3×10 · Side-Plank 3×30 s
- **Tag B (Kraft oben + Power):** Liegestütz 4×Max · Rudern 4×8 · Überkopfdrücken 3×8 · Med-Ball Chest Pass 4×5 · Med-Ball Rotationswurf 3×8/Seite · Y-T-W 3×12
- **Tag C (Agilität + Kondition):** Box Jump 4×4 · Lateral Bound 3×6/Seite · 5-0-5 Drills · Leiter · Repeated-Effort 20s/20s ×6

### L3 Starker Amateur – 3–4 Einheiten/Woche, periodisiert
- **Tag 1 Maximalkraft:** Kniebeuge 5×4 @85 % · Trap-Bar-Kreuzheben 4×4 · Hip Thrust 4×6 · einbeiniges RDL 3×8 · Pallof 3×12
- **Tag 2 Power/Plyo:** Kontrast Box Jump→Broad Jump 5×3 · Lateral Bound 4×5 · Med-Ball Overhead Slam 4×5 · Rotationswurf 4×8/Seite · Depth Jump 4×4
- **Tag 3 Schnelligkeit/Agilität:** Wall Drive · 10 m & 20 m Sprints 6× · Pro-Agility · Spider Drill reaktiv · Partner-Spiegel
- **Tag 4 Kondition/Oberkörper:** Klimmzüge 4×Max · Face Pull 3×15 · Band-AR @90° 3×15 · SIT 6×25 m · Core-Zirkel
- Periodisierung: 3–4 Wo Akkumulation → 1 Wo Deload; tapern in Prioritätsturniere.

### L4 Profi / Leistungssport – 5–6 Einheiten/Woche (endloser Modus, in Court-Tage eingebettet)
- Zwei Court-Blöcke täglich, dazwischen ~45 min Gym (Hinge + Rotations-Med-Ball, kurze Accel-Sprints, Hüft-/BWS-Mobilität).
- Sprints **links-rechts Vollgas** (reaktive Cuts auf Lichtsignal), max RFD-Plyometrie, einbeinige RDL 3×10/Bein, Plyo-Liegestütze, Rotationswürfe 3×12/Seite, Agilität ~7–8 min/Block, HIIT.
- Heavy-Kraft & Ausdauer auf getrennte Tage (Interferenzeffekt), ≥48 h Heavy vor Wettkampf, Taper nur in Prioritätsevents.
- **Endlose Progression:** App generiert prozedural härtere Wochen (Volumen ↑, Pausen ↓, mehr reaktive Entscheidungen, höhere Sprint-Mindestqualität, neue Übungsvarianten).

### Integrationsregeln (alle Stufen)
Hochintensive Kraft/Power **nach** Court-Einheiten oder an court-armen Tagen; ≥48 h vor Wettkampf; Heavy-Kraft & Ausdauer trennen; in-season Richtung Prehab + explosive Erhaltung; Taper nur in Prioritätsevents (Volumen runter, Intensität hoch).

---

## TEIL 7 – PROGRESSIONS- & AUTO-UPLEVEL-LOGIK (das „kein Ende"-Prinzip)

**Innerhalb der Woche/Stufe (Auto-Regulation):**
- Wenn alle Sätze einer Übung mit guter Technik + RPE ≤ 7 geschafft → nächste Woche Last/Wdh/Komplexität erhöhen (Doppel-Progression: erst Wdh bis Obergrenze, dann Gewicht).
- Wenn 2 Einheiten in Folge nicht geschafft → halten/leicht reduzieren (Deload).
- Sprints: Abbruch bei 2 Sprints in Folge >10 % langsamer (Qualität schützen).

**Stufenwechsel (Monatstest, Teil 8):**
- Erreicht der Tennis-Gesamtscore die Schwelle der nächsten Stufe (40/60/80) **und** sind die Schlüssel-Domänen (Agilität, Power) nicht im Defizit → App schlägt Hochstufung vor („Du bist zu gut für L1 – willkommen bei L2!").
- Optional manuelles Hoch-/Runterstufen.

**Am oberen Ende (L4):** kein Ende – prozeduraler Generator erhöht kontinuierlich Volumen/Dichte/Reaktivität und rotiert Übungsvarianten, sodass der Nutzer **unendlich gefordert** bleibt.

---

## TEIL 8 – MONATSTEST & FORTSCHRITTS-TRACKING

- **Monatlich** dieselben 8 Tests wie der Eingangstest (gleiche Protokolle/Konventionen für Vergleichbarkeit; eine Plank-/Sit-and-Reach-Konvention fest verankern).
- **Tracking-Daten:** pro Übung Gewicht × Wdh × Sätze, beste Sprint-/Agilitätszeiten, Sprunghöhe/-weite, Plank-Zeit, Beep-Level, RPE, Trainingsfrequenz, Streak.
- **Dashboard:** 
  - Radar/Spider-Chart der 7 Domänen (jetzt vs. Eingangstest)
  - Verlaufskurven je Test (z. B. CMJ in cm über Monate, Kniebeuge-1RM-Schätzung)
  - PR-Badges, „verbessert"-Marker ab > ~3–5 % Veränderung
  - Stufen-Fortschrittsbalken zur nächsten Stufe
  - Wochen-Compliance & Streak

---

## TEIL 9 – EQUIPMENT-EMPFEHLUNGEN (Adaption & Kauf-Priorität)

Die App erkennt im Onboarding das verfügbare Equipment (kein/Heim/Gym) und **adaptiert jede Übung automatisch**. Wer nichts hat, bekommt Kaufvorschläge in dieser Priorität:

**Tier 1 (zuerst – bestes Preis/Wert, Prehab + Aktivierung):**
1. Mini-Bänder (~10–15 €) – Glute/Hüft-Aktivierung (>50 % der Court-Bewegung)
2. Tube-Bänder + Türanker (~20–30 €) – Rotatorenmanschette/Schulter-Prehab, Rudern, Face Pulls
3. Springseil (~10 €) – Kondition + Fußschnelligkeit

**Tier 2 (danach – Power + Last):**
4. Medizin-/Slam-Ball ~3–5 kg (~25–40 €) – höchster Power-Wert, Rotationswürfe → Aufschlag/Grundschlag
5. Eine Kettlebell ~12–16 kg **oder** ein Kurzhantelpaar (~30–80 €)
6. Foam Roller (~20–30 €)

**Tier 3 (bei Commitment):**
7. Verstellbare Kurzhanteln · 8. Hütchen · 9. Türklimmzugstange · 10. TRX · 11. Agility-Leiter (niedrigste Priorität – trainiert Rhythmus, nicht die reaktive Bewegung; Hütchen + reaktive Drills übertragen besser)

**Minimalist-Starter (~70–90 €):** Mini-Bänder + Tube-Bänder + Springseil + ein Med-Ball. **+50–80 €:** Kettlebell + Foam Roller → deckt Prehab, Power, Kondition und Grundkraft ab.

---

## TEIL 10 – QUELLEN (Auswahl)

**Energiesysteme & Anforderungsprofil**
- Fernandez, Mendez-Villanueva, Pluim – *Intensity of tennis match play*, BJSM 2006 – https://pmc.ncbi.nlm.nih.gov/articles/PMC2653872/
- Kovacs – *Applied physiology of tennis performance*, BJSM 2006 – https://pubmed.ncbi.nlm.nih.gov/16632565/
- Rally-Längen-Verteilung – https://pmc.ncbi.nlm.nih.gov/articles/PMC10538650/
- Human Kinetics – Tennis & Energy Systems – https://us.humankinetics.com/blogs/excerpt/tennis-and-energy-systems

**Bewegung, Richtungswechsel, Verletzungen**
- Movement for Tennis – Importance of Lateral Training – https://www.researchgate.net/publication/232108291
- Efficient Deceleration – The Forgotten Factor – https://www.researchgate.net/publication/232115906
- Hawk-Eye COD-Analyse – https://pubmed.ncbi.nlm.nih.gov/38320234/
- Tennis-Verletzungsepidemiologie (Fu et al.) – https://pmc.ncbi.nlm.nih.gov/articles/PMC5825333/
- Kinetische Kette/Prehab senkt Schulterverletzungen ~26 % – https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12568103/

**Fitness-Tests & Normwerte**
- Axman et al. 2025 – Systematic Review, 8.008 Jugend-Tennisspieler – https://pmc.ncbi.nlm.nih.gov/articles/PMC12397999/
- Barbaros et al. 2023 – U12/U14/U16 Werte – https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2023.1241847/full
- NSCA JASC – Assessment Battery High-Performance Youth Tennis – https://www.strengthandconditioning.org/jasc-31-4/4042
- Topend Sports – Test-Normen – https://www.topendsports.com/testing/index.htm
- BrianMac – Beep Test – https://www.brianmac.co.uk/beep.htm
- USTA Spider Drill – http://assets.usta.com/assets/1/USTA_Import/USTA/dps/doc_437_254.pdf

**Programmgestaltung, Periodisierung, Dosierung**
- ACSM Position Stand – Progression Models in Resistance Training (2009) + 2026 Update – https://acsm.org/resistance-training-guidelines-update-2026/
- NSCA Training Load Chart – https://www.nsca.com/contentassets/61d813865e264c6e852cadfe247eae52/nsca_training_load_chart.pdf
- ITF Coaching & Sport Science Review – Periodisierung im Wettkampf – https://itfcoachingreview.com/index.php/journal/article/view/271
- Strength & conditioning in tennis: current research and practice (JSAMS 2007) – https://pubmed.ncbi.nlm.nih.gov/17597004/
- USTA Player Development – 25-Week College Conditioning Plan – https://s3.amazonaws.com/ustaassets/assets/689/15/15412_player_development_college_conditioning_plan_(1).pdf
- NSCA Youth Resistance Training Position Statement – https://journals.lww.com/nsca-jscr/fulltext/2009/08005/youth_resistance_training__updated_position.2.aspx
- RAMP Warm-up (Jeffreys) – https://humankinetics.me/2019/03/04/what-is-the-ramp-warm-up/

*Vollständige Quellenliste mit Einzelbelegen in den Forschungsnotizen.*
