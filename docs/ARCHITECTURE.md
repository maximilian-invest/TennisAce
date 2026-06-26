# Architektur

## Leitprinzip: zwei native Apps, ein Produkt

TennisAce wird auf jeder Plattform **voll nativ** umgesetzt – SwiftUI auf iOS,
Jetpack Compose auf Android. Es gibt **keinen geteilten Quellcode** (kein
React Native, Flutter oder Kotlin Multiplatform). Das ist eine bewusste
Entscheidung zugunsten **echter paralleler Entwicklung**:

- Jede Plattform hat ihren eigenen Build, eigene CI und eigene Release-Kadenz.
- Kein Stream blockiert den anderen; es gibt keine geteilte Build-Abhängigkeit.
- Jede Plattform nutzt ihre nativen Stärken (SwiftUI-Previews, Compose-Previews,
  plattform-idiomatische Navigation, volle Tool-Unterstützung).

Der Preis dafür ist bewusste Duplikation der Logik. Damit beide Apps trotzdem
dasselbe Produkt bleiben, gibt es **zwei Synchronisationspunkte** – und nur die:

1. **[Domänenmodell](DOMAIN_MODEL.md)** – die fachlichen Begriffe (Match,
   Player, Set, Surface …) sind auf beiden Plattformen identisch definiert.
2. **[API-Vertrag](API_CONTRACT.md)** – die Schnittstelle zum Backend ist
   plattformneutral spezifiziert (JSON-Form, Felder, Fehlerfälle).

Ändert sich eins davon, wird es **zuerst in `docs/` abgestimmt**, dann auf
beiden Plattformen umgesetzt.

## Schichten (auf beiden Plattformen identisch)

Beide Apps folgen demselben unidirektionalen Schichtmodell (MVVM):

```
  View  ─────────────►  ViewModel  ─────────────►  Repository  ─────►  Datenquelle
 (SwiftUI /            (State +                   (Interface)         (Mock | Supabase | API)
  Compose)              Intent)
   ▲                       │
   └──────── State ◄───────┘
```

| Schicht | iOS | Android | Aufgabe |
|---------|-----|---------|---------|
| **View** | SwiftUI `View` | Compose `@Composable` | Stellt State dar, sendet Nutzer-Intents |
| **ViewModel** | `@Observable` / `ObservableObject` | `androidx.lifecycle.ViewModel` + `StateFlow` | Hält UI-State, ruft Repository |
| **Repository** | `protocol MatchRepository` | `interface MatchRepository` | Abstrahiert die Datenquelle |
| **Datenquelle** | `MockMatchRepository` (→ später Supabase) | `MockMatchRepository` (→ später Supabase) | Liefert/persistiert Daten |
| **Model** | `struct Match` … | `data class Match` … | Reines Fachmodell, ohne UI-/Netz-Bezug |

### Warum Repository-Interface?

Der einzige Ort, der das Backend kennt, ist die Repository-Implementierung. UI
und ViewModels hängen nur am Interface. Dadurch:

- laufen die Apps **sofort** gegen `MockMatchRepository` (kein Backend nötig),
- lässt sich Supabase (oder ein eigenes API) später einstecken, ohne UI-Code
  anzufassen,
- sind ViewModels isoliert testbar (Mock-Repo im Test injizieren).

## Verzeichnis-Mapping

Die Paketstruktur ist auf beiden Plattformen absichtlich parallel benannt,
damit man sich plattformübergreifend sofort zurechtfindet:

| Konzept | iOS (`ios/TennisAce/`) | Android (`…/tennisace/`) |
|---------|------------------------|--------------------------|
| App-Einstieg | `App/` | `MainActivity.kt`, `TennisAceApplication.kt` |
| Features (UI+VM) | `Features/Matches/` | `ui/matches/` |
| Fachmodell | `Models/` | `model/` |
| Datenzugriff | `Services/` | `data/` |
| Design/Theme | `Support/` | `ui/theme/` |
| Tests | `TennisAceTests/` | `src/test/` |

## Bewusst (noch) nicht enthalten

Das Setup hält die Grundfläche klein und erweiterbar. Folgendes ist absichtlich
noch nicht drin und kann bei Bedarf ergänzt werden:

- Dependency-Injection-Framework (aktuell: manuelle Konstruktor-Injektion)
- Persistenz/Offline-Cache (SwiftData / Room)
- Authentifizierung
- Analytics / Crash-Reporting

Diese Entscheidungen werden getroffen, wenn das erste echte Feature sie braucht –
nicht auf Vorrat.
