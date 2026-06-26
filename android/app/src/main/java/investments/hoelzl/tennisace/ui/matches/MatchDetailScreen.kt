package investments.hoelzl.tennisace.ui.matches

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import investments.hoelzl.tennisace.model.Match
import investments.hoelzl.tennisace.model.SetScore
import investments.hoelzl.tennisace.model.Surface
import investments.hoelzl.tennisace.ui.theme.TennisAceTheme
import java.time.Instant

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MatchDetailScreen(match: Match, onBack: () -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("vs ${match.opponentName}") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Zurück")
                    }
                },
            )
        },
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text(
                text = if (match.didPlayerWin) "Sieg" else "Niederlage",
                style = MaterialTheme.typography.headlineMedium,
                color = if (match.didPlayerWin) MaterialTheme.colorScheme.primary
                else MaterialTheme.colorScheme.error,
            )
            Text(
                text = match.subtitle(),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            HorizontalDivider()

            Text(
                text = "Sätze (${match.setsWonByPlayer}–${match.setsWonByOpponent})",
                style = MaterialTheme.typography.titleMedium,
            )
            match.sets.forEachIndexed { index, set ->
                SetRow(index = index, set = set)
            }
        }
    }
}

@Composable
private fun SetRow(index: Int, set: SetScore) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text("Satz ${index + 1}")
        val score = buildString {
            append("${set.playerGames}-${set.opponentGames}")
            set.tiebreak?.let { append(" ($it)") }
        }
        Text(
            text = score,
            fontWeight = if (set.playerWonSet) FontWeight.Bold else FontWeight.Normal,
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun MatchDetailPreview() {
    TennisAceTheme {
        MatchDetailScreen(
            match = Match(
                id = "preview",
                date = Instant.parse("2026-06-21T17:30:00Z"),
                opponentName = "Lena Richter",
                location = "TC Rotweiß",
                surface = Surface.CLAY,
                sets = listOf(SetScore(6, 4), SetScore(3, 6), SetScore(7, 6, tiebreak = 5)),
            ),
            onBack = {},
        )
    }
}
