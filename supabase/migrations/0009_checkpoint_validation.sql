-- 0009_checkpoint_validation.sql
-- Server-side checkpoint scoring keys. This table is intentionally unreadable
-- by browser clients because it stores answer keys.

create table if not exists public.checkpoint_validation (
  checkpoint_id text not null references public.checkpoint_catalog(checkpoint_id) on delete cascade,
  activity_type text not null check (length(trim(activity_type)) > 0),
  validation_payload jsonb not null default '{}'::jsonb,
  scoring_version text not null default 'v1' check (length(trim(scoring_version)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (checkpoint_id, activity_type, scoring_version)
);

create index if not exists checkpoint_validation_checkpoint_activity_idx
on public.checkpoint_validation (checkpoint_id, activity_type, updated_at desc);

drop trigger if exists set_checkpoint_validation_updated_at on public.checkpoint_validation;

create trigger set_checkpoint_validation_updated_at
before update on public.checkpoint_validation
for each row
execute function public.set_updated_at();

alter table public.checkpoint_validation enable row level security;
alter table public.checkpoint_validation force row level security;

revoke all on table public.checkpoint_validation from public;
revoke all on table public.checkpoint_validation from anon;
revoke all on table public.checkpoint_validation from authenticated;

comment on table public.checkpoint_validation
is 'Server-side scoring keys for checkpoints. Not readable or writable by browser clients.';

comment on column public.checkpoint_validation.validation_payload
is 'Minimal scoring payload. v1 supports multiple_choice with question ids and correct answer indexes only.';
