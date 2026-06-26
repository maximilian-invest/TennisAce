import Foundation

/// Court surface. `rawValue` is the stable wire/storage contract
/// (see docs/DOMAIN_MODEL.md); `displayName` is for the UI.
enum Surface: String, CaseIterable, Hashable {
    case hard
    case clay
    case grass
    case carpet

    var displayName: String {
        switch self {
        case .hard: "Hartplatz"
        case .clay: "Sand"
        case .grass: "Rasen"
        case .carpet: "Teppich"
        }
    }

    static func from(_ value: String) -> Surface {
        Surface(rawValue: value) ?? .hard
    }
}
