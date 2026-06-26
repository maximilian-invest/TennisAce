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
    supabase.auth.getSession().then(({ data }) => {
      set({
        session: data.session,
        user: data.session?.user ?? null,
        status: data.session ? 'signedIn' : 'signedOut',
      });
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        status: session ? 'signedIn' : 'signedOut',
      });
    });
  },

  signOut: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    set({ session: null, user: null, status: 'signedOut' });
  },
}));
