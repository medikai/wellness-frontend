-- supabase/migrations/20251006_add_demo_credits_and_zoom_start_url.sql
-- 1) profile.demo_credits
ALTER TABLE public.profile
ADD COLUMN IF NOT EXISTS demo_credits integer DEFAULT 1;

COMMENT ON COLUMN public.profile.demo_credits
IS 'Remaining free demo classes for this student. Default 1.';

-- Backfill any NULLs to the default
UPDATE public.profile
SET demo_credits = 1
WHERE demo_credits IS NULL;

-- 2) lesson.zoom_start_url
ALTER TABLE public.lesson
ADD COLUMN IF NOT EXISTS zoom_start_url text;

COMMENT ON COLUMN public.lesson.zoom_start_url
IS 'Zoom host start URL. Do not show to students.';

-- Optional safety index if you filter lessons by time often
-- CREATE INDEX IF NOT EXISTS idx_lesson_lesson_at ON public.lesson(lesson_at);

-- No RLS changes needed. Existing lesson and profile policies remain valid.
