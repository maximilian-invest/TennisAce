@AGENTS.md

# TennisAce

Native iOS + Android app built with **Expo** (SDK 54, React Native, TypeScript,
Expo Router). One codebase, both platforms.

- **Screens come from a design** the user provides — until then
  `src/app/index.tsx` is a placeholder. Do not invent feature screens unprompted.
- Bundle id / package: `investments.hoelzl.tennisace`.
- Path alias: `@/` → `src/`.
- Verify changes with `npm run typecheck` and `npx expo export -p ios -p android`.
- Phone testing: `npx expo start` → Expo Go (QR). Builds/releases via EAS — see
  `docs/WORKFLOW.md`.
- `reactCompiler` is enabled → follow the Rules of Hooks strictly (all hooks
  before any early return).
