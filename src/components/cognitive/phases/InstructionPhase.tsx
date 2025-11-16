'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui'
import { useFontSize } from '@/contexts/FontSizeContext'
import { Icon } from '@/components/ui'

interface InstructionPhaseProps {
  instruction: {
    text: string
    audioUrl?: string
  }
  onStartPractice: () => void
}

export default function InstructionPhase({ instruction, onStartPractice }: InstructionPhaseProps) {
  const { fontSizePx } = useFontSize()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlayAudio = () => {
    if (instruction.audioUrl) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          setIsPlaying(false)
        } else {
          audioRef.current.play()
          setIsPlaying(true)
        }
      } else {
        const audio = new Audio(instruction.audioUrl)
        audioRef.current = audio
        audio.play()
        setIsPlaying(true)
        audio.onended = () => {
          setIsPlaying(false)
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      {/* Instruction Text */}
      <div className="text-center max-w-3xl space-y-6">
        <div 
          className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200"
          style={{ fontSize: `${Math.max(18, fontSizePx * 1.25)}px` }}
        >
          <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line">
            {instruction.text}
          </p>
        </div>

        {/* Audio Playback Button (if audio available) */}
        {instruction.audioUrl && (
          <button
            onClick={handlePlayAudio}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            style={{ fontSize: `${fontSizePx}px` }}
          >
            <Icon 
              name={isPlaying ? "pause" : "play"} 
              size="md" 
              color="#ffffff" 
            />
            <span>{isPlaying ? 'Pause Instructions' : 'Listen to Instructions'}</span>
          </button>
        )}
      </div>

      {/* Start Practice Button - Primary Action Zone */}
      <div className="w-full ">
        <Button
          onClick={onStartPractice}
          className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          style={{ fontSize: `${Math.max(20, fontSizePx * 1.25)}px` }}
        >
          Start Practice
        </Button>
      </div>
    </div>
  )
}

