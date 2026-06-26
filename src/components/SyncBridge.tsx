import { useSyncBridge } from '@/services/sync';

/** Headless: initialises auth and keeps the Supabase mirror in sync. */
export function SyncBridge() {
  useSyncBridge();
  return null;
}
