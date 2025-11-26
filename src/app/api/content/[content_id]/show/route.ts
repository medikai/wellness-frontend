// src/app/api/content/[content_id]/show/route.ts

import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabaseServer";
import { bindSessionFromCookies } from "@/lib/http/session";

// Correct typed params for Next.js route context
interface RouteParams {
  params: {
    content_id: string;
  };
}

// Strict runtime guard without using "any"
function assertRouteContext(value: unknown): asserts value is RouteParams {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    throw new Error("Invalid route context");
  }

  const maybeObj = value as Record<string, unknown>;
  if (
    typeof maybeObj.params !== "object" ||
    maybeObj.params === null
  ) {
    throw new Error("Invalid route params");
  }

  const params = maybeObj.params as Record<string, unknown>;
  if (typeof params.content_id !== "string") {
    throw new Error("Invalid content_id");
  }
}

export async function GET(req: Request, context: unknown) {
  try {
    // Validate the route context (no any used)
    assertRouteContext(context);
    const contentId = context.params.content_id;

    const user = await bindSessionFromCookies();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAnon.rpc("get_content_by_id", {
      p_content_id: contentId,
    });

    if (error) {
      console.error("get_content_by_id error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { ok: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, content: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
