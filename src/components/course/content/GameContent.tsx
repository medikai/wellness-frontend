'use client'

import React, { useState } from 'react'
import { GameContent as GameContentType } from '@/types/course'
import { Button } from '@/components/ui'
import MemoryMatchModal from '@/components/MemoryMatchModal'

interface GameContentProps {
  content: GameContentType
}

export default function GameContent({ content }: GameContentProps) {
  const [showGame, setShowGame] = useState(false)

  const handleStartGame = () => {
    setShowGame(true)
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
      <p className="text-gray-600">{content.description}</p>
      
      <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🎮</span>
          </div>
          <Button
            onClick={handleStartGame}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold"
          >
            Start Game
          </Button>
        </div>
      </div>

      {showGame && content.game_id === 'memory-match' && (
        <div className="mt-4">
          <MemoryMatchModal onClose={() => setShowGame(false)} />
        </div>
      )}

      {showGame && content.game_id === 'focus-game' && (
        <div className="mt-4 bg-blue-50 rounded-xl p-6 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-600 mb-4">Focus on the center dot and count your breaths!</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Focus Session
          </Button>
        </div>
      )}
    </div>
  )
}
