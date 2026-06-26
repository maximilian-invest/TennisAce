# TennisAce — iOS

Native iOS-App in **Swift** mit **SwiftUI** (iOS 17+).

## Voraussetzungen

- macOS mit **Xcode 15+**
- **XcodeGen** — `brew install xcodegen` (oder via [Mint](https://github.com/yonaskolb/Mint): `mint bootstrap`)

## Projekt generieren & öffnen

Das `.xcodeproj` wird **nicht eingecheckt**, sondern aus [`project.yml`](project.yml)
generiert — so gibt es keine `.pbxproj`-Merge-Konflikte bei paralleler Arbeit:

```bash
cd ios
xcodegen generate          # erzeugt TennisAce.xcodeproj
open TennisAce.xcodeproj
# In Xcode: Scheme „TennisAce" wählen, ⌘R zum Starten, ⌘U für Tests
```

Nach jedem Hinzufügen/Umbenennen von Dateien einfach erneut `xcodegen generate`
laufen lassen.

## Per Kommandozeile bauen & testen

```bash
xcodegen generate
xcodebuild -scheme TennisAce -destination 'platform=iOS Simulator,name=iPhone 15' build
xcodebuild -scheme TennisAce -destination 'platform=iOS Simulator,name=iPhone 15' test
```

## Tech-Stack

| Bereich | Wahl |
|--------|------|
| Sprache | Swift 5.9 |
| UI | SwiftUI |
| State | `@Observable` ViewModel (Observation, iOS 17) |
| Architektur | MVVM mit Repository-Protokoll |
| Projektdatei | XcodeGen (`project.yml`) |
| Deployment Target | iOS 17.0 |

## Projektstruktur

```
TennisAce/
├── App/                  # TennisAceApp (@main) + RootView (NavigationStack)
├── Models/               # Fachmodell (Match, Player, Surface, SetScore)
├── Services/             # MatchRepository (Protokoll) + MockMatchRepository
├── Features/
│   ├── Matches/          # MatchesView, MatchesViewModel, MatchDetailView, MatchRow
│   └── Common/           # Wiederverwendbare Views (ResultBadge)
├── Support/              # Theme (Farben)
└── Resources/            # Assets.xcassets (AppIcon, AccentColor)
```

Datenmodell und Backend-Vertrag sind plattformneutral in [`../docs/`](../docs/)
definiert. Aktuell liefert `MockMatchRepository` Beispieldaten; ein echtes
Backend (Supabase) wird an genau dieser Stelle eingesteckt — ohne Änderungen an
Views oder ViewModels.
