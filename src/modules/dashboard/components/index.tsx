'use client';

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from './Header'
import WelcomeSection from './WelcomeSection'
import LiveClassCard from './LiveClassCard'
import ProgressCard from './ProgressCard'
import ActionButtons from './ActionButtons'

// Import role-specific dashboards
import ElderlyDashboard from '@/modules/elderly/components'
import CaregiverDashboard from '@/modules/caregiver/components'
import CoachDashboard from '@/modules/coach/components'
import AdminDashboard from '@/modules/admin/components'

const Dashboard = () => {
  const { user, isLoading } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#6B7280]">Loading...</div>
        </div>
      </div>
    )
  }

  // Show role-specific dashboard
  if (user?.role === 'elderly') {
    return <ElderlyDashboard />
  }

  if (user?.role === 'caregiver') {
    return <CaregiverDashboard />
  }

  if (user?.role === 'coach') {
    return <CoachDashboard />
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  // Default dashboard for users without a role
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WelcomeSection />
          <LiveClassCard />
          <ProgressCard />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <ActionButtons />
        </div>
      </div>
    </>
  )
}

export default Dashboard