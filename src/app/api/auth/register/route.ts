// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin, supabaseAnon } from '../../../../lib/supabaseServer';

type Body = { name: string; email: string; phone?: string; password: string };

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = (await req.json()) as Body;
    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1) Create auth user
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { phone },
    });
    if (createErr || !created.user) {
      return NextResponse.json({ ok: false, error: createErr?.message ?? 'createUser failed' }, { status: 400 });
    }

    // 2) Sign in to get session (for cookies)
    const { data: sessionData, error: signInErr } =
      await supabaseAnon.auth.signInWithPassword({ email, password });
    if (signInErr || !sessionData.session) {
      return NextResponse.json({ ok: false, error: signInErr?.message ?? 'sign in failed' }, { status: 400 });
    }

    supabaseAnon.auth.setSession({
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
    });

    // 3) Upsert profile directly using service role to avoid the enum cast in ensure_profile
    // Generate a simple username. Keep it unique-enough.
    const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '');
    const username = `${base}${Date.now()}`;

    const { data: upserted, error: upsertErr } = await supabaseAdmin
      .from('profile')
      .upsert(
        [{
          id: created.user.id,
          fullname: name,
          username,
          email,
          avatar_url: 'https://pgrest.classroomio.com/storage/v1/object/public/avatars/avatar.png',
          locale: 'en',            // enum string is OK here
        }],
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (upsertErr) {
      return NextResponse.json({ ok: false, error: upsertErr.message }, { status: 400 });
    }

    const isProd = process.env.NODE_ENV === 'production';
    const res = NextResponse.json({ ok: true, profile: upserted }, { status: 200 });

    res.cookies.set('sb-access-token', sessionData.session.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set('sb-refresh-token', sessionData.session.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 28,
    });

    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
