//src/components/tiles/ScreenShareTile.tsx
"use client";
import { useEffect, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
export default function ScreenShareTile({ id }: { id: string }) {
  const { screenShareOn, screenShareStream, displayName } = useParticipant(id);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const sms = new MediaStream();
    if (screenShareOn && screenShareStream?.track) sms.addTrack(screenShareStream.track);
    const el = videoRef.current;
    if (el) { el.srcObject = sms; el.play().catch(() => { }); }
    return () => { if (el) { el.srcObject = null; } };
  }, [screenShareOn, screenShareStream]);
  return (
    <div className="bg-black rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-220px)]">
      <div className="flex-1 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-auto max-h-[80vh] object-contain bg-black"
        />
      </div>

      <div className="p-2 bg-[var(--white)] flex justify-between items-center">
        <span className="text-sm font-medium">{displayName || "Presenter"}</span>
        <span className="text-xs text-[var(--neutral-medium)]">sharing</span>
      </div>
    </div>
  );

}
