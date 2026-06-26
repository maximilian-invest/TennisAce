package investments.hoelzl.tennisace.ui.matches

import investments.hoelzl.tennisace.model.Match
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

private val dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy", Locale.GERMAN)

internal fun formatMatchDate(instant: Instant): String =
    dateFormatter.format(instant.atZone(ZoneId.systemDefault()))

/** Compact one-liner, e.g. "21.06.2026 · Sand · TC Rotweiß". */
internal fun Match.subtitle(): String =
    "${formatMatchDate(date)} · ${surface.displayName} · $location"
