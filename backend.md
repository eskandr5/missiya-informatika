المشروع حاليا يفتقد الى backend واريد ان يكون له backend مجاني وقد وضع لي claude الخطة التالية
# Backend Development Plan - Mission: Informatics

## Requirements Summary
- **Tech Stack**: Node.js + Express/Fastify, PostgreSQL
- **Priority Features**: Authentication, Progress Tracking, Leaderboards, Admin Panel, Analytics, User Profiles
- **Multi-user Support**: Yes, with user accounts from the start
- **Real-time**: Regular HTTP API (no WebSocket needed)
- **Deployment**: Free hosting preferred

## Architecture Overview
- REST API (Node.js/Express) with PostgreSQL database
- JWT authentication for session management
- Frontend continues as-is, connects to new API endpoints
- Three-tier deployment option for free hosting (Render/Railway backend + Vercel frontend + Supabase database)

---

## IMPLEMENTATION PLAN

### Phase 1: Project Setup & Database Schema (Days 1-2)
**Objective**: Initialize backend project and design database schema

#### Step 1.1: Initialize Node.js Project
- Create backend repo: `/backend` or separate repo
- Setup: Express/Fastify, TypeScript, ESLint, environment variables
- Install core dependencies: `express`, `pg`, `jwt`, `bcrypt`, `dotenv`, `cors`
- Create folder structure: `src/routes`, `src/controllers`, `src/models`, `src/middleware`, `src/utils`

#### Step 1.2: Design PostgreSQL Schema
Database tables needed:
- **users** (id, email, password_hash, username, created_at, updated_at, deleted_at)
- **user_profiles** (user_id, bio, avatar_url, display_name, preferred_language)
- **progress** (id, user_id, xp, current_rank, created_at, updated_at)
- **user_missions** (id, user_id, mission_id, module_id, score, completed_at, is_passed)
- **user_checkpoints** (id, user_id, checkpoint_id, completed_at)
- **user_badges** (id, user_id, badge_id, earned_at)
- **leaderboard_snapshot** (id, user_id, rank_position, xp, taken_at) — for periodic snapshots
- **analytics_events** (id, user_id, event_type, module_id, mission_id, timestamp, metadata)

#### Step 1.3: Setup PostgreSQL Database
- Choice: Supabase (free tier, PostgreSQL managed) or Railway/Render (self-managed)
- Create migrations folder with initial schema
- Setup connection pooling (pg-pool)

**Dependencies**: Step 1.1 and 1.2 can run in parallel

---

### Phase 2: Authentication & User Management (Days 2-4)
**Objective**: Implement user registration, login, JWT authentication

#### Step 2.1: Implement Authentication Middleware
- JWT token generation (access token + refresh token pattern)
- Token verification middleware
- Middleware chain: `authMiddleware → validateJWT → attachUser`

#### Step 2.2: User Registration & Login Endpoints
- `POST /api/auth/register` — Email validation, password hashing (bcrypt), user creation
- `POST /api/auth/login` — Credential verification, JWT generation
- `POST /api/auth/refresh` — Refresh token endpoint
- `POST /api/auth/logout` — Token blacklisting (optional, or just client-side removal)
- `GET /api/auth/verify` — Check if current token is valid

#### Step 2.3: User Profile Endpoints
- `GET /api/users/me` — Get current user profile
- `PUT /api/users/me` — Update profile (bio, avatar, display_name, username)
- `GET /api/users/:userId/profile` — Public profile view

**Depends on**: Phase 1

---

### Phase 3: Progress & Mission API (Days 4-7)
**Objective**: Implement endpoints for mission completion and progress tracking

#### Step 3.1: Mission Endpoints (Read-Only)
- `GET /api/modules` — Return all modules with unlock status for current user
- `GET /api/modules/:moduleId` — Return module with missions and unlock status
- `GET /api/missions/:missionId` — Return mission data + activity details

#### Step 3.2: Progress Submission Endpoints
- `POST /api/missions/:missionId/complete` — Submit mission result
  - Input: `{ score, activityData, completionTime }`
  - Logic: Check if mission is unlocked, verify score, award XP, update badges
  - Output: `{ score, xpEarned, newRank, badgeUnlocked, nextMissionUnlocked }`
- `POST /api/checkpoints/:checkpointId/complete` — Submit checkpoint result
- `GET /api/user/progress` — Get current user's progress (XP, rank, completed missions, badges)

#### Step 3.3: Unlock Logic Endpoints
- Backend validates progression rules from src/utils/progression.ts
- Endpoints check user's prior completion before allowing mission start
- Return `unlocked: boolean` + `lockedUntil: condition` for UI messaging

**Depends on**: Phase 2 (user context required)
**Can parallelize with**: Phase 4 preparation

