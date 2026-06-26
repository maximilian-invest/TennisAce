package investments.hoelzl.tennisace.data

import investments.hoelzl.tennisace.model.Match

/**
 * Abstraction over the match data source. UI and ViewModels depend only on this
 * interface — see docs/API_CONTRACT.md. Today: [MockMatchRepository];
 * later: a Supabase-backed implementation with the same shape.
 */
interface MatchRepository {

    /** All matches, newest first. */
    suspend fun matches(): List<Match>

    /** A single match by id, or null if not found. */
    suspend fun match(id: String): Match?

    /** Persist a new match; returns the stored match (with assigned id). */
    suspend fun add(match: Match): Match
}
