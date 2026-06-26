#if DEBUG
import Foundation

// Sample data for SwiftUI previews only (excluded from release builds).
extension Match {
    static let sample = Match(
        id: "preview",
        date: Date(timeIntervalSince1970: 1_781_000_000),
        opponentName: "Lena Richter",
        location: "TC Rotweiß, Center Court",
        surface: .clay,
        sets: [SetScore(playerGames: 6, opponentGames: 4),
               SetScore(playerGames: 3, opponentGames: 6),
               SetScore(playerGames: 7, opponentGames: 6, tiebreak: 5)]
    )
}
#endif
