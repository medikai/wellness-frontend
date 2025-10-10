// src/app/api/videosdk/room/route.ts
import { NextResponse } from "next/server";

async function getCrawlerToken() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/videosdk/token?role=crawler`, {
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Token API failed");
  const { token } = await r.json();
  return token as string;
}

export async function POST() {
  try {
    const token = await getCrawlerToken();

    const resp = await fetch("https://api.videosdk.live/v2/rooms", {
      method: "POST",
      headers: {
        Authorization: token,            // no "Bearer " prefix
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),          // you can pass { region, autoClose, ... } if needed
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: text || "Unable to create room" }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json({ roomId: data.roomId });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Room creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
