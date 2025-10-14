// src/components/tiles/ParticipantTile.tsx
"use client";
import { useEffect, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

export default function ParticipantTile({
  id,
  isLocal,
  pinned,
  onPin,
  compact,
}: {
  id: string;
  isLocal: boolean;
  pinned?: boolean;
  onPin?: (id: string | null) => void;
  compact?: boolean;
}) {
  const { webcamStream, micStream, micOn, webcamOn, displayName } = useParticipant(id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const vms = new MediaStream();
    if (webcamOn && webcamStream?.track) vms.addTrack(webcamStream.track);
    el.srcObject = vms;
    el.muted = isLocal;
    el.play().catch(() => {});
    return () => { el.srcObject = null; };
  }, [webcamOn, webcamStream, isLocal]);

  useEffect(() => {
    if (isLocal) return;
    const el = audioRef.current;
    if (!el) return;
    const ams = new MediaStream();
    if (micOn && micStream?.track) ams.addTrack(micStream.track);
    el.srcObject = ams;
    el.play().catch(() => {});
    return () => { el.srcObject = null; };
  }, [micOn, micStream, isLocal]);

  const outer = compact
  ? "relative w-full h-full rounded-xl overflow-hidden bg-black"
  : "relative w-full h-full rounded-2xl overflow-hidden bg-black";

  const videoCls = compact
    ? "w-full h-full object-cover"
    : "absolute inset-0 w-full h-full object-contain"; // scale like Meet

  return (
    <div className={outer}>
      <video ref={videoRef} autoPlay playsInline className={videoCls} />
      {!isLocal && <audio ref={audioRef} autoPlay />}

      <div className="absolute top-2 right-2 flex items-center gap-2">
        {!isLocal && onPin && (
          <button
            className="text-[11px] px-2 py-0.5 rounded bg-white/85 hover:bg-white shadow"
            onClick={(e) => { e.stopPropagation(); onPin(pinned ? null : id); }}
            title={pinned ? "Unpin" : "Pin"}
          >
            {pinned ? "Unpin" : "Pin"}
          </button>
        )}
        <span className="text-[11px] px-2 py-0.5 rounded bg-white/70 shadow">
          {micOn ? "Mic on" : "Mic off"}
        </span>
      </div>

      {!compact && (
        <div className="absolute left-2 right-2 bottom-2 rounded-md px-2 py-1 bg-white/85 backdrop-blur text-xs flex justify-between">
          <span className="font-medium truncate">{displayName || (isLocal ? "You" : "Guest")}</span>
        </div>
      )}
    </div>
  );
}
