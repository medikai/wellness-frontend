import React from 'react'
import { Card } from '@/components/ui'

const MonthlyStats = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-neutral-dark mb-4">This Month</h3>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-teal-primary">12</div>
          <div className="text-sm text-neutral-medium">Classes Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-primary">480</div>
          <div className="text-sm text-neutral-medium">Exercise Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-teal-primary">18</div>
          <div className="text-sm text-neutral-medium">Meditation Sessions</div>
        </div>
      </div>
    </Card>
  )
}

export default MonthlyStats