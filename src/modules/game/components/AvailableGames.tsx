'use client';
import React, { useState } from 'react'
import { Card, Button, Icon } from '@/components/ui'
import Link from 'next/link'
import QuizModal from './QuizModal';
import MemoryGameModal from './MemoryGameModal';

const AvailableGames = () => {
  const [showMemory, setShowMemory] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="space-y-6 w-full h-full ">
      <Card className="p-0 overflow-hidden w-full h-full shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 flex flex-col">
        <div className="divide-neutral-100 h-full">
          <div className="p-6 flex flex-col h-full hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-neutral-dark">Memory Challenge</h3>
                <p className="text-neutral-medium mt-1 text-sm">Test your memory with health-related cards</p>
              </div>
              <div className="w-10 h-10 bg-teal-light rounded-lg flex items-center justify-center shrink-0">
                <Icon name="heart" size="md" color="#4CAF9D" />
              </div>
            </div>
            <p className="text-sm text-neutral-medium mb-6 flex-grow">
              Match pairs of cards to improve your memory and earn points.
            </p>
            <Button variant="default" size="lg" className="w-full mt-auto shadow-sm" onClick={() => setShowMemory(true)}>
              Play Now
            </Button>
          </div>

          {/* <div className="p-6 flex flex-col h-full hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-neutral-dark">Health Quiz</h3>
                <p className="text-neutral-medium mt-1 text-sm">Test your health knowledge</p>
              </div>
              <div className="w-10 h-10 bg-orange-light rounded-lg flex items-center justify-center shrink-0">
                <Icon name="heart" size="md" color="#F58220" />
              </div>
            </div>
            <p className="text-sm text-neutral-medium mb-6 flex-grow">
              Answer questions about nutrition, exercise, and waylness.
            </p>
            <Button variant="default" size="lg" className="w-full mt-auto shadow-sm" onClick={() => setShowQuiz(true)}>
              Start Quiz
            </Button>
          </div> */}
        </div>
      </Card>

      {/* <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-dark">Step Counter</h3>
            <p className="text-neutral-medium mt-1">Track your daily steps</p>
          </div>
          <div className="w-12 h-12 bg-teal-light rounded-lg flex items-center justify-center">
            <Icon name="heart" size="lg" color="#4CAF9D" />
          </div>
        </div>
        <p className="text-sm text-neutral-medium mb-4">
          Complete daily step goals to unlock rewards and achievements.
        </p>
        <Button variant="default" size="lg" className="w-full shadow-md hover:shadow-lg transition-all rounded-xl">
          Track Steps
        </Button>
      </Card> */}

      {/* Modals */}
      {showMemory && <MemoryGameModal onClose={() => setShowMemory(false)} />}
      {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}
    </div>
  )
}

export default AvailableGames