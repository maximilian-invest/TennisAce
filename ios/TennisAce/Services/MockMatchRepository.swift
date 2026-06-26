import Foundation

/// In-memory `MatchRepository` seeded with sample data so the app runs with no
/// backend. The small sleeps simulate network latency. Replace with a real
/// implementation (e.g. `SupabaseMatchRepository`) when a backend is available —
/// see docs/API_CONTRACT.md.
actor MockMatchRepository: MatchRepository {
    private var store: [Match] = MockMatchRepository.seed()

    func matches() async throws -> [Match] {
        try await Task.sleep(for: .milliseconds(300))
        return store.sorted { $0.date > $1.date }
    }

    func match(id: String) async throws -> Match? {
        try await Task.sleep(for: .milliseconds(150))
        return store.first { $0.id == id }
    }

    func add(_ match: Match) async throws -> Match {
        try await Task.sleep(for: .milliseconds(200))
        let stored = match.id.isEmpty
            ? Match(id: UUID().uuidString,
                    date: match.date,
                    opponentName: match.opponentName,
                    location: match.location,
                    surface: match.surface,
                    sets: match.sets)
            : match
        store.append(stored)
        return stored
    }

    private static func seed() -> [Match] {
        let day: TimeInterval = 86_400
        return [
            Match(id: UUID().uuidString,
                  date: Date().addingTimeInterval(-2 * day),
                  opponentName: "Lena Richter",
                  location: "TC Rotweiß, Center Court",
                  surface: .clay,
                  sets: [SetScore(playerGames: 6, opponentGames: 4),
                         SetScore(playerGames: 3, opponentGames: 6),
                         SetScore(playerGames: 7, opponentGames: 6, tiebreak: 5)]),
            Match(id: UUID().uuidString,
                  date: Date().addingTimeInterval(-9 * day),
                  opponentName: "Marco Feld",
                  location: "Stadtpark, Halle 2",
                  surface: .hard,
                  sets: [SetScore(playerGames: 4, opponentGames: 6),
                         SetScore(playerGames: 2, opponentGames: 6)]),
            Match(id: UUID().uuidString,
                  date: Date().addingTimeInterval(-21 * day),
                  opponentName: "Sofia Klein",
                  location: "Vereinsturnier, Platz 1",
                  surface: .grass,
                  sets: [SetScore(playerGames: 6, opponentGames: 2),
                         SetScore(playerGames: 6, opponentGames: 3)]),
        ]
    }
}
