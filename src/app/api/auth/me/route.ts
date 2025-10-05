// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAnon } from '@/lib/supabaseServer';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const store = await cookies();                 // ✅ await the cookies store
        const access = store.get('sb-access-token')?.value;
        const refresh = store.get('sb-refresh-token')?.value;

        if (!access || !refresh) {
            return NextResponse.json({ ok: true, user: null, profile: null }, { status: 200 });
        }

        supabaseAnon.auth.setSession({
            access_token: access,
            refresh_token: refresh
        });

        const { data: { user } } = await supabaseAnon.auth.getUser();
        const { data: profile } = await supabaseAnon.rpc('get_profile');

        return NextResponse.json({ ok: true, user, profile }, { status: 200 });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown error';
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
}
