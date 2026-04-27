# Backend Development Plan - Mission: Informatics (Supabase First)

## Goal

Build the first backend version without a custom Node/Express server.

The current frontend stays as-is:
- React
- Vite
- TypeScript

The backend stack for v1 will be:
- **Supabase Auth** for registration, login, session handling
- **Supabase PostgreSQL** for persistent data
- **Supabase Row Level Security (RLS)** for authorization
- **Supabase Edge Functions** for sensitive server-side logic

This version is intentionally minimal and aligned with the existing frontend architecture.

---

## Core Product Decision

Do **not** migrate the educational content into the database in phase 1.

Keep these in the frontend static TypeScript files:
- modules
- missions
- vocab
- phrases
- activityData

The database should only know the minimum catalog and user state needed to:
- authenticate users
- persist progress
- validate mission/checkpoint completion
- award XP once
- grant badges
- support leaderboard and analytics

---

## Explicit Non-Goals For V1

Do not build or use:
- Express
- Fastify
- custom JWT auth
- bcrypt-based custom auth flow
- Render or Railway backend server
- MongoDB
- CMS/admin content system in phase 1

---

## Architecture Overview

### Frontend
- React + Vite + TypeScript
- `supabase-js` client in the frontend
- Static course content remains in `src/data/**`

### Backend
- Supabase project
- Supabase Auth
- PostgreSQL tables
- RLS policies on all public user-data tables
- Edge Functions for protected business logic

### Responsibility Split

**Frontend handles:**
- rendering modules, missions, vocab, phrases, and activities
- loading catalog-like static content from local TypeScript files
- reading user progress and results from Supabase
- calling Edge Functions when a mission or checkpoint is completed

**Supabase handles:**
- user identity
- row-level authorization
- persistent progress
- best-score storage
- one-time XP granting
- badge granting
- analytics event insertion
- leaderboard queries

---

## Data Model

## 1. Minimal Catalog Tables

These tables mirror only the parts of mission/checkpoint metadata needed for backend validation.

### `mission_catalog`

Columns:
- `mission_id` text primary key
- `module_id` integer not null
- `order_index` integer not null
- `passing_score` integer not null
- `xp_reward` integer not null
- `implemented` boolean not null default false
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Purpose:
- validate mission existence
- validate score threshold
- validate progression order
- validate XP reward
- prevent trusting frontend-submitted reward values

### `checkpoint_catalog`

Columns:
- `checkpoint_id` text primary key
- `order_index` integer not null
- `passing_score` integer not null
- `xp_reward` integer not null
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Purpose:
- validate checkpoint existence
- validate checkpoint passing threshold
- validate progression gating between course sections

Note:
- If needed, `after_module_id` and `before_module_id` can be added later, but the requested minimal schema is enough for the current v1 plan if unlock logic is encoded in the Edge Function using known progression rules.

---

## 2. User Data Tables

### `profiles`

Purpose:
- application-level public profile data linked to auth users

Columns:
- `id` uuid primary key references `auth.users(id)` on delete cascade
- `username` text unique
- `display_name` text
- `avatar_url` text
- `preferred_language` text default 'ru'
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

### `user_progress`

Purpose:
- current aggregate state for a user

Columns:
- `user_id` uuid primary key references `auth.users(id)` on delete cascade
- `xp` integer not null default 0
- `current_rank` text
- `completed_missions_count` integer not null default 0
- `completed_checkpoints_count` integer not null default 0
- `last_completed_mission_id` text
- `last_completed_checkpoint_id` text
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

### `user_mission_results`

Purpose:
- best score and completion state per mission per user

Columns:
- `id` bigint generated always as identity primary key
- `user_id` uuid not null references `auth.users(id)` on delete cascade
- `mission_id` text not null references `mission_catalog(mission_id)` on delete cascade
- `best_score` integer not null
- `passed` boolean not null default false
- `xp_awarded` boolean not null default false
- `first_completed_at` timestamptz
- `last_completed_at` timestamptz
- `attempt_count` integer not null default 1
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Constraints:
- unique (`user_id`, `mission_id`)

