'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';

const MemoryAid: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getWeatherEmoji = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 18) return '☀️';
    if (hour >= 18 && hour < 21) return '🌇';
    return '🌙';
  };

  return (
    <div className="space-y-4">
      {/* Time and Date Display */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200">
        <div className="text-center">
          <div className="text-6xl mb-2">{getWeatherEmoji()}</div>
          <h2 className="text-3xl font-bold text-orange-800 mb-2">
            {getGreeting()}!
          </h2>
          <div className="text-4xl font-bold text-orange-900 mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-xl text-orange-700">
            {formatDate(currentTime)}
          </div>
        </div>
      </Card>

      {/* Quick Reminders */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200">
        <div className="text-center">
          <div className="text-4xl mb-3">💡</div>
          <h3 className="text-2xl font-bold text-orange-800 mb-3">
            Remember Today
          </h3>
          <div className="space-y-2 text-lg text-orange-700">
            <div className="flex items-center justify-center space-x-2">
              <span>🍎</span>
              <span>Take your morning medication</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🚶‍♀️</span>
              <span>Go for a 10-minute walk</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>💧</span>
              <span>Drink plenty of water</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>📞</span>
              <span>Call your daughter at 3 PM</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="p-6 bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-300">
        <div className="text-center">
          <div className="text-4xl mb-3">🆘</div>
          <h3 className="text-2xl font-bold text-orange-800 mb-3">
            If You Need Help
          </h3>
          <div className="space-y-3">
            <div className="text-xl text-orange-700">
              <strong>Call Family:</strong> (555) 123-4567
            </div>
            <div className="text-xl text-orange-700">
              <strong>Call Doctor:</strong> (555) 987-6543
            </div>
            <div className="text-xl text-orange-700">
              <strong>Emergency:</strong> 911
            </div>
          </div>
        </div>
      </Card>

      {/* Mood Check */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200">
        <div className="text-center">
          <div className="text-4xl mb-3">😊</div>
          <h3 className="text-2xl font-bold text-orange-800 mb-3">
            How are you feeling today?
          </h3>
          <div className="flex justify-center space-x-4">
            <button className="text-4xl hover:scale-110 transition-transform">
              😊
            </button>
            <button className="text-4xl hover:scale-110 transition-transform">
              😐
            </button>
            <button className="text-4xl hover:scale-110 transition-transform">
              😔
            </button>
            <button className="text-4xl hover:scale-110 transition-transform">
              😴
            </button>
          </div>
          <p className="text-lg text-orange-700 mt-3">
            It&apos;s okay to feel any way you do
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MemoryAid;