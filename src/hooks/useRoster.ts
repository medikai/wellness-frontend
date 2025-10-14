// src/hooks/useRoster.ts
import { useEffect, useMemo } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";

type HelloMsg = { type: "hello"; id: string; name?: string; ts: number };

// Narrow shape for PubSub messages we actually use
type PubMsgLike = { message: unknown; timestamp?: number | string };

export function useRoster() {
  const { meetingId, localParticipant } = useMeeting();
  const topic = useMemo(() => `ROSTER_${meetingId || "none"}`, [meetingId]);
  const { publish, messages } = usePubSub(topic);

  // Announce myself once per id or display name change
  useEffect(() => {
    const id = localParticipant?.id;
    if (!id) return;

    const payload: HelloMsg = {
      type: "hello",
      id,
      name: localParticipant?.displayName || undefined,
      ts: Date.now(),
    };

    try {
      // publish can be sync. No .catch.
      publish(JSON.stringify(payload), { persist: true });
    } catch {
      // ignore
    }
  }, [localParticipant?.id, localParticipant?.displayName, publish]);

  // Build first-seen roster
  const roster = useMemo(() => {
    const firstSeen = new Map<string, { name?: string; ts: number }>();

    (messages as PubMsgLike[]).forEach((m) => {
      try {
        const msg = JSON.parse(String(m.message)) as HelloMsg;
        if (msg?.type === "hello" && msg.id) {
          if (!firstSeen.has(msg.id)) {
            const rawTs = m?.timestamp;
            const fallbackTsNum = Number(rawTs);
            const ts =
              typeof msg.ts === "number" && Number.isFinite(msg.ts)
                ? msg.ts
                : Number.isFinite(fallbackTsNum)
                ? fallbackTsNum
                : Date.now();

            firstSeen.set(msg.id, { name: msg.name, ts });
          }
        }
      } catch {
        // ignore malformed
      }
    });

    const ordered = Array.from(firstSeen.entries())
      .sort((a, b) => a[1].ts - b[1].ts)
      .map(([id, info], idx) => ({ id, name: info.name, number: idx + 1 }));

    const numbers = new Map(ordered.map((x) => [x.id, x.number]));
    const names = new Map(ordered.map((x) => [x.id, x.name]));
    return { ordered, numbers, names };
  }, [messages]);

  const labelFor = (id: string, fallbackName?: string) => {
    const n = roster.names.get(id) ?? fallbackName ?? "";
    if (typeof n === "string" && n.trim()) return n.trim();
    const num = roster.numbers.get(id);
    return num ? `Participant ${num}` : "Participant";
  };

  return { roster, labelFor };
}