---

### Phase 4: Leaderboards & Analytics (Days 7-9)
**Objective**: Implement leaderboard rankings and analytics tracking

#### Step 4.1: Leaderboard Endpoints
- `GET /api/leaderboards/global` — Top 100 users by XP (paginated)
  - Response: `[{ rank, userId, username, xp, currentRank, profileUrl, badges_count }]`
- `GET /api/leaderboards/module/:moduleId` — Top users by module completion
- `GET /api/leaderboards/user/:userId/position` — Where is a specific user ranked

#### Step 4.2: Analytics Event Tracking
- Middleware: Auto-log events on mission complete, module start, etc.
- `POST /api/analytics/events` — Client can also manually log events
- Events: `mission_started`, `mission_completed`, `module_completed`, `badge_earned`, `checkpoint_reached`

#### Step 4.3: User Analytics Dashboard
- `GET /api/analytics/user/summary` — User stats (modules completed, total time, accuracy avg, badges count)
- `GET /api/analytics/user/activity` — Activity timeline (last 30 days)
- `GET /api/analytics/user/module/:moduleId` — Performance on specific module

**Depends on**: Phase 3
**Parallelize with**: Phase 5 preparation

---

### Phase 5: Admin Panel Backend (Days 9-11)
**Objective**: Implement admin endpoints for content management and user moderation

#### Step 5.1: Admin Authentication
- Separate `isAdmin` middleware
- `POST /api/admin/login` — Admin-only endpoint or role-based access
- Endpoint: `GET /api/admin/users` — List all users (with filters: created_date, xp_range)

#### Step 5.2: Content Management Endpoints
- `GET /api/admin/modules` — List all modules with stats
- `POST /api/admin/modules` — Create new module
- `PUT /api/admin/modules/:moduleId` — Edit module
- `DELETE /api/admin/modules/:moduleId` — Archive module
- Same CRUD for missions, activities, vocabularies

#### Step 5.3: User Management Endpoints
- `PUT /api/admin/users/:userId/xp` — Manually adjust XP (testing/corrections)
- `PUT /api/admin/users/:userId/reset-progress` — Reset user progress
- `DELETE /api/admin/users/:userId` — Soft delete user
- `GET /api/admin/users/:userId/activity` — Full audit log

#### Step 5.4: Analytics Endpoints (Admin)
- `GET /api/admin/analytics/overview` — Platform-wide stats (total users, avg completion rate, most popular module)
- `GET /api/admin/analytics/users` — User cohort analytics (daily signups, retention curves)

**Depends on**: Phase 3 & 4

---

### Phase 6: Frontend Integration & Testing (Days 11-14)
**Objective**: Connect frontend to new backend API

#### Step 6.1: Create HTTP Client (Frontend)
- Setup `axios` or `fetch` wrapper in src/utils/api.ts or new src/services/apiClient.ts
- Interceptors: Add JWT token to headers, handle 401 refreshes, error handling
- Export functions: `loginUser()`, `getMissions()`, `completeMission()`, etc.

#### Step 6.2: Refactor Frontend State Management
- Replace `localStorage` progress with API calls in src/hooks/useProgress.ts
- Modify `completeMission()` to call `POST /api/missions/:id/complete`
- On app start: Call `GET /api/user/progress` to hydrate state
- Handle offline mode gracefully (show cached progress, queue submissions)

#### Step 6.3: Update Authentication Flow
- Add login/register screens if not present
- Redirect to login if not authenticated (before landing page)
- Store JWT in memory/sessionStorage (not localStorage for security)
- Token refresh on 401 responses

#### Step 6.4: Add Profile & Leaderboard Screens
- `ProfileScreen` component updates to show rank, analytics, user stats from API
- New `LeaderboardScreen` component (list of top users, search for user)
- New `AdminScreen` for admin users (if role exists)

#### Step 6.5: Testing
- Unit tests for API client error handling
- Integration tests: Auth flow, mission completion, progress update
- Manual testing: Cross-browser, offline scenarios, slow network

**Depends on**: All previous phases
**Parallelizable**: 6.1 & 6.2 can start when Phase 3 endpoints are ready (async work)

---

### Phase 7: Deployment & Monitoring (Days 14-15)
**Objective**: Deploy backend and monitor in production

#### Step 7.1: Backend Deployment (Free Options)
**Option A (Recommended)**: Render.com
- Create web service from GitHub repo
- Auto-deploys on push
- Free tier: 750 hours/month (always-on)
- Environment variables: DATABASE_URL, JWT_SECRET, etc.

**Option B**: Railway.app
- Similar free tier
- Slightly more generous than Render

**Option C**: Fly.io
- More features, requires some setup

