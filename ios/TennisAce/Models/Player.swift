import Foundation

/// A tennis player. See docs/DOMAIN_MODEL.md.
struct Player: Identifiable, Hashable {
    let id: String
    let name: String
}
