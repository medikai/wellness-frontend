'use client';

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

const Header = () => {
  const { user } = useAuth()
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg mb-6 border-2 border-orange-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-orange-800 mb-2">
            Hello, {user?.name || 'Friend'}! 👋
          </h1>
          <p className="text-xl text-orange-700 mb-1">
            Today is {currentDate}
          </p>
          <p className="text-lg text-orange-600">
            It&apos;s {currentTime}
          </p>
        </div>
        <div className="text-right">
          <div className="text-6xl mb-2">🧡</div>
          <p className="text-lg font-semibold text-orange-800">
            Health Portal
          </p>
        </div>
      </div>
    </div>
  )
}

export default Header