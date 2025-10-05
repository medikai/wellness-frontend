import React from 'react'
import { Card, ProgressBar, Icon } from '@/components/ui'

const GameStats = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-neutral-dark mb-4">Your Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-dark">Weekly Streak</span>
              <span className="text-sm text-teal-primary font-bold">5 days</span>
            </div>
            <ProgressBar value={71} color="teal" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-dark">Points Earned</span>
              <span className="text-sm text-orange-primary font-bold">1,250 pts</span>
            </div>
            <ProgressBar value={62} color="orange" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-dark">Level Progress</span>
              <span className="text-sm text-neutral-medium">Level 3</span>
            </div>
            <ProgressBar value={45} color="teal" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-neutral-dark mb-4">Achievements</h2>
        <div className="space-y-3">
          {[
            { name: 'First Class', icon: 'heart', earned: true },
            { name: 'Week Warrior', icon: 'heart', earned: true },
            { name: 'Meditation Master', icon: 'heart', earned: false },
            { name: 'Exercise Expert', icon: 'heart', earned: false },
          ].map((achievement) => (
            <div key={achievement.name} className="flex items-center space-x-3">
              <Icon 
                name={achievement.icon} 
                size="md" 
                color={achievement.earned ? "#4CAF9D" : "#6B7280"} 
              />
              <span className={`text-sm ${achievement.earned ? 'text-neutral-dark' : 'text-neutral-medium'}`}>
                {achievement.name}
              </span>
              {achievement.earned && (
                <Icon name="check" size="sm" color="#4CAF9D" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default GameStats