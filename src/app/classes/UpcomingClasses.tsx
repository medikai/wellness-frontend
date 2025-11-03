//src/app/classes/UpcomingClasses.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

type LessonItem = {
    id: string;
    title: string;
    starts_at: string;
    ends_at: string | null;
    meeting_id: string | null;
    coach_id: string | null;
    student_id: string | null;
    coach_name?: string;   // ✅ add this
    student_name?: string; // ✅ add this
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
        <section className="mt-6">
            <h2 className="text-xl font-semibold text-[#2C4A52]">Upcoming Classes</h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
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


                    return (
                        <li key={lesson.id} className="rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-[#6B7280]">{when}</div>
                            <div className="mt-1 text-base font-medium">
                                {lesson.title ?? 'Demo class'}
                            </div>

                            {/* Show who this class is with */}
                            <div className="text-sm text-[#4B5563] mt-1">
                                {isCoach
                                    ? `With: ${lesson.student_name ?? 'Student'}`
                                    : `Coach: ${lesson.coach_name ?? 'Coach'}`}

                            </div>

                            <div className="mt-3 flex items-center gap-3">
                                {canJoin ? (
                                    <Link
                                        href={href}
                                        className="rounded bg-[#22C7A3] px-3 py-2 text-sm text-white hover:opacity-90"
                                    >
                                        {isCoach ? 'Start Class' : 'Join Class'}
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="cursor-not-allowed rounded bg-gray-300 px-3 py-2 text-sm text-white"
                                    >
                                        Meeting Pending
                                    </button>
                                )}
                                <span className="text-xs text-[#6B7280]">
                                    Room: {lesson.meeting_id ?? 'pending'}
                                </span>
                            </div>
                        </li>
                    );

                })}
            </ul>
        </section>
    );
}
