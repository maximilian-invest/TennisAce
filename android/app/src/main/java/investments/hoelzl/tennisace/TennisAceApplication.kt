package investments.hoelzl.tennisace

import android.app.Application
import investments.hoelzl.tennisace.data.MatchRepository
import investments.hoelzl.tennisace.data.MockMatchRepository

/**
 * Application entry point and the app's single composition root. The whole app
 * shares one [MatchRepository] instance created here — this is the one place to
 * swap [MockMatchRepository] for a real backend (e.g. Supabase).
 */
class TennisAceApplication : Application() {
    val matchRepository: MatchRepository by lazy { MockMatchRepository() }
}
