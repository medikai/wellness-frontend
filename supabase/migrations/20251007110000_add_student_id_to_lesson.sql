-- Add the student reference for 1-1 sessions
ALTER TABLE public.lesson
ADD COLUMN IF NOT EXISTS student_id uuid;

COMMENT ON COLUMN public.lesson.student_id
IS 'Student (profile.id) for this 1-1 lesson. Nullable for old rows.';

-- Optional: index to speed up per-day checks
CREATE INDEX IF NOT EXISTS idx_lesson_student_day
ON public.lesson (student_id, lesson_at);

-- Optional: prevent duplicate bookings per student per day (soft, allows NULL student_id)
-- CREATE UNIQUE INDEX IF NOT EXISTS uq_lesson_student_per_day
-- ON public.lesson (student_id, (date_trunc('day', lesson_at)))
-- WHERE student_id IS NOT NULL;
