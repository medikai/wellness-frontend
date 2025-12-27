import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseServer';
import { loginWithEmail } from '../lib/auth/loginWithEmail';

type Body = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = (await req.json()) as Body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Create auth user
    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { phone }
      });

    if (createErr || !created.user) {
      return NextResponse.json(
        { ok: false, error: createErr?.message ?? 'createUser failed' },
        { status: 400 }
      );
    }

    // 2. Create profile using service role
    const base = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');

    const username = `${base}${Date.now()}`;

    const { error: upsertErr } = await supabaseAdmin
      .from('profile')
      .upsert(
        [
          {
            id: created.user.id,
            fullname: name,
            username,
            email,
            avatar_url:
              'https://pgrest.classroomio.com/storage/v1/object/public/avatars/avatar.png',
            locale: 'en'
          }
        ],
        { onConflict: 'id' }
      );

    if (upsertErr) {
      return NextResponse.json(
        { ok: false, error: upsertErr.message },
        { status: 400 }
      );
    }

    // 3. AUTO LOGIN (single source of truth)
    const { session, profile } = await loginWithEmail(email, password);

    const isProd = process.env.NODE_ENV === 'production';
    const res = NextResponse.json({ ok: true, profile });

    res.cookies.set('sb-access-token', session.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    res.cookies.set('sb-refresh-token', session.refresh_token, {
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
