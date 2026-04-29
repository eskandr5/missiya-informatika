# Mission: Informatics

Mission: Informatics is a React + Vite + TypeScript learning application with a Supabase-native backend in v1.

The frontend keeps the lesson content in static TypeScript files under `src/data/**`. The backend uses Supabase Auth, PostgreSQL, Row Level Security, Edge Functions, and SQL RPC functions for persistent identity, progress, XP, badges, analytics, and leaderboard data.

## Current Architecture

- Frontend: React 19, TypeScript, Vite
- Backend v1: Supabase-native
- Auth: Supabase Auth
- Database: Supabase PostgreSQL
- Authorization: Row Level Security
- Protected writes: Supabase Edge Functions plus internal SQL RPCs
- Content source: frontend static data files

This repository does not use Express, Fastify, Next.js, MongoDB, or a custom Node.js backend for v1.

## Frontend Supabase Files

The frontend integration currently includes these files:

- `src/lib/supabase.ts`
- `src/services/auth.ts`
- `src/services/progress.ts`
- `src/services/completion.ts`
- `src/services/leaderboard.ts`
- `src/hooks/useAuth.ts`
- `src/hooks/useProgress.ts`
- `src/screens/LoginScreen.tsx`
- `src/screens/RegisterScreen.tsx`
- `src/screens/LeaderboardScreen.tsx`

What they do:

- `src/lib/supabase.ts` creates the browser Supabase client with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `src/services/auth.ts` wraps registration, login, and logout.
- `src/services/progress.ts` reads the authenticated user's progress state from Supabase.
- `src/services/completion.ts` calls the protected Edge Functions for mission and checkpoint completion.
- `src/services/leaderboard.ts` reads the authenticated leaderboard RPC.
- `src/hooks/useAuth.ts` manages the current session and auth state subscription.
- `src/hooks/useProgress.ts` hydrates Supabase progress for authenticated users and keeps guest local progress for unauthenticated users.
- `src/screens/LoginScreen.tsx`, `src/screens/RegisterScreen.tsx`, and `src/screens/LeaderboardScreen.tsx` provide the auth and leaderboard UI.

## Supabase Files

The Supabase implementation lives under `supabase/`:

- `supabase/migrations/`
- `supabase/seed.sql`
- `supabase/functions/complete-mission/index.ts`
- `supabase/functions/complete-checkpoint/index.ts`

Current migrations include:

- `0001_core_schema.sql`
- `0002_new_user_trigger.sql`
- `0003_rls_policies.sql`
- `0004_complete_mission_rpc.sql`
- `0005_complete_checkpoint_rpc.sql`
- `0006_leaderboard_rpc.sql`
- `0007_mission_validation.sql`
- `0008_security_review_hardening.sql`

## Project Structure

```text
src/
  activities/
  assets/
  components/
  data/
  hooks/
  lib/
  screens/
  services/
  styles/
  types/
  utils/
supabase/
  functions/
    complete-mission/
    complete-checkpoint/
  migrations/
  seed.sql
docs/
```

## Local Development

Requirements:

- Node.js 18+
- npm

Install dependencies:

```bash
npm install
```

Create `.env.local` with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the app:

```bash
npm run dev
```

Run checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Documentation Map

- `docs/supabase-setup.md`: frontend Supabase client setup and file references
- `docs/deployment.md`: frontend hosting and Supabase deployment
- `docs/backend-catalog-report.md`: extracted catalog and seed-alignment notes
- `docs/mission-validation.md`: optional server-side scoring notes
- `docs/security-review.md`: Phase 21 backend security review
- `docs/testing-checklist.md`: Phase 22 automated checks and manual Supabase verification
