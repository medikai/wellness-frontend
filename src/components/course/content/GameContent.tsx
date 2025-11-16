'use client'

import React from 'react'
import { GameContent as GameContentType } from '@/types/course'
import CognitiveTestCard from '@/components/cognitive/CognitiveTestCard'
import { createMemoryMatchTest } from '@/utils/cognitive-test-helpers'

interface GameContentProps {
  content: GameContentType
}

export default function GameContent({ content }: GameContentProps) {
  // Convert game to unified cognitive test format
  let cognitiveTestConfig
  
  if (content.game_id === 'memory-match') {
    cognitiveTestConfig = createMemoryMatchTest()
  } else {
    // Default game config
    cognitiveTestConfig = {
      id: content.game_id,
      title: content.title,
      description: content.description,
      interactionMode: 'single-tap' as const,
      instruction: {
        text: `Welcome to ${content.title}!\n\n${content.description}\n\nTap "Start Practice" when you're ready.`,
      },
      practice: {
        enabled: false,
        items: [],
        requiredPass: false
      },
      test: {
        items: [{
          id: 'game-1',
          stimulus: 'Game content will be displayed here',
        }],
      },
    }
  }

  const handleComplete = (result: { testId: string; responses: unknown[]; score?: number; accuracy?: number }) => {
    console.log('Game completed:', result)
  }

  return (
    <CognitiveTestCard
      config={cognitiveTestConfig}
      onComplete={handleComplete}
    />
  )
}
