'use client';

import React, { useState } from 'react';
import { Card, Button, Icon } from '@/components/ui';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  booked: boolean;
}

interface DaySlots {
  date: string;
  day: string;
  slots: TimeSlot[];
}

const DemoClassBooking: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // Generate time slots for demo classes
  const generateTimeSlots = (date: Date): DaySlots => {
    const daySlots: TimeSlot[] = [];
    const dayOfWeek = date.getDay();
    
    // Only show slots for weekdays (Monday to Friday)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const baseSlots = [
        { time: '9:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '2:00 PM', available: true },
        { time: '4:00 PM', available: true },
        { time: '6:00 PM', available: true },
      ];

      baseSlots.forEach((slot, index) => {
        daySlots.push({
          id: `${date.toISOString().split('T')[0]}-${index}`,
          time: slot.time,
          available: slot.available,
          booked: false
        });
      });
    }

    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      slots: daySlots
    };
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleBookDemo = () => {
    if (selectedDate && selectedSlot) {
      // Store booking in localStorage
      const booking = {
        date: selectedDate,
        slotId: selectedSlot,
        bookedAt: new Date().toISOString(),
        type: 'demo'
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('demoBookings', JSON.stringify(existingBookings));
      
      setIsBookingConfirmed(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const selectedDaySlots = selectedDate ? generateTimeSlots(new Date(selectedDate)) : null;

  if (isBookingConfirmed) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size="lg" color="#10B981" />
          </div>
          <h3 className="text-2xl font-bold text-[#2C4A52] mb-2">Demo Class Booked!</h3>
          <p className="text-[#6B7280]">
            You&apos;ve successfully booked a demo class. We&apos;ll send you a reminder before your session.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => {
            setIsBookingConfirmed(false);
            setSelectedDate(null);
            setSelectedSlot(null);
          }}
        >
          Book Another Demo
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#2C4A52] mb-2">Join a Demo Class</h2>
        <p className="text-[#6B7280]">
          Experience our health and wellness classes with a free demo session
        </p>
      </div>

      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateMonth('prev')}
          >
            <Icon name="chevron-left" size="sm" className="mr-1" />
            Previous
          </Button>
          <h3 className="text-xl font-bold text-[#2C4A52]">{monthName}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateMonth('next')}
          >
            Next
            <Icon name="chevron-right" size="sm" className="ml-1" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-[#6B7280] py-2">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-10"></div>;
            }

            const daySlots = generateTimeSlots(day);
            const hasSlots = daySlots.slots.length > 0;
            const isSelected = selectedDate === day.toISOString().split('T')[0];
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#4CAF9D] text-white'
                    : hasSlots
                    ? 'bg-[#E6F7F5] text-[#2D7D6B] hover:bg-[#B2E5E0]'
                    : 'text-[#F8F9FA] cursor-not-allowed'
                } ${isToday ? 'ring-2 ring-[#4CAF9D]' : ''}`}
                disabled={!hasSlots}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        {/* Time Slots */}
        {selectedDaySlots && selectedDaySlots.slots.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-[#2C4A52] mb-4">
              Available Time Slots for {new Date(selectedDate!).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedDaySlots.slots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotClick(slot.id)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    selectedSlot === slot.id
                      ? 'border-[#4CAF9D] bg-[#E6F7F5] text-[#2D7D6B]'
                      : 'border-[#F8F9FA] hover:border-[#4CAF9D] hover:bg-[#E6F7F5] text-[#2C4A52]'
                  }`}
                >
                  <div className="font-medium">{slot.time}</div>
                  <div className="text-xs text-[#6B7280]">Available</div>
                </button>
              ))}
            </div>

            {selectedSlot && (
              <div className="mt-6 text-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleBookDemo}
                  className="px-8"
                >
                  Book Demo Class
                </Button>
              </div>
            )}
          </div>
        )}

        {selectedDate && selectedDaySlots && selectedDaySlots.slots.length === 0 && (
          <div className="border-t pt-6 text-center">
            <p className="text-[#6B7280]">
              No demo classes available for this date. Please select a weekday.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DemoClassBooking;