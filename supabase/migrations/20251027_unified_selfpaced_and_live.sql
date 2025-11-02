-- 20251027_unified_selfpaced_and_live.sql
-- Additive migration. No hard FK constraints. No RLS yet.

BEGIN;

-- 1) Self-paced hierarchy
CREATE TABLE IF NOT EXISTS public.course_module (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_module_course_id ON public.course_module (course_id);
CREATE INDEX IF NOT EXISTS idx_course_module_order ON public.course_module (order_index);

CREATE TABLE IF NOT EXISTS public.course_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_section_module_id ON public.course_section (module_id);
CREATE INDEX IF NOT EXISTS idx_course_section_order ON public.course_section (order_index);

CREATE TABLE IF NOT EXISTS public.course_chapter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL,
  title text NOT NULL,
  overview text,
  duration_minutes integer,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_chapter_section_id ON public.course_chapter (section_id);
CREATE INDEX IF NOT EXISTS idx_course_chapter_order ON public.course_chapter (order_index);

CREATE TABLE IF NOT EXISTS public.course_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL,
  content_type text NOT NULL,           -- video, survey, quiz, text, game, activity
  content_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_content_chapter_id ON public.course_content (chapter_id);
CREATE INDEX IF NOT EXISTS idx_course_content_order ON public.course_content (order_index);
CREATE INDEX IF NOT EXISTS idx_course_content_type ON public.course_content (content_type);

-- 2) Live 1-1 meeting layer
CREATE TABLE IF NOT EXISTS public.lesson_meeting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL,
  meeting_provider text NOT NULL DEFAULT 'videosdk',
  meeting_id text NOT NULL,
  host_url text,
  join_url text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled', -- scheduled, live, completed, cancelled
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- One meeting per lesson. Keeps data simple.
CREATE UNIQUE INDEX IF NOT EXISTS uq_lesson_meeting_lesson_id ON public.lesson_meeting (lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_meeting_meeting_id ON public.lesson_meeting (meeting_id);
CREATE INDEX IF NOT EXISTS idx_lesson_meeting_starts_at ON public.lesson_meeting (starts_at);
CREATE INDEX IF NOT EXISTS idx_lesson_meeting_status ON public.lesson_meeting (status);

-- 3) Demo booking lifecycle
CREATE TABLE IF NOT EXISTS public.demo_booking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  coach_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  meeting_id text NOT NULL,
  valid_until timestamptz NOT NULL DEFAULT (now() + interval '3 days'),
  status text NOT NULL DEFAULT 'active', -- active, expired, completed, cancelled
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_booking_student_id ON public.demo_booking (student_id);
CREATE INDEX IF NOT EXISTS idx_demo_booking_coach_id ON public.demo_booking (coach_id);
CREATE INDEX IF NOT EXISTS idx_demo_booking_lesson_id ON public.demo_booking (lesson_id);
CREATE INDEX IF NOT EXISTS idx_demo_booking_valid_until ON public.demo_booking (valid_until);
CREATE INDEX IF NOT EXISTS idx_demo_booking_status ON public.demo_booking (status);

-- 4) Optional link from live session back to a chapter
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'lesson'
      AND column_name = 'chapter_id'
  ) THEN
    ALTER TABLE public.lesson
      ADD COLUMN chapter_id uuid NULL;
    CREATE INDEX IF NOT EXISTS idx_lesson_chapter_id ON public.lesson (chapter_id);
  END IF;
END$$;

-- 5) Touch updated_at on UPDATE for new tables (lightweight)
-- Uses moddatetime extension already present in this project.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'moddatetime_course_module_updated_at'
  ) THEN
    CREATE TRIGGER moddatetime_course_module_updated_at
    BEFORE UPDATE ON public.course_module
    FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'moddatetime_course_section_updated_at'
  ) THEN
    CREATE TRIGGER moddatetime_course_section_updated_at
    BEFORE UPDATE ON public.course_section
    FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'moddatetime_course_chapter_updated_at'
  ) THEN
    CREATE TRIGGER moddatetime_course_chapter_updated_at
    BEFORE UPDATE ON public.course_chapter
    FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'moddatetime_course_content_updated_at'
  ) THEN
    CREATE TRIGGER moddatetime_course_content_updated_at
    BEFORE UPDATE ON public.course_content
    FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'moddatetime_lesson_meeting_updated_at'
  ) THEN
    CREATE TRIGGER moddatetime_lesson_meeting_updated_at
    BEFORE UPDATE ON public.lesson_meeting
    FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'moddatetime_demo_booking_updated_at'
  ) THEN
    CREATE TRIGGER moddatetime_demo_booking_updated_at
    BEFORE UPDATE ON public.demo_booking
    FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);
  END IF;
END$$;

-- Optional comments for clarity
COMMENT ON TABLE public.course_module  IS 'Self-paced: Module level under a course';
COMMENT ON TABLE public.course_section IS 'Self-paced: Section under a module';
COMMENT ON TABLE public.course_chapter IS 'Self-paced: Chapter under a section';
COMMENT ON TABLE public.course_content IS 'Self-paced: Content units with typed payloads';
COMMENT ON TABLE public.lesson_meeting IS 'Live 1-1: meeting info per lesson';
COMMENT ON TABLE public.demo_booking   IS 'Demo booking lifecycle with validity';

COMMIT;
