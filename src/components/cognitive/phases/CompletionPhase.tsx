'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui'
import { useFontSize } from '@/contexts/FontSizeContext'
import { CognitiveTestConfig, TestResult } from '@/types/cognitive-test'
import { useRouter } from 'next/navigation'

interface CompletionPhaseProps {
  config: CognitiveTestConfig
  result: TestResult
  onNext?: () => void
  autoAdvanceDelay?: number // Milliseconds before auto-advancing
}

export default function CompletionPhase({
  config,
  result,
  onNext,
  autoAdvanceDelay = 3000
}: CompletionPhaseProps) {
  const { fontSizePx } = useFontSize()
  const router = useRouter()

  useEffect(() => {
    // Auto-advance after delay
    if (autoAdvanceDelay > 0) {
      const timer = setTimeout(() => {
        if (onNext) {
          onNext()
        } else {
          // Default: go back to classes or dashboard
          router.push('/classes')
        }
      }, autoAdvanceDelay)

      return () => clearTimeout(timer)
    }
  }, [autoAdvanceDelay, onNext, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-12 h-12 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        <h3 
          className="font-bold text-gray-900"
          style={{ fontSize: `${Math.max(28, fontSizePx * 1.75)}px` }}
        >
          Test Completed!
        </h3>

        <p 
          className="text-gray-600"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          Great job completing the {config.title}
        </p>
      </div>

      {/* Results Summary */}
      <div className="w-full  bg-blue-50 rounded-xl p-6 border-2 border-blue-200 space-y-4">
        {result.score !== undefined && (
          <div className="flex justify-between items-center">
            <span 
              className="font-semibold text-gray-700"
              style={{ fontSize: `${fontSizePx}px` }}
            >
              Score:
            </span>
            <span 
              className="font-bold text-blue-700"
              style={{ fontSize: `${Math.max(20, fontSizePx * 1.25)}px` }}
            >
              {result.score} / {config.test.items.length}
            </span>
          </div>
        )}

        {result.accuracy !== undefined && (
          <div className="flex justify-between items-center">
            <span 
              className="font-semibold text-gray-700"
              style={{ fontSize: `${fontSizePx}px` }}
            >
              Accuracy:
            </span>
            <span 
              className="font-bold text-blue-700"
              style={{ fontSize: `${Math.max(20, fontSizePx * 1.25)}px` }}
            >
              {result.accuracy.toFixed(1)}%
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span 
            className="font-semibold text-gray-700"
            style={{ fontSize: `${fontSizePx}px` }}
          >
            Time:
          </span>
          <span 
            className="font-bold text-blue-700"
            style={{ fontSize: `${Math.max(20, fontSizePx * 1.25)}px` }}
          >
            {formatTime(result.timing.duration)}
          </span>
        </div>
      </div>

      {/* Auto-advance Notice */}
      {autoAdvanceDelay > 0 && (
        <p 
          className="text-sm text-gray-500 text-center"
          style={{ fontSize: `${fontSizePx * 0.875}px` }}
        >
          Automatically advancing in {Math.ceil(autoAdvanceDelay / 1000)} seconds...
        </p>
      )}

      {/* Manual Next Button */}
      <div className="w-full ">
        <Button
          onClick={() => {
            if (onNext) {
              onNext()
            } else {
              router.push('/classes')
            }
          }}
          className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ fontSize: `${Math.max(20, fontSizePx * 1.25)}px` }}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

