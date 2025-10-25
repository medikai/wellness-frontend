// src/app/api/coach/availability/route.ts
import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabaseServer';
import { bindSessionFromCookies } from '@/lib/http/session';

type Rule = { weekday: number; start_minute: number; end_minute: number; is_demo?: boolean; is_active?: boolean };
type Exception = { date: string; start_minute: number; end_minute: number; is_open: boolean; is_demo?: boolean };
type Body = { rules?: Rule[]; exceptions?: Exception[]; replace_all?: boolean };

export async function POST(req: Request) {
  try {
    const user = await bindSessionFromCookies();
    if (!user) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });

    const { rules = [], exceptions = [], replace_all = false } = (await req.json()) as Body;

    if (replace_all) {
      const { error: del1 } = await supabaseAnon.from('coach_availability_rule').delete().eq('coach_id', user.id);
      if (del1) return NextResponse.json({ ok: false, error: del1.message }, { status: 400 });
      const { error: del2 } = await supabaseAnon.from('coach_availability_exception').delete().eq('coach_id', user.id);
      if (del2) return NextResponse.json({ ok: false, error: del2.message }, { status: 400 });
    }

    if (rules.length) {
      const payload = rules.map(r => ({
        coach_id: user.id,
        weekday: r.weekday,
        start_minute: r.start_minute,
        end_minute: r.end_minute,
        is_demo: !!r.is_demo,
        is_active: r.is_active ?? true,
      }));
      const { error } = await supabaseAnon.from('coach_availability_rule').insert(payload);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    if (exceptions.length) {
      const payload = exceptions.map(e => ({
        coach_id: user.id,
        date: e.date,
        start_minute: e.start_minute,
        end_minute: e.end_minute,
        is_open: e.is_open,
        is_demo: !!e.is_demo,
      }));
      const { error } = await supabaseAnon.from('coach_availability_exception').insert(payload);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
