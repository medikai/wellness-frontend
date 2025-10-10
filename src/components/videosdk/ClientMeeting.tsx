//src/app/meeting/ClientMeeting.tsx
"use client";

import { useEffect, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import MeetingScreen from "./MeetingScreen";

type Mode = "host" | "join";

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
  // const [name, setName] = useState<string>(mode === "host" ? "Host" : "Participant");
  const [name] = useState<string>(mode === "host" ? "Host" : "Participant");
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    fetchToken().then(setToken);
  }, []);

  const askPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach(t => t.stop());
      setHasPermission(true);
    } catch {
      alert("Please allow camera and microphone.");
    }
  };

  const handleCreate = async () => {
    const id = await createRoom();
    if (id) setRoomId(id);
  };

  const onJoinClick = () => {
    if (!roomId.trim()) return;
    // roomId already typed by joinee
  };

  if (!token) return <div className="p-6">Loading token…</div>;

  if (!hasPermission) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Enable camera & mic</h2>
        <button className="px-4 py-2 bg-[var(--primary)] text-white rounded" onClick={askPermission}>
          Allow
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen flex flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Companion 1-1</h1>

        {mode === "host" ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--neutral-dark)]">Coach</span>
            <span className="text-sm text-[var(--accent)]">{roomId || ""}</span>
            <button
              className="px-3 py-1 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]"
              onClick={handleCreate}
            >
              Create Room
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              className="px-2 py-1 border border-gray-300 rounded"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
            />
            <button
              className="px-3 py-1 bg-[var(--secondary)] text-white rounded hover:opacity-90"
              onClick={onJoinClick}
            >
              Join
            </button>
          </div>
        )}
      </header>

      {roomId ? (
        <MeetingProvider
          token={token}
          config={{
            meetingId: roomId,
            name,
            micEnabled: true,
            webcamEnabled: true,
            debugMode: process.env.NODE_ENV !== "production", // required by SDK
          }}
        >
          <MeetingScreen isHost={mode === "host"} />
        </MeetingProvider>
      ) : (
        <div className="text-gray-500">Enter a room ID{mode === "host" ? " or create one" : ""} to join.</div>
      )}
    </div>
  );
}
