// src/app/api/public/calendar/route.ts
import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabaseServer';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p_from = url.searchParams.get('from');
    const p_to = url.searchParams.get('to');
    const p_slot_minutes = Number(url.searchParams.get('slot') ?? 60);
    const type = url.searchParams.get('type') ?? 'demo';
    if (!p_from || !p_to) {
      return NextResponse.json({ ok: false, error: 'from and to are required YYYY-MM-DD' }, { status: 400 });
    }

    const { data, error } = await supabaseAnon.rpc('get_public_calendar', {
      p_from,
      p_to,
      p_slot_minutes,
      p_demo_only: type !== 'all'
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true, slots: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'unknown error' }, { status: 500 });
  }
}
