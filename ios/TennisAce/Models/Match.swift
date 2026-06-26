import Foundation

/// A played tennis match from the player's perspective. See docs/DOMAIN_MODEL.md.
/// Computed properties (result, score line) are derived, never stored.
struct Match: Identifiable, Hashable {
    let id: String
    let date: Date
    let opponentName: String
    let location: String
    let surface: Surface
    let sets: [SetScore]

    var setsWonByPlayer: Int { sets.filter(\.playerWonSet).count }
    var setsWonByOpponent: Int { sets.filter { !$0.playerWonSet }.count }
    var didPlayerWin: Bool { setsWonByPlayer > setsWonByOpponent }

    /// e.g. "6-4, 3-6, 7-6"
    var scoreLine: String {
        sets.map { "\($0.playerGames)-\($0.opponentGames)" }.joined(separator: ", ")
    }
}
