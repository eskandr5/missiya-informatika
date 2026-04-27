# Mission: Informatics — Final Backend Plan
## Supabase MVP Backend for React + Vite Frontend

**Version:** 1.0  
**Architecture:** Supabase-first backend  
**Frontend:** Existing React + Vite + TypeScript app  
**Backend:** Supabase Auth + PostgreSQL + Row Level Security + Edge Functions  
**Main Goal:** Add real users, persistent progress, XP, badges, checkpoints, and leaderboard without building a custom Node/Express backend.

---

## 1. Project Context

Mission: Informatics is an interactive gamified learning platform for beginner/preparatory students.

The current frontend already contains:

- Static educational modules.
- Missions.
- Vocabulary.
- Phrases.
- Activity engines.
- XP logic.
- Rank display.
- Badge display.
- Local progress stored in `localStorage`.
- Unlock/progression logic inside frontend utilities.

The current project does **not** have:

- Backend.
- Real user accounts.
- Authentication.
- Database persistence.
- Secure XP awarding.
- Server-side unlock validation.
- Real leaderboard.
- Admin backend.

The goal of this plan is to add a minimal real backend while keeping the current frontend architecture as much as possible.

---

## 2. Final Technology Decision

Use:

```txt
React + Vite + TypeScript frontend
+
Supabase Auth
+
Supabase PostgreSQL
+
Supabase Row Level Security
+
Supabase Edge Functions
```

Do **not** use in v1:

```txt
Express
Fastify
Custom Node.js backend
Custom JWT implementation
Custom bcrypt auth flow
MongoDB
Next.js migration
Render/Railway backend server
Full CMS
Admin content editor
```

---

## 3. Core Product Decision

For v1, **do not migrate the full educational content into the database**.

Keep these inside the frontend static TypeScript files:

```txt
src/data/modules/**
src/data/checkpoints.ts
src/data/ranks.ts
```

The database should only store:

```txt
users through Supabase Auth
profiles
progress
mission completion results
checkpoint completion results
badges
analytics events
minimal mission/checkpoint catalog metadata
leaderboard read data
```

The frontend remains responsible for rendering:

```txt
modules
missions
vocab
phrases
activityData
activity UI
lesson flow
```

Supabase becomes responsible for:

```txt
identity
authorization
persistent progress
XP awarding
best score storage
badge granting
checkpoint completion
leaderboard data
server-side unlock validation
analytics event insertion
```

---

## 4. Important Trust Model

This is critical.

In the current frontend, activities calculate scores inside the browser. If the frontend sends only this:

```json
{
  "missionId": "some-mission",
  "score": 100
}
```

then the backend cannot fully prove that the score is legitimate.

For v1, the backend will protect against:

```txt
invalid mission IDs
unimplemented missions
locked missions
duplicate XP awards
duplicate badges
fake user IDs
unauthenticated requests
direct client updates to progress tables
```

But v1 will **not** fully protect against a technical user manually submitting a fake high score.

This is acceptable for MVP if the project is educational and not a competitive exam platform.

If stronger anti-cheat is required later, add:

```txt
mission_validation
```

and make Edge Functions calculate scores from submitted answers instead of trusting frontend-submitted scores.

For now:

```txt
V1 score model = frontend-trusted score with backend-controlled XP/progress.
```

---

## 5. ID Strategy

Use `text` for all course identifiers in the database, even if the frontend currently uses numbers.

Examples:

```txt
module_id: "1"
mission_id: "m1-lesson-1"
checkpoint_id: "checkpoint-1"
badge_id: "module-1-complete"
```

Reason:

- safer for mixed ID formats
- easier migration later
- avoids integer/string mismatch between TypeScript and PostgreSQL

During frontend integration, normalize IDs using:

```ts
String(module.id)
String(mission.id)
String(checkpoint.id)
```

The database will still include order fields for progression:

```txt
module_order integer
mission_order integer
checkpoint order_index integer
```

---

## 6. Implementation Rule for Codex

Do **not** implement everything in one giant change.

Implementation must happen in small phases:

```txt
Phase 0: Inspect current frontend data
Phase 1: Supabase project/client setup
Phase 2: Supabase folder structure
Phase 3: Database migrations
Phase 4: New user trigger
Phase 5: RLS policies
Phase 6: Seed catalog data
Phase 7: Auth integration
Phase 8: Progress read layer
Phase 9: Edge Function complete-mission
Phase 10: Mission unlock rules
Phase 11: Badge rules
Phase 12: Rank rules
Phase 13: Edge Function complete-checkpoint
Phase 14: Frontend mission completion integration
Phase 15: Frontend checkpoint integration
Phase 16: App authentication flow
Phase 17: Leaderboard
Phase 18: Analytics scope
Phase 19: Optional anti-cheat upgrade
Phase 20: Deployment plan
Phase 21: Security checklist
Phase 22: Testing checklist
Phase 23: Files to create or modify
Phase 24: Suggested execution order for Codex
```

Each phase should be completed and tested before moving to the next phase.

---

# Phase 0 — Inspect Existing Frontend Data

## Objective

Before writing migrations or seeds, inspect the current frontend data files and produce a catalog report.

## Files to inspect

```txt
src/data/modules/**
src/data/checkpoints.ts
src/data/ranks.ts
src/types/progress.ts
src/utils/progression.ts
src/hooks/useProgress.ts
src/screens/MissionScreen.tsx
```

## Extract these values

For modules:

```txt
module id
module order
module title
module badge id/name if available
module xpReward if available
missions inside module
```

For missions:

```txt
mission id
module id
module order
mission order inside module
mission type
passingScore
xpReward
implemented
```

For checkpoints:

```txt
checkpoint id
order index
after module
before module
passingScore
xpReward
```

For ranks:

```txt
rank id
rank title/name
minimum XP threshold
first/default rank id
```

## Phase 0 output

Create or update a file:

```txt
docs/backend-catalog-report.md
```

It should contain:

```md
# Backend Catalog Report

## Initial Rank
initial_rank_id: ...

## Modules
| module_id | module_order | title | badge_id |
|---|---:|---|---|

## Missions
| mission_id | module_id | module_order | mission_order | passing_score | xp_reward | implemented |
|---|---|---:|---:|---:|---:|---|

## Checkpoints
| checkpoint_id | order_index | after_module_id | before_module_id | passing_score | xp_reward |
|---|---:|---|---|---:|---:|

## Notes
- Any missing passingScore:
- Any missing xpReward:
- Any unimplemented missions:
- Any ID inconsistencies:
```

Do not continue to Phase 1 until this inspection is complete.

---

# Phase 1 — Supabase Setup

## Objective

Connect the existing React/Vite frontend to Supabase.

## Tasks

Install Supabase client:

```bash
npm install @supabase/supabase-js
```

Create:

```txt
src/lib/supabase.ts
```

Code:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Create frontend env file:

```txt
.env.local
```

With:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never put these in frontend env:

```txt
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
JWT_SECRET
```

The service role key must only exist inside Supabase Edge Functions or local backend tooling.

---

# Phase 2 — Supabase Folder Structure

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

Use Supabase CLI migrations rather than making all database changes manually from the dashboard.

Expected workflow:

```bash
supabase init
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase functions deploy complete-mission
supabase functions deploy complete-checkpoint
```

---

# Phase 3 — Database Schema

## Objective

Create minimal catalog tables and user-state tables.

## Important placeholder

Replace this before running migrations:

```txt
__INITIAL_RANK_ID__
```

with the first/default rank ID discovered in Phase 0.

Example:

```txt
rookie
beginner
novice
rank_1
```

Do not guess. Use the actual frontend rank data.

---

## Migration: core schema

Create migration:

```txt
supabase/migrations/0001_core_schema.sql
```

SQL:

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

## 3.1 profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  preferred_language text not null default 'ar',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
```

## 3.2 user_progress

```sql
create table public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  current_rank text not null default '__INITIAL_RANK_ID__',
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

## 3.3 mission_catalog

This table stores only metadata needed for backend validation.

It does not store lesson content, vocab, phrases, or activity data.

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

## 3.4 checkpoint_catalog

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

## 3.5 user_mission_results

```sql
create table public.user_mission_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null references public.mission_catalog(mission_id) on delete cascade,
  module_id text not null,
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

## 3.6 user_checkpoint_results

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

## 3.7 user_badges

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

## 3.8 analytics_events

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

create index analytics_events_user_idx
on public.analytics_events (user_id);

create index analytics_events_type_idx
on public.analytics_events (event_type);

create index analytics_events_created_at_idx
on public.analytics_events (created_at);
```

---

# Phase 4 — New User Trigger

## Objective

When a user signs up through Supabase Auth, automatically create:

```txt
profiles row
user_progress row
```

Create migration:

```txt
supabase/migrations/0002_new_user_trigger.sql
```

SQL:

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
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
    nullif(new.raw_user_meta_data ->> 'username', ''),
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_language', ''), 'ar')
  );

  insert into public.user_progress (
    user_id,
    xp,
    current_rank
  )
  values (
    new.id,
    0,
    '__INITIAL_RANK_ID__'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

Again, replace:

```txt
__INITIAL_RANK_ID__
```

with the actual first rank ID from:

```txt
src/data/ranks.ts
```

---

# Phase 5 — RLS Policies

Create migration:

```txt
supabase/migrations/0003_rls_policies.sql
```

## 5.1 Enable RLS

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

## 5.2 Catalog read policies

Catalog metadata is not sensitive. Authenticated users may read it.

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

Do not allow normal users to insert/update/delete catalog rows.

## 5.3 Profile policies

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

No direct insert policy is needed because profile rows are created by the signup trigger.

## 5.4 Progress policies

```sql
create policy "Users can read own progress"
on public.user_progress
for select
to authenticated
using (auth.uid() = user_id);
```

Do not add direct client insert/update/delete policies for `user_progress`.

Only Edge Functions or database functions should mutate it.

## 5.5 Mission results policies

```sql
create policy "Users can read own mission results"
on public.user_mission_results
for select
to authenticated
using (auth.uid() = user_id);
```

Do not add direct client insert/update/delete policies for mission results.

## 5.6 Checkpoint results policies

```sql
create policy "Users can read own checkpoint results"
on public.user_checkpoint_results
for select
to authenticated
using (auth.uid() = user_id);
```

Do not add direct client insert/update/delete policies for checkpoint results.

## 5.7 Badge policies

```sql
create policy "Users can read own badges"
on public.user_badges
for select
to authenticated
using (auth.uid() = user_id);
```

Do not allow direct client badge insertion.

## 5.8 Analytics policies

```sql
create policy "Users can read own analytics events"
on public.analytics_events
for select
to authenticated
using (auth.uid() = user_id);
```

For v1, analytics inserts should happen through Edge Functions.

---

# Phase 6 — Seed Catalog Data

## Objective

Populate:

```txt
mission_catalog
checkpoint_catalog
```

from the current frontend static data.

Create:

```txt
supabase/seed.sql
```

Seed format:

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

Checkpoint seed format:

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

Important:

```txt
mission IDs in Supabase must match frontend mission IDs exactly.
checkpoint IDs in Supabase must match frontend checkpoint IDs exactly.
module IDs should be stored as text.
```

---

# Phase 7 — Auth Integration

## Objective

Add real registration, login, logout, and session handling.

## New files

```txt
src/services/auth.ts
src/hooks/useAuth.ts
src/screens/LoginScreen.tsx
src/screens/RegisterScreen.tsx
```

## auth service

```ts
import { supabase } from "../lib/supabase";

export async function registerUser(params: {
  email: string;
  password: string;
  username?: string;
  displayName?: string;
}) {
  const { email, password, username, displayName } = params;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username ?? null,
        display_name: displayName ?? null,
        preferred_language: "ar",
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

## useAuth responsibilities

`useAuth` should:

```txt
load current session on app start
listen to auth state changes
expose user
expose session
expose loading state
expose login/register/logout helpers
```

Expected shape:

```ts
type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};
```

---

# Phase 8 — Progress Read Layer

## Objective

Replace local-only progress with Supabase-backed progress for authenticated users.

## New file

```txt
src/services/progress.ts
```

## Required functions

```ts
export async function getMyProgress() {}

export async function getMyMissionResults() {}

export async function getMyCheckpointResults() {}

export async function getMyBadges() {}

