-- 0007_mission_validation.sql
-- Optional server-side scoring validation table.
-- Safe to re-run manually.

create table if not exists public.mission_validation (
  mission_id text not null references public.mission_catalog(mission_id) on delete cascade,
  activity_type text not null check (length(trim(activity_type)) > 0),
  validation_payload jsonb not null default '{}'::jsonb,
  scoring_version text not null default 'v1' check (length(trim(scoring_version)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (mission_id, activity_type, scoring_version)
);

create index if not exists mission_validation_mission_activity_idx
on public.mission_validation (mission_id, activity_type, updated_at desc);

drop trigger if exists set_mission_validation_updated_at on public.mission_validation;

create trigger set_mission_validation_updated_at
before update on public.mission_validation
for each row
execute function public.set_updated_at();

alter table public.mission_validation enable row level security;
alter table public.mission_validation force row level security;

revoke all on table public.mission_validation from public;
revoke all on table public.mission_validation from anon;
revoke all on table public.mission_validation from authenticated;

comment on table public.mission_validation
is 'Optional server-side scoring keys for selected missions. Stores only minimal answer-key payloads required for scoring; not readable or writable by browser clients.';

comment on column public.mission_validation.validation_payload
is 'Minimal scoring payload. v1 supports multiple_choice with question ids and correct answer indexes only; do not store full lesson content or private user submissions.';