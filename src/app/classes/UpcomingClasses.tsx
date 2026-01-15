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
            <section className="mt-6">
                <h2 className="text-xl font-semibold text-[#2C4A52]">Upcoming Classes</h2>
                <div className="mt-3 text-[#6B7280]">Loading…</div>
            </section>
        );

    if (items.length === 0)
        return (
            <section className="mt-6">
                <h2 className="text-xl font-semibold text-[#2C4A52]">Upcoming Classes</h2>
                <div className="mt-3 text-[#6B7280]">No upcoming classes.</div>
            </section>
        );

    return (
        <section className="mt-8">
            <h2 className="text-2xl font-bold text-[#2C4A52] mb-6">Your Upcoming Schedule</h2>
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                        <li key={lesson.id} className="group relative bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl hover:border-teal-100 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-4xl">📹</span>
                            </div>

                            <div className="text-sm font-bold tracking-wide text-teal-600 uppercase mb-2">{when}</div>

                            <div className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                                {lesson.title ?? 'Health & Wellness Session'}
                            </div>

                            <div className="text-sm text-gray-500 mb-6 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-teal-400 mr-2"></span>
                                {isCoach
                                    ? `Student: ${lesson.student_name ?? 'Guest Student'}`
                                    : `Coach: ${lesson.coach_name ?? 'Your Coach'}`}
                            </div>

                            <div className="mt-auto">
                                {canJoinNow ? (
                                    <Link
                                        href={href}
                                        className="block w-full text-center rounded-xl bg-teal-primary px-4 py-3 text-base font-bold text-white hover:bg-teal-700 hover:shadow-lg transition-all transform active:scale-[0.98]"
                                    >
                                        {isCoach ? 'Start Class' : 'Join Class Now'}
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="block w-full text-center rounded-xl bg-gray-100 px-4 py-3 text-base font-medium text-gray-400 cursor-not-allowed"
                                    >
                                        {canJoin ? 'Join (Coming Soon)' : 'Class Pending'}
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}

                {/* Blurred/Locked placeholder to fill negative space and create curiosity */}
                <li className="relative bg-gray-50 rounded-2xl border-2 border-gray-100 p-6 opacity-60 overflow-hidden select-none">
                    <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6 bg-white/30">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mb-3 flex items-center justify-center">
                            <span className="text-xl">🔒</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-500 mb-1">More Classes Coming</h3>
                        <p className="text-sm text-gray-400">Book your next waylness journey to fill this spot!</p>

                    </div>

                    {/* Dummy content behind blur */}
                    <div className="text-sm font-bold text-gray-300 uppercase mb-2">Tomorrow, 10:00 AM</div>
                    <div className="text-xl font-bold text-gray-300 mb-2">Yoga & Meditation</div>
                    <div className="text-sm text-gray-300 mb-6">Coach: Sarah</div>
                    <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                </li>
            </ul>
        </section>
    );
}
