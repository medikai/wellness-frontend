'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui'
import { useFontSize } from '@/contexts/FontSizeContext'
import { CognitiveTestConfig, TestItem, TestResponse } from '@/types/cognitive-test'

interface MultiTapModeProps {
  item: TestItem
  config: CognitiveTestConfig
  onResponse: (response: TestResponse) => void
  disabled?: boolean
}

export default function MultiTapMode({ item, config, onResponse, disabled }: MultiTapModeProps) {
  const { fontSizePx } = useFontSize()
  const [sequence, setSequence] = useState<(string | number)[]>([])
  const [timestamps, setTimestamps] = useState<number[]>([])

  const handleTap = useCallback((value: string | number) => {
    if (disabled) return

    const timestamp = Date.now()
    const newSequence = [...sequence, value]
    const newTimestamps = [...timestamps, timestamp]

    setSequence(newSequence)
    setTimestamps(newTimestamps)

    // Check if sequence is complete (based on item metadata or config)
    const metadataLength = typeof item.metadata?.expectedLength === 'number' ? item.metadata.expectedLength : undefined
    const contentLength = Array.isArray(config.stimulus?.content) ? config.stimulus.content.length : undefined
    const expectedLength = metadataLength ?? contentLength ?? 0
    
    if (expectedLength > 0 && newSequence.length >= expectedLength) {
      // Auto-complete when sequence ends
      const testResponse: TestResponse = {
        itemId: item.id,
        response: newSequence as number[],
        timestamp,
        metadata: { timestamps: newTimestamps }
      }
      onResponse(testResponse)
    }
  }, [item, config, onResponse, disabled, sequence, timestamps])

  const handleSubmit = useCallback(() => {
    if (disabled || sequence.length === 0) return

    const testResponse: TestResponse = {
      itemId: item.id,
      response: sequence as number[],
      timestamp: Date.now(),
      metadata: { timestamps }
    }
    onResponse(testResponse)
  }, [item, onResponse, disabled, sequence, timestamps])

  const handleClear = useCallback(() => {
    setSequence([])
    setTimestamps([])
  }, [])

  // Get options from config or item metadata
  const metadataOptions = Array.isArray(item.metadata?.options) ? item.metadata.options : undefined
  const contentOptions = Array.isArray(config.stimulus?.content) ? config.stimulus.content : undefined
  const defaultOptions: (string | number)[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  const options: (string | number)[] = (metadataOptions as (string | number)[] | undefined) ?? 
    (contentOptions as (string | number)[] | undefined) ?? 
    defaultOptions

  return (
    <div className="space-y-6">
      {/* Display current sequence */}
      <div className="bg-gray-100 rounded-xl p-6 min-h-[80px] flex items-center justify-center">
        <div className="flex gap-3 flex-wrap justify-center">
          {sequence.length > 0 ? (
            sequence.map((item, idx) => (
              <span
                key={idx}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold"
                style={{ fontSize: `${Math.max(24, fontSizePx * 1.5)}px` }}
              >
                {item}
              </span>
            ))
          ) : (
            <span 
              className="text-gray-400"
              style={{ fontSize: `${fontSizePx}px` }}
            >
              Tap to build sequence...
            </span>
          )}
        </div>
      </div>

      {/* Options Grid - Primary Interaction Zone */}
      <div className="grid grid-cols-5 gap-3">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleTap(option)}
            disabled={disabled}
            className="py-6 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold shadow-md transition-all duration-150 transform active:scale-95"
            style={{ fontSize: `${Math.max(20, fontSizePx * 1.25)}px` }}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleClear}
          disabled={disabled || sequence.length === 0}
          className="flex-1 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={disabled || sequence.length === 0}
          className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

