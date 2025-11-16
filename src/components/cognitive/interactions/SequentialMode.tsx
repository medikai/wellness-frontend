'use client'

import React, { useState, useCallback } from 'react'
import { useFontSize } from '@/contexts/FontSizeContext'
import { CognitiveTestConfig, TestItem, TestResponse } from '@/types/cognitive-test'

interface SequentialModeProps {
  item: TestItem
  config: CognitiveTestConfig
  onResponse: (response: TestResponse) => void
  disabled?: boolean
}

export default function SequentialMode({ item, config, onResponse, disabled }: SequentialModeProps) {
  const { fontSizePx } = useFontSize()
  const [selectedSequence, setSelectedSequence] = useState<number[]>([])
  const [errors, setErrors] = useState<number[]>([])

  // Get sequence from config or item
  const sequence = item.metadata?.sequence || 
    (typeof config.stimulus?.content === 'object' ? config.stimulus.content.map((_, i) => i) : [])
  
  const expectedSequence = item.metadata?.expectedSequence || 
    Array.from({ length: (sequence as number[]).length }, (_, i) => i) as number[]

  const handleNodeTap = useCallback((nodeIndex: number) => {
    if (disabled) return

    const nextExpected = (expectedSequence as number[])[selectedSequence.length]
    const isCorrect = nodeIndex === nextExpected

    if (isCorrect) {
      const newSequence = [...selectedSequence, nodeIndex]
      setSelectedSequence(newSequence)

      // Check if sequence is complete
      if (newSequence.length >= (expectedSequence as number[]).length) {
        const testResponse: TestResponse = {
          itemId: item.id,
          response: newSequence,
          timestamp: Date.now(),
          correct: true
        }
        onResponse(testResponse)
      }
    } else {
      // Mark as error
      setErrors(prev => [...prev, nodeIndex])
      
      // After error, continue (don't block)
      setTimeout(() => {
        setErrors(prev => prev.filter(e => e !== nodeIndex))
      }, 1000)
    }
  }, [item, expectedSequence, selectedSequence, onResponse, disabled])

  // Render nodes (for Trail Making or similar)
  const nodes = (sequence as number[]).map((_, idx) => {
    const isSelected = selectedSequence.includes(idx)
    const isError = errors.includes(idx)
    const isNext = idx === (expectedSequence as number[])[selectedSequence.length]

    return (
      <button
        key={idx}
        onClick={() => handleNodeTap(idx)}
        disabled={disabled || isSelected}
        className={`py-6 px-8 rounded-xl font-bold shadow-md transition-all duration-200 transform active:scale-95 ${
          isSelected
            ? 'bg-green-600 text-white'
            : isError
            ? 'bg-red-500 text-white animate-pulse'
            : isNext
            ? 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-300'
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        }`}
        style={{ fontSize: `${Math.max(24, fontSizePx * 1.5)}px` }}
      >
        {idx + 1}
      </button>
    )
  })

  return (
    <div className="space-y-6">
      <div 
        className="text-center text-gray-600 mb-4"
        style={{ fontSize: `${fontSizePx}px` }}
      >
        Tap nodes in the correct order
      </div>

      {/* Node Grid - Primary Interaction Zone */}
      <div className="grid grid-cols-3 gap-4">
        {nodes}
      </div>

      {/* Progress Indicator */}
      <div className="text-center">
        <span 
          className="text-gray-600"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          Progress: {selectedSequence.length} / {(expectedSequence as number[]).length}
        </span>
      </div>
    </div>
  )
}



