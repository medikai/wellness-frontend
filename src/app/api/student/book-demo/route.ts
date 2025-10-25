// src/app/api/student/book-demo/route.ts
import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabaseServer';
import { bindSessionFromCookies } from '@/lib/http/session';

type Body = { slot_start: string; slot_minutes?: number };

// helper to create meeting using your existing Videosdk endpoint
async function createMeetingId() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${base}/api/videosdk/room`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to create meeting');
  const data = await res.json();
  return data.roomId as string;
}

export async function POST(req: Request) {
  try {
    const user = await bindSessionFromCookies();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { slot_start, slot_minutes = 60 } = (await req.json()) as Body;
    if (!slot_start) {
      return NextResponse.json({ ok: false, error: 'slot_start is required ISO string' }, { status: 400 });
    }

    // Step 1: book the demo slot using Supabase RPC
    const { data, error } = await supabaseAnon.rpc('book_demo_slot', {
      p_slot_start: slot_start,
      p_slot_minutes: slot_minutes,
    });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    const booking = Array.isArray(data) ? data[0] : data;
    const bookingId = booking?.booking_id;
    if (!bookingId) {
      return NextResponse.json({ ok: false, error: 'Booking failed, no ID returned' }, { status: 400 });
    }

    // Step 2: create a new VideoSDK meeting room
    const meetingId = await createMeetingId();

    // Step 3: update the Supabase lesson record with meetingId
    const { error: updateErr } = await supabaseAnon
      .from('lesson')
      .update({ zoom_start_url: meetingId })
      .eq('id', bookingId);

    if (updateErr) {
      console.error('Failed to update meeting ID:', updateErr);
    }

    // Step 4: return final booking response including meeting ID
    return NextResponse.json({
      ok: true,
      booking: { ...booking, meeting_id: meetingId },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
