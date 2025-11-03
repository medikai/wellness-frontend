//src/app/api/classes/upcoming/route.ts
import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabaseServer";
import { bindSessionFromCookies } from "@/lib/http/session";

export async function GET() {
  try {
    const user = await bindSessionFromCookies();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const nowIso = new Date().toISOString();

    // Step 1: Fetch lessons where user is coach or student
    const { data: lessons, error: lessonError } = await supabaseAnon
      .from("lesson")
      .select("id, title, starts_at, ends_at, meeting_id, coach_id, student_id")
      .gte("starts_at", nowIso)
      .or(`coach_id.eq.${user.id},student_id.eq.${user.id}`)
      .order("starts_at", { ascending: true })
      .limit(50);

    if (lessonError) {
      return NextResponse.json({ ok: false, error: lessonError.message }, { status: 400 });
    }

    if (!lessons?.length) {
      return NextResponse.json({ ok: true, items: [] });
    }

    // Collect all unique coach and student IDs
    const allIds = Array.from(
      new Set(lessons.flatMap((l) => [l.coach_id, l.student_id]).filter(Boolean))
    );

    // Step 2: Fetch names for those IDs from profile table
    const { data: profiles, error: profileError } = await supabaseAnon
      .from("profile") // change this to your actual table, e.g. user_profile
      .select("id, fullname")
      .in("id", allIds);

    if (profileError) {
      console.error("profileError:", profileError);
    }

    // Build a lookup map
    const nameMap = new Map(profiles?.map((p) => [p.id, p.fullname]) || []);

    // Step 3: Merge names back into lessons
    const items = lessons.map((l) => ({
      id: l.id,
      title: l.title ?? "Demo class",
      starts_at: l.starts_at,
      ends_at: l.ends_at,
      meeting_id: l.meeting_id,
      coach_id: l.coach_id,
      student_id: l.student_id,
      coach_name: nameMap.get(l.coach_id) ?? "Coach",
      student_name: nameMap.get(l.student_id) ?? "Student",
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
