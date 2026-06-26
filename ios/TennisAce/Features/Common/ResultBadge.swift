import SwiftUI

/// Small win/loss pill used in the list and detail headers.
struct ResultBadge: View {
    let didWin: Bool

    var body: some View {
        Text(didWin ? "Sieg" : "Niederlage")
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background((didWin ? Color.courtGreen : .red).opacity(0.18))
            .foregroundStyle(didWin ? Color.courtGreen : .red)
            .clipShape(Capsule())
    }
}

#Preview {
    VStack(spacing: 12) {
        ResultBadge(didWin: true)
        ResultBadge(didWin: false)
    }
    .padding()
}
