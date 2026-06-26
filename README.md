# TennisAce 🎾

Monorepo für die **nativen** TennisAce-Apps auf iOS und Android.

Beide Plattformen werden **parallel und unabhängig** entwickelt:

| Plattform | Sprache | UI | Build | Verzeichnis |
|-----------|---------|----|-------|-------------|
| iOS       | Swift   | SwiftUI | Xcode (via [XcodeGen](https://github.com/yonaskolb/XcodeGen)) | [`ios/`](ios/) |
| Android   | Kotlin  | Jetpack Compose | Gradle (Kotlin DSL) | [`android/`](android/) |

Es gibt **keinen geteilten Code** zwischen den Plattformen – beide sind voll
nativ. Was sie verbindet, ist ein gemeinsamer **fachlicher Vertrag**
([Domänenmodell](docs/DOMAIN_MODEL.md)) und ein gemeinsamer **API-Vertrag**
([API_CONTRACT](docs/API_CONTRACT.md)), damit beide Teams ohne gegenseitige
Blockaden am selben Produkt arbeiten können.

## Schnellstart

### iOS (macOS + Xcode erforderlich)

```bash
cd ios
brew install xcodegen      # einmalig
xcodegen generate          # erzeugt TennisAce.xcodeproj
open TennisAce.xcodeproj    # in Xcode öffnen & ausführen (⌘R)
```

### Android (Android Studio oder Android SDK erforderlich)

```bash
cd android
./gradlew assembleDebug     # baut die Debug-APK
./gradlew test              # Unit-Tests
# oder: in Android Studio öffnen und ▶ drücken
```

## Repository-Struktur

```
TennisAce/
├── ios/            # Native iOS-App (Swift / SwiftUI)
├── android/        # Native Android-App (Kotlin / Jetpack Compose)
├── docs/           # Plattformübergreifende Verträge & Architektur
│   ├── ARCHITECTURE.md   # Architektur-Entscheidungen (warum so?)
│   ├── DOMAIN_MODEL.md   # Gemeinsames Fachmodell (Match, Player, …)
│   ├── API_CONTRACT.md   # Backend-Vertrag (Supabase-ready)
│   └── CONTRIBUTING.md   # Branch-/Review-/Parallel-Workflow
└── .github/workflows/    # CI: iOS & Android bauen unabhängig & parallel
```

## Paralleles Arbeiten

- **iOS** und **Android** sind eigenständige Projekte mit eigener CI. Ein grüner
  Build auf einer Plattform hängt nie vom Stand der anderen ab.
- Änderungen am **Fachmodell** oder **API-Vertrag** werden zuerst in `docs/`
  abgestimmt – das ist der einzige Synchronisationspunkt.
- Branch-Konvention und Reviews: siehe [CONTRIBUTING.md](docs/CONTRIBUTING.md).

## Backend

Die Apps laufen sofort mit lokalen **Mock-Daten** (siehe `MockMatchRepository`).
Der Datenzugriff ist hinter einem `MatchRepository`-Interface gekapselt, sodass
ein echtes Backend (vorgesehen: **Supabase**) eingesteckt werden kann, ohne UI
oder ViewModels anzufassen. Details: [docs/API_CONTRACT.md](docs/API_CONTRACT.md).
