# Mission: Informatics - Final Backend Plan v1.2

## Architecture

Frontend stays as the existing React + Vite + TypeScript application.

Backend v1 is Supabase-native:

- Supabase Auth for registration, login, and session handling
- Supabase PostgreSQL for persistent data
- Row Level Security for authorization
- Supabase Edge Functions for protected completion logic
- PostgreSQL RPC functions only as private internal helpers called by Edge Functions

Do not build these in v1:

- Express
- Fastify
- custom Node.js backend
- custom JWT auth
- custom bcrypt auth
- Next.js migration
- MongoDB
- Render/Railway backend server
- CMS/admin content system

Educational content remains in frontend static TypeScript files:

- src/data/modules/**
- src/data/checkpoints.ts
- src/data/ranks.ts

Supabase stores only identity, progress, scores, XP, badges, analytics events, and minimal validation catalog metadata.

---

## Decisions After Code Review

This version fixes the earlier design issues and the final code review issues: rank identity, internal RPC security, duplicated module_id, username collision, role privilege escalation, hardcoded rank ambiguity, and email-derived display names.

### Decision 1 - Rank identity

Current frontend ranks do not have stable IDs. The backend must not depend on a non-existing rank id.

Before database migrations, update `src/data/ranks.ts` to add explicit stable IDs.

If there are no natural IDs, use this deterministic pattern based on ascending `minXP`:

```ts
export const ranks = [
  {
    id: "rank_01",
    name: "...",
    en: "...",
    minXP: 0,
    icon: "...",
    col: "...",
  },
  {
    id: "rank_02",
    name: "...",
    en: "...",
    minXP: 100,
    icon: "...",
    col: "...",
  },
];
```

Rules:

- `id` is a stable technical key.
- Do not derive rank identity from display names.
- Do not rename rank IDs after launch.
- `current_rank_id` in the database stores the rank `id`, not rank name.
- Initial rank is always `rank_01` in v1. This is a hard rule, not a placeholder.

### Decision 2 - Internal RPC security

Internal RPC functions used by Edge Functions must not be callable by browser clients.

All internal RPC functions must:

- be created with an explicit signature
- set `search_path`
- validate inputs
- be revoked from `PUBLIC`, `anon`, and `authenticated`
- be granted only to `service_role`
- be called only from Edge Functions using the service role key

The frontend must never call:

```ts
supabase.rpc("complete_mission_internal", ...)
```

The frontend may only call:

```ts
supabase.functions.invoke("complete-mission", ...)
supabase.functions.invoke("complete-checkpoint", ...)
```

### Decision 3 - user_mission_results module_id

Do not store duplicate `module_id` in `user_mission_results`.

The source of truth for a mission's module is `mission_catalog.module_id`.

Whenever module information is needed, join:

```sql
user_mission_results.mission_id -> mission_catalog.mission_id
```

`analytics_events.module_id` may still store a snapshot because analytics events are historical event logs.

### Decision 4 - username collision policy

`username` is optional in v1 and is not inserted by the signup trigger.

Reason: if the signup trigger inserts a duplicate unique username, signup can fail.

Rules:

- On signup, create profile with `username = null`.
- `display_name` may be set from user-provided metadata only.
- If no display name is provided, use a generic non-email fallback such as `Student`.
- Never derive `display_name` from the email address.
- User can set username later from profile settings.
- Username uniqueness is enforced by a case-insensitive partial unique index.
- Duplicate username updates should show a normal UI error, not break signup.

### Decision 5 - default language

Set `preferred_language` default to `ru` because the current learning content and speech flow are Russian-oriented.

If UI language becomes separate later, add a separate field such as `ui_language`.

### Decision 6 - leaderboard visibility

Leaderboard is authenticated-only in v1.

Later, if the landing page needs a public leaderboard, create a separate public-safe RPC and grant it to `anon` intentionally.

### Decision 7 - no editable role in profiles

Do not store `role` in `profiles` for v1.

Reason: users are allowed to update their own profile. If `role` exists in the same row, a client could try to promote itself to `admin` unless extra safeguards are added. Since there is no admin panel in v1, the safest decision is to remove the field entirely.

If admin permissions are needed later, use one of these patterns instead:

- a separate `admin_users` table that clients cannot modify
- Supabase Auth `app_metadata` custom claims controlled only by trusted server code
- a dedicated admin RPC/Edge Function protected by service role and explicit checks

Never let users update their own authorization role through normal profile updates.

### Decision 8 - rank_01 is mandatory

`rank_01` is the final and mandatory initial rank ID.

Phase 0 must update `src/data/ranks.ts` so that the lowest-XP rank has:

```ts
id: "rank_01"
```

The database defaults and signup trigger intentionally use `rank_01`. Do not use another initial rank ID.

### Decision 9 - no email-derived display names

The signup trigger must not use the email prefix as `display_name`.

If the user does not provide a display name, store a generic value such as:

```txt
Student
```

This prevents accidental exposure of email aliases in the leaderboard or profile UI.

---

## Trust Model

In v1, the frontend calculates mission scores in the browser and sends the score to the Edge Function.

The backend protects against:

- unauthenticated requests
- fake user IDs
- invalid mission IDs
- unimplemented missions
- locked missions
- duplicate XP awards
- duplicate badges
- direct browser mutations of protected progress tables

The backend does not fully prove that the submitted score is legitimate in v1.

If competitive leaderboard fairness or anti-cheat becomes important, add a later `mission_validation` table and make Edge Functions calculate score from submitted answers.

---

## Phase 0 - Inspect Frontend Data and Add Rank IDs

Inspect:

- src/data/modules/**
- src/data/checkpoints.ts
- src/data/ranks.ts
- src/types/progress.ts
- src/utils/progression.ts
- src/hooks/useProgress.ts
- src/screens/MissionScreen.tsx

Produce:

- docs/backend-catalog-report.md

The report must include:

- rank list after adding stable rank IDs
- initial rank ID
- module IDs and orders
- mission IDs, module IDs, mission orders, passing scores, XP rewards, implemented flags
- checkpoint IDs, after/before module IDs, passing scores, XP rewards
- any missing or inconsistent IDs

Rank ID rule:

- If ranks do not already have IDs, add `id` to `src/data/ranks.ts`.
- Use `rank_01`, `rank_02`, etc., ordered by ascending `minXP`.
- The first/default rank must be `rank_01`.
- Do not use any alternative rank ID pattern in v1.

---

## Phase 1 - Supabase Client Setup

Install:

```bash
npm install @supabase/supabase-js
```

Create:

```txt
src/lib/supabase.ts
```

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL");
if (!supabaseAnonKey) throw new Error("Missing VITE_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Frontend `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never place these in frontend env:

- SUPABASE_SERVICE_ROLE_KEY
- DATABASE_URL
- JWT_SECRET

---

## Phase 2 - Supabase Project Structure

Create:

```txt
supabase/
  migrations/
  functions/
    complete-mission/
      index.ts
    complete-checkpoint/
      index.ts
  seed.sql
```

Use Supabase CLI migrations instead of dashboard-only manual changes.

---

## Phase 3 - Database Schema

Create migration:

```txt
supabase/migrations/0001_core_schema.sql
```

### Shared updated_at helper

```sql
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

### profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text check (username is null or username ~ '^[A-Za-z0-9_]{3,24}$'),
  display_name text,
  avatar_url text,
  bio text,
  preferred_language text not null default 'ru',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_username_lower_unique
on public.profiles (lower(username))
where username is not null;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
```

### user_progress

```sql
create table public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  current_rank_id text not null default 'rank_01',
  completed_missions_count integer not null default 0 check (completed_missions_count >= 0),
  completed_checkpoints_count integer not null default 0 check (completed_checkpoints_count >= 0),
  last_completed_mission_id text,
  last_completed_checkpoint_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_user_progress_updated_at
before update on public.user_progress
for each row execute function public.set_updated_at();
```

### mission_catalog

This table stores only validation metadata, not educational content.

```sql
create table public.mission_catalog (
  mission_id text primary key,
  module_id text not null,
  module_order integer not null check (module_order > 0),
  mission_order integer not null check (mission_order > 0),
  passing_score integer not null check (passing_score between 0 and 100),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  implemented boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, mission_order)
);

create index mission_catalog_module_order_idx
on public.mission_catalog (module_order, mission_order);

create trigger set_mission_catalog_updated_at
before update on public.mission_catalog
for each row execute function public.set_updated_at();
```

### checkpoint_catalog

```sql
create table public.checkpoint_catalog (
  checkpoint_id text primary key,
  order_index integer not null check (order_index > 0),
  after_module_id text,
  before_module_id text,
  passing_score integer not null default 70 check (passing_score between 0 and 100),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_checkpoint_catalog_updated_at
before update on public.checkpoint_catalog
for each row execute function public.set_updated_at();
```

### user_mission_results

No duplicate `module_id` is stored here.

```sql
create table public.user_mission_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null references public.mission_catalog(mission_id) on delete cascade,
  best_score integer not null default 0 check (best_score between 0 and 100),
  passed boolean not null default false,
  xp_awarded boolean not null default false,
  first_completed_at timestamptz,
  last_completed_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_id)
);

create index user_mission_results_user_idx
on public.user_mission_results (user_id);

create index user_mission_results_user_passed_idx
on public.user_mission_results (user_id, passed);

create trigger set_user_mission_results_updated_at
before update on public.user_mission_results
for each row execute function public.set_updated_at();
```

### user_checkpoint_results

```sql
create table public.user_checkpoint_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  checkpoint_id text not null references public.checkpoint_catalog(checkpoint_id) on delete cascade,
  best_score integer not null default 0 check (best_score between 0 and 100),
  passed boolean not null default false,
  xp_awarded boolean not null default false,
  first_completed_at timestamptz,
  last_completed_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkpoint_id)
);

create index user_checkpoint_results_user_idx
on public.user_checkpoint_results (user_id);

create trigger set_user_checkpoint_results_updated_at
before update on public.user_checkpoint_results
for each row execute function public.set_updated_at();
```

### user_badges

```sql
create table public.user_badges (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index user_badges_user_idx
on public.user_badges (user_id);
```

### analytics_events

```sql
create table public.analytics_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  module_id text,
  mission_id text,
  checkpoint_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_user_idx on public.analytics_events (user_id);
create index analytics_events_type_idx on public.analytics_events (event_type);
create index analytics_events_created_at_idx on public.analytics_events (created_at);
```

---

## Phase 4 - New User Trigger

Create migration:

```txt
supabase/migrations/0002_new_user_trigger.sql
```

Important: the trigger does not insert username.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (
    id,
    username,
    display_name,
    preferred_language
  )
  values (
    new.id,
    null,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      'Student'
    ),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_language', ''), 'ru')
  );

  insert into public.user_progress (
    user_id,
    xp,
    current_rank_id
  )
  values (
    new.id,
    0,
    'rank_01'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

---

## Phase 5 - RLS Policies

Create migration:

```txt
supabase/migrations/0003_rls_policies.sql
```

Enable RLS:

```sql
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.mission_catalog enable row level security;
alter table public.checkpoint_catalog enable row level security;
alter table public.user_mission_results enable row level security;
alter table public.user_checkpoint_results enable row level security;
alter table public.user_badges enable row level security;
alter table public.analytics_events enable row level security;
```

Catalog read policies:

```sql
create policy "Authenticated users can read mission catalog"
on public.mission_catalog
for select
to authenticated
using (true);

create policy "Authenticated users can read checkpoint catalog"
on public.checkpoint_catalog
for select
to authenticated
using (true);
```

Profile policies:

Important: `profiles` must not contain `role`, `is_admin`, or any authorization column. Users are allowed to update their own non-sensitive profile fields only.

```sql
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
```

`profiles` must not contain authorization fields such as `role`, `is_admin`, or `permissions`. Users may update their own profile, so authorization data must live elsewhere if needed later.

Do not add admin or security columns to `profiles`. If admin roles are needed later, create a separate protected authorization table.

Progress policies:

```sql
create policy "Users can read own progress"
on public.user_progress
for select
to authenticated
using (auth.uid() = user_id);
```

Mission result policies:

```sql
create policy "Users can read own mission results"
on public.user_mission_results
for select
to authenticated
using (auth.uid() = user_id);
```

Checkpoint result policies:

```sql
create policy "Users can read own checkpoint results"
on public.user_checkpoint_results
for select
to authenticated
using (auth.uid() = user_id);
```

Badge policies:

```sql
create policy "Users can read own badges"
on public.user_badges
for select
to authenticated
using (auth.uid() = user_id);
```

Analytics policies:

```sql
create policy "Users can read own analytics events"
on public.analytics_events
for select
to authenticated
using (auth.uid() = user_id);
```

Do not add direct browser insert/update/delete policies for:

- user_progress
- user_mission_results
- user_checkpoint_results
- user_badges
- analytics_events in v1

These mutations must go through Edge Functions.

---

## Phase 6 - Seed Catalog Data

Create:

```txt
supabase/seed.sql
```

Seed `mission_catalog` from frontend static mission definitions.

```sql
insert into public.mission_catalog (
  mission_id,
  module_id,
  module_order,
  mission_order,
  passing_score,
  xp_reward,
  implemented
)
values
  -- generated from src/data/modules/**
  -- ('mission-id', 'module-id', 1, 1, 70, 50, true)
on conflict (mission_id) do update set
  module_id = excluded.module_id,
  module_order = excluded.module_order,
  mission_order = excluded.mission_order,
  passing_score = excluded.passing_score,
  xp_reward = excluded.xp_reward,
  implemented = excluded.implemented,
  updated_at = now();
```

Seed `checkpoint_catalog` from frontend checkpoint definitions.

```sql
insert into public.checkpoint_catalog (
  checkpoint_id,
  order_index,
  after_module_id,
  before_module_id,
  passing_score,
  xp_reward
)
values
  -- generated from src/data/checkpoints.ts
  -- ('checkpoint-1', 1, '3', '4', 70, 100)
on conflict (checkpoint_id) do update set
  order_index = excluded.order_index,
  after_module_id = excluded.after_module_id,
  before_module_id = excluded.before_module_id,
  passing_score = excluded.passing_score,
  xp_reward = excluded.xp_reward,
  updated_at = now();
```

---

## Phase 7 - Auth Integration

New files:

```txt
src/services/auth.ts
src/hooks/useAuth.ts
src/screens/LoginScreen.tsx
src/screens/RegisterScreen.tsx
```

Registration should not require username in v1.

```ts
import { supabase } from "../lib/supabase";

export async function registerUser(params: {
  email: string;
  password: string;
  displayName?: string;
}) {
  const { email, password, displayName } = params;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName ?? null,
        preferred_language: "ru",
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

`useAuth` should load the current session, subscribe to auth state changes, and expose user/session/loading helpers.

---

## Phase 8 - Progress Read Layer

Create:

```txt
src/services/progress.ts
```

Required functions:

```ts
export async function getMyProgress() {}
export async function getMyMissionResults() {}
export async function getMyCheckpointResults() {}
export async function getMyBadges() {}
export async function getFullProgressState() {}
```

Map Supabase rows into frontend shape:

```ts
type UserProgressState = {
  xp: number;
  currentRankId: string;
  completedMissions: string[];
  completedCheckpoints: string[];
  badges: string[];
  missionScores: Record<string, number>;
  checkpointScores: Record<string, number>;
};
```

Mapping:

- `user_progress.xp` -> `xp`
- `user_progress.current_rank_id` -> `currentRankId`
- passed mission rows -> `completedMissions`
- passed checkpoint rows -> `completedCheckpoints`
- badge rows -> `badges`
- mission best scores -> `missionScores`
- checkpoint best scores -> `checkpointScores`

For authenticated users, Supabase is the source of truth.

For guest users, localStorage may remain as temporary guest progress.

---

## Phase 9 - Private Internal RPC Functions

Create migration:

```txt
supabase/migrations/0004_internal_completion_rpcs.sql
```

Internal RPC functions should perform atomic updates.

### complete_mission_internal skeleton

```sql
create or replace function public.complete_mission_internal(
  p_user_id uuid,
  p_mission_id text,
  p_score integer,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
begin
  if p_user_id is null then
    raise exception 'Missing user id';
  end if;

  if p_mission_id is null or length(trim(p_mission_id)) = 0 then
    raise exception 'Missing mission id';
  end if;

  if p_score is null or p_score < 0 or p_score > 100 then
    raise exception 'Invalid score';
  end if;

  -- Implementation must:
  -- 1. lock the user's progress row with FOR UPDATE
  -- 2. load mission_catalog row
  -- 3. reject missing/unimplemented mission
  -- 4. validate unlock rules
  -- 5. upsert user_mission_results
  -- 6. award XP only once
  -- 7. calculate current_rank_id from rank thresholds
  -- 8. grant module badge if all implemented module missions are passed
  -- 9. insert analytics event
  -- 10. return full updated progress state

  return v_result;
end;
$$;

revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from PUBLIC;
revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from anon;
revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from authenticated;
grant execute on function public.complete_mission_internal(uuid, text, integer, jsonb) to service_role;
```

### complete_checkpoint_internal skeleton

```sql
create or replace function public.complete_checkpoint_internal(
  p_user_id uuid,
  p_checkpoint_id text,
  p_score integer,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
begin
  if p_user_id is null then
    raise exception 'Missing user id';
  end if;

  if p_checkpoint_id is null or length(trim(p_checkpoint_id)) = 0 then
    raise exception 'Missing checkpoint id';
  end if;

  if p_score is null or p_score < 0 or p_score > 100 then
    raise exception 'Invalid score';
  end if;

  -- Implementation must:
  -- 1. lock the user's progress row with FOR UPDATE
  -- 2. load checkpoint_catalog row
  -- 3. validate checkpoint unlock rules
  -- 4. upsert user_checkpoint_results
  -- 5. award XP only once
  -- 6. calculate current_rank_id
  -- 7. insert analytics event
  -- 8. return full updated progress state

  return v_result;
end;
$$;

revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from PUBLIC;
revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from anon;
revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from authenticated;
grant execute on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) to service_role;
```

Important: internal RPC functions are not public API.

---

## Phase 10 - Edge Function complete-mission

Create:

```txt
supabase/functions/complete-mission/index.ts
```

Input:

```ts
type CompleteMissionRequest = {
  missionId: string;
  score: number;
  completionTime?: number;
  activityType?: string;
  attemptMeta?: Record<string, unknown>;
};
```

Security rules:

- Read Authorization header.
- Verify user with Supabase Auth using anon key plus Authorization header.
- Extract `user.id` from verified user.
- Create service-role Supabase client inside the Edge Function.
- Call `complete_mission_internal` with verified user ID.
- Never trust userId, xpReward, moduleId, passed, rank, or badgeId from request body.

The frontend calls only:

```ts
supabase.functions.invoke("complete-mission", {
  body: { missionId, score, completionTime, activityType, attemptMeta },
});
```

---

## Phase 11 - Edge Function complete-checkpoint

Create:

```txt
supabase/functions/complete-checkpoint/index.ts
```

Input:

```ts
type CompleteCheckpointRequest = {
  checkpointId: string;
  score: number;
  completionTime?: number;
  attemptMeta?: Record<string, unknown>;
};
```

Rules are the same as mission completion.

The Edge Function verifies auth and then calls `complete_checkpoint_internal` with the service role client.

---

## Phase 12 - Unlock Rules

Backend must enforce unlock rules.

Ignore frontend testing override:

```txt
UNLOCK_ALL_FOR_TESTING
```

Rules:

- First mission in module 1 is unlocked by default.
- Mission order > 1 is unlocked only if the previous implemented mission in the same module is passed.
- First mission in a later module is unlocked only if all implemented missions in the previous module are passed.
- If a checkpoint exists between previous module and current module, that checkpoint must also be passed.
- Failed attempts may be stored but do not unlock anything.
- Unimplemented missions are never completable.

---

## Phase 13 - XP, Badge, and Rank Rules

XP:

- Award mission XP only once per mission after first successful pass.
- Award checkpoint XP only once per checkpoint after first successful pass.
- Replays can improve best score but do not duplicate XP.

Badges:

- One module badge in v1.
- Award when all implemented missions in that module are passed.
- If no stable frontend badge ID exists, use `module:{module_id}:complete`.
- Use unique constraint to prevent duplicates.

Ranks:

- `current_rank_id` is calculated server-side from XP.
- Use stable rank IDs from `src/data/ranks.ts` after Phase 0 adds them.
- Frontend can use rank data for display, but cannot submit rank to backend.

---

## Phase 14 - Frontend Completion Integration

Create service:

```txt
src/services/completion.ts
```

```ts
import { supabase } from "../lib/supabase";

export async function completeMission(params: {
  missionId: string;
  score: number;
  completionTime?: number;
  activityType?: string;
  attemptMeta?: Record<string, unknown>;
}) {
  const { data, error } = await supabase.functions.invoke("complete-mission", {
    body: params,
  });

  if (error) throw error;
  return data;
}

export async function completeCheckpoint(params: {
  checkpointId: string;
  score: number;
  completionTime?: number;
  attemptMeta?: Record<string, unknown>;
}) {
  const { data, error } = await supabase.functions.invoke("complete-checkpoint", {
    body: params,
  });

  if (error) throw error;
  return data;
}
```

Modify:

- src/hooks/useProgress.ts
- src/screens/MissionScreen.tsx
- checkpoint screen/component if present
- src/screens/ProfileScreen.tsx
- src/screens/DashboardScreenNew.tsx
- src/App.tsx

Do not update protected tables directly from frontend.

---

## Phase 15 - Leaderboard

Leaderboard is authenticated-only in v1.

Create migration:

```txt
supabase/migrations/0005_leaderboard_rpc.sql
```

```sql
create or replace function public.get_global_leaderboard(limit_count integer default 100)
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  xp integer,
  current_rank_id text,
  badges_count bigint
)
language sql
security definer
set search_path = public, pg_temp
as $$
  select
    up.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    up.xp,
    up.current_rank_id,
    coalesce(b.badges_count, 0) as badges_count
  from public.user_progress up
  join public.profiles p on p.id = up.user_id
  left join (
    select user_id, count(*) as badges_count
    from public.user_badges
    group by user_id
  ) b on b.user_id = up.user_id
  order by up.xp desc, up.updated_at asc
  limit least(greatest(limit_count, 1), 100);
$$;

revoke all on function public.get_global_leaderboard(integer) from PUBLIC;
revoke all on function public.get_global_leaderboard(integer) from anon;
grant execute on function public.get_global_leaderboard(integer) to authenticated;
```

Leaderboard must not expose:

- email
- auth.users data
- private profile data
- mission-level results
- analytics logs

Frontend service:

```ts
export async function getGlobalLeaderboard(limit = 100) {
  const { data, error } = await supabase.rpc("get_global_leaderboard", {
    limit_count: limit,
  });

  if (error) throw error;
  return data;
}
```

---

## Phase 16 - Testing Checklist

Auth:

- User can register.
- User can login.
- User can logout.
- New user gets profile row.
- New user gets user_progress row.
- Duplicate username cannot break signup because username is null at signup.

RLS:

- User can read own profile.
- User can update own profile.
- User cannot directly update XP.
- User cannot directly insert mission result.
- User cannot directly insert checkpoint result.
- User cannot directly insert badge.
- User cannot call internal completion RPC as anon/authenticated.

Mission completion:

- Unlocked mission can be completed.
- Locked mission is rejected.
- Unimplemented mission is rejected.
- Invalid score is rejected.
- First pass awards XP.
- Replay does not award XP again.
- Better replay updates best score.
- Failed attempt increments attempt count but does not unlock next mission.

Checkpoint completion:

- Checkpoint is locked before required modules are complete.
- Checkpoint unlocks after required modules are complete.
- First pass awards XP.
- Replay does not duplicate XP.

Leaderboard:

- Authenticated users can read leaderboard.
- Anonymous users cannot read leaderboard in v1.
- Leaderboard does not expose email.
- Leaderboard updates after XP changes.

Security:

- Service role key is never in frontend.
- Edge Functions verify auth before service role writes.
- Internal RPC functions are revoked from PUBLIC, anon, and authenticated.
- CORS is configured for the frontend domain.

---

## Final Execution Order

1. Inspect frontend data and add stable rank IDs.
2. Create backend catalog report.
3. Add Supabase client.
4. Create migrations for schema, trigger, and RLS.
5. Generate seed.sql.
6. Add auth screens and auth hook.
7. Add progress read service.
8. Implement internal completion RPC functions with strict revokes.
9. Implement complete-mission Edge Function.
10. Connect mission completion in frontend.
11. Implement complete-checkpoint Edge Function.
12. Connect checkpoint completion in frontend.
13. Add leaderboard RPC and UI.
14. Run full testing checklist.
15. Deploy frontend and Supabase functions.

---

## Final Scope Boundary

Included in v1:

- Supabase Auth
- profiles
- persistent progress
- mission results
- checkpoint results
- XP
- current_rank_id
- badges
- basic analytics events
- leaderboard for authenticated users
- Edge Functions for protected completion logic
- private internal RPC functions for atomic updates
- RLS policies

Not included in v1:

- Express backend
- Fastify backend
- Next.js migration
- MongoDB
- custom JWT
- custom bcrypt auth
- CMS
- admin content editor
- full server-side scoring for all activities
- advanced anti-cheat
- full analytics dashboard
- public leaderboard
- social features

