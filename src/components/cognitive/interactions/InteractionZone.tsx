'use client'

import React from 'react'
import { CognitiveTestConfig, TestItem, TestResponse, InteractionMode } from '@/types/cognitive-test'
import SingleTapMode from './SingleTapMode'
import MultiTapMode from './MultiTapMode'
import SequentialMode from './SequentialMode'
import VoiceInputMode from './VoiceInputMode'
import AutoAdvanceMode from './AutoAdvanceMode'
import GridTapMode from './GridTapMode'

interface InteractionZoneProps {
  mode: InteractionMode
  config: CognitiveTestConfig
  item: TestItem
  onResponse: (response: TestResponse) => void
  disabled?: boolean
}

export default function InteractionZone({
  mode,
  config,
  item,
  onResponse,
  disabled = false
}: InteractionZoneProps) {
  const handleResponse = (response: TestResponse) => {
    if (!disabled) {
      onResponse(response)
    }
  }

  switch (mode) {
    case 'single-tap':
      return (
        <SingleTapMode
          item={item}
          onResponse={handleResponse}
          disabled={disabled}
        />
      )
    case 'multi-tap':
      return (
        <MultiTapMode
          item={item}
          config={config}
          onResponse={handleResponse}
          disabled={disabled}
        />
      )
    case 'sequential':
      return (
        <SequentialMode
          item={item}
          config={config}
          onResponse={handleResponse}
          disabled={disabled}
        />
      )
    case 'voice-input':
      return (
        <VoiceInputMode
          item={item}
          onResponse={handleResponse}
          disabled={disabled}
        />
      )
    case 'auto-advance':
      return (
        <AutoAdvanceMode
          item={item}
          delay={config.test.autoAdvanceDelay || 2000}
          onResponse={handleResponse}
          disabled={disabled}
        />
      )
    case 'grid-tap':
      return (
        <GridTapMode
          item={item}
          config={config}
          onResponse={handleResponse}
          disabled={disabled}
        />
      )
    default:
      return null
  }
}

