'use client'

import React from 'react'
import { QuizContent as QuizContentType } from '@/types/course'
import CognitiveTestCard from '@/components/cognitive/CognitiveTestCard'
import { quizToCognitiveTest } from '@/utils/cognitive-test-helpers'

interface QuizContentProps {
  content: QuizContentType
  onComplete?: () => void
}

export default function QuizContent({ content, onComplete }: QuizContentProps) {
  // Convert quiz to unified cognitive test format
  const cognitiveTestConfig = quizToCognitiveTest(content, 'single-tap')

  const handleComplete = (result: { testId: string; responses: unknown[]; score?: number; accuracy?: number }) => {
    console.log('Quiz completed:', result)
    // Auto-progress after quiz completion
    if (onComplete) {
      setTimeout(() => {
        onComplete()
      }, 500)
    }
  }

  return (
    <CognitiveTestCard
      config={cognitiveTestConfig}
      onComplete={handleComplete}
    />
  )
}
