'use client'

import React from 'react'
import { QuizContent as QuizContentType } from '@/types/course'
import CognitiveTestCard from '@/components/cognitive/CognitiveTestCard'
import { quizToCognitiveTest } from '@/utils/cognitive-test-helpers'

interface QuizContentProps {
  content: QuizContentType
}

export default function QuizContent({ content }: QuizContentProps) {
  // Convert quiz to unified cognitive test format
  const cognitiveTestConfig = quizToCognitiveTest(content, 'single-tap')

  const handleComplete = (result: { testId: string; responses: unknown[]; score?: number; accuracy?: number }) => {
    console.log('Quiz completed:', result)
    // You can add additional handling here (e.g., save to backend)
  }

  return (
    <CognitiveTestCard
      config={cognitiveTestConfig}
      onComplete={handleComplete}
    />
  )
}
