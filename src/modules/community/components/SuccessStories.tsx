import React from 'react'
import { Card, Button, Icon } from '@/components/ui'

const SuccessStories = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-neutral-dark mb-4">Success Stories</h2>
      <p className="text-neutral-medium mb-4">Read inspiring stories from community members</p>
      <Button variant="outline" size="lg" className="w-full">
        <Icon name="heart" size="sm" className="mr-2" />
        Read Stories
      </Button>
    </Card>
  )
}

export default SuccessStories