import React from 'react'
import Header from './Header'
import WeeklyOverview from './WeeklyOverview'
import RecentActivities from './RecentActivities'
import MonthlyStats from './MonthlyStats'
import Streaks from './Streaks'
import Achievements from './Achievements'

const Progress = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Stats */}
        <div className="lg:col-span-2 space-y-6">
          <WeeklyOverview />
          <RecentActivities />
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <MonthlyStats />
          <Streaks />
          <Achievements />
        </div>
      </div>
    </>
  )
}

export default Progress