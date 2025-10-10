'use client';

import React, { useState, useEffect } from 'react'
import SimpleNavigation from './SimpleNavigation'
import { Card, Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const Dashboard = () => {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null)
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { user } = useAuth()

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const quickActions = [
    {
      id: 'classes',
      title: 'Join Live Classes',
      description: 'Exercise with friends',
      icon: '📚',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white',
      size: 'text-6xl'
    },
    {
      id: 'games',
      title: 'Play Games',
      description: 'Fun brain exercises',
      icon: '🎮',
      color: 'bg-orange-600 hover:bg-orange-700',
      textColor: 'text-white',
      size: 'text-6xl'
    },
    {
      id: 'progress',
      title: 'My Progress',
      description: 'See how well I\'m doing',
      icon: '📊',
      color: 'bg-orange-400 hover:bg-orange-500',
      textColor: 'text-white',
      size: 'text-6xl'
    },
    {
      id: 'community',
      title: 'Talk to Friends',
      description: 'Share with others',
      icon: '👥',
      color: 'bg-orange-700 hover:bg-orange-800',
      textColor: 'text-white',
      size: 'text-6xl'
    }
  ]

  const dailyReminders = [
    {
      time: '9:00 AM',
      activity: 'Morning Exercise Class',
      status: 'upcoming',
      icon: '🌅'
    },
    {
      time: '2:00 PM',
      activity: 'Memory Game',
      status: 'completed',
      icon: '🧠'
    },
    {
      time: '4:00 PM',
      activity: 'Tea Time Chat',
      status: 'upcoming',
      icon: '☕'
    }
  ]

  const encouragementMessages = [
    "You're doing great today! 🌟",
    "Keep up the wonderful work! 💪",
    "Every step counts! 👣",
    "You're stronger than you know! 💚",
    "Today is a good day! ☀️"
  ]

  const getRandomEncouragement = () => {
    return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getWeatherEmoji = () => {
    const hour = currentTime.getHours()
    if (hour >= 6 && hour < 12) return '🌅'
    if (hour >= 12 && hour < 18) return '☀️'
    if (hour >= 18 && hour < 21) return '🌇'
    return '🌙'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Development Role Switcher */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
          >
            Switch Role
          </button>
          {showRoleSwitcher && (
            <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-lg p-2 min-w-32">
              <button
                onClick={() => {
                  localStorage.setItem('testRole', 'elderly');
                  window.location.reload();
                }}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
              >
                Elderly
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('testRole', 'caregiver');
                  window.location.reload();
                }}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
              >
                Caregiver
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('testRole', 'coach');
                  window.location.reload();
                }}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
              >
                Coach
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('testRole', 'admin');
                  window.location.reload();
                }}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
              >
                Admin
              </button>
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Header Section */}
        <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-8 rounded-2xl mb-8 border-4 border-orange-300 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-6xl">{getWeatherEmoji()}</div>
    <div>
                <h1 className="text-5xl font-bold text-orange-900 mb-2">
                  {getGreeting()}, {user?.name || 'Friend'}! 👋
                </h1>
                <p className="text-2xl text-orange-800 mb-1">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xl text-orange-700">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-2">🧡</div>
              <p className="text-2xl font-bold text-orange-900">
                Health Portal
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Encouragement Banner */}
            <div className="bg-gradient-to-r from-yellow-200 to-orange-200 p-6 rounded-2xl text-center border-4 border-yellow-300 shadow-lg">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-3xl font-bold text-orange-900 mb-2">
                {getRandomEncouragement()}
              </h2>
              <p className="text-xl text-orange-800">
                You&apos;ve completed 3 activities today! Keep going! 💪
              </p>
            </div>

            {/* Quick Actions - Redesigned */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-orange-200">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                What would you like to do today?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action) => (
                  <Card key={action.id} className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-orange-200">
                    <div className={`${action.size} mb-4`}>
                      {action.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {action.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {action.description}
                    </p>
                    <Button
                      className={`w-full py-4 text-xl font-bold ${action.color} ${action.textColor} rounded-xl shadow-lg hover:shadow-xl`}
                      onClick={() => setCurrentActivity(action.id)}
                    >
                      Let&apos;s Go! →
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Today's Schedule - Redesigned */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-orange-200">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Today&apos;s Schedule
              </h2>
              <div className="space-y-4">
                {dailyReminders.map((reminder, index) => (
                  <Card key={index} className={`p-6 border-4 ${
                    reminder.status === 'completed' 
                      ? 'bg-green-100 border-green-300' 
                      : 'bg-orange-100 border-orange-300'
                  } rounded-xl shadow-lg`}>
                    <div className="flex items-center space-x-6">
                      <div className="text-5xl">
                        {reminder.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-3xl font-bold text-gray-800">
                            {reminder.time}
                          </span>
                          {reminder.status === 'completed' && (
                            <span className="text-3xl">✅</span>
                          )}
                        </div>
                        <p className="text-2xl text-gray-700 font-semibold">
                          {reminder.activity}
                        </p>
                      </div>
                      <div className="text-right">
                        {reminder.status === 'completed' ? (
                          <span className="text-2xl font-bold text-green-700">
                            Done! 🎉
                          </span>
                        ) : (
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-xl font-bold rounded-xl shadow-lg">
                            Join Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Memory Aid - Compact */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Quick Reminders 💡
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-2xl">🍎</span>
                  <span className="text-lg font-semibold text-orange-800">Take morning medication</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-2xl">🚶‍♀️</span>
                  <span className="text-lg font-semibold text-orange-800">10-minute walk</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-2xl">💧</span>
                  <span className="text-lg font-semibold text-orange-800">Drink water</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-2xl">📞</span>
                  <span className="text-lg font-semibold text-orange-800">Call daughter at 3 PM</span>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 p-6 rounded-2xl shadow-lg border-4 border-red-300">
              <h3 className="text-2xl font-bold text-red-800 mb-4 text-center">
                Emergency Contacts 🆘
              </h3>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-700 mb-1">Family</div>
                  <div className="text-lg text-red-600">(555) 123-4567</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-700 mb-1">Doctor</div>
                  <div className="text-lg text-red-600">(555) 987-6543</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-700 mb-1">Emergency</div>
                  <div className="text-2xl font-bold text-red-600">911</div>
                </div>
              </div>
            </div>

            {/* Mood Check */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                How are you feeling? 😊
              </h3>
              <div className="flex justify-center space-x-4 mb-4">
                <button className="text-5xl hover:scale-110 transition-transform">😊</button>
                <button className="text-5xl hover:scale-110 transition-transform">😐</button>
                <button className="text-5xl hover:scale-110 transition-transform">😔</button>
                <button className="text-5xl hover:scale-110 transition-transform">😴</button>
              </div>
              <p className="text-lg text-orange-700 text-center">
                It&apos;s okay to feel any way you do
              </p>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-6 rounded-2xl shadow-lg border-4 border-orange-300">
              <div className="text-center">
                <div className="text-4xl mb-4">🆘</div>
                <h3 className="text-2xl font-bold text-orange-800 mb-3">
                  Need Help?
                </h3>
                <p className="text-lg text-orange-700 mb-4">
                  We&apos;re here to help you!
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-bold rounded-xl shadow-lg">
                    Call Support 📞
                  </Button>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-bold rounded-xl shadow-lg">
                    Get Help 💬
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Navigation - Bottom */}
        <div className="mt-8">
          <SimpleNavigation />
        </div>

        {/* Memory Aid - Current Activity */}
        {currentActivity && (
          <div className="fixed bottom-6 right-6 bg-orange-500 text-white p-6 rounded-2xl shadow-2xl z-50 border-4 border-orange-600">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📍</span>
              <span className="text-xl font-bold">
                You&apos;re in: {quickActions.find(a => a.id === currentActivity)?.title}
              </span>
              <button 
                onClick={() => setCurrentActivity(null)}
                className="text-white hover:text-orange-200 ml-3 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard