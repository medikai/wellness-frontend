import React from 'react'
import { Button, Icon } from '@/components/ui'

const ActionButtons = () => {
  return (
    <div className="space-y-3">
      <Button variant="default" size="lg" className="w-full">
        Join a Class
      </Button>
      <Button variant="outline" size="lg" className="w-full">
        <Icon name="phone" size="sm" className="mr-2" />
        Get Help
      </Button>
      <Button variant="outline" size="lg" className="w-full">
        <Icon name="settings" size="sm" className="mr-2" />
        Settings
      </Button>
    </div>
  )
}

export default ActionButtons