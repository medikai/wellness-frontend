"use client";
import { useEffect, useMemo, useState } from "react";
import { usePubSub } from "@videosdk.live/react-sdk";

type TimerPayload = { startedAtIso: string; expectedMinutes: number };

export default function useMeetingTimer(meetingId?: string, isHost?: boolean, joined?: boolean, participantCount?: number) {
  const DEFAULT_MINUTES = 60;
  const [timer, setTimer] = useState<TimerPayload | null>(null);
  const [nowTs, setNowTs] = useState<number>(Date.now());

  const topic = `MEETING_TIMER_${meetingId || "none"}`;
  const { publish, messages } = usePubSub(topic, { onMessageReceived: () => {} });

  useEffect(() => {
    if (!messages?.length) return;
    const last = messages[messages.length - 1];
    try {
      const parsed = JSON.parse(String(last.message));
      if (parsed?.action === "clear") { setTimer(null); return; }
      if (parsed?.startedAtIso && parsed?.expectedMinutes) setTimer(parsed as TimerPayload);
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (!joined || !meetingId || timer || !isHost) return;
    const payload: TimerPayload = { startedAtIso: new Date().toISOString(), expectedMinutes: DEFAULT_MINUTES };
    try { publish(JSON.stringify(payload), { persist: true }); } catch {}
    // do not set local state, rely on retained delivery
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, meetingId, isHost, timer]);

  useEffect(() => {
    if (!timer) return;
    const t = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const add15 = () => {
    if (!meetingId || !timer) return;
    const payload: TimerPayload = { startedAtIso: timer.startedAtIso, expectedMinutes: (timer.expectedMinutes ?? DEFAULT_MINUTES) + 15 };
    try { publish(JSON.stringify(payload), { persist: true }); } catch {}
  };

  const computed = useMemo(() => {
    if (!timer) return { elapsedSec: 0, leftSec: 0, warn: false, over: false, hasTimer: false };
    const start = Date.parse(timer.startedAtIso);
    const elapsedSec = Math.max(0, Math.floor((nowTs - start) / 1000));
    const totalSec = timer.expectedMinutes * 60;
    const leftSec = Math.max(0, totalSec - elapsedSec);
    const warn = leftSec <= 5 * 60 && leftSec > 0;
    const over = leftSec === 0;
    return { elapsedSec, leftSec, warn, over, hasTimer: true };
  }, [timer, nowTs]);

  const clearIfLast = () => {
    if (!meetingId) return;
    if ((participantCount ?? 0) === 0) {
      try { publish(JSON.stringify({ action: "clear" }), { persist: true }); } catch {}
    }
  };

  return { ...computed, add15, clearIfLast };
}
