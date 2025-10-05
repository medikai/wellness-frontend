// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { supabaseAnon } from '../../../../lib/supabaseServer';

type Body = { emailOrPhone: string; password: string };

export async function POST(req: Request) {
    try {
        const { emailOrPhone, password } = (await req.json()) as Body;
        if (!emailOrPhone || !password) {
            return NextResponse.json({ ok: false, error: 'Missing credentials' }, { status: 400 });
        }

        if (!emailOrPhone.includes('@')) {
            return NextResponse.json({ ok: false, error: 'Email login only for now' }, { status: 400 });
        }

        const { data, error } = await supabaseAnon.auth.signInWithPassword({
            email: emailOrPhone,
            password
        });
        if (error || !data.session) {
            return NextResponse.json(
                { ok: false, error: error?.message ?? 'Invalid credentials' },
                { status: 401 }
            );
        }

        // bind session for RPC
        supabaseAnon.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
        });

        const { data: profile } = await supabaseAnon.rpc('get_profile');

        const isProd = process.env.NODE_ENV === 'production';
        const res = NextResponse.json({ ok: true, profile }, { status: 200 });

        // set cookies on the response
        res.cookies.set('sb-access-token', data.session.access_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });
        res.cookies.set('sb-refresh-token', data.session.refresh_token, {
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
