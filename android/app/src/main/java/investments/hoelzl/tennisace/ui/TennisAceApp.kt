package investments.hoelzl.tennisace.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.viewmodel.compose.viewModel
import investments.hoelzl.tennisace.data.MatchRepository
import investments.hoelzl.tennisace.model.Match
import investments.hoelzl.tennisace.ui.matches.MatchDetailScreen
import investments.hoelzl.tennisace.ui.matches.MatchesScreen
import investments.hoelzl.tennisace.ui.matches.MatchesViewModel

/**
 * Root composable. Holds simple state-based navigation between the matches list
 * and a match detail — intentionally dependency-light (no navigation library)
 * for this scaffold. Swap in androidx.navigation when the screen graph grows.
 */
@Composable
fun TennisAceApp(repository: MatchRepository) {
    val viewModel: MatchesViewModel = viewModel(factory = MatchesViewModel.factory(repository))
    var selectedMatch by remember { mutableStateOf<Match?>(null) }

    when (val match = selectedMatch) {
        null -> MatchesScreen(
            viewModel = viewModel,
            onMatchClick = { selectedMatch = it },
        )
        else -> MatchDetailScreen(
            match = match,
            onBack = { selectedMatch = null },
        )
    }
}
