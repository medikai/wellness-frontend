// src/app/meeting/MeetingScreen.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { useRoster } from "@/hooks/useRoster";

import Toolbar from "@/components/Toolbar";
import Modal from "@/components/Modal";
import VideoGrid from "@/components/VideoGrid";
import TimerPill from "@/components/TimerPill";

export default function MeetingScreen({ isHost }: { isHost: boolean }) {
  const [joined, setJoined] = useState(false);
  const [wantMic, setWantMic] = useState(true);
  const [wantCam, setWantCam] = useState(true);

  const [offline, setOffline] = useState(false);
  const backoffs = useRef<number[]>([1000, 2000, 4000]);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const joiningRef = useRef(false);
  const [showRejoin, setShowRejoin] = useState(false);

  const DEFAULT_MINUTES = 60;

  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  type TimerPayload = { startedAtIso: string; expectedMinutes: number };
  const [timer, setTimer] = useState<TimerPayload | null>(null);
  const [nowTs, setNowTs] = useState<number>(Date.now());

  const {
    join,
    leave,
    toggleMic,
    toggleWebcam,
    enableScreenShare,
    disableScreenShare,
    localParticipant,
    participants,
    presenterId,
    meetingId,
    // @ts-expect-error event availability differs by SDK version
    onSpeakerChanged,
  } = useMeeting({
    onMeetingJoined: async () => {
      setJoined(true);
      setShowRejoin(false);
      try {
        if (wantMic) {
          await toggleMic();
          await toggleMic();
        }
      } catch { }
      try {
        if (!wantMic) {
          await toggleMic();
        }
      } catch { }
      try {
        if (wantCam) {
          await toggleWebcam();
          await toggleWebcam();
        }
      } catch { }
      try {
        if (!wantCam) {
          await toggleWebcam();
        }
      } catch { }
    },
    onMeetingLeft: () => {
      setJoined(false);
      setShowRejoin(true);
      setActiveSpeakerId(null);
      setPinnedId(null);
    },
  });

  // active speaker binding if SDK provides it
  useEffect(() => {
    if (!onSpeakerChanged) return;
    const unsub = onSpeakerChanged((e: { participantId?: string; dominantSpeakerId?: string; id?: string }) => {
      const id = e?.participantId || e?.dominantSpeakerId || e?.id || null;
      if (id) setActiveSpeakerId(id);
    });
    return () => {
      try {
        // some SDKs return an unsubscribe
        if (typeof unsub === "function") unsub();
      } catch { }
    };
  }, [onSpeakerChanged]);

  useEffect(() => {
    const t = setTimeout(() => {
      safeJoin();
    }, 300);
    return () => {
      clearTimeout(t);
      try {
        leave();
      } catch { }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => {
      setOffline(false);
      const tryJoin = async () => {
        try {
          await safeJoin();
          backoffs.current = [1000, 2000, 4000];
          if (retryTimer.current) {
            clearTimeout(retryTimer.current);
            retryTimer.current = null;
          }
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
  },);

  const localId = localParticipant?.id || "";
  const isSharing = presenterId === localId;

  const participantIds = useMemo(() => {
    const s = new Set<string>();
    participants.forEach((_, pid) => s.add(pid));
    if (localId) s.add(localId);
    return Array.from(s);
  }, [participants, localId]);

  useEffect(() => {
    if (pinnedId && !participantIds.includes(pinnedId)) setPinnedId(null);
  }, [participantIds, pinnedId]);

  async function safeJoin() {
    if (joined || joiningRef.current) return;
    joiningRef.current = true;
    try {
      await join();
    } finally {
      joiningRef.current = false;
    }
  }

  const onShare = async () => {
    if (!joined) return;
    try {
      if (!isSharing) await enableScreenShare();
      else await disableScreenShare();
    } catch (err) {
      console.error("screen share error", err);
    }
  };

  // timer via PubSub
  const timerTopic = `MEETING_TIMER_${meetingId || "none"}`;
  const { publish: publishTimer, messages: timerMsgs } = usePubSub(timerTopic, {
    onMessageReceived: () => { },
  });

  useEffect(() => {
    if (!timerMsgs?.length) return;
    const last = timerMsgs[timerMsgs.length - 1];
    try {
      const raw = String(last.message);
      const parsed = JSON.parse(raw);
      if (parsed?.action === "clear") {
        setTimer(null);
        return;
      }
      const payload = parsed as TimerPayload;
      if (payload?.startedAtIso && payload?.expectedMinutes) {
        setTimer(payload);
      }
    } catch { }
  }, [timerMsgs]);

  useEffect(() => {
    if (!joined) return;
    if (!meetingId) return;
    if (timer) return;
    if (!isHost) return;
    const payload: TimerPayload = {
      startedAtIso: new Date().toISOString(),
      expectedMinutes: DEFAULT_MINUTES,
    };
    try {
      publishTimer(JSON.stringify(payload), { persist: true });
    } catch { }
    // do not set local state, rely on retained
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, meetingId, isHost, timer]);

  useEffect(() => {
    if (!timer) return;
    const t = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [timer]);

  async function endMeeting() {
    const amILast = joined && participants.size === 0;
    if (amILast && meetingId) {
      try {
        publishTimer(JSON.stringify({ action: "clear" }), { persist: true });
      } catch { }
    }
    try {
      await leave();
    } catch { }
  }

  function timerComputed() {
    if (!timer) return { elapsedSec: 0, leftSec: 0, warn: false, over: false };
    const start = Date.parse(timer.startedAtIso);
    const elapsedSec = Math.max(0, Math.floor((nowTs - start) / 1000));
    const totalSec = timer.expectedMinutes * 60;
    const leftSec = Math.max(0, totalSec - elapsedSec);
    const warn = leftSec <= 5 * 60 && leftSec > 0;
    const over = leftSec === 0;
    return { elapsedSec, leftSec, warn, over };
  }

  function add15() {
    if (!meetingId || !timer) return;
    const payload: TimerPayload = {
      startedAtIso: timer.startedAtIso,
      expectedMinutes: (timer.expectedMinutes ?? DEFAULT_MINUTES) + 15,
    };
    try {
      publishTimer(JSON.stringify(payload), { persist: true });
    } catch { }
  }

  // inside return (
  return (
    // inside MeetingScreen return (
    <div className="flex flex-1 h-full min-h-0 gap-4 overflow-hidden overflow-x-hidden">

      <Modal open={showRejoin && !joined} onRejoin={() => safeJoin()} onClose={() => setShowRejoin(false)} />

      {/* LEFT */}
      <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-white rounded-lg shadow-lg overflow-hidden relative">

        {/* top info row */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <h2 className="text-base font-semibold">Companion 1-1</h2>
          <div>
            {joined && timer ? <TimerPill {...timerComputed()} isHost={isHost} onAdd15={add15} /> : null}
          </div>
        </div>

        {offline && (
          <div className="w-full text-center text-sm bg-yellow-100 text-yellow-800 py-1">
            You are offline. We will retry when back online.
          </div>
        )}

        {/* scrollable content area */}
        <div className="flex-1 min-h-0 overflow-y-auto pb-28">
          <VideoGrid
            participantIds={participantIds}
            localId={localId}
            presenterId={presenterId}
            pinnedId={pinnedId}
            activeSpeakerId={activeSpeakerId || undefined}
            onPin={setPinnedId}
          />
        </div>


        {/* bottom dock */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[min(640px,92%)]">
          <Toolbar
            onMic={async () => { setWantMic((v) => !v); await toggleMic(); }}
            onCam={async () => { setWantCam((v) => !v); await toggleWebcam(); }}
            onShare={onShare}
            onLeave={() => endMeeting()}
            onJoin={() => safeJoin()}
            joined={joined}
          />
        </div>
      </div>

      {/* RIGHT sidebar */}
      <div className="flex flex-col min-h-0 min-w-0 flex-shrink-0 w-[360px] gap-4 overflow-y-auto overflow-x-hidden">
        <ChatPanel />
        {isHost && <PollsPanel />}
      </div>
    </div>

  );

}

/* ------- keep Chat and Polls inline for now ------- */

function ChatPanel() {
  const { meetingId, localParticipant } = useMeeting();
  const topic = useMemo(() => `CHAT_${meetingId || "none"}`, [meetingId]);
  type ChatMsg = { id: string; text: string; fromId: string; fromName: string; ts: number };

  const { publish, messages } = usePubSub(topic, { onMessageReceived: () => { } });
  const { labelFor } = useRoster();

  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const meId = localParticipant?.id || "";

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    const payload: ChatMsg = {
      id: crypto.randomUUID(),
      text: t,
      fromId: meId || "anon",
      fromName: localParticipant?.displayName || "",
      ts: Date.now(),
    };
    await publish(JSON.stringify(payload), { persist: true });
    setText("");
  };

  const items: ChatMsg[] = useMemo(() => {
    return messages
      .map((m) => {
        try { return JSON.parse(String(m.message)) as ChatMsg; } catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => a!.ts - b!.ts) as ChatMsg[];
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [items.length]);

  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLElement | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [caret, setCaret] = useState<[number, number]>([0, 0]);

  // load the web component only on the client
  useEffect(() => {
    let cancelled = false;
    import("emoji-picker-element").then(() => {
      if (cancelled) return;
    });
    return () => { cancelled = true; };
  }, []);

  function rememberCaret() {
    const el = inputRef.current;
    if (!el) return;
    setCaret([el.selectionStart ?? 0, el.selectionEnd ?? 0]);
  }

  const insertEmoji = useCallback((unicode: string) => {
    if (!unicode) return;
    const [start, end] = caret;
    const next = text.slice(0, start) + unicode + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const pos = start + unicode.length;
      el.focus();
      el.setSelectionRange(pos, pos);
      setCaret([pos, pos]);
    });
  }, [caret, text]);

  // listen to emoji selection when the picker is visible
  useEffect(() => {
    if (!showPicker || !pickerRef.current) return;
    const el = pickerRef.current;
    const onEmoji = (e: Event) => {
      const ev = e as EmojiClickEvent;
      const unicode = ev.detail.emoji?.unicode || ev.detail.unicode || "";
      insertEmoji(unicode);
      setShowPicker(false);
    };
    el.addEventListener("emoji-click", onEmoji as EventListener);
    return () => el.removeEventListener("emoji-click", onEmoji as EventListener);
  }, [showPicker, insertEmoji]);


  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-0 flex flex-col min-h-0">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <h3 className="text-base font-semibold">Group chat</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded bg-gray-100">All messages</span>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {items.map((m) => {
          const mine = m.fromId === meId;
          // Better wrapping + readable line height
          // Better wrapping + consistent sizing
          const bubble =
            [
              // make the bubble shrink to content but never below ~12 characters
              "inline-flex w-auto max-w-[88%] min-w-[12ch] sm:min-w-[16ch]",
              // padding + type ramp consistent for *all* messages
              "px-4 py-2 rounded-2xl text-[15px] leading-6",
              // wrap on spaces, allow breaking only when needed (long words/URLs)
              "whitespace-pre-line break-words [overflow-wrap:break-word] [word-break:normal]",
              // colors per side
              mine
                ? "bg-[var(--primary)] text-white rounded-br-sm"
                : "bg-gray-100 text-gray-900 rounded-bl-sm",
            ].join(" ");


          return (
            <div key={m.id} className={`w-full flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                {!mine && (
                  <div className="text-[11px] text-gray-500 mb-1">
                    <strong className="text-gray-700">{labelFor(m.fromId, m.fromName)}</strong>
                  </div>
                )}
                {/* bubble */}
                <div className={bubble}>
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* composer */}
      <div className="p-3 border-t border-gray-100 sticky bottom-0 bg-white overflow-visible">
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Add emoji"
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 grid place-items-center text-xl"
              onClick={() => setShowPicker(v => !v)}
            >
              +
            </button>

            <input
              ref={inputRef}
              className="flex-1 border border-gray-300 rounded-full px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
                requestAnimationFrame(rememberCaret);
              }}
              onClick={rememberCaret}
            />

            <button
              className="px-4 py-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--secondary)]"
              onClick={send}
            >
              Send
            </button>
          </div>

          {/* popover - opens downward */}
          {showPicker && (
            <div className="absolute left-0 top-14 z-50 shadow-xl rounded-xl overflow-hidden bg-white">
              <emoji-picker
                ref={(n) => { pickerRef.current = n as unknown as HTMLElement; }}
                data-theme="light"
              />
            </div>
          )}
        </div>
      </div>


    </div>
  );
}


type Poll = { id: string; question: string; options: string[] };

function PollsPanel() {
  const { publish, messages } = usePubSub("POLL");
  const [question, setQuestion] = useState("");
  const [opts, setOpts] = useState(["Yes", "No"]);
  const [selected, setSelected] = useState<string>("");

  const polls = messages
    .map(m => {
      try {
        return JSON.parse(String(m.message)) as Poll;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Poll[];
  const latest = polls[polls.length - 1];

  const create = async () => {
    if (!question.trim()) return;
    const payload: Poll = { id: crypto.randomUUID(), question, options: opts };
    await publish(JSON.stringify(payload), { persist: true });
    setQuestion("");
  };

  const voteTopic = latest ? `POLL_VOTE_${latest.id}` : "POLL_VOTE_NONE";
  const { publish: publishVote, messages: votes } = usePubSub(voteTopic);

  const onVote = async () => {
    if (!latest || !selected) return;
    await publishVote(selected, { persist: false });
    setSelected("");
  };

  const tally = useMemo(() => {
    if (!latest) return {} as Record<string, number>;
    const counts: Record<string, number> = Object.fromEntries(latest.options.map(o => [o, 0]));
    votes.forEach(v => {
      const val = String(v.message);
      if (Object.prototype.hasOwnProperty.call(counts, val)) counts[val] += 1;
    });
    return counts;
  }, [votes, latest]);

  return (
    <div className="bg-[var(--white)] border border-gray-200 rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Polls</h3>
      <div className="mb-3">
        <input
          className="w-full border border-gray-300 rounded px-2 py-1 mb-2"
          placeholder="Poll question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <div className="flex gap-2 mb-2">
          {opts.map((o, i) => (
            <input
              key={`${i}-${o}`}
              className="flex-1 border border-gray-300 rounded px-2 py-1"
              value={o}
              onChange={e => {
                const cp = [...opts];
                cp[i] = e.target.value;
                setOpts(cp);
              }}
            />
          ))}
          <button
            className="px-2 py-1 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]"
            onClick={() => setOpts(o => [...o, "Option"])}
          >
            +
          </button>
        </div>
        <button className="px-3 py-1 bg-[var(--accent)] text-white rounded hover:bg-[var(--secondary)]" onClick={create}>
          Create Poll
        </button>
      </div>

      {latest ? (
        <div className="p-2 bg-[var(--neutral-light)] rounded">
          <div className="font-semibold mb-2">{latest.question}</div>
          <div className="flex flex-col gap-2">
            {latest.options.map(o => (
              <label key={o} className="flex items-center gap-2">
                <input type="radio" name="poll" value={o} checked={selected === o} onChange={e => setSelected(e.target.value)} />
                <span>{o}</span>
                <span className="ml-auto text-xs text-[var(--neutral-medium)]">{tally[o] ?? 0}</span>
              </label>
            ))}
          </div>
          <button className="mt-2 px-3 py-1 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]" onClick={onVote}>
            Vote
          </button>
        </div>
      ) : (
        <div className="text-gray-500">No poll yet.</div>
      )}
    </div>
  );
}
