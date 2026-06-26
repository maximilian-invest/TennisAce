import SwiftUI

/// One row in the matches list: opponent, result badge, score line and subtitle.
struct MatchRow: View {
    let match: Match

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("vs \(match.opponentName)")
                    .font(.headline)
                Spacer()
                ResultBadge(didWin: match.didPlayerWin)
            }
            Text(match.scoreLine)
                .font(.body)
                .monospacedDigit()
            Text(match.subtitle)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    List {
        MatchRow(match: .sample)
    }
}
