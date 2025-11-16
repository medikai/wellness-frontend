'use client'

import React from 'react'
import { useFontSize } from '@/contexts/FontSizeContext'

interface TimerIndicatorProps {
  timeRemaining: number
}

export default function TimerIndicator({ timeRemaining }: TimerIndicatorProps) {
  const { fontSizePx } = useFontSize()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isLowTime = timeRemaining <= 30

  return (
    <div className={`rounded-xl p-4 border-2 ${
      isLowTime 
        ? 'bg-red-50 border-red-300' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center justify-between">
        <span 
          className="font-semibold text-gray-700"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          Time Remaining:
        </span>
        <span 
          className={`font-bold ${
            isLowTime ? 'text-red-600' : 'text-blue-600'
          }`}
          style={{ fontSize: `${Math.max(24, fontSizePx * 1.5)}px` }}
        >
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  )
}

