"use client";

import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import VideoGrid from "@/components/VideoGrid";
import { useRoster } from "@/hooks/useRoster";

// Course Content Component
const CourseContent = memo(function CourseContent() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Content</h3>
      <ul className="space-y-2">
        <li className="flex items-center text-sm text-gray-700">
          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#4CAF9D' }}></div>
          Benefits of chair yoga
        </li>
        <li className="flex items-center text-sm text-gray-700">
          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#4CAF9D' }}></div>
          Focus on slow movements
        </li>
      </ul>
    </div>
  );
});

// Quiz Component
const QuizSection = memo(function QuizSection() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("A. Chair yoga");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (selectedAnswer) {
      setIsSubmitted(true);
    }
  }, [selectedAnswer]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Quiz</h3>
      <div className="space-y-3">
        <p className="text-sm text-gray-700">Which exercise helps joint flexibility?</p>
        <div className="space-y-2">
          {["A. Chair yoga", "B. Weightlifting", "C. Running"].map((option) => (
            <label
              key={option}
              className={`block p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedAnswer === option
                  ? "border-teal-500 bg-white"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="quiz"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="sr-only"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || isSubmitted}
          className="w-full py-2 px-4 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          style={{ backgroundColor: '#2D7D6B' }}
        >
          {isSubmitted ? "Submitted" : "Submit"}
        </button>
      </div>
    </div>
  );
});

// Game Component
const GameSection = memo(function GameSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Game</h3>
      <div className="space-y-3">
        <p className="text-sm text-gray-700">Follow the Pose</p>
        <button 
          className="w-full py-2 px-4 text-white rounded-lg hover:opacity-90 text-sm font-medium"
          style={{ backgroundColor: '#2D7D6B' }}
        >
          Start
        </button>
      </div>
    </div>
  );
});

// Interactive Controls Component
const InteractiveControls = memo(function InteractiveControls({ 
  onFullscreen, 
  onMuteToggle, 
  onVideoToggle, 
  onScreenShare, 
  onEndCall,
  onChatToggle,
  isMuted,
  isVideoOff,
  isScreenSharing,
  showChat
}: { 
  onFullscreen: () => void;
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  onScreenShare: () => void;
  onEndCall: () => void;
  onChatToggle: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  showChat: boolean;
}) {
  return (
    <div className="flex gap-3 mt-4">
      {/* Mute/Unmute Button */}
      <button 
        onClick={onMuteToggle}
        className={`w-12 h-12 rounded-3xl flex items-center justify-center hover:opacity-90 transition-colors ${
          isMuted ? 'bg-red-500' : 'bg-gray-600'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          {isMuted ? (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          ) : (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>

          )}
        </svg>
      </button>

      {/* Video On/Off Button */}
      <button 
        onClick={onVideoToggle}
        className={`w-12 h-12 rounded-3xl flex items-center justify-center hover:opacity-90 transition-colors ${
          isVideoOff ? 'bg-red-500' : 'bg-gray-600'
        }`}
        title={isVideoOff ? 'Turn on video' : 'Turn off video'}
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          {isVideoOff ? (
            <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.55-.18L19.73 21 21 19.73 3.27 2zM5 16V8h1.73l8 8H5z"/>
          ) : (
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          )}
        </svg>
      </button>

      {/* Screen Share Button */}
      <button 
        onClick={onScreenShare}
        className={`w-12 h-12 rounded-3xl flex items-center justify-center hover:opacity-90 transition-colors ${
          isScreenSharing ? 'bg-blue-600' : 'bg-blue-400'
        }`}
        title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-2v1H7V1H5v1H4.5C3.67 2 3 2.67 3 3.5v15C3 19.33 3.67 20 4.5 20h15c.83 0 1.5-.67 1.5-1.5v-15C21 2.67 20.33 2 19.5 2z"/>
        </svg>
      </button>

      {/* Chat Button */}
      <button 
        onClick={onChatToggle}
        className={`w-12 h-12 rounded-3xl flex items-center justify-center hover:opacity-90 transition-colors relative ${
          showChat ? 'bg-blue-600' : 'bg-blue-400'
        }`}
        title="Toggle Chat"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
        <span className="absolute -top-1 -right-1 bg-white text-blue-400 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">2</span>
      </button>

      {/* End Call Button */}
      <button 
        onClick={onEndCall}
        className="w-12 h-12 rounded-3xl flex items-center justify-center hover:opacity-90 transition-colors bg-red-500"
        title="End Call"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </button>

      {/* Fullscreen Button */}
      <button 
        onClick={onFullscreen}
        className="w-12 h-12 rounded-3xl flex items-center justify-center hover:opacity-90 transition-colors" 
        style={{ backgroundColor: '#4CAF9D' }}
        title="Toggle Fullscreen"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
        </svg>
      </button>
    </div>
  );
});

// Speech Bubble Component
function SpeechBubble({ message, isVisible }: { message: string; isVisible: boolean }) {
  if (!isVisible) return null;
  
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <span className="text-sm text-gray-800">{message}</span>
      </div>
      <div className="absolute -bottom-1 right-4 w-3 h-3 bg-white transform rotate-45"></div>
    </div>
  );
}

// Real Chat Component using VideoSDK
const ChatPanel = memo(function ChatPanel() {
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
      const ev = e as CustomEvent<{ emoji?: { unicode: string }; unicode?: string }>;
      const unicode = ev.detail.emoji?.unicode || ev.detail.unicode || "";
      insertEmoji(unicode);
      setShowPicker(false);
    };
    el.addEventListener("emoji-click", onEmoji as EventListener);
    return () => el.removeEventListener("emoji-click", onEmoji as EventListener);
  }, [showPicker, insertEmoji]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-0 flex flex-col min-h-0 h-full">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <h3 className="text-base font-semibold">Group chat</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded bg-gray-100">All messages</span>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {items.map((m) => {
          const mine = m.fromId === meId;
          const bubble =
            [
              "inline-flex w-auto max-w-[88%] min-w-[12ch] sm:min-w-[16ch]",
              "px-4 py-2 rounded-2xl text-[15px] leading-6",
              "whitespace-pre-line break-words [overflow-wrap:break-word] [word-break:normal]",
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
});

export default function JoineeMeetingScreen() {
  const [joined, setJoined] = useState(false);
  const [wantMic] = useState(true);
  const [wantCam] = useState(true);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [speechMessage] = useState("Great job, Mary!");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const joiningRef = useRef(false);
  const [showRejoin, setShowRejoin] = useState(false);

  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  // Timer state for actual meeting time
  const [nowTs, setNowTs] = useState<number>(Date.now());
  const [meetingStartTime, setMeetingStartTime] = useState<number | null>(null);

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
  } = useMeeting({
    onMeetingJoined: async () => {
      setJoined(true);
      setShowRejoin(false);
      setMeetingStartTime(Date.now()); // Set actual meeting start time
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

  // Control functions
  const handleMuteToggle = useCallback(async () => {
    try {
      await toggleMic();
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Failed to toggle mic:', error);
    }
  }, [toggleMic, isMuted]);

  const handleVideoToggle = useCallback(async () => {
    try {
      await toggleWebcam();
      setIsVideoOff(!isVideoOff);
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  }, [toggleWebcam, isVideoOff]);

  const handleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        await disableScreenShare();
        setIsScreenSharing(false);
      } else {
        await enableScreenShare();
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
    }
  }, [isScreenSharing, enableScreenShare, disableScreenShare]);

  const handleEndCall = useCallback(async () => {
    try {
      await leave();
    } catch (error) {
      console.error('Failed to leave meeting:', error);
    }
  }, [leave]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        console.warn('Fullscreen request failed');
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        console.warn('Exit fullscreen failed');
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Timer update - update every second for accurate timing
  useEffect(() => {
    const t = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Calculate actual meeting elapsed time
  const elapsed = useMemo(() => {
    if (!meetingStartTime) return 0;
    return Math.max(0, Math.floor((nowTs - meetingStartTime) / 1000));
  }, [meetingStartTime, nowTs]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-hide speech bubble after 5 seconds
  useEffect(() => {
    if (showSpeechBubble) {
      const timer = setTimeout(() => {
        setShowSpeechBubble(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSpeechBubble]);

  const safeJoin = useCallback(async () => {
    if (joiningRef.current) return;
    joiningRef.current = true;
    try {
      await join();
    } catch (err) {
      console.error("Join failed:", err);
    } finally {
      joiningRef.current = false;
    }
  }, [join]);

  // Optimized join effect - only run once
  useEffect(() => {
    const t = setTimeout(() => {
      safeJoin();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove safeJoin dependency to prevent multiple calls


  if (showRejoin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Rejoin Meeting</h2>
          <button
            onClick={safeJoin}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Rejoin
          </button>
        </div>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} style={{ backgroundColor: '#2D7D6B' }}>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Progress Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4CAF9D' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">Health Tech</span>
            </div>
            
            {/* Progress Bar - Show actual meeting progress */}
            <div className="flex-1 mx-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((elapsed / 3600) * 100, 100)}%`, // Show progress over 1 hour max
                    backgroundColor: '#F58220'
                  }}
                ></div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center space-x-3">
              {/* <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                </svg>
              </button>
              <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>
              <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90" style={{ backgroundColor: '#F58220' }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button> */}
              <InteractiveControls 
                onFullscreen={toggleFullscreen}
                onMuteToggle={handleMuteToggle}
                onVideoToggle={handleVideoToggle}
                onScreenShare={handleScreenShare}
                onEndCall={handleEndCall}
                onChatToggle={() => setShowChat(!showChat)}
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                isScreenSharing={isScreenSharing}
                showChat={showChat}
              />
            </div>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl p-6 h-full flex">
            {/* Left Side - Video Content */}
            <div className="flex-1 flex flex-col">
              {/* Title and Timer */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Live Chair Yoga</h2>
                <div className="text-lg font-semibold text-gray-700">
                  {formatTime(elapsed)}
                </div>
              </div>

              {/* Video Grid */}
              <div className="flex-1 relative">
                <VideoGrid
                  participantIds={Array.from(participants.keys())}
                  localId={localParticipant.id}
                  activeSpeakerId={activeSpeakerId || undefined}
                  pinnedId={pinnedId}
                  presenterId={presenterId}
                />
                
                {/* Speech Bubble Overlay */}
                <SpeechBubble message={speechMessage} isVisible={showSpeechBubble} />
              </div>

             
            </div>

            {/* Right Sidebar - Show in fullscreen with different layout */}
            <div className={`${isFullscreen ? 'w-96 ml-6' : 'w-80 ml-6'} ${showChat ? 'flex flex-col h-full' : 'space-y-4'}`}>
              {showChat ? (
                <div className="flex-1">
                  <ChatPanel />
                </div>
              ) : (
                <>
                  <CourseContent />
                  <QuizSection />
                  <GameSection />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}