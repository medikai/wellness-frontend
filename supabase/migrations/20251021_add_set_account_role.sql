-- 20251021_add_set_account_role.sql
-- Adds RPC to set caller's role. No table changes.

create or replace function public.set_account_role(p_role text)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_role not in ('student','coach') then
    raise exception 'Invalid role';
  end if;

  update public.profile
     set role = p_role
   where id = v_uid;

  if not found then
    raise exception 'Profile not found for user %', v_uid;
  end if;

  return true;
end;
$$;

-- Tighten permissions. Only authenticated can call.
revoke all on function public.set_account_role(text) from public;
grant execute on function public.set_account_role(text) to authenticated;

-- Optional rollback helpers. Keep commented unless needed.
-- drop function if exists public.set_account_role(text);
