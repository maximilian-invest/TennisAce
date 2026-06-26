import Foundation
import Observation

/// Holds the matches-list state and loads from the `MatchRepository`. The view
/// observes the published properties and only ever calls `load()` back.
@MainActor
@Observable
final class MatchesViewModel {
    private let repository: MatchRepository

    private(set) var isLoading = true
    private(set) var matches: [Match] = []
    private(set) var errorMessage: String?

    init(repository: MatchRepository) {
        self.repository = repository
    }

    func load() async {
        isLoading = true
        errorMessage = nil
        do {
            matches = try await repository.matches()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}
