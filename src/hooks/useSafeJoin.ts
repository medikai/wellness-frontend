"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useSafeJoin(join: () => Promise<void>, leave: () => Promise<void>) {
  const [joined, setJoined] = useState(false);
  const [offline, setOffline] = useState(false);
  const [showRejoin, setShowRejoin] = useState(false);
  const joiningRef = useRef(false);
  const backoffs = useRef<number[]>([1000, 2000, 4000]);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeJoin = useCallback(async () => {
    if (joined || joiningRef.current) return;
    joiningRef.current = true;
    try { await join(); setJoined(true); setShowRejoin(false); }
    finally { joiningRef.current = false; }
  }, [join, joined]);

  const safeLeave = useCallback(async () => {
    try { await leave(); } finally { setJoined(false); setShowRejoin(true); }
  }, [leave]);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => {
      setOffline(false);
      const tryJoin = async () => {
        try {
          await safeJoin();
          backoffs.current = [1000, 2000, 4000];
          if (retryTimer.current) { clearTimeout(retryTimer.current); retryTimer.current = null; }
        } catch {
          const wait = backoffs.current.shift() ?? 5000;
          retryTimer.current = setTimeout(tryJoin, wait);
        }
      };
      tryJoin();
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, [safeJoin]);

  return { joined, safeJoin, safeLeave, offline, showRejoin, hideRejoin: () => setShowRejoin(false), setJoined };
}
