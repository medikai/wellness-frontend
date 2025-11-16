'use client'

import React, { useState } from 'react'
import { Icon } from '@/components/ui'
import { useFontSize } from '@/contexts/FontSizeContext'

export default function AccessibilityControls() {
  const { fontSizePx, increase, decrease } = useFontSize()
  const [showControls, setShowControls] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowControls(!showControls)}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Accessibility controls"
      >
        <Icon name="settings" size="sm" color="#6B7280" />
      </button>

      {showControls && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Text Size</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrease}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  aria-label="Decrease text size"
                >
                  <Icon name="minus" size="sm" color="#6B7280" />
                </button>
                <span className="text-sm font-medium text-gray-700 w-12 text-center">
                  {fontSizePx}px
                </span>
                <button
                  onClick={increase}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  aria-label="Increase text size"
                >
                  <Icon name="plus" size="sm" color="#6B7280" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

