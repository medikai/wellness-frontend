// src/app/api/section/[section_id]/contents/route.ts

import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabaseServer";
import { bindSessionFromCookies } from "@/lib/http/session";

// -------------------
// Route param typing
// -------------------
interface RouteParams {
  params: {
    section_id: string;
  };
}

// Runtime validator without using "any"
function assertRouteContext(value: unknown): asserts value is RouteParams {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid route context");
  }

  const maybeObj = value as Record<string, unknown>;
  if (typeof maybeObj.params !== "object" || maybeObj.params === null) {
    throw new Error("Invalid route params");
  }

  const params = maybeObj.params as Record<string, unknown>;
  if (typeof params.section_id !== "string") {
    throw new Error("Invalid section_id");
  }
}

export async function GET(req: Request, context: unknown) {
  try {
    // Validate route context
    assertRouteContext(context);
    const sectionId = context.params.section_id;

    const user = await bindSessionFromCookies();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAnon.rpc("get_section_contents", {
      p_section_id: sectionId,
    });

    if (error) {
      console.error("get_section_contents error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        ok: true,
        chapters: [],
        message: "No chapters found for this section",
      });
    }

    return NextResponse.json({ ok: true, chapters: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
