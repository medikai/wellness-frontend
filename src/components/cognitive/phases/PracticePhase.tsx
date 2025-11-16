'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui'
import { useFontSize } from '@/contexts/FontSizeContext'
import { CognitiveTestConfig, TestResponse } from '@/types/cognitive-test'
import InteractionZone from '../interactions/InteractionZone'

interface PracticePhaseProps {
  config: CognitiveTestConfig
  currentIndex: number
  onComplete: (passed: boolean) => void
  onResponse: (response: TestResponse) => void
}

export default function PracticePhase({
  config,
  currentIndex,
  onComplete,
  onResponse
}: PracticePhaseProps) {
  const { fontSizePx } = useFontSize()
  const [responses, setResponses] = useState<TestResponse[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  const currentItem = config.practice.items[currentIndex]
  const isLastItem = currentIndex >= config.practice.items.length - 1

  const handleResponse = useCallback((response: TestResponse) => {
    const isCorrect = JSON.stringify(response.response) === JSON.stringify(currentItem.correctAnswer)
    
    const feedback = {
      correct: isCorrect,
      message: isCorrect
        ? (currentItem.feedback?.correct || 'Correct! Well done!')
        : (currentItem.feedback?.incorrect || 'Incorrect. Try again.')
    }

    const newResponse: TestResponse = {
      ...response,
      correct: isCorrect
    }

    setResponses(prev => [...prev, newResponse])
    setCurrentFeedback(feedback)
    setShowFeedback(true)
    onResponse(newResponse)

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (isLastItem) {
        // Check if all practice items were answered correctly
        const allCorrect = [...responses, newResponse].every(r => r.correct === true)
        onComplete(allCorrect)
      } else {
        setShowFeedback(false)
        setCurrentFeedback(null)
      }
    }, 2000)
  }, [currentItem, isLastItem, responses, onResponse, onComplete])

  const handleNext = useCallback(() => {
    if (isLastItem) {
      const allCorrect = responses.every(r => r.correct === true)
      onComplete(allCorrect)
    } else {
      setShowFeedback(false)
      setCurrentFeedback(null)
    }
  }, [isLastItem, responses, onComplete])

  if (!currentItem) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Practice Indicator */}
      <div 
        className="text-center mb-4"
        style={{ fontSize: `${fontSizePx}px` }}
      >
        <p className="text-gray-600 font-medium">
          Practice Item {currentIndex + 1} of {config.practice.items.length}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {config.practice.requiredPass 
            ? 'You must answer correctly to continue' 
            : 'This is practice - take your time'}
        </p>
      </div>

      {/* Stimulus Area */}
      {currentItem.stimulus && (
        <div 
          className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6 text-center"
          style={{ fontSize: `${Math.max(20, fontSizePx * 1.5)}px` }}
        >
          {Array.isArray(currentItem.stimulus) ? (
            <div className="space-y-2">
              {currentItem.stimulus.map((item, idx) => (
                <div key={idx} className="font-semibold text-gray-800">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-semibold text-gray-800">{currentItem.stimulus}</p>
          )}
        </div>
      )}

      {/* Feedback Display */}
      {showFeedback && currentFeedback && (
        <div 
          className={`w-full p-4 rounded-xl border-2 mb-4 ${
            currentFeedback.correct
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
          style={{ fontSize: `${fontSizePx}px` }}
        >
          <p className="font-semibold text-center">{currentFeedback.message}</p>
        </div>
      )}

      {/* Primary Interaction Zone */}
      {!showFeedback && (
        <div className="w-full ">
          <InteractionZone
            mode={config.interactionMode}
            config={config}
            item={currentItem}
            onResponse={handleResponse}
            disabled={showFeedback}
          />
        </div>
      )}

      {/* Next Button (shown after feedback) */}
      {showFeedback && !isLastItem && (
        <Button
          onClick={handleNext}
          className="w-full  py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          Continue Practice
        </Button>
      )}
    </div>
  )
}

