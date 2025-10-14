"use client";
import { useEffect, useState } from "react";
const Q_ROOM = "room";
const LS_LAST = "meeting:last";

export default function usePersistentRoom() {
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const q = u.searchParams.get(Q_ROOM) || "";
      const s = localStorage.getItem(LS_LAST) || "";
      const initial = q || s || "";
      if (initial) setRoomId(initial);
    } catch {}
  }, []);

  useEffect(() => {
    if (!roomId) return;
    try {
      localStorage.setItem(LS_LAST, roomId);
      const u = new URL(window.location.href);
      u.searchParams.set(Q_ROOM, roomId);
      window.history.replaceState({}, "", u.toString());
    } catch {}
  }, [roomId]);

  return { roomId, setRoomId };
}
