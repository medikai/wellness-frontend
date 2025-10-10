// src/app/api/videosdk/token/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type VideosdkJwtPayload = {
  apikey: string;
  permissions: string[];
  version: number;
  roles: string[];
  roomId?: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "rtc"; // rtc for client, crawler for REST
  const roomId = searchParams.get("roomId") || undefined;

  const API_KEY = process.env.VIDEOSDK_API_KEY as string;
  const SECRET = process.env.VIDEOSDK_SECRET as string;

  if (!API_KEY || !SECRET) {
    return NextResponse.json({ error: "Missing env VIDEOSDK_API_KEY or VIDEOSDK_SECRET" }, { status: 500 });
  }

  const payload: VideosdkJwtPayload = {
    apikey: API_KEY,
    permissions: ["allow_join"],    // or ask_join, add allow_mod if you need it
    version: 2,
    roles: [role],                  // IMPORTANT
  };
  if (roomId) payload.roomId = roomId;

  const token = jwt.sign(payload, SECRET, { expiresIn: "120m", algorithm: "HS256" });
  return NextResponse.json({ token });
}
