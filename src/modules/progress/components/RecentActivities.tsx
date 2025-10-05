import React from 'react'
import { Card, Icon } from '@/components/ui'

const RecentActivities = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-neutral-dark mb-6">Recent Activities</h2>
      <div className="space-y-4">
        {[
          { activity: 'Yoga for Joints', time: '2 hours ago', points: '+50' },
          { activity: 'Meditation Session', time: 'Yesterday', points: '+30' },
          { activity: 'Chair Exercises', time: '2 days ago', points: '+40' },
          { activity: 'Health Quiz', time: '3 days ago', points: '+25' },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-neutral-light rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="heart" size="md" color="#4CAF9D" />
              <div>
                <p className="text-sm font-medium text-neutral-dark">{item.activity}</p>
                <p className="text-xs text-neutral-medium">{item.time}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-teal-primary">{item.points}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default RecentActivities