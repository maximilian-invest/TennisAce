import { useEffect, useRef } from 'react';

import type { TestResult } from '@/domain/models';
import { useAppStore, type RemoteSnapshot } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { isSupabaseConfigured, supabase } from './supabase';

// Cloud mirror of the local store (see store/appStore RemoteSnapshot). We store
// the offline-first snapshot as JSONB columns rather than a normalised schema —
// simple, robust, and a perfect fit for a single-user backup.

export async function pushSnapshot(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const s = useAppStore.getState();

  await supabase.from('profiles').upsert(
    {
      user_id: userId,
      has_onboarded: s.hasOnboarded,
      profile: s.profile,
      level_state: s.levelState,
      equipment: s.equipment,
      health: s.health,
      settings: s.settings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (s.testHistory.length) {
    await supabase
      .from('test_results')
      .upsert(s.testHistory.map((t) => ({ id: t.id, user_id: userId, date: t.date, payload: t })), { onConflict: 'id' });
  }

  if (s.workoutLog.length) {
    await supabase
      .from('workout_logs')
      .upsert(s.workoutLog.map((w) => ({ user_id: userId, date: w.date, felt: w.felt ?? null })), { onConflict: 'user_id,date' });
  }
}

export async function pullSnapshot(userId: string): Promise<RemoteSnapshot | null> {
  if (!isSupabaseConfigured) return null;

  const { data: prof, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
  if (error || !prof) return null;

  const { data: tests } = await supabase
    .from('test_results')
    .select('payload')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  const { data: logs } = await supabase
    .from('workout_logs')
    .select('date, felt')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  return {
    profile: prof.profile ?? null,
    equipment: prof.equipment ?? null,
    health: prof.health ?? null,
    levelState: prof.level_state ?? null,
    testHistory: (tests ?? []).map((t: { payload: TestResult }) => t.payload),
    workoutLog: (logs ?? []).map((w: { date: string; felt: string | null }) => ({
      date: w.date,
      felt: (w.felt as RemoteSnapshot['workoutLog'][number]['felt']) ?? undefined,
    })),
  };
}

/**
 * On sign-in: if the account already has cloud data, it wins (fresh-device
 * restore); otherwise seed the cloud from whatever is on this device.
 */
export async function syncOnSignIn(userId: string): Promise<void> {
  const remote = await pullSnapshot(userId);
  if (remote && remote.profile) {
    useAppStore.getState().hydrateFromRemote(remote);
  } else {
    await pushSnapshot(userId);
  }
}

/** Mounts auth + keeps the cloud mirror in step while signed in (debounced). */
export function useSyncBridge(): void {
  const init = useAuthStore((s) => s.init);
  const status = useAuthStore((s) => s.status);
  const userId = useAuthStore((s) => s.user?.id);
  const reconciledFor = useRef<string | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (status === 'signedOut') {
      reconciledFor.current = null;
      return;
    }
    if (status !== 'signedIn' || !userId) return;
    // Reconcile once per distinct user id: a fresh sign-in to an existing
    // account (new id) pulls its data; securing the same anon user (same id)
    // does not re-pull and keeps the local progress.
    if (reconciledFor.current === userId) return;
    reconciledFor.current = userId;
    syncOnSignIn(userId).catch(() => {});
  }, [status, userId]);

  useEffect(() => {
    if (status !== 'signedIn' || !userId) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsub = useAppStore.subscribe(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        pushSnapshot(userId).catch(() => {});
      }, 1500);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsub();
    };
  }, [status, userId]);
}
