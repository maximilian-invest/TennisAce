import Foundation

// View-layer formatting for domain types. Kept out of the models so the domain
// stays free of presentation concerns (mirrors Android's MatchFormatting).

extension Match {
    var formattedDate: String {
        Self.dateFormatter.string(from: date)
    }

    /// Compact one-liner, e.g. "21.06.2026 · Sand · TC Rotweiß".
    var subtitle: String {
        "\(formattedDate) · \(surface.displayName) · \(location)"
    }

    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd.MM.yyyy"
        formatter.locale = Locale(identifier: "de_DE")
        return formatter
    }()
}

extension SetScore {
    /// e.g. "7-6 (5)" when a tiebreak is present, otherwise "6-4".
    var scoreText: String {
        if let tiebreak {
            "\(playerGames)-\(opponentGames) (\(tiebreak))"
        } else {
            "\(playerGames)-\(opponentGames)"
        }
    }
}
