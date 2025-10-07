-- supabase/migrations/20251006_seed_demo_credits.sql
-- Set demo_credits for students only, leave teachers/coaches as NULL
-- Safe to re-run.

-- Ensure NULL baseline, then reapply per-role
UPDATE public.profile SET demo_credits = NULL;

-- Variant A: role slugs (preferred if you have role.slug values)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.role WHERE slug = 'student') THEN
    UPDATE public.profile p
    SET demo_credits = 1
    FROM public.groupmember gm
    JOIN public.role r ON r.id = gm.role_id
    WHERE gm.profile_id = p.id
      AND r.slug = 'student';
  END IF;

  IF EXISTS (SELECT 1 FROM public.role WHERE slug IN ('teacher','coach')) THEN
    UPDATE public.profile p
    SET demo_credits = NULL
    FROM public.groupmember gm
    JOIN public.role r ON r.id = gm.role_id
    WHERE gm.profile_id = p.id
      AND r.slug IN ('teacher','coach');
  END IF;
END $$;

-- Variant B: numeric role ids (uncomment and set actual ids if you do not use slugs)
-- DO $$
-- DECLARE
--   v_teacher_id int := 2;  -- set your real id
--   v_student_id int := 3;  -- set your real id
-- BEGIN
--   UPDATE public.profile p
--   SET demo_credits = 1
--   FROM public.groupmember gm
--   WHERE gm.profile_id = p.id AND gm.role_id = v_student_id;

--   UPDATE public.profile p
--   SET demo_credits = NULL
--   FROM public.groupmember gm
--   WHERE gm.profile_id = p.id AND gm.role_id = v_teacher_id;
-- END $$;