export async function getFullProgressState() {}
```

## Expected frontend progress shape

Convert Supabase rows into the shape expected by the current frontend:

```ts
type UserProgressState = {
  xp: number;
  currentRank: string;
  completedMissions: string[];
  completedCheckpoints: string[];
  badges: string[];
  missionScores: Record<string, number>;
  checkpointScores: Record<string, number>;
};
```

Mapping:

```txt
user_progress.xp -> xp
user_progress.current_rank -> currentRank
user_mission_results where passed=true -> completedMissions
user_checkpoint_results where passed=true -> completedCheckpoints
user_badges.badge_id -> badges
user_mission_results.best_score -> missionScores
user_checkpoint_results.best_score -> checkpointScores
```

## localStorage rule

For authenticated users:

```txt
Supabase is the source of truth.
```

For unauthenticated guest users:

```txt
localStorage may remain as temporary guest progress.
```

Do not mix authenticated progress and guest progress silently.

Optional later:

```txt
Ask user whether to import guest progress after registration.
```

---

# Phase 9 — Edge Function: complete-mission

## Objective

Mission completion must not directly update database tables from the frontend.

The frontend calls:

```txt
supabase.functions.invoke("complete-mission", ...)
```

The Edge Function validates and updates progress.

## New folder

```txt
supabase/functions/complete-mission/index.ts
```

## Input

```ts
type CompleteMissionRequest = {
  missionId: string;
  score: number;
  completionTime?: number;
  activityType?: string;
  attemptMeta?: Record<string, unknown>;
};
```

Do not accept `userId` from the frontend.

The user ID must always come from the authenticated Supabase session.

## Required validation

The function must reject when:

```txt
request is unauthenticated
missionId is missing
score is not a number
score is below 0 or above 100
mission does not exist
mission is not implemented
mission is locked
```

## Auth pattern

The Edge Function must:

```txt
1. Read Authorization header.
2. Create a Supabase client using anon key + Authorization header.
3. Call auth.getUser().
4. Extract user.id from verified auth user.
5. Create admin Supabase client with service role.
6. Perform protected writes using service role.
```

Never trust:

```txt
request.body.userId
request.body.xpReward
request.body.moduleId
request.body.passed
request.body.badgeId
```

Only trust data loaded from database catalog and authenticated user context.

## Required behavior

`complete-mission` must:

```txt
1. verify authenticated user
2. validate mission exists
3. reject unimplemented mission
4. validate unlock rules
5. compare score with passing_score
6. upsert mission result
7. preserve best_score
8. increment attempt_count
9. set first_completed_at only on first successful pass
10. update last_completed_at
11. award XP only once
12. grant module badge if module completed
13. update user_progress
14. insert analytics event
15. return updated progress state
```

## Atomicity requirement

The protected update should be atomic.

Preferred implementation:

```txt
Edge Function validates auth and request shape.
Then it calls a PostgreSQL RPC function that performs the database update in one transaction.
```

Suggested RPC name:

```txt
public.complete_mission_internal
```

Suggested parameters:

```txt
p_user_id uuid
p_mission_id text
p_score integer
p_metadata jsonb
```

The RPC should return a JSON object with updated progress.

This avoids race conditions where the same mission could award XP twice if two requests happen at the same time.

## Response shape

```ts
type CompleteMissionResponse = {
  passed: boolean;
  score: number;
  bestScore: number;
  xpEarned: number;
  badgeUnlocked: string | null;
  currentRank: string;
  progress: {
    xp: number;
    currentRank: string;
    completedMissionsCount: number;
    completedCheckpointsCount: number;
  };
  completedMissions: string[];
  completedCheckpoints: string[];
  badges: string[];
};
```

---

# Phase 10 — Mission Unlock Rules

The backend must enforce unlock rules.

Do not trust frontend unlock state.

Ignore frontend testing override:

```txt
UNLOCK_ALL_FOR_TESTING
```

Backend progression rules for v1:

## Mission inside same module

A mission is unlocked if:

```txt
mission_order = 1
```

or:

```txt
previous implemented mission in the same module is passed
```

## First mission in module 1

Unlocked by default.

## First mission in later module

Unlocked if:

```txt
all implemented missions in the previous module are passed
```

and, if a checkpoint exists between previous module and current module:

```txt
that checkpoint is passed
```

## Failed attempts

Failed attempts may be stored as attempts, but they do not unlock the next mission and do not award XP.

## Unimplemented missions

Unimplemented missions are never completable from backend.

---

# Phase 11 — Badge Rules

For v1, use simple module-completion badges.

A module badge is awarded when:

```txt
all implemented missions in that module are passed by the user
```

Badge ID strategy:

Use the frontend badge ID if a stable one exists.

If no stable badge ID exists, use:

```txt
module:{module_id}:complete
```

Example:

```txt
module:1:complete
module:2:complete
module:3:complete
```

Badge inserts must use unique constraint:

```txt
unique(user_id, badge_id)
```

so duplicate badge awards do not create duplicates.

---

# Phase 12 — Rank Rules

The frontend already has rank thresholds in:

```txt
src/data/ranks.ts
```

For v1:

```txt
Edge Functions should calculate current_rank from XP.
Frontend may duplicate rank thresholds for display only.
Database current_rank is authoritative for stored progress and leaderboard.
```

Implementation rule:

```txt
Do not let frontend submit current_rank.
```

The Edge Function or internal RPC should:

```txt
1. calculate new XP
2. find correct rank based on thresholds
3. update user_progress.current_rank
```

If rank thresholds remain only in frontend for v1, duplicate the same thresholds in Edge Function code as constants.

Later improvement:

```txt
Move rank thresholds to a rank_catalog table.
```

Not required in v1.

---

# Phase 13 — Edge Function: complete-checkpoint

## Objective

Checkpoint completion must be protected just like mission completion.

## New folder

```txt
supabase/functions/complete-checkpoint/index.ts
```

## Input

```ts
type CompleteCheckpointRequest = {
  checkpointId: string;
  score: number;
  completionTime?: number;
  attemptMeta?: Record<string, unknown>;
};
```

## Required behavior

`complete-checkpoint` must:

```txt
1. verify authenticated user
2. validate checkpoint exists
3. check checkpoint unlock rules
4. compare score with passing_score
5. upsert checkpoint result
6. preserve best_score
7. increment attempt_count
8. set first_completed_at only on first successful pass
9. update last_completed_at
10. award XP only once
11. update user_progress
12. insert analytics event
13. return updated progress state
```

## Checkpoint unlock rule

A checkpoint is unlocked when:

```txt
all implemented missions up to checkpoint.after_module_id are passed
```

For the current project, the first checkpoint is between module 3 and module 4.

So checkpoint completion should control access to the module after it.

---

# Phase 14 — Frontend Mission Completion Integration

## Files likely affected

```txt
src/screens/MissionScreen.tsx
src/hooks/useProgress.ts
src/services/progress.ts
```

## Current behavior

The frontend currently:

```txt
calculates score
updates local progress
stores progress in localStorage
shows result
```

## New behavior

The frontend should:

```txt
calculate score
call complete-mission Edge Function
receive authoritative progress response
update local React state from server response
show result
```

## Example service

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
```

