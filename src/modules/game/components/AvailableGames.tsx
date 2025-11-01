import React from 'react'
import { Card, Button, Icon } from '@/components/ui'
import Link from 'next/link'

const AvailableGames = () => {
  return (
    <div className="space-y-6">
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-dark">Memory Challenge</h3>
            <p className="text-neutral-medium mt-1">Test your memory with health-related cards</p>
          </div>
          <div className="w-12 h-12 bg-teal-light rounded-lg flex items-center justify-center">
            <Icon name="heart" size="lg" color="#4CAF9D" />
          </div>
        </div>
        <p className="text-sm text-neutral-medium mb-4">
          Match pairs of cards to improve your memory and earn points.
        </p>
        <Button variant="primary" size="lg" className="w-full">
          Play Now
        </Button>
      </Card>

      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-dark">Health Quiz</h3>
            <p className="text-neutral-medium mt-1">Test your health knowledge</p>
          </div>
          <div className="w-12 h-12 bg-orange-light rounded-lg flex items-center justify-center">
            <Icon name="heart" size="lg" color="#F58220" />
          </div>
        </div>
        <p className="text-sm text-neutral-medium mb-4">
          Answer questions about nutrition, exercise, and waylness.
        </p>
        <Link href="/game/quiz" className="w-full inline-block">
          <Button variant="outline" size="lg" className="w-full">
            Start Quiz
          </Button>
        </Link>
      </Card>

      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-dark">Step Counter</h3>
            <p className="text-neutral-medium mt-1">Track your daily steps</p>
          </div>
          <div className="w-12 h-12 bg-teal-light rounded-lg flex items-center justify-center">
            <Icon name="heart" size="lg" color="#4CAF9D" />
          </div>
        </div>
        <p className="text-sm text-neutral-medium mb-4">
          Complete daily step goals to unlock rewards and achievements.
        </p>
        <Button variant="outline" size="lg" className="w-full">
          Track Steps
        </Button>
      </Card>
    </div>
  )
}

export default AvailableGames