'use client'

import React, { useCallback } from 'react'
import { useFontSize } from '@/contexts/FontSizeContext'
import { CognitiveTestConfig, TestResponse } from '@/types/cognitive-test'
import InteractionZone from '../interactions/InteractionZone'

interface TestPhaseProps {
  config: CognitiveTestConfig
  currentIndex: number
  onResponse: (response: TestResponse) => void
  onNext: () => void
  onComplete: () => void
  responses: TestResponse[]
}

export default function TestPhaseComponent({
  config,
  currentIndex,
  onResponse,
  onNext,
  onComplete,
  responses
}: TestPhaseProps) {
  const { fontSizePx } = useFontSize()

  const currentItem = config.test.items[currentIndex]
  const isLastItem = currentIndex >= config.test.items.length - 1

  const handleResponse = useCallback((response: TestResponse) => {
    // Determine if response is correct (if correctAnswer is provided)
    const isCorrect = currentItem.correctAnswer !== undefined
      ? JSON.stringify(response.response) === JSON.stringify(currentItem.correctAnswer)
      : undefined

    const newResponse: TestResponse = {
      ...response,
      correct: isCorrect
    }

    onResponse(newResponse)

    // Auto-advance for certain modes
    if (config.interactionMode === 'auto-advance') {
      setTimeout(() => {
        if (isLastItem) {
          onComplete()
        } else {
          onNext()
        }
      }, config.test.autoAdvanceDelay || 2000)
    } else if (config.interactionMode === 'single-tap' && currentItem.metadata?.type !== 'multiple-choice') {
      // For single-tap (non-multiple-choice), record response and auto-advance
      setTimeout(() => {
        if (isLastItem) {
          onComplete()
        } else {
          onNext()
        }
      }, 500)
    }
    // For multiple-choice, user needs to manually proceed (handled by showing next button)
  }, [config, currentItem, isLastItem, onResponse, onNext, onComplete])

  if (!currentItem) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Test Item Indicator */}
      <div 
        className="text-center mb-4"
        style={{ fontSize: `${fontSizePx}px` }}
      >
        <p className="text-gray-600 font-medium">
          Item {currentIndex + 1} of {config.test.items.length}
        </p>
      </div>

      {/* Stimulus Area */}
      {currentItem.stimulus && (
        <div 
          className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6 text-center min-h-[120px] flex items-center justify-center"
          style={{ fontSize: `${Math.max(24, fontSizePx * 1.75)}px` }}
        >
          {Array.isArray(currentItem.stimulus) ? (
            <div className="space-y-3">
              {currentItem.stimulus.map((item, idx) => (
                <div key={idx} className="font-bold text-gray-800">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-bold text-gray-800">{currentItem.stimulus}</p>
          )}
        </div>
      )}

      {/* Grid Stimulus (for grid-tap mode) */}
      {config.stimulus?.type === 'grid' && config.stimulus.gridConfig && (
        <div className="mb-6">
          {/* Grid will be rendered in InteractionZone for grid-tap mode */}
        </div>
      )}

      {/* Primary Interaction Zone - Only Active Area */}
      <div className="w-full ">
        <InteractionZone
          mode={config.interactionMode}
          config={config}
          item={currentItem}
          onResponse={handleResponse}
          disabled={false}
        />
      </div>

      {/* Next Button for multiple-choice (after response) */}
      {config.interactionMode === 'single-tap' && 
       currentItem.metadata?.type === 'multiple-choice' && 
       responses.some(r => r.itemId === currentItem.id) && (
        <div className="w-full mt-6">
          <button
            onClick={() => {
              if (isLastItem) {
                onComplete()
              } else {
                onNext()
              }
            }}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
            style={{ fontSize: `${fontSizePx}px` }}
          >
            {isLastItem ? 'Complete Test' : 'Next Question'}
          </button>
        </div>
      )}

      {/* Note: User cannot go backward - no back button */}
    </div>
  )
}

