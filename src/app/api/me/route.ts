// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { bindSessionFromCookies } from "@/lib/http/session";

interface SessionUser {
  id: string;
  email: string;
  name?: string;
  fullname?: string;
  role?: string;
}

export async function GET() {
  try {
    const user = (await bindSessionFromCookies()) as SessionUser | null;

    if (!user) {
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? user.fullname ?? null,
        role: user.role ?? "student",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
