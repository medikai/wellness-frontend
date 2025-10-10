'use client';

import React from 'react'
import { Card, Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const CoachDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg mb-6 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-green-800 mb-2">
                Coach Dashboard 👨‍🏫
              </h1>
              <p className="text-xl text-green-700 mb-1">
                Create and manage wellness programs
              </p>
              <p className="text-lg text-green-600">
                Welcome, {user?.name || 'Coach'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-6xl mb-2">💚</div>
              <p className="text-lg font-semibold text-green-800">
                Coach Portal
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Coach Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Create Class
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Schedule new wellness classes
              </p>
              <Button className="w-full py-3 text-lg bg-green-500 hover:bg-green-600 text-white">
                Create Class
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Create Challenge
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Set up community challenges
              </p>
              <Button className="w-full py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white">
                Create Challenge
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Track Progress
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Monitor student engagement
              </p>
              <Button className="w-full py-3 text-lg bg-purple-500 hover:bg-purple-600 text-white">
                View Analytics
              </Button>
            </Card>
          </div>
        </div>

        {/* Today's Classes */}
        <Card className="p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Today&apos;s Classes
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-800">Morning Yoga</h4>
                <p className="text-sm text-gray-600">10:00 AM - 11:00 AM</p>
                <p className="text-sm text-green-600">8 participants</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Start Class
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-800">Meditation Session</h4>
                <p className="text-sm text-gray-600">2:00 PM - 2:30 PM</p>
                <p className="text-sm text-blue-600">12 participants</p>
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Start Class
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CoachDashboard