# Mitwirken & paralleler Workflow

Dieses Repo ist dafür gebaut, dass **iOS und Android gleichzeitig**
weiterentwickelt werden, ohne sich gegenseitig zu blockieren.

## Branch-Konvention

Plattform im Branch-Namen führen, damit Streams sauseinandergehalten werden:

```
ios/<thema>        z. B. ios/match-detail
android/<thema>    z. B. android/match-detail
docs/<thema>       Änderungen am gemeinsamen Vertrag (Modell/API)
chore/<thema>      Tooling, CI, Repo-weite Aufräumarbeiten
```

## Goldene Regel: Vertrag zuerst

Der **einzige** Synchronisationspunkt zwischen den Plattformen sind:

- [`docs/DOMAIN_MODEL.md`](DOMAIN_MODEL.md) – das Fachmodell
- [`docs/API_CONTRACT.md`](API_CONTRACT.md) – die Backend-Schnittstelle

Wenn ein Feature diese berührt:

1. **Erst** den Vertrag in `docs/` per `docs/<thema>`-Branch anpassen und mergen.
2. **Dann** iOS und Android unabhängig nachziehen (je eigener Branch/PR).

So bleibt die Definition an einem Ort, und beide Teams arbeiten gegen dieselbe
Wahrheit – ohne aufeinander zu warten.

## CI

Jede Plattform hat einen eigenen Workflow unter `.github/workflows/`:

- `ios.yml` läuft nur bei Änderungen unter `ios/**`
- `android.yml` läuft nur bei Änderungen unter `android/**`

Dadurch triggert ein iOS-PR keinen Android-Build und umgekehrt – Builds laufen
**unabhängig und parallel**. Änderungen unter `docs/**` triggern bewusst keinen
App-Build (reine Abstimmung).

## Pull Requests

- Klein und plattformfokussiert halten – keine PRs, die iOS und Android mischen
  (außer reine `docs/`- oder `chore/`-PRs).
- Vor dem Öffnen lokal grün:
  - iOS: `xcodegen generate && xcodebuild -scheme TennisAce build`
  - Android: `./gradlew assembleDebug test`
- Commit-Messages im Imperativ, kurz und sachlich.

## Code-Stil

- Gemeinsame Basis: [`.editorconfig`](../.editorconfig).
- iOS: Swift API Design Guidelines; SwiftUI-Views klein und previewbar.
- Android: offizielle Kotlin-Konventionen; Composables klein und previewbar.
- Beide: Fachmodell frei von UI-/Netzwerk-Abhängigkeiten halten.

## Lokale Voraussetzungen

| Plattform | Werkzeuge |
|-----------|-----------|
| iOS       | macOS, Xcode 15+, [XcodeGen](https://github.com/yonaskolb/XcodeGen) (`brew install xcodegen`) |
| Android   | JDK 17+, Android Studio (oder Android SDK + `./gradlew`) |
