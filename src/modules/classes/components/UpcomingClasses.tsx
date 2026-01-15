'use client'

import React from 'react'
import { Card, Button } from '@/components/ui'
import { useRouter } from 'next/navigation'

interface BookedClass {
  id: string;
  slotId?: string;
  date: string;
  time: string;
  type: string;
  bookedAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface UpcomingClassesProps {
  upcomingClasses: BookedClass[];
}

const UpcomingClasses: React.FC<UpcomingClassesProps> = ({ upcomingClasses }) => {
  const router = useRouter();

  const formatClassDate = (date: string, time: string): string => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return `${dateObj.toLocaleDateString('en-US', options)} at ${time}`;
  };

  if (upcomingClasses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-medium text-lg">No upcoming classes scheduled</p>
      </div>
    );
  }

  const handleJoinClass = (classItem: BookedClass) => {
    // For demo classes, redirect to course page
    if (classItem.type === 'demo') {
      router.push('/course/1'); // Using dummy course ID
    } else {
      // For live classes, redirect to join page
      router.push('/join');
    }
  };


  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-neutral-dark mb-6">Upcoming Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingClasses.map((classItem) => (
          <Card key={classItem.id} hover className="p-6 border-l-4 border-teal-primary">
            <div className="mb-4">
              <span className="text-sm text-teal-primary font-semibold uppercase tracking-wide">Upcoming</span>
              <h3 className="text-xl font-bold text-neutral-dark mt-2">
                {classItem.type === 'demo' ? 'Demo Class' : 'Health & Wellness Class'}
              </h3>
              <p className="text-neutral-medium mt-1">
                {formatClassDate(classItem.date, classItem.time)}
              </p>
            </div>
            <p className="text-sm text-neutral-medium mb-6 leading-relaxed">
              {classItem.type === 'demo'
                ? 'Experience our health and wellness classes with this free demo session.'
                : 'Join our live health and wellness class designed for your needs.'
              }
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-light">
              <span className="text-sm text-neutral-medium font-medium">
                {classItem.type === 'demo' ? 'Free Demo' : 'Included in Plan'}
              </span>
              <Button
                variant="default"
                size="default"
                onClick={() => handleJoinClass(classItem)}
              >
                {classItem.type === 'demo' ? 'Start Self-Paced' : 'Join Class'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default UpcomingClasses