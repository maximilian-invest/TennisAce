# Release-Leitfaden – ACE Athlete

Was schon erledigt ist (im Repo) und was noch an Accounts/Builds hängt. Reihenfolge
von oben nach unten.

## ✅ Schon vorbereitet (kein Account nötig)
- App-Name **ACE Athlete**, Bundle id `investments.hoelzl.tennisace`.
- Gebrandete Icons + Splash (Lime/Dark) in `assets/images/`.
- `app.json` (light-only, Splash, Adaptive Icon) und `eas.json` (Build-Profile).
- Store-Texte (`docs/store/listing.md`) & Datenschutz-Entwurf (`docs/store/privacy-policy.md`).

## 1. Accounts anlegen
- [ ] **Apple Developer Program** (~99 $/Jahr) → https://developer.apple.com/programs/
- [ ] **Google Play Console** (einmalig 25 $) → https://play.google.com/console
- [ ] **Expo-Konto** (kostenlos) für EAS → https://expo.dev

## 2. EAS verbinden
```bash
npm i -g eas-cli
eas login
eas init               # legt die EAS projectId in app.json an
```

## 3. Dev-Build (zum Testen von RevenueCat – ersetzt Expo Go)
```bash
eas build --profile development --platform ios     # bzw. android
```
Auf dem Gerät installieren, dann `npx expo start --dev-client`.

## 4. RevenueCat einhängen (echte Käufe)
1. RevenueCat-Projekt anlegen → https://www.revenuecat.com, App-Store-/Play-Keys eintragen.
2. Abo-Produkte in App Store Connect **und** Play Console anlegen
   (z. B. `ace_pro_monthly`, `ace_pro_yearly`) und in RevenueCat zu einem
   Entitlement `pro` + Offering bündeln.
3. `npx expo install react-native-purchases`
4. In `src/services/premium.ts` die Stubs ersetzen:
   - `Purchases.configure({ apiKey })` beim Start (z. B. in `SyncBridge`).
   - `purchasePremium()` → `Purchases.purchasePackage(...)`.
   - `restorePurchases()` → `Purchases.restorePurchases()`.
   - Entitlement `pro` → `useAppStore.getState().setPremium(active)`.
   Der Rest der App liest weiterhin nur `isPremium` – nichts anderes ändert sich.
5. Preise in `src/app/paywall/index.tsx` aus dem RevenueCat-Offering ziehen
   (statt der aktuellen Platzhalter).

## 5. Supabase für Produktion härten
- [ ] **Authentication → URL Configuration**: Site URL + Redirect auf das
  App-Scheme `tennisace://` setzen, damit Bestätigungs-Mails funktionieren.
- [ ] **Confirm email** wieder **an** (für den Live-Betrieb).
- [ ] Anon-User-Cleanup/Quota prüfen.

## 6. Store-Assets
- [ ] Screenshots: iPhone 6.7" & 6.5", iPad 12.9"; Android Phone/Tablet.
- [ ] Datenschutz-URL hosten (z. B. GitHub Pages) und in beiden Stores eintragen.
- [ ] App-Privacy-„Nutrition Label" (Apple) / Data Safety (Google) ausfüllen –
  siehe `docs/store/privacy-policy.md`.

## 7. Production-Build & Upload
```bash
eas build --profile production --platform all
eas submit --profile production --platform ios      # bzw. android
```
