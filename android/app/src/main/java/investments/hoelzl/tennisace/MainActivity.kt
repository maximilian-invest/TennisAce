package investments.hoelzl.tennisace

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import investments.hoelzl.tennisace.ui.TennisAceApp
import investments.hoelzl.tennisace.ui.theme.TennisAceTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val repository = (application as TennisAceApplication).matchRepository

        setContent {
            TennisAceTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    TennisAceApp(repository = repository)
                }
            }
        }
    }
}
