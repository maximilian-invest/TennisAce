package investments.hoelzl.tennisace

import investments.hoelzl.tennisace.model.Match
import investments.hoelzl.tennisace.model.SetScore
import investments.hoelzl.tennisace.model.Surface
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.Instant

/** Pure domain-logic tests — no Android dependencies. */
class MatchTest {

    private fun match(sets: List<SetScore>) = Match(
        id = "1",
        date = Instant.EPOCH,
        opponentName = "X",
        location = "Y",
        surface = Surface.HARD,
        sets = sets,
    )

    @Test
    fun `player wins when leading in sets`() {
        val m = match(listOf(SetScore(6, 4), SetScore(3, 6), SetScore(7, 5)))
        assertTrue(m.didPlayerWin)
        assertEquals(2, m.setsWonByPlayer)
        assertEquals(1, m.setsWonByOpponent)
    }

    @Test
    fun `player loses when behind in sets`() {
        val m = match(listOf(SetScore(4, 6), SetScore(2, 6)))
        assertFalse(m.didPlayerWin)
        assertEquals(0, m.setsWonByPlayer)
    }

    @Test
    fun `score line is formatted per set`() {
        val m = match(listOf(SetScore(6, 4), SetScore(7, 6, tiebreak = 5)))
        assertEquals("6-4, 7-6", m.scoreLine)
    }

    @Test
    fun `surface round-trips through its wire value`() {
        assertEquals(Surface.CLAY, Surface.fromValue("clay"))
        assertEquals(Surface.HARD, Surface.fromValue("unknown"))
    }
}
