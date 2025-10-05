import React from 'react'
import { Card, Icon } from '@/components/ui'

const Achievements = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-neutral-dark mb-4">Achievements</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Icon name="check" size="sm" color="#4CAF9D" />
          <span className="text-sm text-neutral-dark">First Week Complete</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="check" size="sm" color="#4CAF9D" />
          <span className="text-sm text-neutral-dark">Meditation Master</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="check" size="sm" color="#4CAF9D" />
          <span className="text-sm text-neutral-dark">Exercise Enthusiast</span>
        </div>
      </div>
    </Card>
  )
}

export default Achievements