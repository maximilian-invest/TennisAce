import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { isSupabaseConfigured, supabase } from '@/services/supabase';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

type AuthState = {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  init: () => void;
  signOut: () => Promise<void>;
};

let initialized = false;

export const useAuthStore = create<AuthState>((set) => ({
  status: isSupabaseConfigured ? 'loading' : 'signedOut',
  session: null,
  user: null,

  init: () => {
    if (initialized) return;
    initialized = true;
    if (!isSupabaseConfigured) {
      set({ status: 'signedOut' });
      return;
    }
    // Keep the store in step with every auth transition.
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        status: session ? 'signedIn' : 'signedOut',
      });
    });
    // Anonymous-first: if there's no persisted session, silently create a guest
    // user so the app is "signed in" and syncing from the very first launch.
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        set({ session: data.session, user: data.session.user, status: 'signedIn' });
        return;
      }
      const { error } = await supabase.auth.signInAnonymously();
      // On success onAuthStateChange flips us to signedIn; on failure (e.g.
      // anonymous sign-ins disabled) fall back to the manual login UI.
      if (error) set({ status: 'signedOut' });
    });
  },

  signOut: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    set({ session: null, user: null, status: 'signedOut' });
  },
}));