### `user_checkpoint_results`

Purpose:
- best score and completion state per checkpoint per user

Columns:
- `id` bigint generated always as identity primary key
- `user_id` uuid not null references `auth.users(id)` on delete cascade
- `checkpoint_id` text not null references `checkpoint_catalog(checkpoint_id)` on delete cascade
- `best_score` integer not null
- `passed` boolean not null default false
- `xp_awarded` boolean not null default false
- `first_completed_at` timestamptz
- `last_completed_at` timestamptz
- `attempt_count` integer not null default 1
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Constraints:
- unique (`user_id`, `checkpoint_id`)

### `user_badges`

Purpose:
- awarded badges per user

Columns:
- `id` bigint generated always as identity primary key
- `user_id` uuid not null references `auth.users(id)` on delete cascade
- `badge_id` text not null
- `earned_at` timestamptz not null default now()

Constraints:
- unique (`user_id`, `badge_id`)

### `analytics_events`

Purpose:
- lightweight event trail for product analytics

Columns:
- `id` bigint generated always as identity primary key
- `user_id` uuid references `auth.users(id)` on delete cascade
- `event_type` text not null
- `mission_id` text
- `checkpoint_id` text
- `module_id` integer
- `metadata` jsonb not null default '{}'::jsonb
- `created_at` timestamptz not null default now()

---

## Authorization Model

Enable **RLS on all public user-data tables**:
- `profiles`
- `user_progress`
- `user_mission_results`
- `user_checkpoint_results`
- `user_badges`
- `analytics_events`

### Policy Direction

For v1, keep policies simple:

- Users can `select` their own rows
- Users can `update` their own `profiles`
- Users should **not** directly update:
  - `user_progress`
  - `user_mission_results`
  - `user_checkpoint_results`
  - `user_badges`
- Inserts/updates for protected progress data should happen through Edge Functions using the service role

### Recommended RLS Pattern

**Profiles**
- user can read own profile
- user can update own profile
- optional: public read on selected profile fields if leaderboard/profile pages need it

**Progress / mission results / checkpoint results / badges**
- user can read own rows
- no direct client-side mutation

**Analytics**
- user can read own analytics if needed
- inserts preferably happen through Edge Functions

---

## Edge Functions

The frontend must **not** directly update XP or mission/checkpoint result tables.

Mission completion must call:
- `complete-mission`
- `complete-checkpoint`

These Edge Functions are the source of truth for progression.

---

## `complete-mission` Edge Function

### Input

Expected payload:
- `missionId`
- `score`
- optional client metadata such as:
  - `completionTime`
  - `activityType`
  - `attemptMeta`

### Required Behavior

The function must:

1. verify authenticated user  
2. validate mission exists  
3. check unlock rules  
4. check passing score  
5. upsert best score  
6. award XP only once  
7. grant badges  
8. update `user_progress`  
9. insert analytics event  
10. return updated progress to frontend

### Detailed Logic

#### 1) Verify authenticated user
- get user from Supabase auth context
- reject anonymous or invalid requests

#### 2) Validate mission exists
- load mission from `mission_catalog`
- reject if mission does not exist
- reject if `implemented = false`

#### 3) Check unlock rules
- determine whether mission is currently unlocked for the user
- use the same progression rules as the frontend, but enforced server-side
- do not trust frontend unlock state

This logic should mirror the current frontend progression model:
- mission 1 in a module is unlocked if the module is unlocked
- next mission unlocks after previous mission is completed
- next module unlocks after previous module completion or checkpoint completion

#### 4) Check passing score
- compare submitted score against `mission_catalog.passing_score`
- allow storing best score even for failed attempts if desired
- only mark `passed = true` when score meets threshold

#### 5) Upsert best score
- upsert row in `user_mission_results`
- preserve best score
- increment `attempt_count`
- set `first_completed_at` only on first pass
- always update `last_completed_at`

#### 6) Award XP only once
- if first successful pass and `xp_awarded = false`, add `xp_reward`
- never award mission XP twice
- retries can improve best score without duplicating XP

