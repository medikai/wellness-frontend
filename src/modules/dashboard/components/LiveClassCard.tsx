import React from 'react'
import { Card, Button } from '@/components/ui'

const LiveClassCard = () => {
  return (
    <Card hover className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm text-neutral-medium">Live Class</span>
          <h3 className="text-2xl font-bold text-neutral-dark mt-1">
            Yoga for Joints
          </h3>
          <p className="text-neutral-medium mt-1">
            Today at 10:00 AM
          </p>
        </div>
        <Button variant="secondary" size="lg">
          Start Class →
        </Button>
      </div>
    </Card>
  )
}

export default LiveClassCard