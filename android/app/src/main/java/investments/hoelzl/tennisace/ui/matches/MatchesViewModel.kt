package investments.hoelzl.tennisace.ui.matches

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import investments.hoelzl.tennisace.data.MatchRepository
import investments.hoelzl.tennisace.model.Match
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/** Immutable UI state for the matches list. */
data class MatchesUiState(
    val isLoading: Boolean = true,
    val matches: List<Match> = emptyList(),
    val errorMessage: String? = null,
)

/**
 * Holds the matches-list state and loads from the [MatchRepository]. The UI
 * observes [uiState] and only ever sends intents back (e.g. [load]).
 */
class MatchesViewModel(
    private val repository: MatchRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(MatchesUiState())
    val uiState: StateFlow<MatchesUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }
        viewModelScope.launch {
            try {
                val matches = repository.matches()
                _uiState.update { it.copy(isLoading = false, matches = matches) }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isLoading = false, errorMessage = e.message ?: "Unbekannter Fehler")
                }
            }
        }
    }

    companion object {
        /** Factory that injects the [repository] into the ViewModel. */
        fun factory(repository: MatchRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T =
                    MatchesViewModel(repository) as T
            }
    }
}
