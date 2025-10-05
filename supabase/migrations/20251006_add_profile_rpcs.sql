-- 20251006_add_profile_rpcs.sql
-- Creates two RPCs for profile setup and fetch.
-- Add safe grants. Does not change any table.

-- ensure_profile
create or replace function public.ensure_profile(
  fullname text,
  phone text default null,
  locale text default 'en'
)
returns public.profile
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  uemail text;
  new_username text;
  out_prof public.profile;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select email into uemail from auth.users where id = uid;

  new_username := coalesce(
    regexp_replace(lower(coalesce(fullname, split_part(uemail,'@',1))), '[^a-z0-9]+', '', 'g')
    || extract(epoch from now())::bigint::text,
    uid::text
  );

  insert into public.profile as p (id, fullname, username, email, avatar_url, locale)
  values (
    uid,
    coalesce(fullname, split_part(uemail,'@',1)),
    new_username,
    uemail,
    'https://pgrest.classroomio.com/storage/v1/object/public/avatars/avatar.png',
    coalesce(locale, 'en')
  )
  on conflict (id) do update
    set fullname = excluded.fullname,
        email    = excluded.email
  returning * into out_prof;

  return out_prof;
end;
$$;

-- get_profile
create or replace function public.get_profile()
returns public.profile
language sql
stable
set search_path = public, auth
as $$
  select p.*
  from public.profile p
  where p.id = auth.uid();
$$;

-- Tighten permissions. Only authenticated can call.
revoke all on function public.ensure_profile(text, text, text) from public;
revoke all on function public.get_profile() from public;

grant execute on function public.ensure_profile(text, text, text) to authenticated;
grant execute on function public.get_profile() to authenticated;

-- Optional quick rollback helpers. Keep commented unless needed.
-- drop function if exists public.get_profile();
-- drop function if exists public.ensure_profile(text, text, text);
