'use client'

import React, { useEffect, useState } from 'react'
import { useFontSize } from '@/contexts/FontSizeContext'
import { TestItem, TestResponse } from '@/types/cognitive-test'

interface AutoAdvanceModeProps {
  item: TestItem
  delay: number
  onResponse: (response: TestResponse) => void
  disabled?: boolean
}

export default function AutoAdvanceMode({ item, delay, onResponse, disabled }: AutoAdvanceModeProps) {
  const { fontSizePx } = useFontSize()
  const [countdown, setCountdown] = useState(delay / 1000)

  useEffect(() => {
    if (disabled) return

    // Record viewing time
    const testResponse: TestResponse = {
      itemId: item.id,
      response: 'viewed',
      timestamp: Date.now()
    }
    onResponse(testResponse)

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [item, onResponse, disabled])

  return (
    <div className="space-y-6 text-center">
      <div 
        className="text-gray-600 mb-4"
        style={{ fontSize: `${fontSizePx}px` }}
      >
        Viewing stimulus...
      </div>

      {/* Countdown Display */}
      <div 
        className="text-6xl font-bold text-blue-600"
        style={{ fontSize: `${Math.max(48, fontSizePx * 3)}px` }}
      >
        {countdown}
      </div>

      <div 
        className="text-gray-500"
        style={{ fontSize: `${fontSizePx * 0.875}px` }}
      >
        Auto-advancing in {countdown} seconds
      </div>
    </div>
  )
}

