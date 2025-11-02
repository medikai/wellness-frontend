import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabaseServer";
import { bindSessionFromCookies } from "@/lib/http/session";

type Body = {
  slot_id: string;
  coach_id: string;
  slot_minutes?: number;
};

async function createMeetingRoom() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/videosdk/room`, { method: "POST" });
  if (!res.ok) throw new Error("VideoSDK room creation failed");
  const data = await res.json();
  return data.roomId as string;
}

export async function POST(req: Request) {
  try {
    const user = await bindSessionFromCookies();
    if (!user)
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

    const body = (await req.json()) as Body;
    const { slot_id, coach_id, slot_minutes = 60 } = body;

    if (!slot_id || !coach_id) {
      return NextResponse.json(
        { ok: false, error: "slot_id and coach_id required" },
        { status: 400 }
      );
    }

    // Step 1: Call RPC
    const { data, error } = await supabaseAnon.rpc("book_demo_slot", {
      p_student_id: user.id,
      p_coach_id: coach_id,
      p_slot_id: slot_id,
      p_slot_minutes: slot_minutes,
    });

    if (error) {
      console.error("RPC error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    const booking = Array.isArray(data) ? data[0] : data;
    const lessonId = booking?.lesson_id;
    if (!lessonId)
      return NextResponse.json({ ok: false, error: "Lesson not created" }, { status: 400 });

    // Step 2: Create VideoSDK meeting
    const realMeetingId = await createMeetingRoom();

    // Step 3: Update meeting ID on lesson
    await supabaseAnon.rpc("update_lesson_meeting", {
      p_lesson: lessonId,
      p_meeting: realMeetingId,
    });

    return NextResponse.json({
      ok: true,
      booking: { ...booking, meeting_id: realMeetingId },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
