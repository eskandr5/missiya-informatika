create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    username,
    display_name,
    preferred_language
  )
  values (
    new.id,
    null,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      'Student'
    ),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_language', ''), 'ru')
  );

  insert into public.user_progress (
    user_id,
    xp,
    current_rank_id
  )
  values (
    new.id,
    0,
    'rank_01'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