#### Step 7.2: Database Deployment
- Supabase PostgreSQL (free tier: 500MB storage, perfect for this app)
- Or managed PostgreSQL on same platform (Render/Railway)

#### Step 7.3: Environment Configuration
- Backend `.env` file (not committed): DATABASE_URL, JWT_SECRET, CORS_ORIGIN
- Frontend `.env`: VITE_API_URL (backend URL)

#### Step 7.4: Monitoring & Logging
- Basic: Winston/Pino logger in backend (log to stdout, captured by platform)
- Error tracking: Sentry free tier (optional, for production errors)
- Database monitoring: Supabase dashboard has built-in metrics

#### Step 7.5: Production Checklist
- [ ] HTTPS enforced
- [ ] CORS properly configured (only allow frontend domain)
- [ ] Database backups enabled
- [ ] Rate limiting on auth endpoints (prevent brute force)
- [ ] SQL injection protection (use parameterized queries)
- [ ] Secrets rotated (JWT_SECRET, DB credentials)

**Depends on**: All previous phases

---

## Implementation Order & Dependencies

```
Phase 1 (Setup & DB)
    ↓
Phase 2 (Auth) ← Must complete before Phase 3
    ↓
Phase 3 (Progress API) ← Parallelize Phase 4 & 5 preparation
    ├─→ Phase 4 (Leaderboards)
    └─→ Phase 5 (Admin Panel)
    ↓
Phase 6 (Frontend Integration) ← Can start Phase 6.1 in parallel with Phase 3 finish
    ↓
Phase 7 (Deployment)
```

**Estimated Timeline**: 2-3 weeks for one developer following this sequentially

---

## Critical Files to Modify/Create

### Backend (New)
- `backend/src/models/User.ts` — User & Profile data models
- `backend/src/models/Progress.ts` — Progress, Mission, Badge models
- `backend/src/middleware/auth.ts` — JWT authentication middleware
- `backend/src/controllers/auth.controller.ts` — Auth logic
- `backend/src/controllers/progress.controller.ts` — Mission/Progress endpoints
- `backend/src/controllers/leaderboard.controller.ts` — Leaderboard logic
- `backend/src/utils/unlock.ts` — Progression rules (port from src/utils/progression.ts)

### Frontend (Modify)
- src/hooks/useProgress.ts — Replace localStorage with API calls
- src/App.tsx — Add authentication flow, add login screen
- src/screens/MissionScreen.tsx — Call completion API instead of local update
- **New**: src/services/apiClient.ts — API HTTP wrapper
- **New**: src/screens/LoginScreen.tsx — Authentication UI
- **New**: src/screens/LeaderboardScreen.tsx — Leaderboard display

---

## Technology Recommendations

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Backend Framework** | Express + TypeScript | Simple, lightweight, excellent for REST APIs; TypeScript ensures type safety matching frontend |
| **Database** | PostgreSQL + Supabase | Relational model fits content hierarchy; Supabase = managed PostgreSQL with free tier |
| **Authentication** | JWT + Bcrypt | Stateless, scalable; industry standard for modern apps |
| **ORM** | Knex.js or Raw SQL (parameterized) | Avoid heavy ORMs (Sequelize, Prisma) for this app size; Knex is lightweight |
| **Frontend HTTP** | Axios or native Fetch | Axios for cleaner error handling; Fetch fine if using AbortController |
| **Deployment** | Render.com (backend) + Vercel (frontend) + Supabase (DB) | All free tiers, minimal config, GitHub integration |

---

## Scope Boundaries

### Included ✅
- Multi-user authentication & profiles
- Progress persistence & synchronization
- XP/rank/badge system
- Leaderboards (global rankings)
- Basic analytics (user activity, module popularity)
- Admin panel for content management

### Excluded (Future Phases) ❌
- Real-time multiplayer/collaboration
- WebSocket for live notifications
- Social features (following users, messaging)
- Video/audio storage (use free CDN for media)
- Advanced ML/recommendations
- Mobile app (web-responsive only)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Data inconsistency during migration | High | Keep localStorage fallback during Phase 6, sync on next login |
| Database connection failures | Medium | Implement retry logic with exponential backoff |
| JWT token expiration UX | Medium | Use refresh token pattern (14-day access, 30-day refresh) |
| Leaderboard query performance | Low | Index on `xp` and `created_at` columns; add pagination |
| Admin content changes breaking client | Medium | Version API endpoints, deprecation warnings |

---

## Next Steps After Approval

1. Create GitHub repo for backend (or folder structure if monorepo)
2. Start Phase 1 (Project setup + DB schema)
3. Set up Supabase or PostgreSQL instance
4. Begin Phase 2 (Auth implementation)
