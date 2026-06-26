# TennisAce 🎾

Native iOS- & Android-App, gebaut mit **Expo** (React Native) — eine Codebasis,
beide Plattformen. Live-Test auf dem Handy via **Expo Go**, Cloud-Builds und
App-Store-/Play-Auslieferung via **EAS**.

> **Status:** Grundgerüst und Build-/Test-Pipeline stehen und sind verifiziert
> (Typecheck grün, iOS- und Android-Bundle bauen). Die eigentlichen Screens
> werden aus dem kommenden **Design** umgesetzt — aktuell läuft nur ein
> Platzhalter-Screen.

## Stack

| Bereich | Wahl |
|--------|------|
| Framework | Expo SDK 54 (React Native 0.81, React 19) |
| Sprache | TypeScript (strict) |
| Navigation | Expo Router (file-based, `src/app/`) |
| Builds & Release | EAS Build + EAS Submit |
| Live-Updates | EAS Update (OTA) |

Bundle-ID / Package: `investments.hoelzl.tennisace`

## Schnellstart — auf dem Handy ansehen

Voraussetzung: Node 20+, und die App **Expo Go** auf deinem iPhone/Android
(kostenlos im App Store / Play Store).

```bash
npm install
npx expo start
```

Im Terminal erscheint ein **QR-Code** → mit der Kamera (iPhone) bzw. Expo Go
(Android) scannen → die App lädt live aufs Handy, inkl. **Hot-Reload** bei jeder
Code-Änderung. Kein Mac-Build, kein Apple-Account nötig.

> Am zuverlässigsten läuft `npx expo start` auf deinem MacBook, wenn Handy und
> Laptop im selben WLAN sind.

## Bauen & Verifizieren

```bash
npm run typecheck                    # TypeScript prüfen
npx expo export -p ios -p android    # echtes JS-Bundle bauen (ohne Xcode/SDK)
```

## Weiteres

- **Installierbare Builds, App-Store-Release, OTA-Updates, CI:** siehe
  [`docs/WORKFLOW.md`](docs/WORKFLOW.md).

```
src/
├── app/            # Screens & Routen (Expo Router)
│   ├── _layout.tsx # Root-Navigation (Stack)
│   └── index.tsx   # Platzhalter — wird durch das Design ersetzt
├── components/     # Wiederverwendbare UI (themed-text / themed-view)
├── constants/      # theme.ts (Farben, Spacing, Fonts)
└── hooks/          # use-theme, use-color-scheme
```
