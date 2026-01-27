"use client";
import ParticipantTile from "./tiles/ParticipantTile";
import ScreenShareTile from "./tiles/ScreenShareTile";

export default function VideoGrid({
  participantIds,
  localId,
  presenterId,
  pinnedId,
  activeSpeakerId,
  onPin,
}: {
  participantIds: string[];
  localId: string;
  presenterId?: string;
  pinnedId?: string | null;
  activeSpeakerId?: string;
  onPin?: (id: string | null) => void;
}) {
  // --- Screen share: stage + LEFT vertical strip ---
  if (presenterId) {
    const others = participantIds.filter((id) => id !== presenterId);
    return (
      <div className="p-4">
        <div className="flex gap-4">
          {/* Stage */}
          <div className="flex-1 min-w-0">
            <div className="relative w-full h-[min(74vh,calc(100vh-260px))] rounded-2xl shadow-lg border border-gray-100 overflow-hidden bg-white">
              <div className="absolute inset-3 rounded-xl overflow-hidden bg-black">
                <ScreenShareTile id={presenterId} />
              </div>
            </div>
          </div>

          {/* RIGHT vertical strip */}
          <div className="flex-shrink-0 w-40 md:w-48 lg:w-56 flex flex-col gap-3 overflow-y-auto pl-1">
            {others.map((pid) => (
              <div key={pid} className="w-full h-24 md:h-28 rounded-xl overflow-hidden">
                <ParticipantTile id={pid} isLocal={pid === localId} pinned={pinnedId === pid} onPin={onPin} compact />
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  const all = participantIds;
  const others = all.filter((id) => id !== localId);

  // --- 1-1 with PiP (unchanged) ---
  if (all.length === 2 && others.length === 1) {
    const remoteId = others[0];
    return (
      <div className="p-4">
        <div className="relative mx-auto w-full max-w-6xl h-[min(74vh,calc(100vh-260px))] rounded-2xl shadow-lg border border-gray-100 overflow-hidden bg-white">
          <div className="absolute inset-3 rounded-xl overflow-hidden bg-black">
            <ParticipantTile
              id={remoteId}
              isLocal={false}
              pinned={pinnedId === remoteId}
              onPin={onPin}
            />
          </div>

          {/* PiP local */}
          <div className="absolute bottom-5 right-5 w-56 h-32 md:w-64 md:h-36 border-2 border-white rounded-xl shadow overflow-hidden bg-black">
            <ParticipantTile id={localId} isLocal compact />
          </div>
        </div>
      </div>
    );
  }

  // --- Gallery (2+ participants): stage + LEFT vertical strip ---
  const candidateLarge =
    (pinnedId && all.includes(pinnedId)) ? pinnedId
      : (activeSpeakerId && all.includes(activeSpeakerId)) ? activeSpeakerId
        : others[0] || localId;

  const rest = all.filter((id) => id !== candidateLarge);

  return (
    <div className="p-4">
      <div className="flex gap-4">
        {/* Stage */}
        <div className="flex-1 min-w-0">
          <div className="relative w-full h-[min(74vh,calc(100vh-260px))] rounded-2xl shadow-lg border border-gray-100 overflow-hidden bg-white">
            <div className="absolute inset-3 rounded-xl overflow-hidden bg-black">
              <ParticipantTile
                id={candidateLarge}
                isLocal={candidateLarge === localId}
                pinned={pinnedId === candidateLarge}
                onPin={onPin}
              />
            </div>
          </div>
        </div>

        {/* RIGHT vertical strip */}
        <div className="flex-shrink-0 w-40 md:w-48 lg:w-56 flex flex-col gap-3 overflow-y-auto pl-1">
          {rest.map((pid) => (
            <div key={pid} className="w-full h-24 md:h-28 rounded-xl overflow-hidden">
              <ParticipantTile id={pid} isLocal={pid === localId} pinned={pinnedId === pid} onPin={onPin} compact />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
