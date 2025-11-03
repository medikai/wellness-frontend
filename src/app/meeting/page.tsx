'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ClientMeeting = dynamic(() => import('@/components/videosdk/ClientMeeting'), { ssr: false });

export default function MeetingPage() {
  const { user } = useAuth();
  const params = useSearchParams();

  const roomId = params.get('room') || '';
  const forcedMode = params.get('mode');
  const coachId = params.get('coach_id');

  // ✅ no any cast, fully typed
  const isCoach = Boolean(user && coachId && coachId === user.id);

  const mode: 'host' | 'join' = (forcedMode as 'host' | 'join') || (isCoach ? 'host' : 'join');

  if (!roomId) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Missing room ID. Please open from your class list.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--background)]">
      <ClientMeeting mode={mode} />
    </div>
  );
}
