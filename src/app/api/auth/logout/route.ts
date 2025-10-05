import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Clear cookies
        const res = NextResponse.json({ ok: true }, { status: 200 });
        res.cookies.set('sb-access-token', '', { path: '/', maxAge: 0 });
        res.cookies.set('sb-refresh-token', '', { path: '/', maxAge: 0 });
        return res;
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown error';
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

}
