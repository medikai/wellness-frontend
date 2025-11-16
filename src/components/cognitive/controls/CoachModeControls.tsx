'use client'

import React, { useState } from 'react'
import { Icon } from '@/components/ui'
import { CognitiveTestConfig, CognitiveTestState, TestResponse } from '@/types/cognitive-test'

interface CoachModeControlsProps {
  config: CognitiveTestConfig
  state: CognitiveTestState
  responses: TestResponse[]
}

export default function CoachModeControls({ config, state, responses }: CoachModeControlsProps) {
  const [showPanel, setShowPanel] = useState(false)

  if (!config.coachMode?.enabled) return null

  const correctCount = responses.filter(r => r.correct === true).length
  const totalCount = responses.length
  const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="p-2 rounded-lg bg-teal-100 hover:bg-teal-200 transition-colors"
        aria-label="Coach mode controls"
      >
        <Icon name="eye" size="sm" color="#059669" />
      </button>

      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Coach Mode</h3>
            
            {config.coachMode.showTiming && state.startTime && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Elapsed:</span>
                  <span className="font-semibold text-gray-800">
                    {Math.floor((Date.now() - state.startTime) / 1000)}s
                  </span>
                </div>
              </div>
            )}

            {config.coachMode.showAnswers && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Correct:</span>
                  <span className="font-semibold text-green-600">{correctCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-gray-800">{totalCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-semibold text-blue-600">{accuracy.toFixed(1)}%</span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Phase: <span className="font-semibold">{state.phase}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

