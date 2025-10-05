import React from 'react'
import { Card } from '@/components/ui'

const Streaks = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-neutral-dark mb-4">Streaks</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-dark">Daily Exercise</span>
          <span className="text-sm font-bold text-teal-primary">5 days</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-dark">Meditation</span>
          <span className="text-sm font-bold text-orange-primary">3 days</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-dark">Water Intake</span>
          <span className="text-sm font-bold text-teal-primary">7 days</span>
        </div>
      </div>
    </Card>
  )
}

export default Streaks