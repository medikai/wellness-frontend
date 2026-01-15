import React from 'react'
import { Card, Button, Icon } from '@/components/ui'

const ContactSupport = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-neutral-dark mb-4">Contact Support</h2>
      <p className="text-neutral-medium mb-4">Get in touch with our support team</p>
      <Button variant="default" size="lg" className="w-full">
        <Icon name="phone" size="sm" className="mr-2" />
        Call Support
      </Button>
    </Card>
  )
}

export default ContactSupport