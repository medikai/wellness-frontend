'use client'

import React, { useState, useRef, useCallback } from 'react'
import { useFontSize } from '@/contexts/FontSizeContext'
import { Icon } from '@/components/ui'
import { TestItem, TestResponse } from '@/types/cognitive-test'

interface VoiceInputModeProps {
  item: TestItem
  onResponse: (response: TestResponse) => void
  disabled?: boolean
}

export default function VoiceInputMode({ item, onResponse, disabled }: VoiceInputModeProps) {
  const { fontSizePx } = useFontSize()
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState<string>('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number | null>(null)

  const handleStartRecording = useCallback(async () => {
    if (disabled) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        
        // Here you would typically send to a transcription service
        // For now, we'll use a placeholder
        const audioUrl = URL.createObjectURL(audioBlob)
        
        // Simulate transcription (replace with actual API call)
        const simulatedTranscript = 'User speech recorded' // Replace with actual transcription
        
        setTranscript(simulatedTranscript)

        const testResponse: TestResponse = {
          itemId: item.id,
          response: simulatedTranscript,
          timestamp: Date.now(),
          metadata: {
            audioUrl,
            duration: startTimeRef.current ? Date.now() - startTimeRef.current : 0
          }
        }
        onResponse(testResponse)
      }

      startTimeRef.current = Date.now()
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Microphone access denied. Please enable microphone permissions.')
    }
  }, [item, onResponse, disabled])

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }, [isRecording])

  return (
    <div className="space-y-6">
      <div 
        className="text-center text-gray-600 mb-6"
        style={{ fontSize: `${fontSizePx}px` }}
      >
        {isRecording 
          ? 'Recording... Release to stop' 
          : 'Press and hold to record your response'}
      </div>

      {/* Primary Interaction Zone - Hold to Speak Button */}
      <div className="flex justify-center">
        <button
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onMouseLeave={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
          disabled={disabled}
          className={`w-32 h-32 rounded-full font-bold shadow-xl transition-all duration-200 transform active:scale-95 flex items-center justify-center ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          style={{ fontSize: `${Math.max(18, fontSizePx * 1.125)}px` }}
        >
          {isRecording ? (
            <Icon name="mic" size="xl" color="#ffffff" />
          ) : (
            <Icon name="mic" size="xl" color="#ffffff" />
          )}
        </button>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div 
          className="bg-gray-100 rounded-xl p-4 text-center"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          <p className="text-gray-700 font-medium">{transcript}</p>
        </div>
      )}

      {/* Instructions */}
      <div 
        className="text-center text-sm text-gray-500"
        style={{ fontSize: `${fontSizePx * 0.875}px` }}
      >
        Hold the button while speaking, then release when finished
      </div>
    </div>
  )
}

