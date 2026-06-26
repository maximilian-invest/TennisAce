import SwiftUI

/// Detail for a single match: result header plus a per-set breakdown.
struct MatchDetailView: View {
    let match: Match

    var body: some View {
        List {
            Section {
                Text(match.didPlayerWin ? "Sieg" : "Niederlage")
                    .font(.largeTitle.bold())
                    .foregroundStyle(match.didPlayerWin ? Color.courtGreen : .red)
                Text(match.subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Section("Sätze (\(match.setsWonByPlayer)–\(match.setsWonByOpponent))") {
                ForEach(Array(match.sets.enumerated()), id: \.offset) { index, set in
                    HStack {
                        Text("Satz \(index + 1)")
                        Spacer()
                        Text(set.scoreText)
                            .fontWeight(set.playerWonSet ? .bold : .regular)
                            .monospacedDigit()
                    }
                }
            }
        }
        .navigationTitle("vs \(match.opponentName)")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationStack {
        MatchDetailView(match: .sample)
    }
}
