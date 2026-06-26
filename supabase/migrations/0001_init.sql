-- TennisAce · initial schema (Phase 5 — Auth, DB, Sync)
-- Offline-first snapshot mirror: the app keeps everything locally and pushes a
-- JSONB snapshot per signed-in user. Row Level Security scopes every row to its
-- owner. Apply with the Supabase SQL editor, `supabase db push`, or the MCP.

-- ── profiles: one snapshot row per user ──────────────────────────────────────
create table if not exists public.profiles (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  has_onboarded boolean     not null default false,
  profile       jsonb,
  level_state   jsonb,
  equipment     jsonb,
  health        jsonb,
  settings      jsonb,
  updated_at    timestamptz not null default now()
);

-- ── test_results: one row per performance test (id = app-generated) ──────────
create table if not exists public.test_results (
  id         text        primary key,
  user_id    uuid        not null references auth.users (id) on delete cascade,
  date       timestamptz not null,
  payload    jsonb       not null,
  created_at timestamptz not null default now()
);
create index if not exists test_results_user_date_idx on public.test_results (user_id, date);

-- ── workout_logs: one row per logged session (unique per user+timestamp) ─────
create table if not exists public.workout_logs (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  date       text        not null,
  felt       text,
  created_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.test_results enable row level security;
alter table public.workout_logs enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own test_results" on public.test_results;
create policy "own test_results" on public.test_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own workout_logs" on public.workout_logs;
create policy "own workout_logs" on public.workout_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
