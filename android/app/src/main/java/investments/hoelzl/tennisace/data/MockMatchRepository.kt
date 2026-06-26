package investments.hoelzl.tennisace.data

import investments.hoelzl.tennisace.model.Match
import investments.hoelzl.tennisace.model.SetScore
import investments.hoelzl.tennisace.model.Surface
import kotlinx.coroutines.delay
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

/**
 * In-memory [MatchRepository] seeded with sample data so the app runs with no
 * backend. The small delays simulate network latency. Replace with a real
 * implementation (e.g. SupabaseMatchRepository) when a backend is available —
 * see docs/API_CONTRACT.md.
 */
class MockMatchRepository : MatchRepository {

    private val store = mutableListOf(
        Match(
            id = UUID.randomUUID().toString(),
            date = Instant.now().minus(2, ChronoUnit.DAYS),
            opponentName = "Lena Richter",
            location = "TC Rotweiß, Center Court",
            surface = Surface.CLAY,
            sets = listOf(
                SetScore(6, 4),
                SetScore(3, 6),
                SetScore(7, 6, tiebreak = 5),
            ),
        ),
        Match(
            id = UUID.randomUUID().toString(),
            date = Instant.now().minus(9, ChronoUnit.DAYS),
            opponentName = "Marco Feld",
            location = "Stadtpark, Halle 2",
            surface = Surface.HARD,
            sets = listOf(
                SetScore(4, 6),
                SetScore(2, 6),
            ),
        ),
        Match(
            id = UUID.randomUUID().toString(),
            date = Instant.now().minus(21, ChronoUnit.DAYS),
            opponentName = "Sofia Klein",
            location = "Vereinsturnier, Platz 1",
            surface = Surface.GRASS,
            sets = listOf(
                SetScore(6, 2),
                SetScore(6, 3),
            ),
        ),
    )

    override suspend fun matches(): List<Match> {
        delay(300)
        return store.sortedByDescending { it.date }
    }

    override suspend fun match(id: String): Match? {
        delay(150)
        return store.firstOrNull { it.id == id }
    }

    override suspend fun add(match: Match): Match {
        delay(200)
        val stored = if (match.id.isBlank()) {
            match.copy(id = UUID.randomUUID().toString())
        } else {
            match
        }
        store.add(stored)
        return stored
    }
}
