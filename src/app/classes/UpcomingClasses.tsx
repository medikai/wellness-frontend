//src/app/classes/UpcomingClasses.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Configurable flags
const ALLOW_EARLY_JOIN = true; // set true for testing, join button always enabled
const JOIN_BEFORE_MINUTES = 5; // enable join X minutes before class starts

type LessonItem = {
    id: string;
    title: string;
    starts_at: string;
    ends_at: string | null;
    meeting_id: string | null;
    coach_id: string | null;
    student_id: string | null;
    coach_name?: string;
    student_name?: string;
};

export default function UpcomingClasses() {
    const { user } = useAuth();
    const [items, setItems] = useState<LessonItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function load() {
            try {
                setLoading(true);
                const res = await fetch('/api/classes/upcoming', { cache: 'no-store' });
                const json = await res.json();
                if (json.ok) setItems(json.items || []);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [user]);

    if (!user) return null;

    if (loading)
        return (
            <section className="mt-8">
                <h2 className="text-2xl font-semibold text-[#2C4A52] mb-8">Upcoming Classes</h2>
                <div className="text-[#6B7280]">Loading…</div>
            </section>
        );

    if (items.length === 0)
        return (
            <section className="mt-8">
                <h2 className="text-2xl font-semibold text-[#2C4A52] mb-8">Upcoming Classes</h2>
                <div className="text-[#6B7280]">No upcoming classes.</div>
            </section>
        );

    // Create blurred placeholder boxes for upcoming/locked content
    const placeholderCount = Math.max(0, 3 - items.length);
    const placeholderItems = Array.from({ length: placeholderCount }, (_, i) => ({
        id: `placeholder-${i}`,
        isPlaceholder: true,
    }));

    return (
        <section className="mt-8">
            <h2 className="text-2xl font-semibold text-[#2C4A52] mb-8">Upcoming Classes</h2>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((lesson) => {
                    const start = new Date(lesson.starts_at);
                    const when = start.toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                    });

                    const isCoach = lesson.coach_id === user.id;
                    const mode = isCoach ? 'host' : 'join';
                    const canJoin = !!lesson.meeting_id;

                    const href = canJoin
                        ? `/meeting?room=${lesson.meeting_id}&mode=${mode}&coach_id=${lesson.coach_id}`
                        : '#';

                    // Time until class in minutes
                    const now = new Date();
                    const diffMinutes = (start.getTime() - now.getTime()) / 60000;

                    // Join allowed if meeting exists AND time threshold reached OR override
                    const canJoinNow =
                        canJoin && (ALLOW_EARLY_JOIN || diffMinutes <= JOIN_BEFORE_MINUTES);

                    return (
                        <li key={lesson.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <div className="text-sm text-[#6B7280] mb-3">{when}</div>

                            <div className="mt-2 mb-2 text-lg font-semibold text-[#2C4A52]">
                                {lesson.title ?? 'Demo class'}
                            </div>

                            <div className="text-sm text-[#4B5563] mt-2 mb-4">
                                {isCoach
                                    ? `With: ${lesson.student_name ?? 'Student'}`
                                    : `Coach: ${lesson.coach_name ?? 'Coach'}`}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                                {canJoinNow ? (
                                    <Link
                                        href={href}
                                        className="rounded bg-[#22C7A3] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                                    >
                                        {isCoach ? 'Start Class' : 'Join Class'}
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="cursor-not-allowed rounded bg-gray-300 px-4 py-2 text-sm text-white"
                                    >
                                        {canJoin ? 'Join Disabled' : 'Meeting Pending'}
                                    </button>
                                )}

                                <span className="text-xs text-[#6B7280]">
                                    Room: {lesson.meeting_id ?? 'pending'}
                                </span>
                            </div>
                        </li>
                    );
                })}
                
                {/* Blurred/Subdued placeholder boxes for upcoming/locked content */}
                {placeholderItems.map((placeholder) => (
                    <li 
                        key={placeholder.id} 
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-md opacity-40 blur-[1px] pointer-events-none relative overflow-hidden"
                    >
                        {/* Lock icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
                            <div className="text-center">
                                <svg 
                                    className="w-8 h-8 text-gray-400 mx-auto mb-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                    />
                                </svg>
                                <p className="text-xs text-gray-500 font-medium">Coming Soon</p>
                            </div>
                        </div>
                        
                        <div className="text-sm text-[#6B7280] mb-3">Upcoming session</div>
                        <div className="mt-2 mb-2 text-lg font-semibold text-[#2C4A52]">
                            New Class Available Soon
                        </div>
                        <div className="text-sm text-[#4B5563] mt-2 mb-4">
                            Additional wellness classes coming your way
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                            <button
                                disabled
                                className="rounded bg-gray-300 px-4 py-2 text-sm text-white cursor-not-allowed"
                            >
                                Locked
                            </button>
                            <span className="text-xs text-[#6B7280]">
                                Available soon
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
