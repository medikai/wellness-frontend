// src/app/meeting/ClientMeeting.tsx
"use client";

import { useEffect, useState } from "react";
import MeetingScreen from "./MeetingScreen";
import JoineeMeetingScreen from "./JoineeMeetingScreen";
import StableMeetingProvider from "./StableMeetingProvider";

type Mode = "host" | "join";
const Q_ROOM = "room";
const LS_LAST = "meeting:last";
const LS_NAME = "meeting:name";

function readQueryRoom() {
  try {
    const u = new URL(window.location.href);
    return u.searchParams.get(Q_ROOM) || "";
  } catch {
    return "";
  }
}
function writeQueryRoom(roomId: string) {
  try {
    const u = new URL(window.location.href);
    if (roomId) u.searchParams.set(Q_ROOM, roomId);
    else u.searchParams.delete(Q_ROOM);
    window.history.replaceState({}, "", u.toString());
  } catch {}
}

async function fetchToken() {
  const r = await fetch("/api/videosdk/token?role=rtc", { cache: "no-store" });
  const { token } = await r.json();
  return token as string;
}
async function createRoom() {
  const r = await fetch("/api/videosdk/room", { method: "POST" });
  const { roomId } = await r.json();
  return String(roomId);
}

export default function ClientMeeting({ mode }: { mode: Mode }) {
  const [token, setToken] = useState<string>();
  const [roomId, setRoomId] = useState<string>("");

  // Name, required only for joinee
  const [name, setName] = useState<string>(() => {
    if (typeof window === "undefined") return mode === "host" ? "Host" : "";
    return localStorage.getItem(LS_NAME) || (mode === "host" ? "Host" : "");
  });
  const isNameOk = name.trim().length >= 2 || mode === "host";

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(LS_NAME, name);
  }, [name]);

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    fetchToken().then(setToken);

    const fromQuery = readQueryRoom();
    const fromStore = typeof window !== "undefined" ? localStorage.getItem(LS_LAST) || "" : "";
    const initial = fromQuery || fromStore || "";
    if (initial) setRoomId(initial);

    const onOnline = () => {
      fetchToken().then(setToken).catch(() => {});
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_LAST, roomId);
      writeQueryRoom(roomId);
    }
  }, [roomId]);

  const askPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach((t) => t.stop());
      setHasPermission(true);
    } catch {
      alert("Please allow camera and microphone.");
    }
  };

  const handleCreate = async () => {
    const id = await createRoom();
    if (id) {
      setRoomId(id);
      writeQueryRoom(id);
    }
  };

  const onJoinClick = () => {
    if (!roomId.trim()) return;
    // nothing else to do here, MeetingProvider below controls gating
  };

  if (!token) return <div className="p-6">Loading token…</div>;

  if (!hasPermission) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Enable camera and mic</h2>
        <button className="px-4 py-2 bg-[var(--primary)] text-white rounded" onClick={askPermission}>
          Allow
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen flex flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold hidden">{mode === "host" ? "Companion 1-1" : "Join"}</h1>

        {mode === "host" ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--neutral-dark)]">Coach</span>

            {/* Optional name for host */}
            <input
              className="px-2 py-1 border border-gray-300 rounded w-[180px]"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="px-2 py-1 border border-gray-300 rounded w-[220px]"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <button
              className="px-3 py-1 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]"
              onClick={handleCreate}
            >
              Create Room
            </button>

            <button
              className="px-3 py-1 bg-[var(--secondary)] text-white rounded hover:opacity-90 disabled:opacity-50"
              onClick={() => void navigator.clipboard.writeText(roomId)}
              disabled={!roomId}
              title="Copy Room ID"
            >
              Copy
            </button>

            <button
              className="px-3 py-1 bg-[var(--accent)] text-white rounded hover:opacity-90 disabled:opacity-50"
              onClick={onJoinClick}
              disabled={!roomId}
              title="Join this room"
            >
              Join
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 hidden">
            {/* Required name for joinee */}
            <input
              className="px-2 py-1 border border-gray-300 rounded w-[180px]"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="px-2 py-1 border border-gray-300 rounded"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <button
              className="px-3 py-1 bg-[var(--secondary)] text-white rounded hover:opacity-90 disabled:opacity-50"
              onClick={onJoinClick}
              disabled={!roomId || !isNameOk}
            >
              Join
            </button>
          </div>
        )}
      </header>

      {(mode === "host" ? !!roomId : !!roomId && isNameOk) ? (
        <StableMeetingProvider
          token={token || ""}
          config={{
            meetingId: roomId,
            name, // shows in tiles and chat
            micEnabled: true,
            webcamEnabled: true,
            debugMode: false,
          }}
        >
          {mode === "host" ? (
            <MeetingScreen isHost={true} />
          ) : (
            <JoineeMeetingScreen />
          )}
        </StableMeetingProvider>
      ) : (
        <div className="text-gray-500">
          {mode === "host"
            ? "Enter or create a room ID to join."
            : "Enter your name and room ID to join."}
        </div>
      )}
    </div>
  );
}
