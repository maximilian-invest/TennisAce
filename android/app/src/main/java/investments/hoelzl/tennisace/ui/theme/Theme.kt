package investments.hoelzl.tennisace.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val LightColors = lightColorScheme(
    primary = CourtGreen,
    onPrimary = Color.White,
    primaryContainer = CourtGreenDark,
    onPrimaryContainer = Color.White,
    secondary = ClayOrange,
)

private val DarkColors = darkColorScheme(
    primary = AceLime,
    primaryContainer = CourtGreenDark,
    secondary = ClayOrange,
)

/**
 * App theme. Uses Material You dynamic color on Android 12+ when enabled,
 * otherwise falls back to the TennisAce brand palette.
 */
@Composable
fun TennisAceTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit,
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColors
        else -> LightColors
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = TennisAceTypography,
        content = content,
    )
}
