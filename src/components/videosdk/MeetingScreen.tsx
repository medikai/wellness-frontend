"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMeeting, useParticipant, usePubSub } from "@videosdk.live/react-sdk";

export default function MeetingScreen({ isHost }: { isHost: boolean }) {
  const [joined, setJoined] = useState(false);
  const [sharing, setSharing] = useState(false);

  const {
    join, leave, toggleMic, toggleWebcam,
    enableScreenShare, disableScreenShare,
    localParticipant, participants,
  } = useMeeting({
    onMeetingJoined: () => setJoined(true),
    onMeetingLeft: () => setJoined(false),
  });

  // run once, but satisfy deps rule
  const didJoinRef = useRef(false);
  useEffect(() => {
    if (didJoinRef.current) return;
    didJoinRef.current = true;

    const t = setTimeout(() => { join(); }, 300);
    return () => {
      clearTimeout(t);
      try { leave(); } catch {}
    };
  }, [join, leave]);

  const localId = localParticipant?.id || "";

  const participantIds = useMemo(() => {
    const s = new Set<string>();
    participants.forEach((_, pid) => s.add(pid));
    if (localId) s.add(localId);
    return Array.from(s);
  }, [participants, localId]);

  const onShare = async () => {
    if (!joined) return;
    try {
      if (!sharing) { await enableScreenShare(); setSharing(true); }
      else { await disableScreenShare(); setSharing(false); }
    } catch (err) { console.error("screen share error", err); }
  };

  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      <div className="flex flex-col flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
        <Toolbar onMic={toggleMic} onCam={toggleWebcam} onShare={onShare} onLeave={() => leave()} joined={joined} />
        <VideoGrid participantIds={participantIds} localId={localId} />
      </div>

      <div className="flex flex-col w-1/3 gap-4">
        <ChatPanel />
        {isHost && <PollsPanel />}
      </div>
    </div>
  );
}

function Toolbar(props: { onMic: () => void; onCam: () => void; onShare: () => void; onLeave: () => void; joined: boolean }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-[var(--white)] border-b border-gray-200">
      {props.joined ? (
        <>
          <button className="px-3 py-1 bg-[var(--neutral-light)] hover:bg-[var(--neutral-medium)] rounded" onClick={props.onMic}>Mic</button>
          <button className="px-3 py-1 bg-[var(--neutral-light)] hover:bg-[var(--neutral-medium)] rounded" onClick={props.onCam}>Cam</button>
          <button className="px-3 py-1 bg-[var(--neutral-light)] hover:bg-[var(--neutral-medium)] rounded" onClick={props.onShare}>Share</button>
          <button className="px-3 py-1 bg-[var(--accent)] text-white hover:bg-[var(--secondary)] rounded" onClick={props.onLeave}>End</button>
        </>
      ) : (
        <span className="text-gray-500">Joining…</span>
      )}
    </div>
  );
}

function ParticipantTile({ id, isLocal }: { id: string; isLocal: boolean }) {
  const { webcamStream, micStream, micOn, webcamOn, displayName } = useParticipant(id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // webcam video
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const vms = new MediaStream();
    if (webcamOn && webcamStream?.track) vms.addTrack(webcamStream.track);

    // set srcObject with a safe cast instead of ts-expect-error
    (videoEl as unknown as { srcObject: MediaStream | null }).srcObject = vms;
    videoEl.muted = isLocal;
    videoEl.play().catch(() => {});

    return () => {
      (videoEl as unknown as { srcObject: MediaStream | null }).srcObject = null;
    };
  }, [webcamOn, webcamStream, isLocal]);

  // remote audio
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || isLocal) return;

    const ams = new MediaStream();
    if (micOn && micStream?.track) ams.addTrack(micStream.track);

    (audioEl as unknown as { srcObject: MediaStream | null }).srcObject = ams;
    audioEl.play().catch(() => {});
  }, [micOn, micStream, isLocal]);

  return (
    <div className="bg-black rounded-lg overflow-hidden flex flex-col">
      <video ref={videoRef} autoPlay playsInline className="w-full h-auto bg-black" />
      {!isLocal && <audio ref={audioRef} autoPlay />}
      <div className="p-2 bg-[var(--white)] flex justify-between items-center">
        <span className="text-sm font-medium">{displayName || (isLocal ? "You" : "Guest")}</span>
        <span className="text-xs text-[var(--neutral-medium)]">{micOn ? "mic on" : "mic off"}</span>
      </div>
    </div>
  );
}

function VideoGrid({ participantIds, localId }: { participantIds: string[]; localId: string }) {
  return (
    <div className="p-3 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {participantIds.map(pid => <ParticipantTile key={pid} id={pid} isLocal={pid === localId} />)}
    </div>
  );
}

function ChatPanel() {
  const { publish, messages } = usePubSub("CHAT", { onMessageReceived: () => {} });
  const [text, setText] = useState("");

  const send = async () => {
    if (!text.trim()) return;
    await publish(text, { persist: true });
    setText("");
  };

  return (
    <div className="bg-[var(--white)] border border-gray-200 rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Chat</h3>
      <div className="flex-1 overflow-y-auto bg-[var(--neutral-light)] p-2 rounded mb-2">
        {messages.map((m, i) => (
          <div key={`${i}-${m.timestamp}`} className="mb-1">
            <strong>{m.senderName}</strong>: {String(m.message)}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border border-gray-300 rounded px-2 py-1" value={text} onChange={e => setText(e.target.value)} placeholder="Message" />
        <button className="px-3 py-1 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]" onClick={send}>Send</button>
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
    .map(m => { try { return JSON.parse(String(m.message)) as Poll; } catch { return null; } })
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

  const tally = useMemo<Record<string, number>>(() => {
    if (!latest) return {};
    const counts: Record<string, number> = Object.fromEntries(latest.options.map(o => [o, 0]));
    votes.forEach(v => {
      const val = String(v.message);
      if (counts[val] !== undefined) counts[val] += 1;
    });
    return counts;
  }, [votes, latest]);

  return (
    <div className="bg-[var(--white)] border border-gray-200 rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Polls</h3>
      <div className="mb-3">
        <input className="w-full border border-gray-300 rounded px-2 py-1 mb-2" placeholder="Poll question" value={question} onChange={e => setQuestion(e.target.value)} />
        <div className="flex gap-2 mb-2">
          {opts.map((o, i) => (
            <input
              key={`${i}-${o}`}
              className="flex-1 border border-gray-300 rounded px-2 py-1"
              value={o}
              onChange={e => { const cp = [...opts]; cp[i] = e.target.value; setOpts(cp); }}
            />
          ))}
          <button className="px-2 py-1 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]" onClick={() => setOpts(o => [...o, "Option"])}>+</button>
        </div>
        <button className="px-3 py-1 bg-[var(--accent)] text-white rounded hover:bg-[var(--secondary)]" onClick={create}>Create Poll</button>
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
          <button className="mt-2 px-3 py-1 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]" onClick={onVote}>Vote</button>
        </div>
      ) : (
        <div className="text-gray-500">No poll yet.</div>
      )}
    </div>
  );
}
