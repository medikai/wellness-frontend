'use client';

import { Card, Button, Icon } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface BookedClass {
  id: string;
  slotId?: string;
  date: string;
  time: string;
  type: string;
  bookedAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function ClassesPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#6B7280]">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2C4A52] mb-4">Please log in to view your classes</h1>
          <p className="text-[#6B7280]">You need to be logged in to see your booked classes.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C4A52] mb-2">My Classes</h1>
        <p className="text-[#6B7280]">View your booked classes and track your progress</p>
      </div>

      {/* Upcoming Classes */}
      {upcomingClasses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2C4A52] mb-6">Upcoming Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingClasses.map((classItem) => (
              <Card key={classItem.id} hover className="p-6 border-l-4 border-[#4CAF9D]">
                <div className="mb-4">
                  <span className="text-sm text-[#4CAF9D] font-medium">UPCOMING</span>
                  <h3 className="text-xl font-bold text-[#2C4A52] mt-1">
                    {classItem.type === 'demo' ? 'Demo Class' : 'Health & Wellness Class'}
                  </h3>
                  <p className="text-[#6B7280] mt-1">
                    {formatClassDate(classItem.date, classItem.time)}
                  </p>
                </div>
                <p className="text-sm text-[#6B7280] mb-4">
                  {classItem.type === 'demo' 
                    ? 'Experience our health and wellness classes with this free demo session.'
                    : 'Join our live health and wellness class designed for your needs.'
                  }
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">
                    {classItem.type === 'demo' ? 'Free Demo' : 'Included in Plan'}
                  </span>
                  <Button variant="primary" size="md">
                    Join Class
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2C4A52] mb-6">Completed Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedClasses.map((classItem) => (
              <Card key={classItem.id} className="p-6 border-l-4 border-green-500">
                <div className="mb-4">
                  <span className="text-sm text-green-500 font-medium">COMPLETED</span>
                  <h3 className="text-xl font-bold text-[#2C4A52] mt-1">
                    {classItem.type === 'demo' ? 'Demo Class' : 'Health & Wellness Class'}
                  </h3>
                  <p className="text-[#6B7280] mt-1">
                    {formatClassDate(classItem.date, classItem.time)}
                  </p>
                </div>
                <p className="text-sm text-[#6B7280] mb-4">
                  Great job! You completed this class successfully.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-500 font-medium">
                    ✓ Completed
                  </span>
                  <Button variant="outline" size="md">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Classes Message */}
      {bookedClasses.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mb-6">
            <Icon name="calendar" size="xl" color="#9CA3AF" className="mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#2C4A52] mb-2">No Classes Booked</h3>
            <p className="text-[#6B7280]">
              You haven&apos;t booked any classes yet. Start by booking a demo class to experience our health and wellness programs.
            </p>
          </div>
          <Button variant="primary" size="lg">
            Book a Demo Class
          </Button>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#2C4A52] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="p-6 text-center">
            <Icon name="calendar" size="lg" color="#4CAF9D" className="mx-auto mb-4" />
            <h3 className="font-semibold text-[#2C4A52] mb-2">Book New Class</h3>
            <p className="text-sm text-[#6B7280] mb-4">Schedule your next health session</p>
            <Button variant="outline" size="md" className="w-full">
              Book Now
            </Button>
          </Card>
          
          <Card hover className="p-6 text-center">
            <Icon name="heart" size="lg" color="#4CAF9D" className="mx-auto mb-4" />
            <h3 className="font-semibold text-[#2C4A52] mb-2">View Progress</h3>
            <p className="text-sm text-[#6B7280] mb-4">Track your health journey</p>
            <Button variant="outline" size="md" className="w-full">
              View Progress
            </Button>
          </Card>
          
          <Card hover className="p-6 text-center">
            <Icon name="settings" size="lg" color="#4CAF9D" className="mx-auto mb-4" />
            <h3 className="font-semibold text-[#2C4A52] mb-2">Manage Classes</h3>
            <p className="text-sm text-[#6B7280] mb-4">Update your class preferences</p>
            <Button variant="outline" size="md" className="w-full">
              Manage
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}