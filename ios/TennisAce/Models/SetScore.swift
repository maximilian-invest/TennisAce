import Foundation

/// Result of a single set from the player's perspective. See docs/DOMAIN_MODEL.md.
///
/// - Parameter tiebreak: optional points of the set loser in a tiebreak (e.g. 5 in 7-6(5)).
struct SetScore: Hashable {
    let playerGames: Int
    let opponentGames: Int
    let tiebreak: Int?

    init(playerGames: Int, opponentGames: Int, tiebreak: Int? = nil) {
        self.playerGames = playerGames
        self.opponentGames = opponentGames
        self.tiebreak = tiebreak
    }

    var playerWonSet: Bool { playerGames > opponentGames }
}
