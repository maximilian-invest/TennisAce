# Domänenmodell

Dies ist die **maßgebliche, plattformneutrale** Definition der TennisAce-
Fachbegriffe. iOS (`ios/TennisAce/Models/`) und Android
(`…/tennisace/model/`) implementieren exakt dieses Modell. Änderungen hier
zuerst, dann auf beiden Plattformen nachziehen.

## Überblick

TennisAce trackt gespielte Tennismatches aus Sicht **eines Spielers** ("du")
gegen einen Gegner. Ein Match besteht aus mehreren Sätzen.

```
Match 1───* SetScore
  │
  └─ surface: Surface (enum)
```

## `Player`

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID/String | Eindeutige ID |
| `name` | String | Anzeigename |

## `Surface` (Enum)

Belag des Platzes. Stringwerte sind der stabile Vertrag (z. B. fürs Backend):

| Case | Stringwert | Anzeige |
|------|-----------|---------|
| `hard`   | `"hard"`   | Hartplatz |
| `clay`   | `"clay"`   | Sand |
| `grass`  | `"grass"`  | Rasen |
| `carpet` | `"carpet"` | Teppich |

## `SetScore`

Ergebnis eines einzelnen Satzes.

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `playerGames`   | Int | Spiele des Spielers in diesem Satz (z. B. 6) |
| `opponentGames` | Int | Spiele des Gegners in diesem Satz (z. B. 4) |
| `tiebreak`      | Int? | Optional: Punkte des Verlierers im Tiebreak |

Abgeleitet (berechnet, nicht gespeichert):

- `playerWonSet` = `playerGames > opponentGames`

## `Match`

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id`           | UUID/String | Eindeutige ID |
| `date`         | Date/Instant | Zeitpunkt des Matches |
| `opponentName` | String | Name des Gegners |
| `location`     | String | Ort / Turnier |
| `surface`      | Surface | Belag |
| `sets`         | `[SetScore]` | Sätze in Spielreihenfolge |

Abgeleitet (berechnet, nicht gespeichert):

- `setsWonByPlayer` = Anzahl `sets` mit `playerWonSet == true`
- `setsWonByOpponent` = Anzahl `sets` mit `playerWonSet == false`
- `didPlayerWin` = `setsWonByPlayer > setsWonByOpponent`
- `scoreLine` = Sätze als String, z. B. `"6-4, 3-6, 7-5"`

### Beispiel (JSON-Form, siehe API_CONTRACT)

```json
{
  "id": "8f1c…",
  "date": "2026-06-21T17:30:00Z",
  "opponentName": "Lena Richter",
  "location": "TC Rotweiß, Center Court",
  "surface": "clay",
  "sets": [
    { "playerGames": 6, "opponentGames": 4, "tiebreak": null },
    { "playerGames": 3, "opponentGames": 6, "tiebreak": null },
    { "playerGames": 7, "opponentGames": 6, "tiebreak": 5 }
  ]
}
```

Dieses Match ergibt `scoreLine = "6-4, 3-6, 7-6", didPlayerWin = true`.

> Hinweis: Das Domänenmodell ist absichtlich schlank gehalten (MVP =
> Match-Tracking). Erweiterungen (Statistiken, mehrere Spielerprofile,
> Doppel-Matches, Ranglisten) bauen darauf auf und werden hier ergänzt, bevor
> sie implementiert werden.
