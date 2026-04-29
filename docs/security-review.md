# Security Review

Date: 2026-04-29

Scope: Phase 21 only. This review covers the Supabase backend security surface described in `backend-plan-mission-informatics-final.md`: RLS, RPCs, Edge Functions, service-role usage, direct mutations, profile privacy, leaderboard output, progress authority, and frontend secret exposure.

## Overall Status

Status: passed after hardening.

No user-to-admin escalation path, direct progress mutation path, service-role frontend leak, or email-derived display name path was found. A hardening migration was added in `supabase/migrations/0008_security_review_hardening.sql` to make grants explicit and reduce reliance on implicit Supabase defaults.

## Findings and Status

| Area | Status | Notes |
| --- | --- | --- |
| RLS policies | Passed | RLS is enabled on profiles, progress, catalogs, results, badges, analytics, and validation data. Browser roles only have own-row read policies for private user data. |
| RPC permissions | Fixed | Internal completion RPCs are revoked from `PUBLIC`, `anon`, and `authenticated`, and granted only to `service_role`. Leaderboard remains `authenticated` only. Migration `0008` reasserts these grants. |
| Edge Function auth verification | Passed | `complete-mission` and `complete-checkpoint` require `Authorization`, verify the token through Supabase Auth with the anon key, and use the verified `user.id` for service-role RPC calls. |
| Service role usage | Passed | Service role is used only inside Supabase Edge Functions. Frontend code uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. |
| Direct table mutation exposure | Fixed | RLS already blocked protected writes. Migration `0008` also revokes browser insert/update/delete privileges on progress, result, badge, analytics, catalog, and validation tables. |
| Profile update policies | Fixed | Users may update only their own profile row. Migration `0008` narrows authenticated update grants to public profile columns: `username`, `display_name`, `avatar_url`, `bio`, and `preferred_language`. |
| Leaderboard exposed fields | Passed | Leaderboard returns only `user_id`, `username`, `display_name`, `avatar_url`, `xp`, `current_rank_id`, and aggregate `badges_count`. It does not expose email, auth rows, mission results, or analytics logs. |
| Username/display_name privacy | Passed with accepted risk | Signup leaves `username` null. `display_name` comes from user-provided metadata or falls back to `Student`; it is not derived from email. A user can still voluntarily enter an email-like display name. |
| Rank update authority | Passed | `current_rank_id` is updated only inside internal service-role RPCs from server-calculated XP thresholds. No frontend direct update path was found. |
| XP awarding logic | Passed | XP is awarded only on first passing completion using `xp_awarded`, result uniqueness, and a locked `user_progress` row to serialize updates per user. |
| Badge duplication prevention | Passed | `user_badges` has a unique `(user_id, badge_id)` constraint and the mission RPC uses `on conflict do nothing`. |
| Mission/checkpoint unlock validation | Passed | Internal RPCs enforce backend unlock rules and ignore frontend-only unlock helpers. Failed attempts do not unlock later content. |
| Frontend secret usage | Passed | No frontend reference to service-role, database, or JWT secret key names was found. `.env.local` and `.env.example` were checked for restricted key names without printing values. |
| Self-promotion to admin | Passed | No admin update route or editable authorization field was found. Users cannot self-promote through profiles. |
| Role/admin fields in profiles | Passed | `profiles` contains no `role`, `is_admin`, `permissions`, or equivalent authorization field. |
| Email-derived display_name | Passed | Signup trigger and registration code do not derive display names from email prefixes. Migration `0008` keeps the fallback as `Student` and trims user metadata. |

## Issues Found

1. Browser database privileges were implicit.
   RLS had the right intent, but grants were not explicitly pinned. This could make future review harder and leave too much trust in default privileges.
   Fixed in `0008_security_review_hardening.sql` by revoking browser mutations on protected tables and granting only the intended read/update surface.

2. Helper trigger functions were not explicitly hardened.
   Trigger/helper functions had default execute exposure, and `handle_new_user` used `set search_path = public` rather than the planned `public, pg_temp`.
   Fixed in `0008_security_review_hardening.sql` by replacing helper functions with explicit search paths and revoking execute from browser roles.

## Fixes Applied

- Added `supabase/migrations/0008_security_review_hardening.sql`.
- Reasserted private internal RPC grants: service-role only for completion RPCs.
- Reasserted authenticated-only leaderboard RPC access.
- Revoked browser mutations on protected backend tables.
- Granted authenticated users only the reads required by the app.
- Restricted profile updates to public profile columns only.
- Hardened trigger/helper function search paths and revoked browser execute grants.
- Kept signup display-name fallback non-email-based.

## Remaining Accepted Risks

- Frontend-trusted score remains an accepted v1 risk. The client can submit a score for missions without server validation data. This review did not add anti-cheat.
- Existing optional mission validation can score selected answer payloads, but v1 still supports score submission where validation is absent or not required.
- Leaderboard intentionally exposes public profile fields to authenticated users. Users should avoid entering private data as `username`, `display_name`, or `avatar_url`.
- Edge Functions currently use wildcard CORS headers. Auth verification still protects writes, but production can tighten allowed origins as a deployment hardening step.
