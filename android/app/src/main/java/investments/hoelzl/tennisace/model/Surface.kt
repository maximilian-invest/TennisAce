package investments.hoelzl.tennisace.model

/**
 * Court surface. [value] is the stable wire/storage contract (see
 * docs/DOMAIN_MODEL.md); [displayName] is for the UI.
 */
enum class Surface(val value: String, val displayName: String) {
    HARD("hard", "Hartplatz"),
    CLAY("clay", "Sand"),
    GRASS("grass", "Rasen"),
    CARPET("carpet", "Teppich");

    companion object {
        fun fromValue(value: String): Surface =
            entries.firstOrNull { it.value == value } ?: HARD
    }
}
