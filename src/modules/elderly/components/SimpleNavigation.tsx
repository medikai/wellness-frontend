'use client';

import React from 'react';
import { Card } from '@/components/ui';

const SimpleNavigation: React.FC = () => {
  const navigationItems = [
    {
      id: 'home',
      title: 'Home',
      description: 'Main page',
      icon: '🏠',
      color: 'bg-orange-500',
      href: '/dashboard'
    },
    {
      id: 'classes',
      title: 'Classes',
      description: 'Exercise classes',
      icon: '📚',
      color: 'bg-orange-600',
      href: '/classes'
    },
    {
      id: 'games',
      title: 'Games',
      description: 'Fun activities',
      icon: '🎮',
      color: 'bg-orange-400',
      href: '/game'
    },
    {
      id: 'progress',
      title: 'Progress',
      description: 'How I\'m doing',
      icon: '📊',
      color: 'bg-orange-700',
      href: '/progress'
    },
    {
      id: 'community',
      title: 'Friends',
      description: 'Talk to others',
      icon: '👥',
      color: 'bg-orange-500',
      href: '/community'
    },
    {
      id: 'help',
      title: 'Help',
      description: 'Get assistance',
      icon: '🆘',
      color: 'bg-orange-800',
      href: '/help'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Where would you like to go?
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="block"
          >
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-5xl mb-3">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {item.title}
              </h3>
              <p className="text-lg text-gray-600">
                {item.description}
              </p>
              <div className={`w-full h-2 ${item.color} rounded-full mt-3`}></div>
            </Card>
          </a>
        ))}
      </div>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-xl font-semibold rounded-lg">
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default SimpleNavigation;