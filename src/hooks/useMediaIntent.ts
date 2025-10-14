"use client";
import { useEffect, useState } from "react";

export default function useMediaIntent() {
  const [wantMic, setWantMic] = useState(true);
  const [wantCam, setWantCam] = useState(true);

  useEffect(() => { /* future: persist intents if needed */ }, []);

  return { wantMic, wantCam, setWantMic, setWantCam };
}
