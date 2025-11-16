//src/modules/classes/components/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import UpcomingClasses from './UpcomingClasses';
import CompletedClasses from './CompletedClasses';
import NoClassesMessage from './NoClassesMessage';
import QuickActions from './QuickActions';

interface BookedClass {
  id: string;
  slotId?: string;
  date: string;
  time: string;
  type: string;
  bookedAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const Classes = () => {
  const { user, isLoading } = useAuth();
  const [bookedClasses, setBookedClasses] = useState<BookedClass[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<BookedClass[]>([]);
  const [completedClasses, setCompletedClasses] = useState<BookedClass[]>([]);

  useEffect(() => {
    if (user) {
      // Load demo bookings
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      
      // Load regular class bookings (if any)
      const regularBookings = JSON.parse(localStorage.getItem('classBookings') || '[]');
      
      const allBookings = [...demoBookings, ...regularBookings].map((booking: BookedClass) => ({
        ...booking,
        id: booking.slotId || booking.id,
        status: getClassStatus(booking.date, booking.time)
      }));

      setBookedClasses(allBookings);
      setUpcomingClasses(allBookings.filter((cls: BookedClass) => cls.status === 'upcoming'));
      setCompletedClasses(allBookings.filter((cls: BookedClass) => cls.status === 'completed'));
    }
  }, [user]);

  const getClassStatus = (date: string, time: string): 'upcoming' | 'completed' | 'cancelled' => {
    const classDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    if (classDateTime < now) {
      return 'completed';
    }
    return 'upcoming';
  };

  const formatClassDate = (date: string, time: string) => {
    const classDate = new Date(`${date}T${time}`);
    return classDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#2C4A52] mb-4">Please log in to view your classes</h1>
        <p className="text-[#6B7280]">You need to be logged in to see your booked classes.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <UpcomingClasses 
        upcomingClasses={upcomingClasses} 
      />
      <CompletedClasses 
        completedClasses={completedClasses} 
        formatClassDate={formatClassDate} 
      />
      {bookedClasses.length === 0 && <NoClassesMessage />}
      <QuickActions />
    </>
  );
};

export default Classes;