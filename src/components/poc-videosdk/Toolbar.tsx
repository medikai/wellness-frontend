// src/components/Toolbar.tsx
"use client";
import { Mic, Video, MonitorUp, PhoneOff } from "lucide-react";
type Props = { joined: boolean; onMic: () => void; onCam: () => void; onShare: () => void; onLeave: () => void; onJoin: () => void; };

export default function Toolbar(p: Props) {
  if (!p.joined) {
    return (
      <div className="flex items-center justify-center gap-3 p-2">
        <span className="text-gray-600">You left the room.</span>
        <button className="px-4 py-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--secondary)]" onClick={p.onJoin}>Join</button>
      </div>
    );
  }

  const btn = "w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm";
  return (
    <div className="backdrop-blur bg-white/85 border border-gray-200 rounded-full shadow-xl px-3 py-2 mx-auto flex items-center gap-3">
      <button className={btn} onClick={p.onMic}>
        <Mic className="w-5 h-5" />
      </button>
      <button className={btn} onClick={p.onCam}>
        <Video className="w-5 h-5" />
      </button>
      <button className={btn} onClick={p.onShare}>
        <MonitorUp className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white" onClick={p.onLeave}>
        <PhoneOff className="w-5 h-5" />
      </button>

    </div>
  );
}
