"use client";
import { useEffect, useState } from "react";

export default function useActiveSpeaker(onSpeakerChanged?: (cb: (id: string | null) => void) => void) {
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);

  useEffect(() => {
    if (!onSpeakerChanged) return;
    const cb = (id: string | null) => setActiveSpeakerId(id);
    onSpeakerChanged(cb);
    return () => { /* no-op cleanup for SDK based callback */ };
  }, [onSpeakerChanged]);

  return activeSpeakerId;
}
