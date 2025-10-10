'use client';

import React, { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const CaregiverDashboard = () => {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedPatient, setSelectedPatient] = useState('Mary Johnson')

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const patients = [
    { id: 'mary', name: 'Mary Johnson', age: 78, condition: 'Dementia', status: 'stable' },
    { id: 'robert', name: 'Robert Smith', age: 82, condition: 'Alzheimer\'s', status: 'monitoring' },
    { id: 'alice', name: 'Alice Brown', age: 75, condition: 'Mild Cognitive Impairment', status: 'stable' }
  ]

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const recentActivities = [
    { id: 1, patient: 'Mary Johnson', activity: 'Completed morning exercise', time: '2 hours ago', status: 'completed', type: 'exercise' },
    { id: 2, patient: 'Robert Smith', activity: 'Took morning medication', time: '3 hours ago', status: 'completed', type: 'medication' },
    { id: 3, patient: 'Alice Brown', activity: 'Attended memory class', time: '4 hours ago', status: 'completed', type: 'class' },
    { id: 4, patient: 'Mary Johnson', activity: 'Scheduled doctor appointment', time: 'Tomorrow 2:00 PM', status: 'upcoming', type: 'appointment' },
    { id: 5, patient: 'Robert Smith', activity: 'Medication reminder', time: 'Due in 30 minutes', status: 'urgent', type: 'medication' }
  ]

  const healthAlerts = [
    { id: 1, patient: 'Mary Johnson', alert: 'Blood pressure slightly elevated', severity: 'medium', time: '1 hour ago' },
    { id: 2, patient: 'Robert Smith', alert: 'Missed evening medication', severity: 'high', time: '2 hours ago' },
    { id: 3, patient: 'Alice Brown', alert: 'Sleep pattern irregular', severity: 'low', time: '3 hours ago' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300'
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300'
      case 'stable': return 'bg-green-100 text-green-800'
      case 'monitoring': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Header Section */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-2xl mb-8 border-4 border-blue-300 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-6xl">👩‍⚕️</div>
              <div>
                <h1 className="text-5xl font-bold text-blue-900 mb-2">
                  {getGreeting()}, {user?.name || 'Caregiver'}! 
                </h1>
                <p className="text-2xl text-blue-800 mb-1">
                  Caregiver Dashboard
                </p>
                <p className="text-xl text-blue-700">
                  Monitor and support your loved ones
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-2">💙</div>
              <p className="text-2xl font-bold text-blue-900">
                Care Portal
              </p>
            </div>
          </div>
        </div>

        {/* Patient Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-blue-200 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Select Patient to Monitor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg`}
                onClick={() => setSelectedPatient(patient.name)}
              >
                <Card 
                  className={`p-4 border-4 ${
                    selectedPatient === patient.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">👤</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{patient.name}</h3>
                    <p className="text-lg text-gray-600 mb-2">Age: {patient.age}</p>
                    <p className="text-sm text-gray-500 mb-2">{patient.condition}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-blue-200">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Caregiver Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-blue-200">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Monitor Activity
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Track daily activities and progress
                  </p>
                  <Button className="w-full py-4 text-xl font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg">
                    View Activity
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-green-200">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Add Notes
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Record observations and reminders
                  </p>
                  <Button className="w-full py-4 text-xl font-bold bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg">
                    Add Note
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-purple-200">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Health Summary
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    View health reports and analytics
                  </p>
                  <Button className="w-full py-4 text-xl font-bold bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg">
                    View Reports
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-orange-200">
                  <div className="text-6xl mb-4">📞</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Send Reminders
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Send medication and activity reminders
                  </p>
                  <Button className="w-full py-4 text-xl font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg">
                    Send Reminder
                  </Button>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-blue-200">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Recent Activity - {selectedPatient}
              </h3>
              <div className="space-y-4">
                {recentActivities.filter(activity => activity.patient === selectedPatient).map((activity) => (
                  <Card key={activity.id} className={`p-6 border-4 ${getStatusColor(activity.status)} rounded-xl shadow-lg`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">
                        {activity.type === 'exercise' && '🏃‍♀️'}
                        {activity.type === 'medication' && '💊'}
                        {activity.type === 'class' && '📚'}
                        {activity.type === 'appointment' && '📅'}
                      </div>
                      <div className="flex-1">
                        <p className="text-xl font-bold text-gray-800">{activity.activity}</p>
                        <p className="text-lg text-gray-600">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-full text-lg font-bold ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Health Alerts */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-red-200">
              <h3 className="text-2xl font-bold text-red-800 mb-4 text-center">
                Health Alerts 🚨
              </h3>
              <div className="space-y-3">
                {healthAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}>
                    <div className="font-bold text-lg">{alert.patient}</div>
                    <div className="text-sm">{alert.alert}</div>
                    <div className="text-xs mt-1">{alert.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Status */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Patient Status
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">👤</div>
                  <div className="text-xl font-bold text-gray-800">{selectedPatient}</div>
                  <div className="text-lg text-gray-600">Currently Active</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">3</div>
                    <div className="text-sm text-green-600">Activities Today</div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">85%</div>
                    <div className="text-sm text-blue-600">Wellness Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-2xl shadow-lg border-4 border-blue-300">
              <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-bold rounded-xl shadow-lg">
                  📞 Call Patient
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-bold rounded-xl shadow-lg">
                  💬 Send Message
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 text-lg font-bold rounded-xl shadow-lg">
                  📋 View Reports
                </Button>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-bold rounded-xl shadow-lg">
                  ⚙️ Settings
                </Button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 p-6 rounded-2xl shadow-lg border-4 border-red-300">
              <h3 className="text-2xl font-bold text-red-800 mb-4 text-center">
                Emergency Contacts 🆘
              </h3>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-700 mb-1">Emergency</div>
                  <div className="text-2xl font-bold text-red-600">911</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-700 mb-1">Doctor</div>
                  <div className="text-lg text-red-600">(555) 987-6543</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-700 mb-1">Family</div>
                  <div className="text-lg text-red-600">(555) 123-4567</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaregiverDashboard