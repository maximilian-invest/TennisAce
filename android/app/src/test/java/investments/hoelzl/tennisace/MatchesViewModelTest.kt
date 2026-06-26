package investments.hoelzl.tennisace

import investments.hoelzl.tennisace.data.MatchRepository
import investments.hoelzl.tennisace.model.Match
import investments.hoelzl.tennisace.model.SetScore
import investments.hoelzl.tennisace.model.Surface
import investments.hoelzl.tennisace.ui.matches.MatchesViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test
import java.time.Instant

@OptIn(ExperimentalCoroutinesApi::class)
class MatchesViewModelTest {

    private val dispatcher = StandardTestDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(dispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `loads matches into state`() = runTest(dispatcher) {
        val vm = MatchesViewModel(FakeRepository(listOf(sampleMatch)))

        advanceUntilIdle()

        val state = vm.uiState.value
        assertFalse(state.isLoading)
        assertEquals(1, state.matches.size)
        assertNull(state.errorMessage)
    }

    @Test
    fun `surfaces error message on failure`() = runTest(dispatcher) {
        val vm = MatchesViewModel(FailingRepository)

        advanceUntilIdle()

        val state = vm.uiState.value
        assertFalse(state.isLoading)
        assertEquals("boom", state.errorMessage)
    }

    private val sampleMatch = Match(
        id = "1",
        date = Instant.parse("2026-06-21T17:30:00Z"),
        opponentName = "Lena",
        location = "Court 1",
        surface = Surface.CLAY,
        sets = listOf(SetScore(6, 4), SetScore(6, 3)),
    )

    private class FakeRepository(private val data: List<Match>) : MatchRepository {
        override suspend fun matches(): List<Match> = data
        override suspend fun match(id: String): Match? = data.firstOrNull { it.id == id }
        override suspend fun add(match: Match): Match = match
    }

    private object FailingRepository : MatchRepository {
        override suspend fun matches(): List<Match> = throw RuntimeException("boom")
        override suspend fun match(id: String): Match? = null
        override suspend fun add(match: Match): Match = throw RuntimeException("boom")
    }
}
