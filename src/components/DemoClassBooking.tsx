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
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // Start of current week (Saturday)
    const today = new Date();
    const day = today.getDay();
    // Calculate days to subtract to get to Saturday (0 = Sunday, 6 = Saturday)
    const daysToSaturday = day === 6 ? 0 : (day === 0 ? 1 : 7 - day);
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - daysToSaturday);
    saturday.setHours(0, 0, 0, 0);
    return saturday;
  });
  const [availableSlots, setAvailableSlots] = useState<Record<string, Slot[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
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

  // Fetch available slots for the current week
  useEffect(() => {
    setIsLoading(true);
    const weekStart = new Date(currentWeekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // 7 days (Saturday to Friday)

    const from = fmt(weekStart);
    const to = fmt(weekEnd);

    fetchAvailableSlots(from, to).then((slots) => {
      const grouped: Record<string, Slot[]> = {};
      slots.forEach((s: Slot) => {
        const dateObj = new Date(s.slot_start);
        const dateKey = dateObj.toLocaleDateString('en-CA'); // gives YYYY-MM-DD in local time

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(s);
      });
      setAvailableSlots(grouped);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [currentWeekStart]);

  // Generate week days (Saturday to Friday)
  const generateWeekDays = () => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  // Handle interactions
  const handleDateClick = (date: Date) => {
    setSelectedDate(fmt(date));
    setSelectedSlot(null);
  };

  const handleSlotClick = (id: string) => setSelectedSlot(id);

  const handleBookDemo = async () => {
    if (!selectedDate || !selectedSlot) return;

    setIsBooking(true);
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
      const weekStart = new Date(currentWeekStart);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const from = fmt(weekStart);
      const to = fmt(weekEnd);
      const refreshed = await fetchAvailableSlots(from, to);

      const grouped: Record<string, Slot[]> = {};
      refreshed.forEach((s: Slot) => {
        const dateKey = new Date(s.slot_start).toLocaleDateString('en-CA');
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(s);
      });

      setAvailableSlots(grouped);
      // setIsBookingConfirmed(false);
      // Redirect to home page after successfully booking a demo
      router.push('/home');
    } catch (err) {
      console.error(err);
      alert('Booking failed. Try again.');
      setIsBooking(false);
    }
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
        <Button variant="default" size="lg" onClick={() => setIsBookingConfirmed(false)}>
          Book Another Demo
        </Button>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">

        <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center mb-2 sm:mb-3">Join a Demo Class</h1>
            <p className="text-sm sm:text-base text-gray-600 text-center max-w-3xl mx-auto">
              Experience our health and wellness classes with a free demo session. Select a date and time that works best for you.
            </p>
          </div>

          {/* Calendar Section */}
          <div className="mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
              Select a Date
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-12 sm:py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
                <span className="ml-4 text-lg text-gray-600">Loading schedule...</span>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-6 px-4 snap-x w-full max-w-full justify-start md:justify-center">
                  {weekDays.map((day, index) => {
                    const dateKey = fmt(day);
                    const hasSlots = availableSlots[dateKey]?.length > 0;
                    const isSelected = selectedDate === dateKey;
                    const isToday = fmt(new Date()) === dateKey;
                    const isTomorrow = fmt(new Date(new Date().setDate(new Date().getDate() + 1))) === dateKey;

                    const dayAbbr = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                    const dayNumber = day.getDate();
                    const monthAbbr = day.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                    const urgencyLabel = isToday ? 'Today' : (isTomorrow ? 'Tomorrow' : '');

                    return (
                      <button
                        key={dateKey}
                        onClick={() => hasSlots && handleDateClick(day)}
                        disabled={!hasSlots}
                        className={`
                          flex flex-col items-center justify-center 
                          min-w-[90px] sm:min-w-[110px] 
                          h-[110px] sm:h-[130px]
                          rounded-2xl transition-all duration-300 transform
                          snap-center
                          ${isSelected
                            ? 'bg-teal-primary text-white shadow-xl scale-110 ring-4 ring-teal-100'
                            : hasSlots
                              ? 'bg-white text-gray-700 border-2 border-gray-100 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1'
                              : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100' // plain contrast
                          }
                        `}
                      >
                        {urgencyLabel && !isSelected && (
                          <span className="absolute -top-3 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-orange-200">
                            {urgencyLabel}
                          </span>
                        )}

                        <span className={`text-xs font-bold tracking-widest mb-1 ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                          {dayAbbr}
                        </span>
                        <span className={`text-3xl sm:text-4xl font-extrabold mb-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                          {dayNumber}
                        </span>
                        <span className={`text-xs font-medium uppercase ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                          {monthAbbr}
                        </span>

                        {hasSlots && !isSelected && (
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Slots Section */}
          {!selectedDate && !isLoading && (
            <div className="text-center py-6 sm:py-8 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-500">Please select a date to view available time slots</p>
            </div>
          )}

          {selectedDate && availableSlots[selectedDate] && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 text-center sm:text-left">
                  Available Time Slots
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {availableSlots[selectedDate].length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p className="text-sm sm:text-base">No available slots for this date. Please select another date.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {availableSlots[selectedDate].map((slot) => {
                      const isMine = slot.student_id === currentUser?.id;
                      const isBookedByOther = slot.is_booked && !isMine;
                      const slotTime = new Date(slot.slot_start);
                      const slotEnd = new Date(slot.slot_end);

                      return (
                        <button
                          key={slot.id}
                          onClick={() => !isBookedByOther && handleSlotClick(slot.id)}
                          disabled={isBookedByOther}
                          className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all w-full ${isBookedByOther
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 border-gray-200'
                            : selectedSlot === slot.id
                              ? 'border-red-600 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-white hover:border-red-400 hover:bg-red-50'
                            }`}
                        >
                          <div className="text-sm sm:text-base font-medium text-gray-800 mb-0.5 sm:mb-1">
                            {slotTime.toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            {slotEnd.toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </div>
                          <div className={`text-xs ${isMine
                            ? 'text-green-600'
                            : isBookedByOther
                              ? 'text-gray-400'
                              : 'text-gray-600'
                            }`}>
                            {isMine
                              ? '✓ Your Booking'
                              : isBookedByOther
                                ? 'Unavailable'
                                : slot.coach_name ? `Coach ${slot.coach_name}` : 'Available'}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedSlot && (
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <Button
                          variant="default"
                          size="lg"
                          onClick={handleBookDemo}
                          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                          disabled={isBooking}
                        >
                          {isBooking ? (
                            <span className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                              Booking...
                            </span>
                          ) : (
                            'Book Demo Class'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DemoClassBooking;