#### 7) Grant badges
- if mission completion causes all missions in a module to be completed, grant the module badge
- avoid duplicate badge inserts using unique constraint

#### 8) Update `user_progress`
- update total XP
- update current rank
- update completed mission counts
- update `last_completed_mission_id`
- update timestamp

#### 9) Insert analytics event
- insert event such as `mission_completed`
- store `mission_id`, `module_id`, submitted score, pass/fail, xp awarded

#### 10) Return updated progress

Suggested response:
- `passed`
- `score`
- `bestScore`
- `xpEarned`
- `badgeUnlocked`
- `currentRank`
- `progress`
- `completedMissions`
- `completedCheckpoints`
- `badges`
- `nextUnlocks` if useful

---

## `complete-checkpoint` Edge Function

### Input
- `checkpointId`
- `score`
- optional metadata

### Required Behavior

This function follows the same pattern:

1. verify authenticated user  
2. validate checkpoint exists  
3. check unlock rules  
4. check passing score  
5. upsert best score  
6. award XP only once  
7. grant badges if needed  
8. update user_progress  
9. insert analytics event  
10. return updated progress to frontend

### Special Note

Checkpoint completion controls progression between sections of the course, so unlock validation here is critical.

---

## Frontend Integration Rules

The frontend should use `supabase-js` directly for:
- auth
- session handling
- reading profile
- reading progress
- reading mission results
- reading checkpoint results
- reading badges
- reading leaderboard data

The frontend should **not** directly:
- write XP
- insert mission result rows
- insert checkpoint result rows
- grant badges
- mutate aggregate progress

Instead:
- mission completion calls `complete-mission`
- checkpoint completion calls `complete-checkpoint`

---

## Frontend Changes Needed

### Keep Existing Frontend Structure

Do not rewrite the app architecture.

Keep:
- React + Vite + TypeScript
- static content files in `src/data/**`
- existing activity components

### Add Supabase Client Layer

Create a frontend integration layer such as:
- `src/lib/supabase.ts`
- `src/services/progress.ts`
- `src/services/auth.ts`

### Replace Local Progress Source

Current progress is stored in localStorage. That should be replaced with Supabase-backed state.

Likely affected files:
- `src/hooks/useProgress.ts`
- `src/App.tsx`
- `src/screens/MissionScreen.tsx`
- `src/screens/ProfileScreen.tsx`
- `src/screens/DashboardScreenNew.tsx`

### Expected Frontend Flow

On app start:
- restore session from Supabase Auth
- if signed in, load:
  - profile
  - user_progress
  - user_mission_results
  - user_checkpoint_results
  - user_badges

On mission completion:
- activity calculates score in frontend
- frontend calls `complete-mission`
- backend returns authoritative updated progress
- frontend hydrates local UI state from returned payload

On checkpoint completion:
- frontend calls `complete-checkpoint`
- backend returns authoritative updated progress

---

## Leaderboard Approach

The frontend may read leaderboard data directly from Supabase using `supabase-js`.

For v1, simplest options:
- SQL view
- RPC function
- read query joining:
  - `user_progress`
  - `profiles`
  - optional badge counts

Suggested leaderboard output:
- `user_id`
- `username`
- `display_name`
- `xp`
- `current_rank`
- `badges_count`

Because leaderboard data is semi-public, plan the RLS/view exposure carefully.

---

## Analytics Scope For V1

Keep analytics lightweight.

Recommended events:
- `mission_completed`
- `mission_failed`
- `checkpoint_completed`
- `badge_earned`
- `profile_updated`
- `auth_signed_up`

Store analytics primarily for:
- product visibility
- per-user activity summaries
- future admin insights

Do not build a full analytics dashboard in phase 1 unless needed later.

---

## Rank Logic

The current frontend already has rank thresholds.

For consistency, the Edge Functions should become the source of truth for rank calculation.

Recommended approach:
- mirror the current thresholds from frontend
- compute `current_rank` server-side after XP changes
- optionally keep the rank thresholds duplicated in frontend for display only

This avoids trusting the client for progression-critical state.

---

## Badge Logic

