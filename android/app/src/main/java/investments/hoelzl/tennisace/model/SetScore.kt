package investments.hoelzl.tennisace.model

/**
 * Result of a single set from the player's perspective. See docs/DOMAIN_MODEL.md.
 *
 * @param tiebreak optional points of the set loser in a tiebreak (e.g. 5 in 7-6(5)).
 */
data class SetScore(
    val playerGames: Int,
    val opponentGames: Int,
    val tiebreak: Int? = null,
) {
    val playerWonSet: Boolean get() = playerGames > opponentGames
}
