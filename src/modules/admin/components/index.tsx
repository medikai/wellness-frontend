'use client';

import React from 'react'
import { Card, Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg mb-6 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-purple-800 mb-2">
                Admin Dashboard 👨‍💼
              </h1>
              <p className="text-xl text-purple-700 mb-1">
                Manage users, content, and analytics
              </p>
              <p className="text-lg text-purple-600">
                Welcome, {user?.name || 'Admin'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-6xl mb-2">💜</div>
              <p className="text-lg font-semibold text-purple-800">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Admin Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Manage Users
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Add, edit, and manage user accounts
              </p>
              <Button className="w-full py-3 text-lg bg-purple-500 hover:bg-purple-600 text-white">
                Manage Users
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Analytics
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                View engagement and conversion metrics
              </p>
              <Button className="w-full py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white">
                View Analytics
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                System Settings
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Configure platform settings
              </p>
              <Button className="w-full py-3 text-lg bg-gray-500 hover:bg-gray-600 text-white">
                Settings
              </Button>
            </Card>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
            <p className="text-gray-600">Total Users</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">23</div>
            <p className="text-gray-600">Active Classes</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
            <p className="text-gray-600">Engagement Rate</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            System Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-gray-800">New user registered</p>
                <p className="text-sm text-gray-600">Mary Johnson - 5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-semibold text-gray-800">New class created</p>
                <p className="text-sm text-gray-600">Evening Meditation - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-gray-800">System maintenance scheduled</p>
                <p className="text-sm text-gray-600">Tonight at 2:00 AM</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard