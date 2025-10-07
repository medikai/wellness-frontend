--supabase/migrations/20251006_rpcs_demo_class.sql
-- Helpers and RPCs for demo class booking and completion.
-- Assumptions:
--  - public.lesson has: id, student_id uuid, teacher_id uuid, lesson_at timestamptz, call_url text, zoom_start_url text, is_complete bool
--  - public.profile has: id, demo_credits int
--  - public.groupmember & public.role map teachers (slug 'teacher' or 'coach')

-- 0) Optional: ensure stable search_path for SECURITY DEFINER functions
SET check_function_bodies = off;

--------------------------------------------------------------------------------
-- Helper: pick the teacher with the fewest lessons on the requested day
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._pick_teacher_for_day(p_requested_at timestamptz)
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  WITH teachers AS (
    SELECT p.id AS teacher_id
    FROM public.groupmember gm
    JOIN public.role r       ON r.id = gm.role_id
    JOIN public.profile p    ON p.id = gm.profile_id
    WHERE r.slug IN ('teacher','coach')
  ),
  day_load AS (
    SELECT l.teacher_id, COUNT(*) AS cnt
    FROM public.lesson l
    WHERE l.lesson_at::date = p_requested_at::date
    GROUP BY l.teacher_id
  )
  SELECT t.teacher_id
  FROM teachers t
  LEFT JOIN day_load dl USING (teacher_id)
  ORDER BY COALESCE(dl.cnt, 0) ASC, t.teacher_id ASC
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public._pick_teacher_for_day(timestamptz) TO authenticated;

--------------------------------------------------------------------------------
-- RPC: book a demo class
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.book_demo_class(
  p_student_id uuid,
  p_requested_at timestamptz DEFAULT now(),
  p_duration_minutes int DEFAULT 60
)
RETURNS TABLE(lesson_id uuid, teacher_id uuid, lesson_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_teacher_id uuid;
  v_has_today boolean;
  v_credits int;
BEGIN
  -- Check student exists and has credits
  SELECT demo_credits INTO v_credits
  FROM public.profile
  WHERE id = p_student_id;

  IF v_credits IS NULL OR v_credits <= 0 THEN
    RAISE EXCEPTION 'No demo credits left';
  END IF;

  -- Enforce at most one 1-to-1 per day for this student
  SELECT EXISTS (
    SELECT 1 FROM public.lesson
    WHERE student_id = p_student_id
      AND lesson_at::date = p_requested_at::date
  ) INTO v_has_today;

  IF v_has_today THEN
    RAISE EXCEPTION 'A session for this student already exists for the selected day';
  END IF;

  -- Pick a teacher with the lightest load on that day
  SELECT public._pick_teacher_for_day(p_requested_at) INTO v_teacher_id;
  IF v_teacher_id IS NULL THEN
    RAISE EXCEPTION 'No teacher available';
  END IF;

  -- Create a pending lesson slot. call_url/zoom_start_url will be filled by app after Zoom meeting creation.
  RETURN QUERY
  INSERT INTO public.lesson (student_id, teacher_id, lesson_at, is_complete, call_url, zoom_start_url)
  VALUES (p_student_id, v_teacher_id, p_requested_at, false, NULL, NULL)
  RETURNING id, teacher_id, lesson_at;
END;
$$;

-- Execution rights: allow signed-in users to call. RLS still applies to table access inside.
GRANT EXECUTE ON FUNCTION public.book_demo_class(uuid, timestamptz, int) TO authenticated;

--------------------------------------------------------------------------------
-- RPC: mark lesson complete and decrement demo credits
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.mark_lesson_complete(p_lesson_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id uuid;
  v_is_complete boolean;
BEGIN
  -- Mark complete
  UPDATE public.lesson
  SET is_complete = true
  WHERE id = p_lesson_id
  RETURNING student_id, is_complete INTO v_student_id, v_is_complete;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lesson not found';
  END IF;

  -- Decrement demo credit if student still has any
  UPDATE public.profile
  SET demo_credits = GREATEST(COALESCE(demo_credits,0) - 1, 0)
  WHERE id = v_student_id
    AND COALESCE(demo_credits,0) > 0;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_lesson_complete(uuid) TO authenticated;
