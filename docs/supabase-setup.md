# Supabase Frontend Setup

This project uses Supabase for the backend integration planned in `backend-plan-mission-informatics-final.md`.

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
