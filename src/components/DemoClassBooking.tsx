//src/components/DemoClassBooking.tsx
'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, Button, Icon } from '@/components/ui';


interface Slot {
  id: string;
  coach_id: string;
  coach_name?: string;
  slot_start: string;
  slot_end: string;
  is_booked: boolean;
  student_id?: string | null;
}


async function fetchAvailableSlots(from: string, to: string) {
  const res = await fetch(`/api/slots?from=${from}&to=${to}`, { cache: 'no-store' });
  const data = await res.json();
  if (!data.ok) return [];
  return data.slots;
}

const DemoClassBooking: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Record<string, Slot[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const router = useRouter();


  const fmt = (d: Date) => d.toLocaleDateString('en-CA');

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.user) setCurrentUser(data.user);
      })
      .catch(() => setCurrentUser(null));
  }, []);

  // Fetch available slots for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const from = fmt(new Date(year, month, 1));
    const to = fmt(new Date(year, month + 1, 0));

    fetchAvailableSlots(from, to).then((slots) => {
      const grouped: Record<string, Slot[]> = {};
      slots.forEach((s: Slot) => {
        const dateObj = new Date(s.slot_start);
        const dateKey = dateObj.toLocaleDateString('en-CA'); // gives YYYY-MM-DD in local time

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(s);
      });
      setAvailableSlots(grouped);
    });
  }, [currentMonth]);

  // Calendar generation
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Handle interactions
  const handleDateClick = (date: Date) => {
    setSelectedDate(fmt(date));
    setSelectedSlot(null);
  };

  const handleSlotClick = (id: string) => setSelectedSlot(id);

  const handleBookDemo = async () => {
    if (!selectedDate || !selectedSlot) return;

    try {
      const selected = Object.values(availableSlots)
        .flat()
        .find((s) => s.id === selectedSlot);

      if (!selected) return;

      // Payload now includes coach_id directly from the slot
      const payload = {
        slot_id: selected.id,
        coach_id: selected.coach_id,
        slot_minutes: 60,
      };

      const res = await fetch('/api/student/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Booking failed');

      // Refresh slots after booking
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const from = fmt(new Date(year, month, 1));
      const to = fmt(new Date(year, month + 1, 0));
      const refreshed = await fetchAvailableSlots(from, to);

      const grouped: Record<string, Slot[]> = {};
      refreshed.forEach((s: Slot) => {
        const dateKey = new Date(s.slot_start).toLocaleDateString('en-CA');
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(s);
      });

      setAvailableSlots(grouped);
      // setIsBookingConfirmed(false);
      router.push('/classes');
    } catch (err) {
      console.error(err);
      alert('Booking failed. Try again.');
    }
  };





  const navigateMonth = (dir: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const n = new Date(prev);
      n.setMonth(prev.getMonth() + (dir === 'prev' ? -1 : 1));
      return n;
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  // UI rendering
  if (isBookingConfirmed) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size="lg" color="#10B981" />
          </div>
          <h3 className="text-2xl font-bold text-[#2C4A52] mb-2">Demo Class Booked!</h3>
          <p className="text-[#6B7280]">
            You’ve successfully booked a demo class. Check your email or dashboard for meeting details.
          </p>

        </div>
        <Button variant="primary" size="lg" onClick={() => setIsBookingConfirmed(false)}>
          Book Another Demo
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Skip Demo button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => router.push('/dashboard')}
        >
          Skip Demo
        </Button>
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-dark mb-2">Join a Demo Class</h2>
        <p className="text-neutral-medium">
          Experience our health and wellness classes with a free demo session
        </p>
      </div>

      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <Icon name="chevron-left" size="sm" className="mr-1" /> Previous
          </Button>
          <h3 className="text-xl font-bold text-neutral-dark">{monthName}</h3>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            Next <Icon name="chevron-right" size="sm" className="ml-1" />
          </Button>
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-sm font-semibold py-2 text-neutral-medium">
              {d}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            if (!day) return <div key={i} className="h-10" />;
            const dateKey = fmt(day);
            const hasSlots = availableSlots[dateKey]?.length > 0;
            const isSelected = selectedDate === dateKey;

            return (
              <button
                key={dateKey}
                onClick={() => handleDateClick(day)}
                disabled={!hasSlots}
                className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${isSelected
                  ? 'bg-teal-primary text-white shadow-md'
                  : hasSlots
                    ? 'bg-teal-light text-teal-dark hover:bg-teal-primary/20 hover:shadow-sm'
                    : 'bg-neutral-light text-neutral-medium cursor-not-allowed opacity-50'
                  }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        {/* Slots */}
        {selectedDate && availableSlots[selectedDate] && (
          <div className="border-t border-neutral-light pt-6">
            <h4 className="text-lg font-semibold text-neutral-dark mb-4">
              Available Slots for{' '}
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSlots[selectedDate].map((slot) => {
                const isMine = slot.student_id === currentUser?.id;
                const isBookedByOther = slot.is_booked && !isMine;

                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot.id)}
                    disabled={isBookedByOther}
                    className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${isBookedByOther
                      ? 'bg-neutral-light text-neutral-medium cursor-not-allowed opacity-50'
                      : selectedSlot === slot.id
                        ? 'border-teal-primary bg-teal-light text-teal-dark shadow-md'
                        : 'border-neutral-light hover:border-teal-primary hover:bg-teal-light/50 hover:shadow-sm'
                      }`}
                  >
                    <div className="font-medium">
                      {new Date(slot.slot_start).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-xs text-neutral-medium">
                      {isMine
                        ? '✔ Booked by You'
                        : isBookedByOther
                          ? 'Booked by another student'
                          : `Coach: ${slot.coach_name ?? 'Unknown'}`}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedSlot && (
              <div className="mt-6 text-center">
                <Button variant="primary" size="lg" onClick={handleBookDemo} className="px-8">
                  Book Demo Class
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DemoClassBooking;
