# Deployment

This guide covers the lightweight v1 deployment path for Mission: Informatics.

## Frontend Hosting

The frontend is a Vite React app and can be deployed to Vercel, Netlify, or Cloudflare Pages.

Use these common settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node package install command: `npm install`

### Vercel

1. Import the repository in Vercel.
2. Keep the framework preset as Vite, or set the build command/output manually.
3. Add the frontend environment variables in Project Settings.
4. Deploy.

### Netlify

1. Create a new site from the repository.
2. Set build command to `npm run build`.
3. Set publish directory to `dist`.
4. Add the frontend environment variables in Site configuration.
5. Deploy.

### Cloudflare Pages

1. Create a Pages project from the repository.
2. Set build command to `npm run build`.
3. Set build output directory to `dist`.
4. Add the frontend environment variables in Settings.
5. Deploy.

## Frontend Environment Variables

Only public frontend variables belong in the hosting provider environment:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Do not add service-role or database secrets to frontend hosting:

- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `JWT_SECRET`

`.env.example` contains placeholders only. Real values should stay in `.env.local` and provider dashboards.

## Supabase Deployment

Use the Supabase CLI from the repository root.

Link the local project to the remote Supabase project:

```bash
supabase link --project-ref your-project-ref
```

Apply database migrations:

```bash
supabase db push
```

Deploy Edge Functions:

```bash
supabase functions deploy complete-mission
supabase functions deploy complete-checkpoint
```

The deployed functions are the only trusted write path for protected progress, completion, badge, and analytics updates.

## Function Secrets

`SUPABASE_SERVICE_ROLE_KEY` must exist only in Supabase Edge Function secrets. It must never be placed in `.env.local`, frontend provider environment variables, or client code.

Set secrets through the Supabase dashboard or CLI using real values outside the repository:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The functions also rely on Supabase-provided project configuration such as the project URL and anon key. Keep all secret values out of git.

## Auth URLs and CORS

In Supabase Dashboard:

1. Open Authentication settings.
2. Set Site URL to the production frontend URL, for example `https://your-app.example.com`.
3. Add redirect URLs for production and preview/local development as needed:
   - `https://your-app.example.com/**`
   - `https://your-preview-domain.example.com/**`
   - `http://localhost:5173/**`

The Edge Functions currently return CORS headers that allow browser calls. Before production hardening, replace wildcard origins with the deployed frontend origin if the project requires stricter CORS.

## Release Checklist

1. Confirm `.env.local` exists locally and `.env.example` contains placeholders only.
2. Configure frontend hosting with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `supabase link --project-ref your-project-ref`.
4. Run `supabase db push`.
5. Set `SUPABASE_SERVICE_ROLE_KEY` in Supabase function secrets only.
6. Deploy `complete-mission` and `complete-checkpoint`.
7. Configure Supabase Site URL and redirect URLs.
8. Deploy the frontend.
