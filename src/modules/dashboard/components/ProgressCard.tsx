import React from 'react'
import { Card, ProgressBar } from '@/components/ui'

const ProgressCard = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-neutral-dark mb-4">
        Your Progress
      </h3>
      <p className="text-neutral-medium mb-4">
        You&apos;ve completed 3 classes this week 💪
      </p>
      <p className="text-neutral-dark font-medium mb-4">
        Keep going!
      </p>
      <ProgressBar 
        value={75} 
        showLabel 
        label="Weekly Goal" 
        color="teal"
      />
    </Card>
  )
}

export default ProgressCard