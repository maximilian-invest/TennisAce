import XCTest
@testable import TennisAce

final class MatchesViewModelTests: XCTestCase {

    @MainActor
    func testLoadsMatchesIntoState() async {
        let viewModel = MatchesViewModel(repository: StubRepository(stored: [.sampleForTest]))

        await viewModel.load()

        XCTAssertFalse(viewModel.isLoading)
        XCTAssertEqual(viewModel.matches.count, 1)
        XCTAssertNil(viewModel.errorMessage)
    }

    @MainActor
    func testSurfacesErrorOnFailure() async {
        let viewModel = MatchesViewModel(repository: FailingRepository())

        await viewModel.load()

        XCTAssertFalse(viewModel.isLoading)
        XCTAssertNotNil(viewModel.errorMessage)
    }
}

// MARK: - Test doubles

private extension Match {
    static let sampleForTest = Match(
        id: "1",
        date: Date(timeIntervalSince1970: 0),
        opponentName: "Lena",
        location: "Court 1",
        surface: .clay,
        sets: [SetScore(playerGames: 6, opponentGames: 4)]
    )
}

private struct StubRepository: MatchRepository {
    let stored: [Match]
    func matches() async throws -> [Match] { stored }
    func match(id: String) async throws -> Match? { stored.first { $0.id == id } }
    func add(_ match: Match) async throws -> Match { match }
}

private struct FailingRepository: MatchRepository {
    struct Boom: Error {}
    func matches() async throws -> [Match] { throw Boom() }
    func match(id: String) async throws -> Match? { nil }
    func add(_ match: Match) async throws -> Match { throw Boom() }
}
