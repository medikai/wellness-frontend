import React from 'react'
import { Card, Button, Icon } from '@/components/ui'

const NoClassesMessage = () => {
  return (
    <Card className="p-12 text-center">
      <div className="mb-6">
        <Icon name="calendar" size="xl" color="#9CA3AF" className="mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[#2C4A52] mb-2">No Classes Booked</h3>
        <p className="text-[#6B7280]">
          You haven&apos;t booked any classes yet. Start by booking a demo class to experience our health and waylness programs.
        </p>
      </div>
      <Button variant="primary" size="lg">
        Book a Demo Class
      </Button>
    </Card>
  )
}

export default NoClassesMessage