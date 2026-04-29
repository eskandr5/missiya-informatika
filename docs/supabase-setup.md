# Supabase Frontend Setup

This project uses a Supabase-native backend in v1, as defined in `backend-plan-mission-informatics-final.md`.

## Required frontend environment variables

Create a local file named:

```txt
.env.local
```

Add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Important rules

These values are allowed in frontend environment files:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These values must not be placed in frontend environment files:

- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `JWT_SECRET`

## Notes

- `src/lib/supabase.ts` reads from `import.meta.env`.
- The frontend must only use the public anon key.
- The service role key is for trusted server-side environments only, such as Supabase Edge Functions.

## Frontend Integration Files

The current frontend Supabase integration is split across:

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

These files cover:

- browser client creation
- auth flows
- progress reads
- protected mission and checkpoint completion calls
- leaderboard reads
- auth session state
- auth and leaderboard UI

## Supabase Backend Files

The backend implementation referenced by those frontend files lives in:

- `supabase/migrations/`
- `supabase/seed.sql`
- `supabase/functions/complete-mission/index.ts`
- `supabase/functions/complete-checkpoint/index.ts`

The frontend does not talk to Express, Fastify, Next.js API routes, MongoDB, or a custom Node.js backend in v1.
