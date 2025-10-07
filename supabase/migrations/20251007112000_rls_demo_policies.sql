-- Lesson: allow insert when caller is the student
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='lesson' AND policyname='lesson_insert_by_student'
  ) THEN
    CREATE POLICY lesson_insert_by_student
    ON public.lesson
    FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());
  END IF;
END $$;

-- Lesson: allow update by student or teacher on their own lessons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='lesson' AND policyname='lesson_update_by_parties'
  ) THEN
    CREATE POLICY lesson_update_by_parties
    ON public.lesson
    FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid() OR teacher_id = auth.uid())
    WITH CHECK (student_id = auth.uid() OR teacher_id = auth.uid());
  END IF;
END $$;

-- Profile: allow a user to read their own row (needed for demo_credits check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='profile' AND policyname='profile_select_self'
  ) THEN
    CREATE POLICY profile_select_self
    ON public.profile
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());
  END IF;
END $$;
