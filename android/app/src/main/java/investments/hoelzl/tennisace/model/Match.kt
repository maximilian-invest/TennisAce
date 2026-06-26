package investments.hoelzl.tennisace.model

import java.time.Instant

/**
 * A played tennis match from the player's perspective. See docs/DOMAIN_MODEL.md.
 * Computed properties (result, score line) are derived, never stored.
 */
data class Match(
    val id: String,
    val date: Instant,
    val opponentName: String,
    val location: String,
    val surface: Surface,
    val sets: List<SetScore>,
) {
    val setsWonByPlayer: Int get() = sets.count { it.playerWonSet }
    val setsWonByOpponent: Int get() = sets.count { !it.playerWonSet }
    val didPlayerWin: Boolean get() = setsWonByPlayer > setsWonByOpponent

    /** e.g. "6-4, 3-6, 7-6" */
    val scoreLine: String
        get() = sets.joinToString(", ") { "${it.playerGames}-${it.opponentGames}" }
}
