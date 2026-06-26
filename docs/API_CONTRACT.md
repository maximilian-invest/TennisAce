# API-Vertrag

Plattformneutrale Spezifikation der Schnittstelle zwischen App und Backend.
iOS und Android implementieren beide **denselben** Vertrag. Änderungen hier
zuerst abstimmen.

## Status

Aktuell laufen beide Apps gegen **Mock-Daten** (`MockMatchRepository`). Es ist
**noch kein Backend angebunden**. Dieser Vertrag definiert die Zielschnittstelle,
damit der Mock später 1:1 durch eine echte Implementierung ersetzt werden kann,
ohne UI/ViewModels zu ändern.

## Vorgesehenes Backend: Supabase

Empfohlen ist **Supabase** (Postgres + Auto-REST + Auth + Storage). Die Tabelle
spiegelt das [Domänenmodell](DOMAIN_MODEL.md):

```sql
-- matches
create table public.matches (
  id            uuid primary key default gen_random_uuid(),
  date          timestamptz not null,
  opponent_name text        not null,
  location      text        not null default '',
  surface       text        not null check (surface in ('hard','clay','grass','carpet')),
  sets          jsonb       not null default '[]'::jsonb,  -- [{playerGames,opponentGames,tiebreak}]
  created_at    timestamptz not null default now()
);

alter table public.matches enable row level security;
-- RLS-Policies je nach Auth-Modell ergänzen (z. B. owner = auth.uid()).
```

> Die konkreten Supabase-Projektdaten (URL, anon key) gehören **nicht** ins
> Repo. Sie werden plattformspezifisch injiziert:
> - iOS: über `Secrets.xcconfig` (gitignored) bzw. CI-Secrets
> - Android: über `local.properties` / `BuildConfig` bzw. CI-Secrets

## Repository-Schnittstelle (das, woran die Apps hängen)

Die Apps kennen kein HTTP/SQL, sondern nur dieses Interface. So sieht es
plattformneutral aus:

```
interface MatchRepository {
    // Alle Matches, neueste zuerst
    suspend fun matches(): List<Match>

    // Einzelnes Match per ID, oder null
    suspend fun match(id: String): Match?

    // Neues Match anlegen, gibt das gespeicherte Match (inkl. ID) zurück
    suspend fun add(match: Match): Match
}
```

- **iOS** (`ios/TennisAce/Services/MatchRepository.swift`): `async` Funktionen.
- **Android** (`…/data/MatchRepository.kt`): `suspend` Funktionen.

## JSON-Form

Maßgeblich ist die JSON-Repräsentation aus dem
[Domänenmodell](DOMAIN_MODEL.md#beispiel-json-form-siehe-api_contract). Feld-
Konventionen:

- Schlüssel in `snake_case` aus dem Backend (`opponent_name`) werden in der
  jeweiligen Repository-Implementierung auf die nativen Modellnamen gemappt
  (`opponentName`). Das Mapping ist die einzige Stelle, die beide Formen kennt.
- Datumswerte: ISO-8601 / RFC-3339 in UTC (`2026-06-21T17:30:00Z`).
- `surface`: einer der vier Stringwerte aus dem Domänenmodell.

## Fehlerfälle

| Situation | Erwartetes Verhalten der App |
|-----------|------------------------------|
| Netzwerkfehler | Repository wirft Fehler → ViewModel zeigt Fehler-State + Retry |
| `match(id)` nicht gefunden | Liefert `null` (kein Fehler) |
| Validierungsfehler bei `add` | Repository wirft Fehler → ViewModel zeigt Hinweis |

## Migrationspfad Mock → Supabase

1. Supabase-Projekt anlegen, obige Tabelle migrieren.
2. Pro Plattform eine `SupabaseMatchRepository` implementieren (gleiches
   Interface wie der Mock).
3. In der App-Komposition `MockMatchRepository` gegen `SupabaseMatchRepository`
   tauschen – **eine Zeile**, UI/ViewModels bleiben unangetastet.
