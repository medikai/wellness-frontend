'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, ProgressBar } from '@/components/ui'
import { useFontSize } from '@/contexts/FontSizeContext'
import { CognitiveTestConfig, TestPhase, CognitiveTestState, TestResponse, TestResult } from '@/types/cognitive-test'
import InstructionPhase from './phases/InstructionPhase'
import PracticePhase from './phases/PracticePhase'
import TestPhaseComponent from './phases/TestPhase'
import CompletionPhase from './phases/CompletionPhase'
import TimerIndicator from './controls/TimerIndicator'
import AccessibilityControls from './controls/AccessibilityControls'
import CoachModeControls from './controls/CoachModeControls'

interface CognitiveTestCardProps {
  config: CognitiveTestConfig
  onComplete?: (result: TestResult) => void
  onPhaseChange?: (phase: TestPhase) => void
  coachMode?: boolean
  className?: string
}

export default function CognitiveTestCard({
  config,
  onComplete,
  onPhaseChange,
  coachMode = false,
  className = ''
}: CognitiveTestCardProps) {
  const { fontSizePx } = useFontSize()
  
  const [state, setState] = useState<CognitiveTestState>({
    phase: 'instruction',
    currentItemIndex: 0,
    responses: [],
    practicePassed: false,
    testStarted: false,
    testCompleted: false
  })

  const [timer, setTimer] = useState<number | null>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // Initialize timer when test phase starts
  useEffect(() => {
    if (state.phase === 'test' && state.testStarted && config.test.duration) {
      setTimer(config.test.duration)
      startTimeRef.current = Date.now()
    }
  }, [state.phase, state.testStarted, config.test.duration])

  const handleStartPractice = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'practice',
      currentItemIndex: 0,
      responses: []
    }))
    onPhaseChange?.('practice')
  }, [onPhaseChange])

  const handlePracticeComplete = useCallback((passed: boolean) => {
    setState(prev => ({
      ...prev,
      practicePassed: passed
    }))

    if (passed || !config.practice.requiredPass) {
      setState(prev => ({
        ...prev,
        phase: 'test',
        testStarted: true,
        currentItemIndex: 0,
        responses: []
      }))
      onPhaseChange?.('test')
      startTimeRef.current = Date.now()
    }
  }, [config.practice.requiredPass, onPhaseChange])

  const handleTestResponse = useCallback((response: TestResponse) => {
    setState(prev => ({
      ...prev,
      responses: [...prev.responses, response]
    }))
  }, [])

  const handleTestComplete = useCallback(() => {
    const endTime = Date.now()
    const startTime = startTimeRef.current || endTime
    const duration = (endTime - startTime) / 1000

    const result: TestResult = {
      testId: config.id,
      phase: 'completion',
      responses: state.responses,
      timing: {
        startTime,
        endTime,
        duration
      }
    }

    // Calculate score if applicable
    if (config.test.items.length > 0) {
      const correctCount = state.responses.filter(r => r.correct === true).length
      result.score = correctCount
      result.accuracy = (correctCount / config.test.items.length) * 100
    }

    setState(prev => ({
      ...prev,
      phase: 'completion',
      testCompleted: true
    }))

    onPhaseChange?.('completion')
    onComplete?.(result)
  }, [config, state.responses, onComplete, onPhaseChange])

  // Timer management - must be after handleTestComplete definition
  useEffect(() => {
    if (timer !== null && timer > 0 && state.phase === 'test' && state.testStarted) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === null || prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current)
            }
            // Auto-complete test when timer expires
            handleTestComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [timer, state.phase, state.testStarted, handleTestComplete])

  const handleNextItem = useCallback(() => {
    if (state.phase === 'test') {
      const nextIndex = state.currentItemIndex + 1

      if (nextIndex >= config.test.items.length) {
        handleTestComplete()
      } else {
        setState(prev => ({
          ...prev,
          currentItemIndex: nextIndex
        }))
      }
    }
  }, [state.phase, state.currentItemIndex, config.test.items, handleTestComplete])

  const renderPhase = () => {
    switch (state.phase) {
      case 'instruction':
        return (
          <InstructionPhase
            instruction={config.instruction}
            onStartPractice={handleStartPractice}
          />
        )
      case 'practice':
        return (
          <PracticePhase
            config={config}
            currentIndex={state.currentItemIndex}
            onComplete={handlePracticeComplete}
            onResponse={handleTestResponse}
          />
        )
      case 'test':
        return (
          <TestPhaseComponent
            config={config}
            currentIndex={state.currentItemIndex}
            onResponse={handleTestResponse}
            onNext={handleNextItem}
            onComplete={handleTestComplete}
            responses={state.responses}
          />
        )
      case 'completion':
        return (
          <CompletionPhase
            config={config}
            result={{
              testId: config.id,
              phase: 'completion',
              responses: state.responses,
              timing: {
                startTime: startTimeRef.current || Date.now(),
                endTime: Date.now(),
                duration: ((Date.now() - (startTimeRef.current || Date.now())) / 1000)
              },
              score: state.responses.filter(r => r.correct === true).length,
              accuracy: config.test.items.length > 0
                ? (state.responses.filter(r => r.correct === true).length / config.test.items.length) * 100
                : undefined
            }}
          />
        )
      default:
        return null
    }
  }

  const currentProgress = state.phase === 'test' && config.test.items.length > 0
    ? ((state.currentItemIndex + 1) / config.test.items.length) * 100
    : state.phase === 'practice' && config.practice.items.length > 0
    ? ((state.currentItemIndex + 1) / config.practice.items.length) * 100
    : 0

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Card className="p-6 md:p-8 shadow-xl">
        {/* Header with Test Title */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 
                className="font-bold text-gray-900 mb-2"
                style={{ fontSize: `${Math.max(20, fontSizePx * 1.5)}px` }}
              >
                {config.title}
              </h2>
              {config.description && (
                <p 
                  className="text-gray-600"
                  style={{ fontSize: `${fontSizePx}px` }}
                >
                  {config.description}
                </p>
              )}
            </div>
            
            {/* Accessibility Controls */}
            <div className="flex items-center gap-3">
              <AccessibilityControls />
              {coachMode && config.coachMode?.enabled && (
                <CoachModeControls
                  config={config}
                  state={state}
                  responses={state.responses}
                />
              )}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {(state.phase === 'practice' || state.phase === 'test') && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-sm font-medium text-gray-700"
                style={{ fontSize: `${fontSizePx}px` }}
              >
                {state.phase === 'practice' ? 'Practice' : 'Test'} Progress
              </span>
              <span 
                className="text-sm font-medium text-gray-700"
                style={{ fontSize: `${fontSizePx}px` }}
              >
                {Math.round(currentProgress)}%
              </span>
            </div>
            <ProgressBar value={currentProgress} />
          </div>
        )}

        {/* Timer Indicator */}
        {state.phase === 'test' && timer !== null && (
          <div className="mb-6">
            <TimerIndicator timeRemaining={timer} />
          </div>
        )}

        {/* Main Content Area - Single Card Architecture */}
        <div className="min-h-[400px] flex flex-col">
          {/* Instruction Area */}
          <div className="flex-1 mb-6">
            {renderPhase()}
          </div>
        </div>
      </Card>
    </div>
  )
}

