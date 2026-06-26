import SwiftUI

/// Hosts the app's navigation stack. Kept tiny on purpose so the feature views
/// stay focused and previewable.
struct RootView: View {
    let repository: MatchRepository

    var body: some View {
        NavigationStack {
            MatchesView(repository: repository)
        }
    }
}
