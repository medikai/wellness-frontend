import React from 'react'
import { Icon } from '@/components/ui'

const Logo = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-2">
        <Icon name="heart" size="lg" color="#4CAF9D" />
        <h1 className="text-2xl font-bold text-neutral-dark">Health++</h1>
      </div>
    </div>
  )
}

export default Logo