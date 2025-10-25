// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin, supabaseAnon } from '../../../../lib/supabaseServer';

type Body = { name: string; email: string; phone?: string; password: string; user_type?: string };

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, user_type } = (await req.json()) as Body;
    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { phone }
    });
    if (createErr || !created.user) {
      return NextResponse.json({ ok: false, error: createErr?.message ?? 'createUser failed' }, { status: 400 });
    }

    const { data: sessionData, error: signInErr } =
      await supabaseAnon.auth.signInWithPassword({ email, password });
    if (signInErr || !sessionData.session) {
      return NextResponse.json({ ok: false, error: signInErr?.message ?? 'sign in failed' }, { status: 400 });
    }

    supabaseAnon.auth.setSession({
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token
    });

    const { data: profile, error: rpcErr } = await supabaseAnon.rpc('ensure_profile', {
      fullname: name,
      phone,
      locale: 'en',
      user_type: user_type || 'user'
    });
    if (rpcErr) {
      return NextResponse.json({ ok: false, error: rpcErr.message }, { status: 400 });
    }

    const isProd = process.env.NODE_ENV === 'production';

    // Create response and set cookies ON THE RESPONSE
    const res = NextResponse.json({ ok: true, profile }, { status: 200 });
    res.cookies.set('sb-access-token', sessionData.session.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    res.cookies.set('sb-refresh-token', sessionData.session.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 28
    });

    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
