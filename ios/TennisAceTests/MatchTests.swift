import XCTest
@testable import TennisAce

/// Pure domain-logic tests — no UI dependencies.
final class MatchTests: XCTestCase {

    private func match(_ sets: [SetScore]) -> Match {
        Match(id: "1",
              date: Date(timeIntervalSince1970: 0),
              opponentName: "X",
              location: "Y",
              surface: .hard,
              sets: sets)
    }

    func testPlayerWinsWhenLeadingInSets() {
        let m = match([SetScore(playerGames: 6, opponentGames: 4),
                       SetScore(playerGames: 3, opponentGames: 6),
                       SetScore(playerGames: 7, opponentGames: 5)])
        XCTAssertTrue(m.didPlayerWin)
        XCTAssertEqual(m.setsWonByPlayer, 2)
        XCTAssertEqual(m.setsWonByOpponent, 1)
    }

    func testPlayerLosesWhenBehindInSets() {
        let m = match([SetScore(playerGames: 4, opponentGames: 6),
                       SetScore(playerGames: 2, opponentGames: 6)])
        XCTAssertFalse(m.didPlayerWin)
        XCTAssertEqual(m.setsWonByPlayer, 0)
    }

    func testScoreLineFormatting() {
        let m = match([SetScore(playerGames: 6, opponentGames: 4),
                       SetScore(playerGames: 7, opponentGames: 6, tiebreak: 5)])
        XCTAssertEqual(m.scoreLine, "6-4, 7-6")
    }

    func testSurfaceRoundTrip() {
        XCTAssertEqual(Surface.from("clay"), .clay)
        XCTAssertEqual(Surface.from("unknown"), .hard)
    }
}