For v1, use simple badge awarding:
- one badge per module
- badge awarded when all implemented missions in that module are passed

Badge definitions can remain in frontend static files for display.

The database only needs:
- `badge_id`
- `user_id`
- `earned_at`

---

## Migration / Seeding Plan

Since content stays in frontend files, create a lightweight seed source for catalog tables only.

Seed:
- `mission_catalog`
- `checkpoint_catalog`

The seed data should be derived from the same static frontend definitions so that:
- mission ids match exactly
- module ids match exactly
- order index matches frontend order
- passing score and XP reward match frontend values

This can be done with:
- SQL seed files
- a one-time script
- or a manual import generated from frontend data

Important rule:
- the backend catalog must always match the frontend mission ids exactly

---

## Phase Plan

## Phase 1 - Supabase Setup

Objective:
- create Supabase project and base configuration

Tasks:
- create Supabase project
- configure environment variables
- enable email auth
- configure site URL and redirect URLs
- install and initialize Supabase CLI if needed

---

## Phase 2 - Database Schema

Objective:
- create minimal catalog and user tables

Tasks:
- create `mission_catalog`
- create `checkpoint_catalog`
- create `profiles`
- create `user_progress`
- create `user_mission_results`
- create `user_checkpoint_results`
- create `user_badges`
- create `analytics_events`
- add indexes and unique constraints

---

## Phase 3 - RLS Policies

Objective:
- secure all user data

Tasks:
- enable RLS on all public user-data tables
- add self-read policies
- add self-update policy for profiles
- block direct client mutation for protected progress tables

---

## Phase 4 - Edge Functions

Objective:
- move authoritative progress logic to Supabase

Tasks:
- implement `complete-mission`
- implement `complete-checkpoint`
- centralize unlock validation
- centralize XP awarding
- centralize badge granting
- centralize analytics insertion

---

## Phase 5 - Frontend Integration

Objective:
- connect existing frontend to Supabase

Tasks:
- add `supabase-js`
- add auth flow
- replace local progress storage
- fetch progress and results from Supabase
- call Edge Functions for completion actions
- hydrate UI from server responses

---

## Phase 6 - Leaderboard

Objective:
- expose leaderboard data safely

Tasks:
- create view or RPC
- join progress with profile data
- connect leaderboard UI later if needed

---

## Recommended File/Code Changes

### Frontend
- `src/hooks/useProgress.ts`
- `src/App.tsx`
- `src/screens/MissionScreen.tsx`
- `src/screens/ProfileScreen.tsx`
- `src/screens/DashboardScreenNew.tsx`
- new: `src/lib/supabase.ts`
- new: `src/services/auth.ts`
- new: `src/services/progress.ts`

### Supabase
- `supabase/migrations/...`
- `supabase/functions/complete-mission/...`
- `supabase/functions/complete-checkpoint/...`
- optional: `supabase/seed.sql`

---

## Why This Plan Fits The Current Frontend

This plan matches the project as it exists today:
- content is already well-structured in TypeScript
- frontend progression flow already exists
- local progress model is already defined
- mission completion already produces a score in the UI

So the first backend version should focus on:
- identity
- persistence
- authorization
- authoritative progression logic

Not on:
- content CMS
- a separate custom API server
- full backend-managed content modeling

---

## Final Direction

For v1, the backend should be a **Supabase-native backend**, not a custom server.

That means:
- Supabase Auth for user access
- PostgreSQL for stored progress and results
- RLS for data protection
- Edge Functions for mission/checkpoint completion rules
- static course content remaining in the frontend

This is the smallest architecture that still gives us:
- real accounts
- synced progress
- secure XP logic
- badges
- leaderboard support
- clean upgrade path later

---

## Phase 1 Scope Boundary

Included in phase 1:
- auth
- profile
- progress persistence
- mission completion function
- checkpoint completion function
- XP and badges
- analytics event insertion
- leaderboard read model

Not included in phase 1:
- Express/Fastify backend
- custom auth server
- full content database
- CMS/admin panel
- content authoring tools
- advanced moderation
- full analytics dashboard
