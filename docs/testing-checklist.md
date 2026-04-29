# Testing Checklist

Date: 2026-04-29

Scope: Phase 22 only. This checklist records the available automated checks and the Supabase backend integration items that were verified by static review or that still require a live Supabase project.

## Automated Checks

| Check | Command | Result | Notes |
| --- | --- | --- | --- |
| Typecheck | `npm run typecheck` | Passed | Added a dedicated script that runs `tsc -b`. |
| Lint | `npm run lint` | Failed | Existing React Hooks lint errors were found in frontend screens/activities. They are not specific to the Supabase backend integration. |
| Build | `npm run build` | Passed | TypeScript and Vite production build completed. Vite reported only a chunk-size warning. |
| npm tests | `npm test` | Not available | No `test` script exists. |
| Edge Function unit test | `supabase/functions/complete-mission/scoring_test.ts` | Not run | A Deno test file exists, but `deno` is not installed in this environment. |

## Integration Checklist

| Item | Status | Verification |
| --- | --- | --- |
| User can register | Manual Supabase required | Frontend calls `supabase.auth.signUp` in `src/services/auth.ts`; live Auth must verify signup settings, email confirmation behavior, and trigger execution. |
| User can login | Manual Supabase required | Frontend calls `supabase.auth.signInWithPassword`; live Auth must verify credentials and session creation. |
| User can logout | Manual Supabase required | Frontend calls `supabase.auth.signOut`; live browser session should confirm session cleanup. |
| New user gets profile | Manual Supabase required | `public.handle_new_user()` inserts into `profiles`; must be verified after a real signup. |
| New user gets user_progress | Manual Supabase required | `public.handle_new_user()` inserts `user_progress` with `xp = 0` and `current_rank_id = 'rank_01'`; must be verified after a real signup. |
| User can read own progress | Manual Supabase required | RLS policy and `grant select` exist for `user_progress`; live test should read as the registered user. |
| User cannot directly update XP | Manual Supabase required | Phase 21 hardening revokes authenticated update on `user_progress`; live test should confirm direct client update is rejected. |
| User cannot directly insert mission result | Manual Supabase required | Phase 21 hardening revokes authenticated insert on `user_mission_results`; live test should confirm direct client insert is rejected. |
| Mission completion awards XP once | Manual Supabase required | RPC uses `xp_awarded`, `for update`, and unique `(user_id, mission_id)`; live test should complete one unlocked mission and verify XP delta. |
| Repeated mission does not duplicate XP | Manual Supabase required | RPC only awards XP when `xp_awarded` was false; live replay should leave XP unchanged. |
| Better score updates best_score | Manual Supabase required | RPC uses `greatest(existing.best_score, excluded.best_score)`; live replay with higher score should update `best_score`. |
| Locked mission is rejected | Manual Supabase required | Mission RPC raises `Mission is locked` when prior mission/module/checkpoint requirements are unmet. |
| Unimplemented mission is rejected | Manual Supabase required | Mission RPC raises `Mission is not implemented` when catalog `implemented = false`. |
| Checkpoint rules work | Manual Supabase required | Checkpoint RPC requires all implemented missions up to `after_module_id` to be passed before completion. |
| Badge is awarded once | Manual Supabase required | `user_badges` has unique `(user_id, badge_id)` and RPC uses `on conflict do nothing`; live module completion/replay should confirm one badge row. |
| Leaderboard does not expose email | Static verified, manual recommended | `get_global_leaderboard` returns only `user_id`, `username`, `display_name`, `avatar_url`, `xp`, `current_rank_id`, and `badges_count`. Live RPC response should confirm no email field. |

## Manual Supabase Verification Steps

Use a disposable test user and seeded catalog data.

1. Register a new user through the app.
2. Confirm `profiles.id = auth.users.id`, `profiles.username is null`, and `display_name` is user-provided or `Student`.
3. Confirm `user_progress.user_id = auth.users.id`, `xp = 0`, and `current_rank_id = 'rank_01'`.
4. Log out, then log in with the same account.
5. Read progress through the app or anon client session.
6. Attempt direct browser/client updates:
   - update `user_progress.xp`
   - insert `user_mission_results`
   - insert `user_checkpoint_results`
   - insert `user_badges`
   Each should be rejected.
7. Complete the first unlocked implemented mission through `complete-mission`.
8. Verify XP increased once, mission result was created, and `best_score` matches the submitted score.
9. Replay the same mission with a lower score and verify XP does not increase and `best_score` does not decrease.
10. Replay the same mission with a higher score and verify XP does not increase and `best_score` increases.
11. Attempt a locked mission and verify the Edge Function returns a locked error.
12. Attempt an unimplemented mission and verify the Edge Function returns a not-implemented error.
13. Complete required module missions, then complete the checkpoint and verify XP is awarded once.
14. Complete all implemented missions in a module and verify exactly one badge row is created.
15. Call `get_global_leaderboard` as an authenticated user and verify it includes no email or auth user fields.

## Failures Found

- `npm run lint` fails with existing `react-hooks/set-state-in-effect` errors in frontend components and one `react-hooks/exhaustive-deps` warning in `src/App.tsx`.
- Deno-based Edge Function unit tests could not be run because the Deno executable is unavailable in this environment.

## Fixes Applied

- No build or type errors were found.
- Added a dedicated `typecheck` npm script for faster TypeScript verification.
- No Supabase backend code changes were required in Phase 22.
- Added this checklist so live Supabase verification has a precise pass/fail script.
