import SwiftUI

@main
struct TennisAceApp: App {
    /// The app's single composition root. Swap `MockMatchRepository` for a real
    /// backend (e.g. Supabase) here — nothing else needs to change.
    private let repository: MatchRepository = MockMatchRepository()

    var body: some Scene {
        WindowGroup {
            RootView(repository: repository)
        }
    }
}