## Do not do this from frontend

```txt
insert into user_mission_results
update user_progress.xp
insert into user_badges
set current_rank
```

Those are protected backend actions.

---

# Phase 15 — Frontend Checkpoint Integration

Similar to mission completion.

Create service function:

```ts
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

Frontend should use the returned authoritative progress.

---

# Phase 16 — App Authentication Flow

## Files likely affected

```txt
src/App.tsx
src/screens/LoginScreen.tsx
src/screens/RegisterScreen.tsx
src/screens/ProfileScreen.tsx
src/screens/DashboardScreenNew.tsx
```

## Recommended UX

For v1:

```txt
Landing page can be public.
Dashboard and missions require login.
Profile requires login.
Leaderboard can require login or be public later.
```

## On app start

```txt
1. Load Supabase session.
2. If session exists, load user progress.
3. If no session, show Landing/Login/Register flow.
```

## Authenticated user data load

After login/register:

```txt
load profile
load user_progress
load user_mission_results
load user_checkpoint_results
load user_badges
hydrate useProgress
```

---

# Phase 17 — Leaderboard

## Objective

Create a safe leaderboard that exposes only public-safe fields.

Do not expose:

```txt
email
private profile data
mission-level details
checkpoint-level details
analytics logs
auth.users data
```

Expose only:

```txt
user_id
username
display_name
avatar_url
xp
current_rank
badges_count
```

## Recommended approach

Use an RPC function instead of directly exposing full tables.

Create migration:

```txt
supabase/migrations/0004_leaderboard_rpc.sql
```

SQL:

```sql
create or replace function public.get_global_leaderboard(limit_count integer default 100)
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  xp integer,
  current_rank text,
  badges_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    up.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    up.xp,
    up.current_rank,
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

