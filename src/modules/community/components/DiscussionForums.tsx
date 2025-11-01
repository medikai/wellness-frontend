import React from 'react'
import { Card, Button, Icon } from '@/components/ui'

const DiscussionForums = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-neutral-dark mb-4">Discussion Forums</h2>
      <p className="text-neutral-medium mb-4">Join conversations about health and waylness</p>
      <Button variant="primary" size="lg" className="w-full">
        <Icon name="users" size="sm" className="mr-2" />
        Join Discussion
      </Button>
    </Card>
  )
}

export default DiscussionForums