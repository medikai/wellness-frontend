-- supabase/migrations/20251007090500_fix2_ensure_profile_locale_cast.sql
-- Drop and recreate with the SAME signature, then cast inside.
drop function if exists public.ensure_profile(text, text, text);

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
  loc "LOCALE";
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select email into uemail from auth.users where id = uid;

  -- Cast the provided text to your enum
  loc := coalesce(locale, 'en')::"LOCALE";

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
    loc
  )
  on conflict (id) do update
    set fullname = excluded.fullname,
        email    = excluded.email
  returning * into out_prof;

  return out_prof;
end;
$$;

-- Re-apply execution permissions
revoke all on function public.ensure_profile(text, text, text) from public;
grant  execute on function public.ensure_profile(text, text, text) to authenticated;
