'use client'

import React, { useRef, useCallback } from 'react'
import { useFontSize } from '@/contexts/FontSizeContext'
import { TestItem, TestResponse } from '@/types/cognitive-test'

interface SingleTapModeProps {
  item: TestItem
  onResponse: (response: TestResponse) => void
  disabled?: boolean
}

export default function SingleTapMode({ item, onResponse, disabled }: SingleTapModeProps) {
  const { fontSizePx } = useFontSize()
  const startTimeRef = useRef<number | null>(null)

  const handleTap = useCallback((response: string | number | boolean) => {
    if (disabled) return

    const endTime = Date.now()
    const reactionTime = startTimeRef.current ? endTime - startTimeRef.current : 0

    const testResponse: TestResponse = {
      itemId: item.id,
      response,
      timestamp: endTime,
      reactionTime: reactionTime > 0 ? reactionTime : undefined,
      correct: item.correctAnswer !== undefined 
        ? JSON.stringify(response) === JSON.stringify(item.correctAnswer)
        : undefined
    }

    onResponse(testResponse)
  }, [item, onResponse, disabled])

  const handleOptionClick = useCallback((optionIndex: number) => {
    if (disabled) return
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }
    handleTap(optionIndex)
  }, [disabled, handleTap])

  // For multiple choice questions
  if (item.metadata?.type === 'multiple-choice' && Array.isArray(item.metadata.options)) {
    const options = item.metadata.options as string[]
    return (
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={disabled}
            className="w-full p-6 rounded-xl font-bold text-left transition-all duration-200 border-2 bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 hover:border-blue-400 active:scale-95"
            style={{ fontSize: `${Math.max(20, fontSizePx * 1.25)}px` }}
          >
            <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
            {option}
          </button>
        ))}
      </div>
    )
  }

  // For yes/no or simple decisions
  if (item.metadata?.type === 'yes-no' || item.metadata?.type === 'decision') {
    return (
      <div className="space-y-4">
        <div 
          className="text-center text-gray-600 mb-6"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          Tap when ready
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              startTimeRef.current = Date.now()
              handleTap(true)
            }}
            disabled={disabled}
            className="py-8 px-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl font-bold shadow-lg transition-all duration-150 transform active:scale-95"
            style={{ fontSize: `${Math.max(24, fontSizePx * 1.5)}px` }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              startTimeRef.current = Date.now()
              handleTap(false)
            }}
            disabled={disabled}
            className="py-8 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold shadow-lg transition-all duration-150 transform active:scale-95"
            style={{ fontSize: `${Math.max(24, fontSizePx * 1.5)}px` }}
          >
            No
          </button>
        </div>
      </div>
    )
  }

  // For reaction time (single tap button)
  return (
    <div className="space-y-4">
      <div 
        className="text-center text-gray-600 mb-6"
        style={{ fontSize: `${fontSizePx}px` }}
      >
        Tap the button as quickly as possible
      </div>
      <button
        onClick={() => {
          startTimeRef.current = Date.now()
          handleTap('tap')
        }}
        disabled={disabled}
        className="w-full py-12 px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold shadow-lg transition-all duration-150 transform active:scale-95"
        style={{ fontSize: `${Math.max(28, fontSizePx * 1.75)}px` }}
      >
        TAP HERE
      </button>
    </div>
  )
}