revoke all on function public.get_global_leaderboard(integer) from public;
grant execute on function public.get_global_leaderboard(integer) to authenticated;
```

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

# Phase 18 — Analytics Scope

## v1 analytics events

Record lightweight events:

```txt
mission_completed
mission_failed
checkpoint_completed
checkpoint_failed
badge_earned
profile_updated
auth_signed_up
```

## Events should be inserted mostly by Edge Functions

For mission completion:

```json
{
  "event_type": "mission_completed",
  "mission_id": "...",
  "module_id": "...",
  "metadata": {
    "score": 90,
    "passed": true,
    "xpEarned": 50
  }
}
```

For failed mission:

```json
{
  "event_type": "mission_failed",
  "mission_id": "...",
  "module_id": "...",
  "metadata": {
    "score": 40,
    "passed": false
  }
}
```

Do not build a full analytics dashboard in v1.

---

# Phase 19 — Optional Anti-Cheat Upgrade

Not required in v1.

Add later only if leaderboard fairness becomes important.

## Add table

```sql
create table public.mission_validation (
  mission_id text primary key references public.mission_catalog(mission_id) on delete cascade,
  activity_type text not null,
  validation_payload jsonb not null,
  scoring_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## New model

Instead of frontend sending:

```json
{
  "missionId": "...",
  "score": 90
}
```

frontend sends:

```json
{
  "missionId": "...",
  "answers": {}
}
```

Then Edge Function calculates score server-side.

This is not part of the first implementation.

---

# Phase 20 — Deployment Plan

## Frontend hosting

Use one of:

```txt
Vercel
Netlify
Cloudflare Pages
```

Frontend env vars:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Backend hosting

Supabase handles:

```txt
Auth
Database
RLS
Edge Functions
```

No Render/Railway backend server is needed in v1.

## Edge Function secrets

Service role key must be configured only in Supabase Functions environment.

Never expose:

```txt
SUPABASE_SERVICE_ROLE_KEY
```

to the frontend.

---

# Phase 21 — Security Checklist

Before production:

```txt
[ ] RLS enabled on all user-data tables
[ ] No direct client update policy on user_progress
[ ] No direct client insert/update policy on mission results
[ ] No direct client insert/update policy on checkpoint results
[ ] No direct client insert policy on user_badges
[ ] Edge Functions verify Authorization header
[ ] Edge Functions never trust userId from request body
[ ] Edge Functions validate score is between 0 and 100
[ ] Edge Functions reject unimplemented missions
[ ] Edge Functions reject locked missions
[ ] Service role key is never used in frontend
[ ] Vite env contains only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
[ ] Leaderboard exposes only public-safe fields
[ ] No email exposed in leaderboard
[ ] CORS configured for frontend domain
```

---

# Phase 22 — Testing Checklist

## Auth

```txt
[ ] User can register
[ ] User can login
[ ] User can logout
[ ] New user automatically gets profile row
[ ] New user automatically gets user_progress row
```

## RLS

```txt
[ ] User can read own profile
[ ] User cannot read another user's private profile directly
[ ] User can read own progress
[ ] User cannot directly update own XP from frontend
[ ] User cannot insert own badge from frontend
[ ] User cannot insert mission result directly from frontend
```

## Mission completion

```txt
[ ] Completing unlocked mission stores result
[ ] Passing mission awards XP once
[ ] Repeating same mission does not award XP again
[ ] Repeating mission with better score updates best_score
[ ] Failed attempt increments attempt_count
[ ] Failed attempt does not award XP
[ ] Locked mission completion is rejected
[ ] Unimplemented mission completion is rejected
```

## Checkpoints

```txt
[ ] Checkpoint is locked before required modules are complete
[ ] Checkpoint unlocks after required modules are complete
[ ] Passing checkpoint awards XP once
[ ] Repeating checkpoint does not award XP again
[ ] Checkpoint completion unlocks next section
```

## Badges

```txt
[ ] Completing all implemented missions in a module grants module badge
[ ] Badge is not duplicated
[ ] Badge appears in profile
```

## Leaderboard

```txt
[ ] Leaderboard returns top users by XP
[ ] Leaderboard does not expose email
[ ] Leaderboard shows badges_count
[ ] Leaderboard updates after XP changes
```

---

# Phase 23 — Files to Create or Modify

## New frontend files

```txt
src/lib/supabase.ts
src/services/auth.ts
src/services/progress.ts
src/services/leaderboard.ts
src/hooks/useAuth.ts
src/screens/LoginScreen.tsx
src/screens/RegisterScreen.tsx
src/screens/LeaderboardScreen.tsx
```

## Modified frontend files

```txt
src/App.tsx
src/hooks/useProgress.ts
src/screens/MissionScreen.tsx
src/screens/ProfileScreen.tsx
src/screens/DashboardScreenNew.tsx
src/utils/progression.ts
```

## New Supabase files

```txt
supabase/migrations/0001_core_schema.sql
supabase/migrations/0002_new_user_trigger.sql
supabase/migrations/0003_rls_policies.sql
supabase/migrations/0004_leaderboard_rpc.sql
supabase/seed.sql
supabase/functions/complete-mission/index.ts
supabase/functions/complete-checkpoint/index.ts
```

## Documentation files

```txt
docs/backend-catalog-report.md
docs/supabase-setup.md
docs/testing-checklist.md
```

---

# Phase 24 — Suggested Execution Order for Codex

Use this exact execution order.

## Step 1

```txt
Implement Phase 0 only.
Inspect frontend data.
Create docs/backend-catalog-report.md.
Do not modify Supabase or frontend logic yet.
```

## Step 2

```txt
Add Supabase client setup.
Create src/lib/supabase.ts.
Add documentation for required .env.local values.
```

## Step 3

```txt
Create Supabase migrations for schema, trigger, and RLS.
Use actual initial rank ID from docs/backend-catalog-report.md.
```

## Step 4

```txt
Generate supabase/seed.sql from frontend static mission/checkpoint data.
Ensure IDs match exactly.
```

## Step 5

```txt
Add auth service, useAuth hook, LoginScreen, RegisterScreen.
Do not replace progress yet.
```

## Step 6

```txt
Add progress service for reading Supabase progress.
Map Supabase rows into current frontend progress shape.
```

## Step 7

```txt
Implement complete-mission Edge Function.
Ensure it verifies auth and does not trust userId from body.
```

## Step 8

```txt
Connect MissionScreen completion flow to complete-mission.
Keep localStorage fallback only for unauthenticated guest mode.
```

## Step 9

```txt
Implement complete-checkpoint Edge Function and connect checkpoint flow.
```

## Step 10

```txt
Add leaderboard RPC and frontend LeaderboardScreen.
```

## Step 11

```txt
Run full testing checklist.
Fix RLS/security issues.
Prepare deployment.
```

---

# Final Architecture Summary

The final v1 architecture is:

```txt
React/Vite frontend
  |
  | uses supabase-js
  |
Supabase Auth
  |
Supabase PostgreSQL + RLS
  |
Supabase Edge Functions
  |
Protected progress logic:
- complete mission
- complete checkpoint
- award XP once
- update best score
- grant badges
- calculate rank
- validate unlock rules
```

The frontend remains the source of:

```txt
educational content
lesson display
activity UI
vocab
phrases
static module content
```

Supabase becomes the source of:

```txt
user identity
persistent progress
stored scores
XP
badges
checkpoints
leaderboard
protected progression state
```

---

# Final Scope Boundary

## Included in v1

```txt
Supabase Auth
profiles
persistent progress
mission results
checkpoint results
XP
rank updates
badges
basic analytics events
leaderboard
Edge Functions for protected completion logic
RLS security
```

## Not included in v1

```txt
Express backend
Fastify backend
Next.js migration
MongoDB
custom JWT
custom bcrypt auth
CMS
admin content editor
server-side scoring for every activity
advanced anti-cheat
full analytics dashboard
real-time multiplayer
social features
```

---

# Final Rule

Do not build a custom backend server for v1.

Build a Supabase-native backend first.

This is the smallest architecture that gives the project:

```txt
real accounts
saved progress
server-controlled XP
badges
checkpoints
leaderboard
security rules
future upgrade path
```

while keeping the existing React/Vite frontend mostly intact.
