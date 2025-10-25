-- CREATE OR REPLACE: timezone-aware booking using Asia/Kolkata for rule matching
create or replace function public.book_demo_slot(
  p_slot_start   timestamptz,
  p_slot_minutes int default 60
) returns table(booking_id uuid, coach_id uuid, starts_at timestamptz, ends_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student  uuid := auth.uid();
  v_local_ts timestamp;  -- local Asia/Kolkata wall time for comparisons
  v_slot_end timestamptz := p_slot_start + make_interval(mins => p_slot_minutes);
  v_coach    uuid;
  v_credits  int;
begin
  if v_student is null then
    raise exception 'Not authenticated';
  end if;

  -- optional credit gate
  select demo_credits into v_credits from public.profile where id = v_student;
  if coalesce(v_credits, 0) <= 0 then
    raise exception 'No demo credits left';
  end if;

  -- lock per exact slot to avoid races
  perform pg_advisory_xact_lock(hashtext(p_slot_start::text));

  -- compute local wall-time pieces in Asia/Kolkata
  v_local_ts := (p_slot_start at time zone 'Asia/Kolkata');

  with params as (
    select
      extract(dow  from v_local_ts)::int                                           as wd,
      extract(epoch from v_local_ts::time)::int / 60                               as sm,
      extract(epoch from (v_local_ts + make_interval(mins => p_slot_minutes))::time)::int / 60 as em,
      (v_local_ts::date)                                                           as d_local
  ),
  weekly as (
    select car.coach_id
    from public.coach_availability_rule car
    cross join params p
    where car.is_active = true
      and car.is_demo   = true
      and car.weekday   = p.wd
      and car.start_minute <= p.sm
      and car.end_minute   >= p.em
  ),
  excs as (
    select cae.coach_id
    from public.coach_availability_exception cae
    cross join params p
    where cae.is_open = true
      and cae.is_demo = true
      and cae.date    = p.d_local
      and cae.start_minute <= p.sm
      and cae.end_minute   >= p.em
  ),
  eligible as (
    select distinct coach_id from weekly
    union
    select distinct coach_id from excs
  ),
  free as (
    select e.coach_id
    from eligible e
    left join public.lesson l
      on l.teacher_id = e.coach_id
     and l.lesson_at  = p_slot_start
    where l.id is null
  ),
  ranked as (
    select
      f.coach_id,
      coalesce((
        select count(*) from public.lesson l2
        where l2.teacher_id = f.coach_id
          and l2.lesson_at::date = p_slot_start::date
      ), 0) as today_load
    from free f
  )
  select r.coach_id into v_coach
  from ranked r
  order by r.today_load asc, r.coach_id asc
  limit 1;

  if v_coach is null then
    raise exception 'Slot full';
  end if;

  return query
  insert into public.lesson (student_id, teacher_id, lesson_at, is_complete, call_url, zoom_start_url)
  values (v_student, v_coach, p_slot_start, false, null, null)
  returning id, teacher_id, lesson_at, (lesson_at + make_interval(mins => p_slot_minutes));
end;
$$;

-- keep execute grant
revoke all on function public.book_demo_slot(timestamptz, int) from public;
grant  execute on function public.book_demo_slot(timestamptz, int) to authenticated;
