import SwiftUI

/// The matches list. Owns its `MatchesViewModel` and renders loading / error /
/// empty / content states. Navigation to the detail is driven by `Match` values.
struct MatchesView: View {
    @State private var viewModel: MatchesViewModel

    init(repository: MatchRepository) {
        _viewModel = State(initialValue: MatchesViewModel(repository: repository))
    }

    var body: some View {
        content
            .navigationTitle("TennisAce")
            .navigationDestination(for: Match.self) { match in
                MatchDetailView(match: match)
            }
            .task {
                if viewModel.matches.isEmpty {
                    await viewModel.load()
                }
            }
    }

    @ViewBuilder
    private var content: some View {
        if viewModel.isLoading {
            ProgressView("Lade Matches …")
        } else if let message = viewModel.errorMessage {
            ContentUnavailableView {
                Label("Fehler beim Laden", systemImage: "exclamationmark.triangle")
            } description: {
                Text(message)
            } actions: {
                Button("Erneut versuchen") {
                    Task { await viewModel.load() }
                }
            }
        } else if viewModel.matches.isEmpty {
            ContentUnavailableView(
                "Noch keine Matches",
                systemImage: "sportscourt",
                description: Text("Erfasste Matches erscheinen hier.")
            )
        } else {
            List(viewModel.matches) { match in
                NavigationLink(value: match) {
                    MatchRow(match: match)
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        MatchesView(repository: MockMatchRepository())
    }
}
