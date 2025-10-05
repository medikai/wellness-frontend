import React from 'react'
import { Card, Button, Icon } from '@/components/ui'

const FAQ = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-neutral-dark mb-4">FAQ</h2>
      <p className="text-neutral-medium mb-4">Find answers to common questions</p>
      <Button variant="outline" size="lg" className="w-full">
        <Icon name="helpCircle" size="sm" className="mr-2" />
        View FAQ
      </Button>
    </Card>
  )
}

export default FAQ