-- supabase/migrations/20251007111500_rpcs_demo_first.sql
-- Stable function bodies in public
SET check_function_bodies = off;

-- Helper: pick least-loaded teacher for the requested day
CREATE OR REPLACE FUNCTION public._pick_teacher_for_day(p_requested_at timestamptz)
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  WITH teachers AS (
    SELECT p.id AS teacher_id
    FROM public.groupmember gm
    JOIN public.role r    ON r.id = gm.role_id
    JOIN public.profile p ON p.id = gm.profile_id
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

-- RPC 1: book_demo_class
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
  -- student must exist and have credits
  SELECT demo_credits INTO v_credits
  FROM public.profile
  WHERE id = p_student_id;

  IF v_credits IS NULL OR v_credits <= 0 THEN
    RAISE EXCEPTION 'No demo credits left';
  END IF;

  -- only one session per day
  SELECT EXISTS (
    SELECT 1 FROM public.lesson
    WHERE student_id = p_student_id
      AND lesson_at::date = p_requested_at::date
  ) INTO v_has_today;

  IF v_has_today THEN
    RAISE EXCEPTION 'A session already exists for this day';
  END IF;

  -- pick teacher
  SELECT public._pick_teacher_for_day(p_requested_at) INTO v_teacher_id;
  IF v_teacher_id IS NULL THEN
    RAISE EXCEPTION 'No teacher available';
  END IF;

  -- insert pending lesson
  RETURN QUERY
  INSERT INTO public.lesson (student_id, teacher_id, lesson_at, is_complete, call_url, zoom_start_url)
  VALUES (p_student_id, v_teacher_id, p_requested_at, false, NULL, NULL)
  RETURNING id, teacher_id, lesson_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_demo_class(uuid, timestamptz, int) TO authenticated;

-- RPC 2: mark_lesson_complete
CREATE OR REPLACE FUNCTION public.mark_lesson_complete(p_lesson_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id uuid;
BEGIN
  UPDATE public.lesson
  SET is_complete = true
  WHERE id = p_lesson_id
  RETURNING student_id INTO v_student_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lesson not found';
  END IF;

  UPDATE public.profile
  SET demo_credits = GREATEST(COALESCE(demo_credits,0) - 1, 0)
  WHERE id = v_student_id
    AND COALESCE(demo_credits,0) > 0;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_lesson_complete(uuid) TO authenticated;

-- Optional RPC: set Zoom URLs from server without service role client
CREATE OR REPLACE FUNCTION public.set_lesson_zoom_urls(
  p_lesson_id uuid,
  p_join_url text,
  p_start_url text
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.lesson
  SET call_url = p_join_url,
      zoom_start_url = p_start_url
  WHERE id = p_lesson_id;
  SELECT TRUE;
$$;

GRANT EXECUTE ON FUNCTION public.set_lesson_zoom_urls(uuid, text, text) TO authenticated;
