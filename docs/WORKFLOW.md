# Build- & Test-Workflow

Wie TennisAce gebaut, aufs Handy gebracht und veröffentlicht wird.

## 1. Live testen auf dem Handy (jetzt, ohne Account)

Der schnellste Loop — ideal während der Entwicklung:

```bash
npm install
npx expo start      # QR-Code scannen mit Expo Go
```

- **iPhone:** Kamera-App auf den QR-Code halten → öffnet in **Expo Go**.
- **Android:** in **Expo Go** → „Scan QR code".
- Jede Code-Änderung erscheint per **Hot-Reload** sofort auf dem Gerät.
- Funktioniert **ohne Mac-Build und ohne Apple-Developer-Account**.

Am stabilsten vom MacBook im selben WLAN. Aus einer Cloud-Umgebung heraus geht
auch `npx expo start --tunnel` (langsamer, über einen öffentlichen Tunnel).

## 2. Installierbarer Build ohne Laptop (EAS Build)

Wenn die App „standalone" (ohne Metro/Laptop) aufs Gerät soll:

```bash
npm install -g eas-cli
eas login                 # kostenloser Expo-Account
eas init                  # legt projectId in app.json an (einmalig)

# Android — funktioniert sofort, ohne Apple:
eas build --profile preview --platform android
# → installierbare APK via Link/QR

# iOS — benötigt Apple-Developer-Account (99 $/Jahr):
eas build --profile preview --platform ios
```

Build-Profile sind in [`../eas.json`](../eas.json) definiert: `development`
(Dev-Client mit Hot-Reload), `preview` (interne Test-Builds), `production`.

## 3. In den App Store / Play Store (Release)

Voll unterstützt über EAS. **Einmalig nötig:** Apple-Developer-Account (iOS,
99 $/Jahr) bzw. Google-Play-Developer-Konto (Android, einmalig 25 $).

```bash
eas build  --profile production --platform ios       # signierte .ipa
eas submit --profile production --platform ios       # → App Store Connect

eas build  --profile production --platform android   # signierte .aab
eas submit --profile production --platform android   # → Play Console
```

EAS verwaltet Signing/Zertifikate automatisch (oder nutzt deine eigenen).

## 4. OTA-Updates (EAS Update)

JS-/UI-Änderungen ohne neuen Store-Build direkt an installierte Apps ausliefern:

```bash
eas update --branch preview --message "..."
```

Greift für `development`/`preview`/`production`-Builds (nicht für native
Änderungen, die einen neuen Store-Build erfordern).

## 5. CI

[`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) prüft bei jedem
Push/PR die Typen und baut das JS-Bundle — ohne Secrets oder SDK. EAS-Builds
werden separat ausgelöst (benötigen `EXPO_TOKEN` als GitHub-Secret).

## Was wann nötig ist

| Ziel | Eigener Mac? | Apple-Account? | Tool |
|------|:---:|:---:|------|
| Live auf iPhone testen | nein | nein | Expo Go |
| Live auf Android testen | nein | nein | Expo Go |
| Android-APK standalone | nein | nein | EAS Build (`preview`) |
| iOS standalone / TestFlight | nein¹ | **ja** | EAS Build |
| App Store Release | nein¹ | **ja** | EAS Build + Submit |

¹ EAS baut iOS in der **Cloud** — ein eigener Mac ist dafür nicht zwingend nötig.
