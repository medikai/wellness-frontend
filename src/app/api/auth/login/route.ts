import { NextResponse } from 'next/server';
import { loginWithEmail } from '../lib/auth/loginWithEmail';

type Body = {
  emailOrPhone: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const { emailOrPhone, password } = (await req.json()) as Body;

    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { ok: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    if (!emailOrPhone.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Email login only for now' },
        { status: 400 }
      );
    }

    const { session, profile } = await loginWithEmail(
      emailOrPhone,
      password
    );

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
