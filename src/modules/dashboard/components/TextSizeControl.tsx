import React from 'react'
import { Card } from '@/components/ui'

const TextSizeControl = () => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-neutral-dark mb-4">
        Text Size
      </h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neutral-light rounded-full"></div>
          <span className="text-sm text-neutral-medium">Small</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-teal-primary rounded-full"></div>
          <span className="text-sm text-neutral-dark font-medium">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-neutral-light rounded-full"></div>
          <span className="text-sm text-neutral-medium">Large</span>
        </div>
      </div>
    </Card>
  )
}

export default TextSizeControl