# TennisAce — Android

Native Android-App in **Kotlin** mit **Jetpack Compose** und Material 3.

## Voraussetzungen

- JDK 17+
- Android Studio (Ladybug+) **oder** Android SDK mit `cmdline-tools`
- Android SDK Platform 35 (compileSdk/targetSdk = 35)

## Bauen & Testen

```bash
./gradlew assembleDebug   # Debug-APK bauen
./gradlew test            # JVM-Unit-Tests
./gradlew lint            # Android Lint
```

Der **Gradle-Wrapper** ist eingecheckt (`./gradlew`), Gradle-Version 8.11.1 wird
beim ersten Lauf automatisch geladen. Eine `local.properties` mit dem SDK-Pfad
erzeugt Android Studio automatisch (oder `sdk.dir=/pfad/zum/Android/sdk` setzen).

## Tech-Stack

| Bereich | Wahl |
|--------|------|
| Sprache | Kotlin 2.0.21 |
| UI | Jetpack Compose (Material 3) |
| Architektur | MVVM (`ViewModel` + `StateFlow`) |
| Build | Gradle (Kotlin DSL) + Version-Catalog (`gradle/libs.versions.toml`) |
| AGP | 8.7.3 |
| minSdk / targetSdk | 26 / 35 |

## Projektstruktur

```
app/src/main/java/investments/hoelzl/tennisace/
├── TennisAceApplication.kt   # Hält die MatchRepository-Instanz (DI-Punkt)
├── MainActivity.kt           # Compose-Einstieg
├── model/                    # Fachmodell (Match, Player, Surface, SetScore)
├── data/                     # MatchRepository (Interface) + MockMatchRepository
└── ui/
    ├── TennisAceApp.kt       # Einfache State-basierte Navigation (Liste ↔ Detail)
    ├── matches/              # MatchesScreen, MatchesViewModel, MatchDetailScreen
    └── theme/                # Farben, Typografie, TennisAceTheme
```

Das Datenmodell und der Backend-Vertrag sind plattformneutral in
[`../docs/`](../docs/) definiert. Aktuell liefert `MockMatchRepository`
Beispieldaten; ein echtes Backend (Supabase) wird an genau dieser Stelle
eingesteckt.
