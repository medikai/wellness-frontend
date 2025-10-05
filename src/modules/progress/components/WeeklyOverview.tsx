import React from 'react'
import { Card, ProgressBar } from '@/components/ui'

const WeeklyOverview = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-neutral-dark mb-6">Weekly Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-dark">Classes Completed</span>
            <span className="text-sm text-teal-primary font-bold">3/5</span>
          </div>
          <ProgressBar value={60} color="teal" showLabel label="Weekly Goal" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-dark">Exercise Minutes</span>
            <span className="text-sm text-orange-primary font-bold">120/150</span>
          </div>
          <ProgressBar value={80} color="orange" showLabel label="Weekly Goal" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-dark">Meditation Sessions</span>
            <span className="text-sm text-teal-primary font-bold">4/7</span>
          </div>
          <ProgressBar value={57} color="teal" showLabel label="Daily Goal" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-dark">Water Intake</span>
            <span className="text-sm text-orange-primary font-bold">6/8</span>
          </div>
          <ProgressBar value={75} color="orange" showLabel label="Daily Goal" />
        </div>
      </div>
    </Card>
  )
}

export default WeeklyOverview