import Foundation

/// Abstraction over the match data source. Views and ViewModels depend only on
/// this protocol — see docs/API_CONTRACT.md. Today: `MockMatchRepository`;
/// later: a Supabase-backed implementation with the same shape.
protocol MatchRepository: Sendable {
    /// All matches, newest first.
    func matches() async throws -> [Match]

    /// A single match by id, or nil if not found.
    func match(id: String) async throws -> Match?

    /// Persist a new match; returns the stored match (with assigned id).
    func add(_ match: Match) async throws -> Match
}
